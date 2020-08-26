$(function () {
  var white = "rgb(255, 255, 255)";
  var grey = "rgb(211, 211, 211)";

  var stammdaten = function () {
    var ort = null;
    var kategorie = null;
    var keywords = null;

    $.ajax({
      'async': false,
      'type': "GET",
      'global': false,
      'url': "/stammdaten/ort",
      'success': function (data) {
        ort = data;
      }
    });

    $.ajax({
      'async': false,
      'type': "GET",
      'global': false,
      'url': "/stammdaten/kategorie",
      'success': function (data) {
        kategorie = data;
      }
    });

    $.ajax({
      'async': false,
      'type': "GET",
      'global': false,
      'url': "/stammdaten/keywords",
      'success': function (data) {
          keywords = data;
      }
    });
    return {"ort": ort.data, "kategorie": kategorie.data, "keywords": keywords.data};
}();

  console.log(stammdaten);

  var test = $('<div/>', {'id':'PopUp'}).append(
    $('<form/>', {'id': 'createForm', 'action': '/create', 'method': 'post'}).append(
      $('<div/>', {'class': 'PopUp_topBar', 'text': 'Neuen Artikel anlegen'}).append(
        $('<span/>', {'text': 'x'})
      )
    ).append(
      $('<div/>', {'class': 'PopUp_middle'}).append(
        $('<table/>').append(
          $('<tr/>').append(
            $('<td/>', {'text': 'Artikel:'})
          ).append(
            $('<td/>').append(
              $('<input/>', {'type': 'text', 'id': 'name', 'name': 'name', 'maxlength': '20'})
            )
          ).append(
            $('<td/>')
          ).append(
            $('<td/>', {'text': 'Ort:'})
          ).append(
            $('<td/>').append(
              $('<select/>', {'name': 'location', 'id': 'location', 'oninvalid': 'this.setCustomValidity(`Wählen Sie bitte einen Ort aus.\n Sie müssen diese vorher in den Stammdaten eintragen`)'})
            ).append(
              $('<a/>', {'href': '/stammdaten'}).append(
                $('<img/>', {'class': 'linkStammdaten', 'src': 'assets/iconfinder_link.svg', 'title': 'Zu den Stammdaten..'})
              )
            )
          )
        ).append(
          $('<tr/>').append(
            $('<td/>', {'text': 'Anzahl:'})
          ).append(
            $('<td/>').append(
              $('<input/>', {'type': 'text', 'id': 'number', 'name': 'number', 'maxlength': '10'})
            )
          ).append(
            $('<td/>')
          ).append(
            $('<td/>', {'text': 'Mindestanzahl:'})
          ).append(
            $('<td>').append(
              $('<input/>', {'type': 'text', 'id': 'minimum_number', 'name': 'minimum_number', 'maxlength': '10'})
            )
          )
        ).append(
          $('<tr/>').append(
            $('<td/>', {'text': 'Kategorie:'})
          ).append(
            $('<td/>').append(
              $('<select/>', {'name': 'category', 'id': 'category', 'oninvalid': 'this.setCustomValidity(`Wählen Sie bitte eine Kategorie aus.\n Sie müssen diese vorher in den Stammdaten eintragen`)'})
            ).append(
              $('<a/>', {'href': '/stammdaten'}).append(
                $('<img/>', {'class': 'linkStammdaten', 'src': 'assets/iconfinder_link.svg', 'title': 'Zu den Stammdaten..'})
              )
            )
          ).append(
            $('<td/>')
          ).append(
            $('<td/>', {'text': 'Stichwärter:'})
          ).append(
            $('<td/>').append(
              $('<div/>', {'class': 'select-wrapper'}).append(
                $('<span/>', {'class': 'autocomplete-select'})
              )
            )
          )
        )
      )
    ).append(
      $('<div/>', {'class': 'PopUp_footer'}).append(
        $('<button/>', {'type': 'submit', 'id': 'PopUpSubmit', 'text': 'Speichern'})
      )
    )
  );

  $.each(stammdaten.ort, function(i, p) {
    test.find('#location').append($('<option></option>').val(p.ort).html(p.ort));
  });

  $.each(stammdaten.kategorie, function(i, p) {
    test.find('#category').append($('<option></option>').val(p.kategorie).html(p.kategorie));
  });


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
          $("#keyDiv").prepend(`<span class="Tags" data-keyword="${ui.item.value}" onclick="close()">${ui.item.value} (${res[0].number})</span>`);
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
          $("#keyDiv_update").prepend(`<span class="Tags" data-keyword="${ui.item.value}" onclick="close()">${ui.item.value} (${res[0].number})</span>`);
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
  $("#name").on("change, keyup", function () {
    var artikel = $("#name").val();
    console.log(artikel);
    if (artikel !== "") {
      $.get(`entry/name/${artikel}`, function (data) {
        console.log(data);
        if (data) {
          if (!$("#notification").length) {
            $("#name")
              .parent()
              .append(
                "<br id='notificationBreak'><span id='notification'>Dieser Artikel extistiert bereits</span>"
              );
          }
          $(".ui-autocomplete").css("z-index", "0");
          $("#CreateSubmit").prop( "disabled", true );
        }else{
          $("#notificationBreak").remove();
          $("#notification").remove();
          $("#CreateSubmit").prop( "disabled", false );

        }
        //   $("#number").val(data[0].number);
        //   $("#minimum_number").val(data[0].minimum_number);
        //   $("#category").val(data[0].category);

        //   addKeywordBubbles($("#keyDiv"), $("#keywords"), data[0].keywords);

        //   $("#CreateSubmit").html("Update");
        //   $("#createForm").attr("action", "/entry");

        //   var id = data[0].id;

        //   $(
        //     '<input type="text" style="display:none" class="id" name="id" value="' +
        //     id +
        //     '"/>'
        //   ).insertAfter("#number");
        //   if ($(".id").length > 1) {
        //     for (let i = 1; i < $(".id").length; i++) {
        //       $(".id")[i].remove();
        //     }
        //   }

        //   console.log("id: " + id);
        // } else {
        //   console.log("else");
        //   $("#notification").remove();
        //   $("#notificationBreak").remove();
        //   $(".ui-autocomplete").css("z-index", "100");
        //   $("#CreateSubmit").html("Create");
        //   $("#createForm").attr("action", "/create");

        //   $("#number").val("");
        //   $("#minimum_number").val("");
        //   $("#category").val($("#category option:first").val());
        //   $("#keywords").val("");

        // }
      });
    }
  });

  //Number input fields in Create PopUp
  $("#number, #number_update, #minimum_number, #minimum_number_update").on("keyup", function () {
    console.log($(this).val().length);
    //Remove Error Messages
    $(this).parent().find(".ErrBr").remove();
    $(this).parent().find(".ErrMsg").remove();
  

    //Remove Error Border
    $(this).css("border", "none");
    $(this).css("border-bottom", "1px solid rgb(0,60,121");

    //If the input is not a number
    if (!/^\d+$/.test($(this).val()) && $(this).val().length != 0) {
      $(this).parent().append("<br class='ErrBr'><span style='color: red' class='ErrMsg'>Bitte geben Sie hier nur Zahlen ein.</span>"); //Error message
      $(this).css("border", "1px solid red"); //Error Border
    }

  })
  $("#New").click(function () {
    //var NewPopUp = createPopUp();
    //$('body').append(NewPopUp);
    $('#tableDiv').after(test);
    test.fadeIn();

    var KeywordsAutocomplete;
    var KeywordsUpdateAutocomplete;
    $.ajax({
      url: 'stammdaten/keywords',
      success: function(data) {
          var optionsArr = [];
          for(var i = 0; i < data.data.length; i ++){
            optionsArr.push({"label": data.data[i].keywords, "value": data.data[i].keywords});
          }
          KeywordsAutocomplete = new SelectPure(".autocomplete-select", {
            options: optionsArr,
            multiple: true,
            autocomplete: true,
            icon: "fa fa-times",
            onChange: value => {
                  console.log(value);
                  //var element = document.getElementsByClassName('.select-pure__label')[0];
                  //element.scrollTop = element.scrollHeight;
                  var element = $(".select-pure__label");
                  $(element[0]).scrollTop(element[0].scrollHeight);
  
              },
            classNames: {
              select: "select-pure__select",
              dropdownShown: "select-pure__select--opened",
              multiselect: "select-pure__select--multiple",
              label: "select-pure__label",
              placeholder: "select-pure__placeholder",
              dropdown: "select-pure__options",
              option: "select-pure__option",
              autocompleteInput: "select-pure__autocomplete",
              selectedLabel: "select-pure__selected-label",
              selectedOption: "select-pure__option--selected",
              placeholderHidden: "select-pure__placeholder--hidden",
              optionHidden: "select-pure__option--hidden",
            }
          });
          var resetAutocomplete = function() {
            KeywordsAutocomplete.reset();
          };
        }
    });
    
    //$("#PopUp").fadeIn();
    $("#name").focus();
    $("#cover").fadeIn();
  });

  $("#Edit").click(function () {
    console.log(KeywordsAutocomplete.value);
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
        $(keyDiv).prepend(`<span class="Tags" data-keyword="test" onclick="close()">${res[0].keywords} (${res[0].number})</span>`);
        $(keyDiv).scrollTop($('#keyDiv_update')[0].scrollHeight);
        $(keywordEle).css("margin-top", "0");
        $(keywordEle).prop("required", false);
        $("#keywords").prop("oninvalid", false);
        document.getElementById("keywords").setCustomValidity('');


      });
    }
  }

  $("#cover, .PopUp_topBar span").click(function () {
    //when grey background or x button is clicked
    $("#PopUp").fadeOut();
    $("#PopUpUpdate").fadeOut();
    $("#PopUpDelete").fadeOut();
    $(document).unbind("keypress");
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
