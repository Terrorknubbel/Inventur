$('tr > td:first-child').each(function (i) {
    switch ($(this).html().trim()) {
        case "delete":
            $(this).css("border", "1px solid red");
            break;
        case "change":
            $(this).css("border", "1px solid orange");
            break;
        case "create":
            $(this).css("border", "1px solid #0096c7");
            break;
        default:

            break;
    }
});