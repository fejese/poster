function parseSize(field) {
    var val = $(field).val();
    if (val.endsWith("px") || val.endsWith("em") || val.endsWith("cm") || val.endsWith("mm") || val.endsWith("pt")) {
        return val;
    }
    return parseInt(val);
}

function update() {
    var poster = $("#poster");
    var max_font_size = parseInt($("#max_font_size").val(), 10);
    var poster_size = $("#poster_size").val();
    if (poster_size == "custom") {
        $("#orientation").css("display", "none");
        $("#custom_size").css("display", "inline");
        var poster_width = parseSize("#poster_width");
        var poster_height = parseSize("#poster_height");
    } else {
        $("#custom_size").css("display", "none");
        $("#orientation").css("display", "inline");
        var dimensions = poster_size.split(" ");
        var orientation = $("input[name=orientation]:checked").val();
        if (orientation == "landscape") {
            dimensions = dimensions.reverse();
        }
        var poster_width = dimensions[0];
        var poster_height = dimensions[1];
        $("#poster_width").val(poster_width);
        $("#poster_height").val(poster_height);
    }
    poster.css("width", poster_width);
    poster.css("height", poster_height);

    if (!isNaN(max_font_size)) {
        var poster_text = $("#poster_text");
        poster_text.css("display", "inline");
        poster_text.css("margin-top", "0px");
        poster_text.html($("#text").val());
        poster.textfill({maxFontPixels: max_font_size});
        var new_height = parseInt(poster_text.css("height"));
        var container_height = parseInt(poster.css("height")) - parseInt(poster.css("padding-top")) - parseInt(poster.css("padding-bottom"));
        poster_text.css("margin-top", (container_height - new_height) / 2 + "px");
        poster_text.css("display", "block");

        html2canvas(document.getElementById("poster")).then(function(canvas) {
            $("#poster_image canvas").remove();
            document.getElementById("poster_image").appendChild(canvas);
            var im = $(canvas);
            var im_w = parseInt(im.css("width"));
            var im_h = parseInt(im.css("height"));
            var im_r = im_h / im_w;
            var max_im_w = window.innerWidth * 0.7;
            var max_im_h = window.innerHeight * 0.7;
            var max_im_r = max_im_h / max_im_w;

            var new_im_w = Math.min(im_w, max_im_w);
            var new_im_h = Math.min(new_im_w * im_r, im_h, max_im_h);
            new_im_w = new_im_h / im_r;
            $("#image_overlay canvas")
                .css("width", new_im_w + "px")
                .css("height", new_im_h + "px")
            ;
        });
    }
}

function add_paper_sizes() {
    var size_select = $("#poster_size");
    var paper_sizes = {
        meme: "297px 420px",
        custom: "custom",
        A5: "148mm 210mm",
        A4: "210mm 297mm",
        A3: "297mm 420mm",
        Letter: "216mm 279mm",
        Legal: "216mm 356mm",
        Tabloid: "279mm 432mm",
    };
    for (var name in paper_sizes) {
        var size = paper_sizes[name];
        size_select.append($("<option>").val(size).text(name));
    }
}

function add_handlers() {
    $("select, input, textarea").keyup(update).change(update);

    $("#download_button").click(function() {
        $(document).href = $("canvas")[0].toDataURL();
        $(document).download = "poster.png";
        var image = $("canvas")[0].toDataURL("image/png").replace("image/png", "image/octet-stream");
        var link = document.createElement("a");
        link.download = "poster.png";
        link.href = image;
        link.click();
    });
}

$(function () {
    add_paper_sizes();
    add_handlers();

    $("#text").val("keep\ncalm\nand\ncarry\non");
    update();
});

