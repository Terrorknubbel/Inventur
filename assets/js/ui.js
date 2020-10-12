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

  //create Popup
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
            $('<td/>', {'text': 'Ort:'})
          ).append(
            $('<td/>').append(
              $('<select/>', {'name': 'location', 'id': 'location', 'oninvalid': 'this.setCustomValidity(`Wählen Sie bitte einen Ort aus.\n Sie müssen diese vorher in den Stammdaten eintragen`)'})
            )
          )
        ).append(
          $('<tr/>').append(
            $('<td/>', {'text': 'Anzahl:'})
          ).append(
            $('<td/>', {'style': 'text-align:center'}).append(
              $('<input/>', {'type': 'number', 'id': 'number', 'name': 'number', 'maxlength': '10'})
            )
          ).append(
            $('<td/>', {'text': 'Mindestanzahl:'})
          ).append(
            $('<td>').append(
              $('<input/>', {'type': 'number', 'id': 'minimum_number', 'name': 'minimum_number', 'maxlength': '10'})
            )
          )
        ).append(
          $('<tr/>').append(
            $('<td/>', {'text': 'Kategorie:'})
          ).append(
            $('<td/>').append(
              $('<select/>', {'name': 'category', 'id': 'category', 'oninvalid': 'this.setCustomValidity(`Wählen Sie bitte eine Kategorie aus.\n Sie müssen diese vorher in den Stammdaten eintragen`)'})
            )
          ).append(
            $('<td/>', {'text': 'Stichwörter:'})
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

  popup.find("#name").prop("required", "true");
  popup.find("#location").prop("required", "true");
  popup.find("#number").prop("required", "true");
  popup.find("#minimum_number").popup("required", "true");
  popup.find("#category").prop("required", "true");


  //append options to dropdowns
  $.each(stammdaten.ort, function(i, p) {
    popup.find('#location').append($('<option></option>').val(p.ort).html(p.ort));
  });

  $.each(stammdaten.kategorie, function(i, p) {
    popup.find('#category').append($('<option></option>').val(p.kategorie).html(p.kategorie));
  });


  //~~~~~~~~~~~~~~~~~~~~~~~~~~

  //check if new Item already exists
  //Need to be updated!
  $("body").on("change, keyup", "#name", function () {
    var artikel = $("#name").val();
  
    if (artikel !== "" && $("#createForm").attr("action") == "/create") {
      $.get(`entry/name/${artikel}`, function (data) {
        if (data) {
          if (!$("#notification").length) {
            $("#name")
              .parent()
              .append(
                "<br id='notificationBreak'><span id='notification'>Dieser Artikel extistiert bereits</span>"
              );
          }
          $(".ui-autocomplete").css("z-index", "0");
          $("#PopUpSubmit").prop("disabled", true);          
        }else{
          $("#notificationBreak").remove();
          $("#notification").remove();
          checkError();
          
        }

      });
    }
  });

  function checkError(){
    if($(".ErrMsg").length == 0 && $(".ErrMsg2").length == 0 && !$("#notification").length){
      $("#PopUpSubmit").prop("disabled", false);
    }
  }

  var KeywordsAutocomplete;

  $("#New").click(function () {
    //var NewPopUp = createPopUp();
    //$('body').append(NewPopUp);
    popup = toCreatePopup(popup);
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

    $("#name").val(result.name);
    $("#location").val(result.location);
    $("#number").val(result.number);
    $("#minimum_number").val(result.minimum_number);
    $("#category").val(result.category);


    $("#cover").fadeIn();

  });

  function toCreatePopup(popup){
    popup.find(".PopUp_topBar").text("Neuen Artikel anlegen");
    popup.find(".PopUp_topBar").append('<div id="mdiv"><div class="mdiv"><div class="md"></div></div></div>')
    popup.find("form").prop("action", "/create");
    popup.find(".numberButton").remove();
    
    return popup;

  }

  function toUpdatePopup(popup){
    popup.find(".PopUp_topBar").text("Artikel bearbeiten");
    popup.find(".PopUp_topBar").append('<div id="mdiv"><div class="mdiv"><div class="md"></div></div></div>')
    popup.find("form").prop("action", "/entry");

    popup.find(".numberButton").remove();

    popup.find("#number").after('<button class="numberButton">+10</button>');
    popup.find("#number").after('<button class="numberButton">+1</button>');
    popup.find("#number").after('<button class="numberButton">-1</button>');
    popup.find("#number").after('<button class="numberButton">-10</button>');

    return popup;
  }

  $("body").on("click", "#cover, .navbar, #mdiv",function () {
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

  });
});
