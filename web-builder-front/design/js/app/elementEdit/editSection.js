define(function () {
    return {
        init:function(){
            this.bindEvent();
            $(document).trigger("sectionResize");
        },
        bindEvent:function(){
            $(document).on("sectionResize",function(e){
                var $sections = $(".wqdSectiondiv").filter(function() {
                        return ! ($(this).find(".artDetlSection").length || $(this).hasClass("hoverCon-section"));
                    });
                $sections.each(function(index, el) {
                    if(!$(el).siblings(".sectionDragCtrl").length) {
                        $(el).after("<div class='sectionDragCtrl'></div>");
                    }
                });

            });
            var onDragSection = false;
            $("body").off(".sec").on("mousedown.sec.secDrag", ".sectionDragCtrl", function (e) {
                var cY = e.clientY,
                    $this = $(this),
                    $section = $this.siblings(".wqdSectiondiv").find(".sectionV2"),
                    height = $section.height();

                $("body").off(".secMove").on("mousemove.sec.secMove", function (e) {
                    var h = height + e.clientY - cY;
                    $section.height(h).attr("wqdheight",h);
                    onDragSection = true;
                });
            }).on("mouseup.sec", function (e) {
                $("body").off("mousemove.secMove");
                onDragSection && $(document).trigger("appSetCatch");
                onDragSection = false;
			})
        }
    };
});
