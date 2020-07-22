$(".AddRow").click(function () {
    $(this).find("i").toggleClass("fa-chevron-down fa-chevron-up");
    var th = $(this).parent().parent().parent().find("th:eq(1)").html();
    console.log($(this).parent().siblings());
    if ($(this).parent().siblings().length == 0) {
        //console.log($(this));
        $(this).parent().after(`
            <tr>
            <td><input maxlength="32" class="StammInput" type="text" placeholder="${th}..."></td>
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

})

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
        $.post(`/Stammdaten/${placeholder}`, { value: text }, function (data) {
            location.reload();
        });
    }
}

$(".fa-trash").click(function () {
    let table = $(this).attr('class').split(' ').pop();
    let val = $(this).parent().parent().children().eq(1).html().trim();
    // var id = $(this).parent().siblings().first().html().trim();
    console.log(table);
    console.log(val);
    let popUp = `
        <div class="popup">
            <form>
            <div class="popup_top">
                Stammdatum von "${table}" löschen
                <span>x</span>
            </div>
            <div class="popup_mid">
                Sicher, dass Sie "${val}" <b><u>unwiderruflich</u></b> löschen wollen?
                <br>
                <input type="button" value="Löschen" />
                <input type="button" value="Abbrechen" />
            </div>
            <div class="popup_foot">
            
                
            </div>
            </form>
        </div>
    `;

    let cover = '<div class="cover"></div>';

    console.log($(popUp));
    $(".container").prepend($(cover + popUp).hide().fadeIn());

    $(".cover, .popup_top > span, .popup_mid > input:nth-of-type(2").click(function () {
        $(".cover").remove();
        $(".popup").remove();
    })

    $(".popup_mid > input:first-of-type").click(function () {
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
