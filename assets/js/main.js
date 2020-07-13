$(document).ready(function () {
  $("#Logout").click(function () {
    $.get("/logout", function (data) {
      window.location.href = "/";
    });
  });

  $("#createForm").submit(function (event) {
    event.preventDefault(); //prevent default action

    var post_url = $(this).attr("action"); //get form action url
    var form_data = $(this).serialize(); //Encode form elements for submission

    var isnum = /^\d+$/.test($("#number").val()); //check if the inputs are valid
    var isminnum = /^\d+$/.test($("#minimum_number").val());
    if (isnum && isminnum) {
      console.log(form_data);
      $.post(post_url, form_data, function (response) {
        //post data to server after submit
        console.log("Response: " + response);
        location.reload(); //reload page when everything is finished
      });
    } else if (!isnum) {
      $("#NumberError").remove();
      $("#number").parent().find("br").remove();
      $("#number")
        .parent()
        .append(
          "<br><span id='NumberError'>Bitte geben Sie hier nur Zahlen ein.</span>"
        ); //Error message if ther are invalid inputs
      $("#number").css("border", "1px solid red");

      $("#minimum_number").css("border", "none");
      $("#minimum_number").css("border-bottom", "1px solid rgb(0, 60, 121)");
    } else if (!isminnum) {
      $("#NumberError").remove();
      $("#minimum_number").parent().find("br").remove();
      $("#minimum_number")
        .parent()
        .append(
          "<br><span id='NumberError'>Bitte geben Sie hier nur Zahlen ein.</span>"
        ); //Error message if ther are invalid inputs
      $("#minimum_number").css("border", "1px solid red");

      $("#number").css("border", "none");
      $("#number").css("border-bottom", "1px solid rgb(0, 60, 121)");
    }
  });

  $("#updateForm").submit(function (event) {
    event.preventDefault(); //prevent default action

    var post_url = $(this).attr("action"); //get form action url

    var id = $(".selected").find("td")[0].innerHTML;
    var id = id.replace(/[ \t\r\s]+/g, "");
    var form_data = `id=${id}&`;
    form_data += $(this).serialize(); //Encode form elements for submission

    var isnum = /^\d+$/.test($("#number_update").val()); //check if the inputs are valid
    var isminnum = /^\d+$/.test($("#minimum_number_update").val());
    if (isnum && isminnum) {
      console.log(form_data);
      // $.patch(post_url, form_data, function (response) {
      //   //post data to server after submit
      //   console.log("Response: " + response);
      //   //location.reload(); //reload page when everything is finished
      // });


      $.ajax({
        type: 'PATCH',
        url: post_url,
        data: form_data,
        processData: false,
        contentType: 'application/x-www-form-urlencoded',
        success: function () {
          location.reload();
        }
        /* success and error handling omitted for brevity */
      });
    } else if (!isnum) {
      $("#NumberError").remove();
      $("#number_update").parent().find("br").remove();

      $("#number_update")
        .parent()
        .append(
          "<br><span id='NumberError'>Bitte geben Sie hier nur Zahlen ein.</span>"
        ); //Error message if ther are invalid inputs
      $("#number_update").css("border", "1px solid red");

      $("#minimum_number_update").css("border", "none");
      $("#minimum_number_update").css("border-bottom", "1px solid rgb(0, 60, 121)");

    } else if (!isminnum) {
      $("#NumberError").remove();
      $("#minimum_number_update").parent().find("br").remove();

      $("#minimum_number_update")
        .parent()
        .append(
          "<br><span id='NumberError'>Bitte geben Sie hier nur Zahlen ein.</span>"
        ); //Error message if ther are invalid inputs
      $("#minimum_number_update").css("border", "1px solid red");

      $("#number_update").css("border", "none");
      $("#number_update").css("border-bottom", "1px solid rgb(0, 60, 121)");

    }
  });

  $(".numberButton").click(function (e) {
    e.preventDefault();
    var number = $("#number_update").val();
    var sum = parseInt(number) + parseInt($(this).html());
    if (sum >= 0) {
      $("#number_update").val(sum);
    } else {
      $("#number_update").val(0);
    }

  });
});
