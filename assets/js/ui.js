$(function(){

    var white = "rgb(255, 255, 255)";
    var grey = "rgb(211, 211, 211)";

    $('<button id="New">New</button><button id="Edit" disabled>Edit</button><button id="Delete" disabled>Delete</button>').insertBefore('.dt-table');

    $("button").css("margin","0px -5px 5px 15px");


    //~~~~Autocomplete~~~~

    $('#artikel').autocomplete({
        source: function(request, response){
            var form_data = {
                entry : 'name',
                val : $('#artikel').val()
            }
    
            var data;
            $.post( "/checkValue", form_data, function( res ) {
                data = res;
                console.log(res);
                response(data);                
              });
        },
        autoFocus: true,
        delay: 0,
        focus: function(event, ui) {
            $(this).on( 'keyup', function( e ) {
                if( e.which == 9 ) {
                    $(this).val(ui.item.value);
                }
            } );
        }
    });

    $('#ort').autocomplete({
        source: function(request, response){
            var form_data = {
                entry : 'location',
                val : $('#ort').val()
            }
    
            var data;
            $.post( "checkValue", form_data, function( res ) {
                data = res;
                console.log(res);
                response(data);
                
              });
        },
        autoFocus: true,
        delay: 0,
        focus: function(event, ui) {
            $(this).on( 'keyup', function( e ) {
                if( e.which == 9 ) {
                    $(this).val(ui.item.value);
                }
            } );
        }
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~

    $('#artikel, #ort').on('change keyup', function(){
        var artikel = $('#artikel').val();
        var ort = $('#ort').val();
        if(artikel !== "" && ort !== ""){
            $.get("entry", {name:artikel, location:ort}, function(data){
                console.log(data[0]);
                if(data[0]){
                    if(!$("#notification").length){
                        $("#artikel").parent().append("<br><span id='notification'>Dieser Artikel extistiert schon an diesem Ort. Sie können ihn nun anpassen</span>");
                    }
                    $('.ui-autocomplete').css("z-index", "0");
                    
                    $('#anzahl').val(data[0].number);
                    $('#mindestanzahl').val(data[0].minimum_number);
                    $('#Kategorie').val(data[0].category);
                    $('#keywords').val(data[0].keywords);

                    $('#CreateSubmit').html("Update");
                    $('#createForm').attr("action", "/update");

                    var id = data[0].id;

                    $('<input type="text" style="display:none" class="id" name="id" value="'+ id +'"/>').insertAfter('#anzahl');
                    if($(".id").length > 1){
                        for (let i = 1; i < $('.id').length; i++) {
                            $('.id')[i].remove();
                            
                        }
                    }

                    console.log("id: " + id);
                }else{
                    $("#notification").remove();
                    $('.ui-autocomplete').css("z-index", "100");
                    $('#CreateSubmit').html("Create");

                }
                

            });
        }
    });


    //~~~~ click functions ~~~~

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

        $("#PopUp input").each(function(i){
            $(this).val("");
        })

        $("#keywords").val("");
    });

    $(".PopUp_topBar span").click(function(){
        $("#PopUp").fadeOut();
        $("#PopUpDelete").fadeOut();
        $("#cover").fadeOut();

        $("#PopUp input").each(function(i){
            $(this).val("");
        })

        $("#keywords").val("");
    });


});