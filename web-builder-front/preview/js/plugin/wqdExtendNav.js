(function ($) {
    var wqdExtendNav={};
    //重新计算位置
    wqdExtendNav.resize= function () {
        var obj=$("[data-elementtype=extendNav]");
         if(obj.hasClass("full_nav")) {
             var _range=obj.attr("page-range")?parseFloat( obj.attr("page-range")):0;
             var width = $(window).width(),
                 sectionWidth = +$(this).parents(".sectionV2").attr("sectionwidth") || 1200;
             width = width < sectionWidth ? sectionWidth : width;
             obj.width(Math.ceil(width*((100-_range*2)/100)));
             $(".wqd-mainnava").parent().each(function (i, _) {
                 //$(_).css("width",100/$(".wqd-mainnava").length+"%")
                 $(_).width(obj.width()*$(_).attr("nav-percent"));
             });
         }
    };
    //绑定二级导航事件
    //$(".wqd-subnavul").css("display","none");
    $(".wqdNavTemplate .wqd-mainnavli").hover(function () {
        $(this).children(".wqd-subnavul").stop().slideDown(200)
    }, function () {
        $(this).children(".wqd-subnavul").stop().slideUp(200)
    });

    wqdExtendNav.resize();
    $(window).on("resize",function () {
        wqdExtendNav.resize();
    })

})($);
