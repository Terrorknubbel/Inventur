$('tr > td:first-child').each(function (i) {
    console.log($(this).html());
    switch ($(this).html().trim()) {
        case "delete":
            $(this).css("background-color", "red");
            break;
        case "change":
            $(this).css("background-color", "orange");
            break;
        case "create":
            $(this).css("background-color", "green");
            break;
        default:

            break;
    }
});