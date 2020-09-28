$(document).ready(function () {

  function closePopup(){
    //when grey background or x button is clicked
    if($(".select-pure__select--opened").length == 0){

      $("#PopUp").fadeOut();
      $("#PopUpUpdate").fadeOut();
      $("#PopUpDelete").fadeOut();
      // $(document).unbind("keypress");
      $("#cover").fadeOut();
      $("#notification").fadeOut();

      $(".Tags").remove();

      $("#PopUp input").each(function (i) {
        $(this).val("");
      });

      $("#number, #minimum_number").parent().find("span").remove();
      $("#number , #minimum_number").parent().find("br").remove();

      $("#number , #minimum_number").css("border", "none");
      $("#number , #minimum_number").css("border-bottom", "1px solid rgb(0,60,121");

      $("#keywords , #minimum_number").val("");
  }

  }

  $("#Logout").click(function () {
    $.get("/logout", function (data) {
      window.location.href = "/";
    });
  });

  $("body").on("submit", "#PopUp form", function(event){
    event.preventDefault();
    var post_url = $(this).attr("action"); //get form action url 

    if(post_url == "/entry"){
      var id = $(".selected").find("td")[0].innerHTML;

    }
    var name = $("#name").val();
    var location = $("#location").val();
    var number = $("#number").val();
    var minimum_number = $("#minimum_number").val();
    var category = $("#category").val();
    var keywords = $('.select-pure__selected-label');
    var keywordArr = [];
    $(keywords).each(function (i){
      keywordArr.push($(this).first().text());
    })

    var formdata = `id=${id}&name=${name}&location=${location}&number=${number}&minimum_number=${minimum_number}&category=${category}&keywords=${keywordArr}`;

    console.log(post_url);

    switch (post_url) {
      case "/create":
        $.post(post_url, formdata, function (response) {
          //post data to server after submit
          console.log("response: " + response);
          $('#table').DataTable().ajax.reload();
          closePopup();
          // history.go(0);

        });
        break;
      case "/entry":
        $.ajax({
          type: 'PATCH',
          url: post_url,
          data: formdata,
          processData: false,
          contentType: 'application/x-www-form-urlencoded',
          success: function () {
            history.go(0);          
          }
          /* success and error handling omitted for brevity */
        });
        break;
      default:
        break;
    }



  })


  $("body").on("click", ".numberButton", function (e) {
    e.preventDefault();
    var number = $("#number").val();
    var sum = parseInt(number) + parseInt($(this).html());
    if (sum >= 0) {
      $("#number").val(sum);
    } else {
      $("#number").val(0);
    }

  });
});
