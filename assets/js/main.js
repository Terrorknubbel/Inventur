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

    var keywords = "";

    $(".Tags").each(function (index) {
      //get Tag without the parenthesized number
      //var tagName = $(this).html().substring(0, $(this).html().length - 4);
      var tagName = $(this).data("keyword");
      console.log("tagName: " + tagName);
      //create keywordstring
      keywords += tagName + ", ";
    });

    //add keywordstring to formdata (without the last comma)
    form_data += "&keywords=" + keywords.substring(0, keywords.length - 2);

    var isnum = /^\d+$/.test($("#number").val()); //check if the inputs are valid
    var isminnum = /^\d+$/.test($("#minimum_number").val());
    var tagLength = $(".Tags").length;

    if (isnum && isminnum && tagLength > 0) {
      
      if (post_url === "/create") {
        $.post(post_url, form_data, function (response) {
          //post data to server after submit
          location.reload(); //reload page when everything is finished
        });
      // } else if (post_url === "/entry") {
      //   console.log(form_data);
      //   $.ajax({
      //     type: 'PATCH',
      //     url: post_url,
      //     data: form_data,
      //     processData: false,
      //     contentType: 'application/x-www-form-urlencoded',
      //     success: function () {
      //       location.reload();
      //     }
      //   });

       }
    };

    if(tagLength == 0){
      console.log("tag length 0");
      document.getElementById("keywords").setCustomValidity('Bitte wählen Sie mindestens 1 Stichwort aus den Stammdaten aus.');
      document.getElementById("createForm").reportValidity();
      $("#keywords").attr("required", "true");
    }
  });

  $("#keywords").on("change", function(event){
    $(this)[0].setCustomValidity('');
  })

  $("#keywords_update").on("change", function(event){
    $(this)[0].setCustomValidity('');
  })

  $("#updateForm").submit(function (event) {
    event.preventDefault(); //prevent default action

    var post_url = $(this).attr("action"); //get form action url

    var id = $(".selected").find("td")[0].innerHTML;
    var id = id.replace(/[ \t\r\s]+/g, "");
    var form_data = `id=${id}&`;
    form_data += $(this).serialize(); //Encode form elements for submission

    var keywords = "";

    $(".Tags").each(function (index) {
      //get Tag without the parenthesized number
      var tagName = $(this).html().substring(0, $(this).html().length - 4);
      //create keywordstring
      keywords += tagName + ", ";
    });
    console.log("keywords: " + keywords);
    if(keywords.length == 0){
      console.log("tag length 0");
      document.getElementById("keywords_update").setCustomValidity('Bitte wählen Sie mindestens 1 Stichwort aus den Stammdaten aus.');
      document.getElementById("updateForm").reportValidity();
      $("#keywords_update").attr("required", "true");
    }

    //add keywordstring to formdata (without the last comma)
    form_data += "&keywords=" + keywords.substring(0, keywords.length - 2);

    var isnum = /^\d+$/.test($("#number_update").val()); //check if the inputs are valid
    var isminnum = /^\d+$/.test($("#minimum_number_update").val());
    if (isnum && isminnum && keywords.length != 0) {

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
