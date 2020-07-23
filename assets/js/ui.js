$(function () {
  var white = "rgb(255, 255, 255)";
  var grey = "rgb(211, 211, 211)";

  //~~~~Autocomplete~~~~

  //Name autocomplete
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
  //--------

  //keywors autocomplete
  function split(val) {
    return val.split(/,\s*/);
  }
  function extractLast(term) {
    return split(term).pop();
  }

  function filterArray(json) {
    var arr = [];
    var banned = [];
    var tags = $(".Tags");

    for (var i = 0; i < json.length; i++) {
      for (var j = 0; j < tags.length; j++) {
        var tag = tags[j].innerHTML;
        if (json[i].keywords == tag.substring(0, tag.length - 4)) {
          banned.push(json[i].keywords);
        }
      }
      arr.push(json[i].keywords);

    }

    for (var i = 0; i < banned.length; i++) {
      arr = arr.filter(e => e !== banned[i]);
    }

    return arr;
  }

  $("#keywords")
    // don't navigate away from the field on tab when selecting an item
    .on("keydown keyup change", function (event) {
      console.log($(this).parent());
      console.log("trigger");
      if (event.keyCode === $.ui.keyCode.TAB &&
        $(this).autocomplete("instance").menu.active) {
        event.preventDefault();
      }
    }).autocomplete({
      minLength: 0,
      autoFocus: true,
      source: function (request, response) {
        // delegate back to autocomplete, but extract the last term

        $.get(`/stammdaten/keywords`, function (res) {
          response($.ui.autocomplete.filter(
            filterArray(res), extractLast(request.term)));
        });

      },
      focus: function () {
        // prevent value inserted on focus
        return false;
      },
      select: function (event, ui) {

        console.log(ui.item.value);
        $.get(`/stammdaten/keywords/${ui.item.value}`, function (res) {
          $("#keyDiv").prepend(`<span class="Tags" onclick="close()">${ui.item.value} (${res[0].number})</span>`);
          $('#keyDiv').scrollTop($('#keyDiv')[0].scrollHeight);
          $("#keywords").css("margin-top", "0");
          $("#keywords").prop("required", false);
        });

        this.value = "";

        return false;
      }
    }).click(function (e) {
      console.log("clicked");
      e.stopPropagation();
      $(this).autocomplete("search");
    });

  $("#keywords_update")
    // don't navigate away from the field on tab when selecting an item
    .on("keydown keyup change", function (event) {
      console.log($(this).parent());
      console.log("trigger");
      if (event.keyCode === $.ui.keyCode.TAB &&
        $(this).autocomplete("instance").menu.active) {
        event.preventDefault();
      }
    }).autocomplete({
      minLength: 0,
      autoFocus: true,
      source: function (request, response) {
        // delegate back to autocomplete, but extract the last term

        $.get(`/stammdaten/keywords`, function (res) {
          response($.ui.autocomplete.filter(
            filterArray(res), extractLast(request.term)));
        });

      },
      focus: function () {
        // prevent value inserted on focus
        return false;
      },
      select: function (event, ui) {

        console.log(ui.item.value);
        $.get(`/stammdaten/keywords/${ui.item.value}`, function (res) {
          $("#keyDiv_update").prepend(`<span class="Tags" onclick="close()">${ui.item.value} (${res[0].number})</span>`);
          $('#keyDiv_update').scrollTop($('#keyDiv_update')[0].scrollHeight);
          $("#keywords_update").css("margin-top", "0");
          $("#keywords_update").prop("required", false);
        });

        this.value = "";

        return false;
      }
    }).click(function (e) {
      console.log("clicked");
      e.stopPropagation();
      $(this).autocomplete("search");
    });

  $("body").on("click", ".Tags", function () {
    console.log($(this));
    $(this).remove();
    if ($(".Tags").length === 0) {
      $("#keywords,#keywords_update").prop("required", true);
      $("#keywords,#keywords_update").css("margin-top", "0px");

    }
  })
  //~~~~~~~~~~~~~~~~~~~~~~~~~~

  //check if new Item already exists
  //Need to be updated!
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

          addKeywordBubbles($("#keyDiv"), $("#keywords"), data[0].keywords);

          $("#CreateSubmit").html("Update");
          $("#createForm").attr("action", "/entry");

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

          addKeywordBubbles($("#keyDiv_update"), $("#keywords_update"), data.keywords);

        });

      }
    });
  });

  function addKeywordBubbles(keyDiv, keywordEle, keywords) {
    keywords = keywords.split(',');
    for (var i = 0; i < keywords.length; i++) {
      keywords[i] = keywords[i].trim();
      console.log(keywords[i]);
      $.get(`/stammdaten/keywords/${keywords[i]}`, function (res) {
        console.log(res);
        $(keyDiv).prepend(`<span class="Tags" onclick="close()">${res[0].keywords} (${res[0].number})</span>`);
        $(keyDiv).scrollTop($('#keyDiv_update')[0].scrollHeight);
        $(keywordEle).css("margin-top", "0");
        $(keywordEle).prop("required", false);
      });
    }
  }

  $("#cover, .PopUp_topBar span").click(function () {
    //when grey background or x button is clicked
    $("#PopUp").fadeOut();
    $("#PopUpUpdate").fadeOut();
    $("#PopUpDelete").fadeOut();
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
  });
});
