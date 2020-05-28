$(document).ready(function() {

    $('<button id="New">New</button><button id="Edit" disabled>Edit</button><button id="Delete" disabled>Delete</button>').insertBefore('.dt-table');

    $("button").css("margin","0px -5px 5px 15px");

    $('.sorting').click(function(){
        $("#dataTbody tr:nth-child(odd)").css("background-color", "rgb(255, 255, 255)");
        $("#dataTbody tr:nth-child(even)").css("background-color", "rgb(238, 238, 238)");
    });

    $("#table tbody tr").click(function(e){

        var white = ("rgb(255, 255, 255)");
        var grey = ("rgb(211, 211, 211)");

        console.log($(this).css('background-color'));
        if (e.ctrlKey) {
            if($(this).css('background-color') == grey){
                $(this).css('background-color', white);
                $("#dataTbody tr:nth-child(even)").css("background-color", "rgb(238, 238, 238)");

            }else{
                $(this).css("background-color", grey);
            }
        }else{
            console.log($(this).css('background-color'));

            if($(this).css('background-color') == grey){
                console.log("weis");
                $("#dataTbody tr").css("background-color", white);
                $("#dataTbody tr:nth-child(even)").css("background-color", "rgb(238, 238, 238)");

            }else{
                console.log("grau");
                $("#dataTbody tr").css("background-color", white);
                $("#dataTbody tr:nth-child(even)").css("background-color", "rgb(238, 238, 238)");

                $(this).css("background-color", grey);

            }
        }


        var bg = $("#dataTbody tr");
        var rows = 0;
        for (let i = 0; i < bg.length; i++) {
            console.log(bg[i].style.backgroundColor);
            if(bg[i].style.backgroundColor == grey){
                rows++;
            }
        }

        $("#rows").remove();
        $("<span id='rows'>"+rows+" Zeile"+ (rows > 1 ? 'n' : '') + " ausgewählt</span>").insertAfter(".dataTables_info");
        
    });

    $("#New").click(function(){
        $("#PopUp").fadeIn();
        $("#cover").fadeIn();
    })

    $("#cover").click(function(){
        $("#PopUp").fadeOut();
        $("#cover").fadeOut();
    });

    $("#PopUp_topBar span").click(function(){
        $("#PopUp").fadeOut();
        $("#cover").fadeOut();
    })

    $("#createForm").submit(function(event){
        event.preventDefault(); //prevent default action 

        var post_url = $(this).attr("action"); //get form action url
        var request_method = $(this).attr("method"); //get form GET/POST method
        var form_data = $(this).serialize(); //Encode form elements for submission

        console.log(post_url);
        console.log(request_method);
        console.log(form_data);

        var isnum = /^\d+$/.test($("#anzahl").val());
        if(isnum){
            $.post( post_url, form_data, function( response ) {
                console.log( response );
              });

            location.reload();
        }else{
            $("#anzahl").parent().append("<span>Bitte geben Sie hier nur Zahlen ein.</span>");
            $("#anzahl").css("border", "1px solid red");
        }

    });
});