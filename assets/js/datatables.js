$(document).ready(function () {

  // DataTable
  var table = $("#table").DataTable({
    "columnDefs": [{ "targets": 11, "orderable": false }],
    "initComplete": function () {
      // Apply the search
      this.api()
        .columns()
        .every(function () {
          var that = this;

          $("input", this.footer()).on("keyup change clear", function () {
            if (that.search() !== this.value) {
              that.search(this.value).draw();
            }
          });
        });
      var r = $("#table tfoot tr");
      r.find("th").each(function () {
        $(this).css("padding", 8);
      });
      $("#table thead").append(r);
      $("#search_0").css("text-align", "center");
    }, stateSave: true,
    language: {
      "url": "/assets/js/German.json"
    },

  });

  var ortTable = $('#ortTable').DataTable({
    "columnDefs": [
      { "width": "20%", "targets": 0 },
      { "width": "20%", "targets": 1 },
      { "width": "20%", "targets": 2 },
      { "width": "1%", "targets": 3, "orderable": false }
    ],
    language: {
      "url": "/assets/js/German.json"
    },
  });

  var kategorieTable = $('#kategorieTable').DataTable({
    "columnDefs": [
      { "width": "20%", "targets": 0 },
      { "width": "20%", "targets": 1 },
      { "width": "20%", "targets": 2 },
      { "width": "1%", "targets": 3, "orderable": false }
    ],
    language: {
      "url": "/assets/js/German.json"
    },
  });
  var keywordsTable = $('#keywordsTable').DataTable({
    "columnDefs": [
      { "width": "20%", "targets": 0 },
      { "width": "20%", "targets": 1 },
      { "width": "20%", "targets": 2 },
      { "width": "1%", "targets": 3, "orderable": false }
    ],
    language: {
      "url": "/assets/js/German.json"
    },
  });

  $(
    '<button id="New" title="Neuen Artikel hinzufügen">Neu</button><button id="Edit" disabled title="Wähle eine Zeile aus um sie bearbeiten zu können">Bearbeiten</button><button id="Delete" disabled title="Wähle mindestens eine Zeile aus um sie löschen zu können">Löschen</button>'
  ).insertBefore("#table");

  console.log($(".dt-table"));

  $("#table tbody").on("click", "tr", function (e) {
    var thisClass = $(this).hasClass("selected");

    if (e.ctrlKey) {
      $(this).toggleClass("selected");
    } else {
      table.rows().every(function (rowIdx, tableLoop, rowLoop) {
        console.log(this);
        this.nodes().to$().removeClass("selected");
      });
      if (!thisClass) {
        $(this).toggleClass("selected");
      }
    }
    var rowsSelected = table.rows(".selected").data().length;
    console.log(rowsSelected);

    $("#rows").remove();
    $(`<span id="rows">${rowsSelected} Zeile(n) ausgewählt</span>`).insertAfter(
      ".dataTables_info"
    );

    if (rowsSelected === 1) {
      $("#Edit").prop("disabled", false);
      $("#Edit").prop("title", "Aktuell ausgewählte Zeile bearbeiten");
    } else {
      $("#Edit").prop("disabled", true);
      $("#Edit").prop("title", "Wähle eine Zeile aus um sie bearbeiten zu können");
    }

    if (rowsSelected > 0) {
      $("#Delete").prop("disabled", false);
      $("#Delete").prop("title", "Aktuell ausgewählte Zeile(n) löschen");
    } else {
      $("#Delete").prop("disabled", true);
      $("#Delete").prop("title", "Wähle mindestens eine Zeile aus um sie löschen zu können");

    }
  });

  $(document).on("keypress", function (e) {
    if ($("#ortInput").is(":focus")) {
      if (e.which == 13) {
        alert($("#ortInput").val());
      };
    }

  });

  //------------------------------------
  //----------Delete Entry---------------

  $("#Delete").click(function () {
    var counter = table.rows(".selected").data().length;
    console.log("Delete");
    $("#PopUpDelete").show();
    $("#cover").show();
    $(".PopUpDelete_middle").html(
      "<span>Sind sie sicher, dass Sie " +
      counter +
      " Zeile" +
      (counter > 1 ? "n" : "") +
      " löschen möchten?<span>"
    );
  });

  $("#deleteForm").submit(function (event) {
    event.preventDefault(); //prevent default action

    var post_url = $(this).attr("action"); //get form action url
    var deleteRows = table.rows(".selected").data().to$();

    for (var i = 0; i < deleteRows.length; i++) {
      var id = table.rows(".selected").data().to$()[i][0];

      post_urlNew = post_url + "/" + id;

      $.ajax({
        url: post_urlNew,
        type: "DELETE",
        success: function (result) {
          location.reload();
        },
      });
    }
  });

  //------------------------------------
});
