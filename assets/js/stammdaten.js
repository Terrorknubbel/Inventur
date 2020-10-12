
$(".AddRow").click(function () {
    $(this).parent().children().eq(1).find("i").toggleClass("fa-chevron-down fa-chevron-up");
    var th = $(this).parent().parent().parent().find("th:eq(0)").html();
    console.log($(this).parent().siblings());
    if ($(this).parent().siblings().length == 0) {
        //console.log($(this));
        $(this).parent().after(`
            <tr>
            <td><input maxlength="20" class="StammInput" type="text" placeholder="${th}..."></td>
            <td><input type="submit" value="Speichern" onclick="addStamm(this)" class="StammSave" /></td>
            </tr>
    `);

        $(function () {
            var input = $(`input[placeholder="${th}..."`).get(0);
            console.log(input);
            input.focus();
        });

    } else {
        console.log("fehler");
        $(this).parent().siblings().first().remove();
    }

});

//dynamically create location tree menu
function createTree(){
    $.get( "/lagerorte", function( data ) {
        let ulRäume = $("#myUL li ul");
        $(ulRäume).empty();
        let räume = [];
    
        //create rooms
        $.each(data, function(key, value){
            $(ulRäume).append(
                $("<li/>").append(
                    $("<span/>", {"class": "caret Raum", "text": key})
                ).append(
                    $("<ul/>", {"class": "nested"})
                )
            );
    
            //fill array with room names
            räume.push(key);
        });
    
        //add button to create another room
        $(ulRäume).append(
            $("<li/>").append(
                $("<button/>", {"class": "btn btn-outline-primary RaumBtn mt-2", "text": "Raum hinzufügen"})
            )
        );
    
        //create shelfs 
        $(ulRäume).find("ul").each(function(index){ //for each room..
            for(var i = 0; i < data[räume[index]].length; i++){ //for each shell..
                $(this).append(
                    $("<li/>").append(
                        $("<span/>", {"class": "caret", "text": data[räume[index]][i].regalname})
                    ).append(
                        $("<ul/>", {"class": "nested"}).append(
                            $("<li/>", {"text": `Fächer: ${data[räume[index]][i].fachanzahl}`})
                        )
                    )
                )
      
            }
    
            //add button to create another shelf
            $(this).append(
                $("<li/>").append(
                    $("<button/>", {"class": "btn btn-outline-primary RegalBtn", "text": "Regal hinzufügen"})
                )
            )
        });
    
      });
}
createTree();

$(function(){
    $(".AddRow").prop("colspan", 2);

    var toggler = document.getElementsByClassName("caret");
    var i;

    // for (i = 0; i < toggler.length; i++) {
    $("#myUL").on("click", ".caret", function() {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
        console.log(this.parentElement);
        if($(this).hasClass("Räume")){

            // $(".RegalBtn").hide();
            // $(".RaumBtn").show();   
            $(".nested:not(:first)").removeClass("active");
            $(".caret:not(:first)").removeClass("caret-down");
        }

        // if($(this).hasClass("Regal")){
        //     if(!$(".Regal").hasClass('caret-down')){
        //         $(".RaumBtn").show();
        //     }else{
        //         $(".RegalBtn").show();
        //         $(".RaumBtn").hide();
        //     }
        // }

    });
    
});

$(".AddRow").hover(function () {
    $(this).css("cursor", "pointer");
});

function addStamm(x) {
    var input = $(x).parent().siblings(1).children();

    var placeholder = input.attr('placeholder');
    placeholder = placeholder.slice(0, placeholder.length - 3);

    var text = input.val();
    console.log("Placeholder: " + placeholder);
    console.log("text: " + text);
    if (text != "") {
        $(x).prop("disabled", true);
        $.post(`/stammdaten/${placeholder}`, { value: text }, function (data) {
            location.reload();
        });
    }
}

$("table").on("click", ".fa-trash", function () {

    let table = $(this).closest("table").find("th").first().text();
    let val = $(this).parent().prev().text();
    let number = $(this).parent().text();

    console.log("~~~~~~");
    console.log(table);
    console.log(val);
    console.log(number);
    console.log("~~~~~~");
    
    // var id = $(this).parent().siblings().first().html().trim();

    let popUpMid = ``;

    if(number == 0){
        popUpMid = `
        <span>Sicher, dass Sie "${val}" <b><u>unwiderruflich</u></b></span>
        <br>
        <span>von den Stammdaten löschen wollen?</span>
        <br>
        <input type="button" value="Löschen" />
        <input type="button" value="Abbrechen" />
        `;
    }else{
        popUpMid = `
        "${val}" Wird aktuell von ${number} Artikeln genutzt <br> und kann daher nicht gelöscht werden.
        <br>
        <input type="button" value="Abbrechen" />
        `;
    }

    let popUp = `
        <div class="popup">
            <form>
            <div class="popup_top">
                Stammdatum von "${table}" löschen
                <div id="mdiv"><div class="mdiv"><div class="md"></div></div></div>
            </div>
            <div class="popup_mid">
            `+popUpMid+`
            </div>
            <div class="popup_foot"></div>
            </form>
        </div>
    `;

    let cover = '<div class="cover"></div>';

    console.log($(popUp));
    $(".Stamm_container").prepend($(cover + popUp).hide().fadeIn());

    $(".cover, .popup_top > span, .popup_mid > input[value='Abbrechen']").click(function () {
        $(".cover").remove();
        $(".popup").remove();
    })

    $(".popup_mid > input[value='Löschen']").click(function () {
        console.log(val);
        $.ajax({
            url: `/stammdaten/${table}/${val}`,
            type: "DELETE",
            success: function (result) {
                location.reload();
            },
        });
    });


});
