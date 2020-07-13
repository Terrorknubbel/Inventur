$(function () {
  var white = "rgb(255, 255, 255)";
  var grey = "rgb(211, 211, 211)";

  //~~~~Autocomplete~~~~

  $("#name").autocomplete({
    source: function (request, response) {
      var data = $("#name").val();
      $.get(`/checkValue/name/${data}`, function (res) {
        response(res);
      });
    },
    autoFocus: true,
    delay: 0,
    focus: function (event, ui) {
      $(this).on("keyup", function (e) {
        if (e.which == 9) {
          $(this).val(ui.item.value);
        }
      });
    },
  });

  $("#location").autocomplete({
    source: function (request, response) {
      var data = $("#location").val();
      $.get(`/checkValue/location/${data}`, function (res) {
        response(res);
      });
    },
    autoFocus: true,
    delay: 0,
    focus: function (event, ui) {
      $(this).on("keyup", function (e) {
        if (e.which == 9) {
          $(this).val(ui.item.value);
        }
      });
    },
  });

  //~~~~~~~~~~~~~~~~~~~~~~~~~~

  $("#name, #location").on("change", function () {
    var artikel = $("#name").val();
    var ort = $("#location").val();
    console.log(artikel, ort);
    if (artikel !== "" && ort !== "") {
      $.get("entry", { name: artikel, location: ort }, function (data) {
        console.log(data[0]);
        if (data[0]) {
          if (!$("#notification").length) {
            $("#name")
              .parent()
              .append(
                "<br id='notificationBreak'><span id='notification'>Dieser Artikel extistiert schon an diesem Ort. Sie können ihn nun anpassen</span>"
              );
          }
          $(".ui-autocomplete").css("z-index", "0");

          $("#number").val(data[0].number);
          $("#minimum_number").val(data[0].minimum_number);
          $("#category").val(data[0].category);
          $("#keywords").val(data[0].keywords);

          $("#CreateSubmit").html("Update");
          $("#createForm").attr("action", "/update");

          var id = data[0].id;

          $(
            '<input type="text" style="display:none" class="id" name="id" value="' +
            id +
            '"/>'
          ).insertAfter("#number");
          if ($(".id").length > 1) {
            for (let i = 1; i < $(".id").length; i++) {
              $(".id")[i].remove();
            }
          }

          console.log("id: " + id);
        } else {
          console.log("else");
          $("#notification").remove();
          $("#notificationBreak").remove();
          $(".ui-autocomplete").css("z-index", "100");
          $("#CreateSubmit").html("Create");
          $("#createForm").attr("action", "/create");

          $("#number").val("");
          $("#minimum_number").val("");
          $("#category").val($("#category option:first").val());
          $("#keywords").val("");

        }
      });
    }
  });


  $("#New").click(function () {
    //var NewPopUp = createPopUp();
    //$('body').append(NewPopUp);
    $("#PopUp").fadeIn();
    $("#cover").fadeIn();
  });

  $("#Edit").click(function () {
    $("#PopUpUpdate").fadeIn();
    $("#cover").fadeIn();

    $("#table tbody tr").each(function () {
      if ($(this).hasClass("selected")) {
        //get marked line
        var id = $(this).children().html(); //get id from line
        id = id.replace(/ /g, ""); //cut spaces
        id = id.replace(/\r?\n|\r/g, "");

        $.get(`/entry/${id}`, function (data, status) {
          $("#name_update").val(data.name);
          $("#location_update").val(data.location);
          $("#number_update").val(data.number);
          $("#minimum_number_update").val(data.minimum_number);
          $("#category_update").val(data.category);
          console.log("Edit Data: " + data.category);
          console.log($("#category_update"));
          $("#keywords_update").val(data.keywords);
        });
      }
    });
  });


  $("#cover, .PopUp_topBar span").click(function () {
    //when grey background or x button is clicked
    $("#PopUp").fadeOut();
    $("#PopUpUpdate").fadeOut();
    $("#PopUpDelete").fadeOut();
    $("#cover").fadeOut();
    $("#notification").fadeOut();

    $("#PopUp input").each(function (i) {
      $(this).val("");
    });

    $("#keywords").val("");
  });
});
