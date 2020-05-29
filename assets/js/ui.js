$(function(){

    var white = "rgb(255, 255, 255)";
    var grey = "rgb(211, 211, 211)";

    $('<button id="New">New</button><button id="Edit" disabled>Edit</button><button id="Delete" disabled>Delete</button>').insertBefore('.dt-table');

    $("button").css("margin","0px -5px 5px 15px");

    $('.sorting').click(function(){
        $("#dataTbody tr:nth-child(odd)").css("background-color", white);
        $("#dataTbody tr:nth-child(even)").css("background-color", "rgb(238, 238, 238)");
    });

    $("#table tbody tr").click(function(e){

        console.log($(this).css('background-color'));
        if (e.ctrlKey) {
            if($(this).css('background-color') === grey){
                $(this).css('background-color', white);
                $("#dataTbody tr:nth-child(even)").css("background-color", "rgb(238, 238, 238)");

            }else{
                $(this).css("background-color", grey);
            }
        }else{
            console.log($(this).css('background-color'));

            if($(this).css('background-color') === grey){
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
        
        if(rows === 1){
            $('#Edit').prop('disabled', false);
        }else{
            $('#Edit').prop('disabled', true);
        }

        if(rows > 0){
            $('#Delete').prop('disabled', false);
        }else{
            $('#Delete').prop('disabled', true);
        }
    });

    $("#New").click(function(){
        $("#PopUp").fadeIn();
        $("#cover").fadeIn();
    });

    $("#Delete").click(function(){
        var counter = 0;

        $('#table tbody tr').each(function(){            
            if($(this).css("background-color") === grey){
                counter++;
            }
        });

        $('#PopUpDelete').show();
        $('#cover').show();
        $(".PopUpDelete_middle").html("<span>Sind sie sicher, dass Sie "+ counter +" Zeile"+ (counter > 1 ? 'n' : '') + " löschen möchten?<span>");

    });

    $("#cover").click(function(){
        $("#PopUp").fadeOut();
        $("#PopUpDelete").fadeOut();

        $("#cover").fadeOut();
    });

    $(".PopUp_topBar span").click(function(){
        $("#PopUp").fadeOut();
        $("#PopUpDelete").fadeOut();
        $("#cover").fadeOut();
    });


});