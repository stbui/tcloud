define(function() {
    var pubu = {};
    pubu.init = function() {
        //瀑布流
        this.pubu = function() {
            $.fn.extend({
                MM: function(options) {
                    //参数和默认值
                    var defaults = {cols: 3};
                    var options = $.extend(defaults, options);
                    var t = $(this),
                        $li = t.find("li"),
                        Falls = {},
                        TW = t.width(),
                        $liBorderW = 0;

                    Falls.init = function() {
                        var column=t.parents("[data-elementtype='picture']").attr("column");
                        t.css({ "position": "relative" }).children("li").css({ "position": "absolute" }).removeClass("nouse");
                        options.cols=column?Number(column):3;
                        this.setWidth();
                        this.setTL();
                    };
                    //li的宽度
                    Falls.setWidth = function() {
                        $li.each(function(i) {
                            $(this).css({ "width": 100 / options.cols + "%", "top": 0 });
                            i < options.cols && $(this).css({ "left": 100 * i / options.cols + "%" });
                        });
                    };
                    Falls.getRealHW = function(src) {
                        var image = new Image();    
                        image.src = src;
                        var W = image.width;
                        H = image.height;
                        return H / W;
                    };
                    //li的高度
                    Falls.getHeight = function(len) { //获取制定个数的li高度数组
                        var json = {};
                        $li.each(function(i) { //
                            var url =$(this).parents(".atlasWrap4").length?$(this).find("a").css("background-image").replace(/url\("([^)]+)"\).*/gi,"$1"): $(this).find("a>img").attr("src");
                            if (i >= len || $(this).hasClass("nouse")) return;
                            var imgH = Falls.getRealHW(url) * $(this).width(),
                                txtBoxH = $(this).find(".txt_box").height(),
                                paddingBom = parseInt($(this).css("paddingBottom"), 10);
                            json[i] = imgH + txtBoxH + $liBorderW + $(this).position().top + paddingBom;
                        });
                        return json;
                    };
                    //li的top和left
                    Falls.setTL = function() {
                        //只有一行
                        if ($li.length < options.cols) {
                            $li.css("top", 0);
                            return;
                        } else {
                            $li.each(function(i) {
                                if (i < options.cols) {
                                    return;
                                } else {
                                    var arr = [];
                                    for (var x in Falls.getHeight(i)) {
                                        arr.push(Falls.getHeight(i)[x])
                                    };
                                    var min = Math.min.apply(null, arr),
                                        minIdx;
                                    for (var x in Falls.getHeight(i)) {
                                        if (Falls.getHeight(i)[x] == min)
                                            minIdx = x;
                                    };
                                    console.log( Math.round($li.eq(minIdx).addClass("nouse").position().left / $li.innerWidth()) * (100 / options.cols) + "%");
                                    $(this).css({
                                        "top": $(this).parents(".atlasWrap4").length?0:min,
                                        "left": Math.round($li.eq(minIdx).addClass("nouse").position().left / $li.innerWidth()) * (100 / options.cols) + "%"
                                    })
                                };
                            });
                        };
                    };
                    Falls.init();
                    return this;
                }
            });
        }();
        //拖拽事件
        $(document).on("element.resize", "[data-elementtype='picture']", function(e) {
            var obj=$(e.target);
            obj.find(".masonry").MM();
            $(document).trigger("appSetCatch");
        });
    };
    return pubu;
});
