
define(function() {
    var wqdNavElement = {};
    wqdNavElement.resize= function () {
        var obj=$("[data-elementtype=extendNav]");
        if(obj.hasClass("full_nav")) {
            var _range=obj.attr("page-range")?parseFloat( obj.attr("page-range")):0;
            var width = $(window).width(),
                sectionWidth = +$(this).parents(".sectionV2").attr("sectionwidth") || 1200;
            width = width < sectionWidth ? sectionWidth : width;
            obj.width(Math.ceil(width*((100-_range*2)/100)));
            $(".wqd-mainnava").parent().each(function (i, _) {
                //$(_).css("width",100/$(".wqd-mainnava").length+"%");
                $(_).width(obj.width()*$(_).attr("nav-percent"));
            });
        }
    };
    wqdNavElement.resize();
    $(window).on("resize",function () {
        wqdNavElement.resize();
    });
    return wqdNavElement;
});


