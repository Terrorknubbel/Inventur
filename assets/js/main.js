$(document).ready(function() {

    $("#createForm").submit(function(event){
        event.preventDefault(); //prevent default action 

        var post_url = $(this).attr("action"); //get form action url
        var form_data = $(this).serialize(); //Encode form elements for submission

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

    $('#deleteForm').submit(function(event){
        event.preventDefault(); //prevent default action

        var post_url = $(this).attr("action"); //get form action url

        $('#table tbody tr').each(function(){            
            if($(this).css("background-color") === "rgb(211, 211, 211)"){
                var id = $(this).find("td").html();
                id = id.replace(/ /g,'');
                id = id.replace(/\r?\n|\r/g,'');
                console.log(id);
                var form_data = {
                    "id": id
                };

                $.post( post_url, form_data, function( response ) {
                    console.log(response);
                    location.reload();
                  });
            }
        });
    })
});