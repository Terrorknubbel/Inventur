$(".AddRow").click(function () {
    $(this).find("i").toggleClass("fa-chevron-down fa-chevron-up");
    var th = $(this).parent().parent().parent().find("th:eq(1)").html();

    if ($(this).parent().siblings().length == 0) {
        //console.log($(this));
        $(this).parent().after(`
            <tr>
            <td><input maxlength="32" class="StammInput" type="text" placeholder="${th}..."></td>
            <td><input type="submit" value="Speichern" onclick="addStamm(this)" class="StammSave" /></td>
            </tr>
    `);

        $(function () {
            var input = $(`input[placeholder="${th}..."`).get(0);
            console.log(input);
            input.focus();
        });

    } else {
        console.log("fehler");
        $(this).parent().siblings().first().remove();
    }

})

$(".AddRow").hover(function () {
    $(this).css("cursor", "pointer");
});

function addStamm(x) {
    var input = $(x).parent().siblings(1).children();

    var placeholder = input.attr('placeholder');
    placeholder = placeholder.slice(0, placeholder.length - 3);

    var text = input.val();
    console.log("Placeholder: " + placeholder);
    console.log("text: " + text);
    if (text != "") {
        $.post(`/Stammdaten/${placeholder}`, { value: text }, function (data) {
            location.reload();
        });
    }
}

$(".fa-trash").click(function () {

    var id = $(this).parent().siblings().first().html().trim();
    var table = $(this).attr('class').split(' ').pop();

    $.ajax({
        url: `/stammdaten/${table}/${id}`,
        type: "DELETE",
        success: function (result) {
            location.reload();
        },
    });
});