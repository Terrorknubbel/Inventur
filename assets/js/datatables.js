$(document).ready(function () {

  // DataTable
  var table = $("#table").DataTable({
    "rowCallback": function (row, data, index) {
      if (parseInt(data[2]) < parseInt(data[3])) {
        if (parseInt(data[2]) > 0) {
          $(row).find("td:nth-child(3)").addClass("notEnough_left");
          $(row).find("td:nth-child(4)").addClass("notEnough_right");
          $(row).find("td:nth-child(3) .warn").remove();
          $(row).find("td:nth-child(3)").prepend(`<img class="warn" title="Die Mindestanzahl ist unterschritten!" src="assets/iconfinder_warn.svg" alt="">`);
        } else {
          $(row).find("td:nth-child(3)").addClass("notEnough2_left");
          $(row).find("td:nth-child(4)").addClass("notEnough2_right");

          // console.log(0);
          $(row).find("td:nth-child(3) .error").remove();
          $(row).find("td:nth-child(3)").prepend(`<img class="error" title="Es sind keine Artikel mehr vorhanden" src="assets/iconfinder_error.svg" alt="">`);
        }

      }
    },
    "columnDefs": [{ "targets": 11, "orderable": false }],
    "initComplete": function () {
      // Apply the search
      this.api().columns().every(function () {
        var that = this;

        $("input", this.footer()).on("keyup change clear", function () {
          if (that.search() !== this.value) {
            that.search(this.value).draw();
          }
        });
      });

      // var input = $(".ui input");
      // console.log(input.first());
      // $("#table_filter label").text("");
      // $("#table_filter").append(input.first());

      var r = $("#table tfoot tr");
      r.find("th").each(function () {
        $(this).css("padding", 8);
      });
      $("#table thead").append(r);
      $("#search_0").css("text-align", "center");
    },
    stateSave: true,
    language: {
      "url": "/assets/js/German.json",
      "searchPlaceholder": "Search..."
    },
    "oLanguage": { "sSearch": "" }

  });
  // Clear all Search filter (after reload)
  if (table.state.loaded()) {
    table
      .search('')
      .columns().search('')
      .draw();

  }

  var logsTable = $('#logsTable').DataTable({
    "ordering": false,
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
    `
    <button id="New" title="Neuen Artikel hinzufügen">
      Neu
    </button>
    <button id="Edit" disabled title="Wähle eine Zeile aus um sie bearbeiten zu können">
      Bearbeiten
    </button>
    <button id="Delete" disabled title="Wähle mindestens eine Zeile aus um sie löschen zu können">
      Löschen
    </button>
    
    <label for="alert">
      <span>Nur Reihen mit Warnungen anzeigen</span>
      <input id="alert" type="checkbox">
    </label>
    `
  ).insertBefore("#table");

  //console.log($(".dt-table"));

  $('#table tbody').on('dblclick', 'tr', function (e) {
    var that = $(this);
    if (!$(this).hasClass("selected")) {
      selectRows(that, e);
    }

    if (!e.ctrlKey) {
      $("#Edit").trigger("click");

    }
    console.log("double click");
  });

  $("#table tbody").on("click", "tr", function (e) {
    var that = $(this);
    selectRows(that, e);
  });


  //selects row(s)
  function selectRows(that, e) {
    var thisClass = that.hasClass("selected");

    if (e.ctrlKey) {
      that.toggleClass("selected");
    } else {
      table.rows().every(function (rowIdx, tableLoop, rowLoop) {
        //console.log(this);
        this.nodes().to$().removeClass("selected");
      });
      if (!thisClass) {
        that.toggleClass("selected");
      }
    }

    selectHandler();
  }

  function selectHandler() {
    var rowsSelected = table.rows(".selected").data().length;
    //console.log(rowsSelected);

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
  }

  $("#table").on("click", ".log", function (e) {
    // console.log("------------------");
    // console.log($(this));
    // console.log("------------------");
    var id = $(this).parent().parent().children().first().html().trim();
    window.location.href = `/logs/${id}`;
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
    console.log(counter);
    var artikel = table.rows(".selected").data()[0][1];
    $("#PopUpDelete").show();
    $("#cover").show();
    if (counter > 1) {
      $(".PopUpDelete_middle").html(`<span>Sind Sie sicher, dass Sie ${counter} Einträge löschen möchten?<span>`);
    } else {
      $(".PopUpDelete_middle").html(`<span>Sind Sie sicher, dass Sie "${artikel}" löschen möchten?<span>`);
    }
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
