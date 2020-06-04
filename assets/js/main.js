$(document).ready(function() {

    $('#Logout').click(function(){
        $.get("/logout", function(data){
            window.location.href = "/";
        });
    });

    $("#createForm").submit(function(event){
        event.preventDefault(); //prevent default action 

        var post_url = $(this).attr("action"); //get form action url
        var form_data = $(this).serialize(); //Encode form elements for submission

        var isnum = /^\d+$/.test($("#anzahl").val());           //check if the inputs are valid
        var isminnum = /^\d+$/.test($("#mindestanzahl").val());
        if(isnum && isminnum){
            console.log(form_data);
            $.post( post_url, form_data, function( response ) { //post data to server after submit
                console.log( "Response: " + response );
                location.reload();                              //reload page when everything is finished
              });

        }else{
            $("#anzahl").parent().append("<br><span>Bitte geben Sie hier nur Zahlen ein.</span>");  //Error message if ther are invalid inputs
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
                post_url = post_url + "/" + id;  

                $.ajax({
                    url: post_url,
                    type: 'DELETE',
                    success: function(result) {
                        location.reload();
                    }
                });

                // $.delete( post_url, form_data, function( response ) {
                //     console.log(response);
                //     location.reload();
                //   });
            }
        });
    })
});