$(window).scroll(function(){
    hoverContainerLoad();
}).on("load",function () {
    hoverContainerLoad();
})
function hoverContainerLoad() {
    var scrollTop = $(window).scrollTop(),
　　    scrollHeight = $(document).height(),
　　    windowHeight = $(window).height();
    $(".hc-fixed.hc-show-notfirst").toggle(scrollTop > windowHeight);
    $(".hc-fixed.hc-show-bottom").toggle(scrollTop + windowHeight >= scrollHeight-50);
}

$(document).on("mouseover",".wqdelementEdit.hoverContainer",function (e) {
    $(this).addClass("hover");
}).on("mouseout",".wqdelementEdit.hoverContainer",function () {
    $(this).removeClass("hover");
})
