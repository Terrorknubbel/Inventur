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

  var popup = $('<div/>', {'id':'PopUp'}).append(
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
    popup.find('#location').append($('<option></option>').val(p.ort).html(p.ort));
  });

  $.each(stammdaten.kategorie, function(i, p) {
    popup.find('#category').append($('<option></option>').val(p.kategorie).html(p.kategorie));
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
  var KeywordsAutocomplete;

  $("#New").click(function () {
    //var NewPopUp = createPopUp();
    //$('body').append(NewPopUp);
    $('#tableDiv').after(popup);
    popup.fadeIn();

    $('.select-pure__select').remove();
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
    
    var id;
    $("#table tbody tr").each(function () {
      if ($(this).hasClass("selected")) {
        //get marked line
        id = $(this).children().html(); //get id from line
        id = id.replace(/ /g, ""); //cut spaces
        id = id.replace(/\r?\n|\r/g, "");
      };
    });
    var result;
    $.ajax({
      "async": false,
      "type": "GET",
      "global": false,
      "url": `/entry/${id}`,
      "success": function(data){
        result = {
          "name": data.name,
          "location": data.location,
          "number": data.number,
          "minimum_number": data.minimum_number,
          "category": data.category,
          "keywords": data.keywords.split(",")
        };
      }
    })

    popup = toUpdatePopup(popup);
    console.log(result);
    $('#tableDiv').after(popup);
    popup.fadeIn();

    $('.select-pure__select').remove();
    $.ajax({
      url: 'stammdaten/keywords',
      success: function(data) {
          var optionsArr = [];
          for(var i = 0; i < data.data.length; i ++){
            optionsArr.push({"label": data.data[i].keywords, "value": data.data[i].keywords});
          }
          KeywordsAutocomplete = new SelectPure(".autocomplete-select", {
            options: optionsArr,
            value: result.keywords,
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

    $("#cover").fadeIn();

  });

  function toCreatePopup(popup){

  }

  function toUpdatePopup(popup){
    popup.find(".PopUp_topBar").text("Artikel bearbeiten");
    return popup;
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
