define(['popupDrag', 'createColorStyle', 'utility', 'popupCommon', 'popupImgEdit'], function(popupDrag, createColorStyle, utility, popupCommon, popupImgEdit) {
    var tuce = {};
    tuce.init = function() {
        this.request();
        tuce.animation();
        //手机编辑中悬停、点击效果
        if ($("body").find(".wqdIphoneView").length) {
            $(document).on("click", ".wqd-atlas li .wrap ", function() {
                $(this).find("a>span").toggleClass("mShadeBg").end().parent().siblings().find("a>span").removeClass("mShadeBg");
                $(this).find("h5").toggleClass("mTitleColor").end().parent().siblings().find("h5").removeClass("mTitleColor");
            });
        };
    };
    tuce.request = function() {
        $(document).on("pictureEdit", function(e, data) {
            var $node = data.element;
            if ($node.attr("data-elementtype") == "picture") {
                var $node = data.element;
                setTimeout(function() {
                    // _ei.removeElementEditBtn();
                    window.edit = $node;
                    $.ajax({
                        url: '../js/app/JSON/designComponentEdit.json',
                        type: "GET",
                        dataType: "json",
                        success: function(json) {
                            $.colorbox({
                                transition: "none",
                                opacity: 0.5,
                                html: json.edit.tuceSet,
                                fixed: true,
                                closeButton: false,
                                onOpen: function() {
                                    window.scroll_top = $(document).scrollTop();
                                },
                                onComplete: function() {
                                    popupCommon.commonInit();
                                    tuce.render();
                                },
                                onClosed: function() {
                                    window.scrollTo(0, window.scroll_top);
                                }
                            });
                        }
                    });

                }, 0);
            }
        });
        $(document).on("elmenentEdit", function(e, data) {
            var $node = data.element;
            if ($node.attr("data-elementtype") == "picture") {
                var $node = data.element;
                setTimeout(function() {
                    // _ei.removeElementEditBtn();
                    window.edit = $node;
                    $.ajax({
                        url: '../js/app/JSON/designComponentEdit.json',
                        type: "GET",
                        dataType: "json",
                        success: function(json) {
                            $.colorbox({
                                transition: "none",
                                opacity: 0.5,
                                html: json.edit["editImg"],
                                fixed: true,
                                closeButton: false,
                                onOpen: function() {
                                    window.scroll_top = $(document).scrollTop();
                                },
                                onComplete: function() {
                                    popupImgEdit.editImgInit();
                                },
                                onClosed: function() {
                                    window.scrollTo(0, window.scroll_top);
                                }
                            });
                        }
                    });

                }, 0);
            }
        });
    };
    //图册运动动画
    tuce.animation = function() {
         //图册一
        var tuce_1 = function() {
            $(document).on("element.resize", "[data-elementtype='picture']", function(e) {
                var edit=$(e.target);
                if (edit.find(".wqdPictureUsual") && edit.attr("heiRatio")) {
                    //拖拽宽度
                    var $aWidth = edit.width() * Number(edit.attr("heiRatio"))
                    edit.find("li a").css("height",$aWidth);
                };
            });
        }();
        //图册三
        var tuce_3 = function() {
            var speed = 10;
            var MyMar;
            $(document).on("mouseover mouseout", '.leftBar,.rightBar', function(e) {
                var self = $(this);
                var tab = self.siblings(".atlasWrap3")[0];
                if ($(tab).find(".autoscroll.copy").length == 0) {
                    $("<div class='autoscroll copy'><div>").appendTo($(tab).find(".scrollBox"));
                };
                var tab1 = $(tab).find(".autoscroll")[0];
                var tab2 = $(tab).find(".autoscroll.copy")[0];
                if (e.type == "mouseover") {
                    tab2.innerHTML = tab1.innerHTML;
                    clearInterval(MyMar);
                    if ($(this).hasClass("rightBar")) {
                        function Marquee1() {
                            if (tab2.offsetWidth - tab.scrollLeft <= 0) {
                                tab.scrollLeft = 0;
                            } else {
                                tab.scrollLeft += 1;;
                            }
                        };
                        MyMar = setInterval(Marquee1, speed);
                    } else if ($(this).hasClass("leftBar")) {
                        function Marquee2() {
                            if (tab.scrollLeft <= 0)
                                tab.scrollLeft += tab2.offsetWidth
                            else {
                                tab.scrollLeft--
                            }
                        }
                        MyMar = setInterval(Marquee2, speed);
                    };
                } else if (e.type == "mouseout") {
                    clearInterval(MyMar);
                };
            });
            //拖拽函数
            $(document).on("element.resize", "[data-elementtype='picture']", function(e) {
                if ($(e.target).find(".atlasWrap3")) {
                    //拖拽宽度
                    $(".atlasWrap3").each(function() {
                        $(this).find("li a").each(function() {
                            var self = $(this);
                            var image = new Image();    
                            image.src = self.css("background-image").replace(/\"|\(|\)|url/g, '');
                            var realWidth = image.width;
                            var realHeight = image.height;
                            self.parents("li").css("width", self.height() * (realWidth / realHeight))
                        });
                    });

                };
            });
        }();
        //图册四
        var tuce_4 = function() {
            $(document).on("tuce_4", function() {
                $(".atlasWrap4").each(function(i) {
                    //获取比例
                    function getInitRatio(url) {
                        var image = new Image();    
                        image.src = url;
                        var realWidth = image.width;
                        var realHeight = image.height;
                        return realWidth / realHeight;
                    };
                    var self = $(this).find(".wqd-atlas");
                    self.find("a").each(function() {
                        $(this).height($(this).parents("[data-elementtype='picture']").height());
                    });
                    self.on("mouseenter", "li", function() {
                        var $li = $(this);
                        var viewHeight = $li.parents("[data-elementtype='picture']").height();
                        var viewWidth = $li.parent().width();
                        var imgSrc = $li.find("a").css("background-image").replace(/\"|\(|\)|url/g, '');;
                        var activeWidth = viewHeight * getInitRatio(imgSrc) >= viewWidth * 0.8 ? viewWidth * 0.8 : viewHeight * getInitRatio(imgSrc);
                        var allChildren = $li.parent().children();
                        var liLen = allChildren.length;
                        var otherWidth = (viewWidth - activeWidth) / (liLen - 1);
                        var activeIndex = $li.index();
                        $li.addClass("active").siblings().removeClass("active");
                        $li.find(".wrap,.wrap a").css({
                            "width": "100%"
                        });
                        allChildren.each(function(i) {
                            var self = $(this);
                            if (i < activeIndex) {
                                self.stop().animate({
                                    "left": i * otherWidth,
                                    "width": otherWidth
                                });
                            } else if (i == activeIndex) {
                                self.stop().animate({
                                    "left": i * otherWidth,
                                    "width": activeWidth
                                }, function() {
                                    self.find(".txt_box").css("width", activeWidth).stop().show(200)
                                });
                            } else if (i > activeIndex) {
                                self.stop().animate({
                                    "width": otherWidth,
                                    "left": (i - 1) * otherWidth + activeWidth
                                });
                            };
                        });
                    });
                });
                $(document).on("mouseleave", ".atlasWrap4", function() {
                    var self = $(this);
                    var viewWidth = self.width();
                    var liLen = self.find("li").length;
                    self.find("li").each(function(m) {
                        self.find(".txt_box").hide();
                        $(this).stop().animate({
                            "width": viewWidth / liLen,
                            "left": viewWidth * m / liLen
                        }, function() {
                            self.find(".wrap,.wrap a").css({
                                "width": viewWidth / liLen + "px"
                            });
                        });
                    });

                });
            });
            $(document).trigger("tuce_4");
            $(document).on("element.resize", "[data-elementtype='picture']", function(e) {
                var obj = $(e.target);
                if (obj.find(".atlasWrap4")) {
                    var $liLen = obj.find(".atlasWrap4 li").length;
                    var viewWidth = obj.width();
                    var viewHeight = obj.height();
                    obj.find(".atlasWrap4 li").each(function(i) {
                        $(this).css({
                            width: viewWidth / $liLen,
                            left: i * (viewWidth / $liLen)
                        }).find(".wrap,.wrap a").css({
                            "width": viewWidth / $liLen,
                            height: viewHeight
                        });

                    });
                };
                // $(e.target).find(".atlasWrap4") && $(document).trigger("tuce_4");
            });
        }();
        //图册五
        var tuce_5 = function() {
            //主要是下面的图片列表滚动
            $(document).on("click", ".atlasWrap5 .wqd-atlas li a", function(e) {
                var $this = $(this);
                var self = $this.parents(".atlasWrap5");
                var scrollBox = self.find(".wqd-atlas");
                e.stopPropagation();
                self.find(".pohotoshow a").css("background-image", $this.css("background-image")).attr({
                    "href": $this.attr("href"),
                    "target": $this.attr("target") ? $this.attr("target") : ""
                }).find(".mask").css("background-color", $this.find(".mask").css("background-color") ? $this.find(".mask").css("background-color") : "rgba(0,0,0,0)");
            });
            $(document).on("mousedown", ".atlasWrap5 .wqd-atlas", function(e) {
                //初始坐标
                e.stopPropagation();
                var downX = e.pageX;
                var downY = e.pageY;
                var $this = $(this);
                var scrollAttr = parseInt($this.attr("scroll"), 10) || 0; //为了保存拖动距离
                var scrollMax = $this.find("li").length * $this.find("li").innerWidth() - $this.width();
                $(document).on("mousemove.atlasWrap5", function(e) {
                    var moveX = e.pageX;
                    var moveY = e.pageY;
                    var range = downX - moveX;
                    var realScrollrange = function() {
                        // (range+scrollAttr)>=scrollMax?scrollMax:range+scrollAttr;
                        // (range+scrollAttr)<=0?0:(range+scrollAttr);
                        if ((range + scrollAttr) >= scrollMax) {
                            return scrollMax;
                        } else if ((range + scrollAttr) <= 0) {
                            return 0;
                        } else {
                            return range + scrollAttr;
                        };
                    }();
                    // if (range >= 0) {};
                    $this.scrollLeft(realScrollrange).attr("scroll", realScrollrange);
                }).on("mouseup", function() {
                    $(document).off("mousemove.atlasWrap5");
                });
            });

            $(document).on("element.resize", "[data-elementtype='picture']", function(e) {
                var obj = $(e.target);
                if (obj.find(".atlasWrap5")) {
                    obj.find(".atlasWrap5 .pohotoshow").css({
                        height: obj.height() - 66
                    }).find("a").css({ height: "100%" });
                };
                $(document).trigger('appSetCatch');
                // $(e.target).find(".atlasWrap4") && $(document).trigger("tuce_4");
            });
        }();
        $(document).on("wqdBaseElementCallBack", function(e, section) {
            if (section.elementString.match(/data-elementtype=\"picture\"/g)) {
                if (section.elementString.match(/atlasWrap4/g)) {
                    $(document).trigger("tuce_4");
                };
                $(document).trigger('appSetCatch');
            };
        });

    };
    //图册弹窗设置
    tuce.render = function() {
        var tuceInner = {};
        var $slider_0 = $(".tuceSet .slider").eq(0);
        var $moment_0 = $slider_0.siblings(".moment");
        var $input_0 = $slider_0.parent().siblings("input");
        tuceInner.funs = {
            //滑块距离
            sliderSet: function(Max, Min, index, space, val) {
                var momentWidth = 105;
                $(".tuceSet .slider").eq(index).css("left", (momentWidth * val) / Max).siblings(".moment").css("width", (momentWidth * val) / Max);
                if (space <= Min) {
                    $(".tuceSet .slider").eq(index).css("left", (momentWidth * Min) / Max).siblings(".moment").css("width", (momentWidth * Min) / Max).parent().siblings("input").val(Min);
                } else if (space >= Max) {
                    $(".tuceSet .slider").eq(index).css("left", (momentWidth * Max) / Max).siblings(".moment").css("width", (momentWidth * Max) / Max).parent().siblings("input").val(Max);
                };
                if (val <= Min) {
                    $(".tuceSet .slider").eq(index).parent().siblings("input").val(Min);
                };
            },
            //列数
            column: function(n) {
                var Max = 10;
                var Min = 1;
                var momentWidth = 105;
                var initColSpace = 30;
                n = Math.round(n * Max, 10);
                var padR = !edit.attr("colSpace") ? 30 : edit.attr("colSpace");
                var padD = !edit.attr("rowSpace") ? 30 : edit.attr("rowSpace");
                //最小
                if (n <= Min) {
                    n = Min;
                    $(".tuceSet .slider").eq(0).css("left", (momentWidth * Min) / Max).siblings(".moment").css("width", (momentWidth * Min) / Max).parent().siblings("input").val(Min);
                    edit.find(".wqd-atlas>li").css({
                        "padding": "0",
                        "width": "100%"
                    });
                    edit.find(".atlasWrap").css("margin-right", -(!edit.attr("colspace") ? initColSpace : edit.attr("colspace")));
                } else if (n >= Max - 0.5) { //最大
                    n = Max;
                    edit.find(".wqd-atlas>li").css("width", (100 / Max) + "%");
                    edit.find(".atlasWrap").css("margin-right", -(!edit.attr("colspace") ? initColSpace : edit.attr("colspace")));

                } else if (n > Min && n < Max) { //中间
                    edit.find(".wqd-atlas>li").css("width", (100 / n) + "%");
                    edit.find(".atlasWrap").css("margin-right", -(!edit.attr("colspace") ? initColSpace : edit.attr("colspace")));
                };
                edit.find(".wqd-atlas>li").css("padding", "0 " + padR + "px " + padD + "px " + "0");
                // tuceInner.funs.pubu();
                $(".tuceSet .slider").eq(0).parent().siblings("input").val(n);
                edit.attr("column", n);
                // $(document).trigger('appSetCatch');
                edit.find(".wqdPictureFalls").MM({cols:n});
            },
            //行距
            rowSpace: function(n) {
                var Max = 100;
                n = Math.round(n * Max, 10);
                if (edit.find(".atlasWrap5").length != 0) {
                    var pohotoshowHeight = edit.find(".pohotoshow").innerHeight();
                    edit.find(".pohotoshow").css("padding-bottom", n).find("a").height(pohotoshowHeight - n);
                } else {
                    edit.find(".wqd-atlas>li").css("padding-bottom", n);
                };
                // tuceInner.funs.pubu();
                edit.find(".wqdPictureFalls").MM();
                edit.attr("rowSpace", n);
                $(".tuceSet .slider").eq(1).parent().siblings("input").val(n);
                // $(document).trigger('appSetCatch');
            },
            //列矩
            colSpace: function(n) {
                var Max = 100;
                col = Math.round(n * Max, 10);
                edit.attr("colSpace", col);
                $(".tuceSet .slider").eq(2).parent().siblings("input").val(col);
                //列数为1
                if (edit.attr("column") == "1") {
                    return;
                };
                if (n * Max < 1) {
                    n = 0;
                    $(".atlasWrap5 .wqd-atlas").length && $(".atlasWrap5 .wqd-atlas ").css("margin-right", -1 + "px");
                };
                if (edit.find(".atlasWrap3").length != 0) {
                    edit.find(".wqd-atlas>li,.copy>li").css({
                        "margin-right": n * Max
                    });
                } else {
                    edit.find(".wqd-atlas>li").css({
                        "padding-right": n * Max
                    });
                };
                edit.find(".atlasWrap").css({
                    "margin-right": "-" + Math.ceil(n * Max) + "px" //1像素差值
                });
                edit.find(".wqdPictureFalls").MM();
                // tuceInner.funs.pubu();
                // $(document).trigger('appSetCatch');
            },
            selectColor: function(category, colorVal) {
                switch (category) {
                    case "1": //图片标题色
                        createColorStyle.styleInit(edit.attr("id"), ".txt_box h5", {
                            'color': colorVal,
                        });
                        edit.attr("txtColor", colorVal);
                        break;
                    case "3": //字体悬停色
                        if ($("#wqdIphonePage").length == 0) {
                            createColorStyle.styleInit(edit.attr("id"), ".wrap:hover h5", {
                                'color': colorVal,
                            });
                        } else {
                            createColorStyle.styleInit(edit.attr("id"), ".wrap .mTitleColor", {
                                'color': colorVal,
                            });
                        };
                        edit.attr("txtColorHover", colorVal);
                        break;
                    case "5": //图片悬停效果
                        if ($("#wqdIphonePage").length == 0) {
                            createColorStyle.styleInit(edit.attr("id"), ".wrap:hover a>span", {
                                'background-color': colorVal,
                            });

                        } else {
                            createColorStyle.styleInit(edit.attr("id"), ".wrap a .mShadeBg", {
                                'background-color': colorVal,
                            });
                        };
                        edit.attr("shadeColor", colorVal);
                        break;
                    default:
                        break;
                };
                $(document).trigger('appSetCatch');
            },
        }
        tuceInner.eleInit = function() {
            function recordSlider() {
                for (var i = 0; i < arguments.length; i++) {
                    var realColumn = !edit.attr(arguments[i].attr) ? arguments[i].init : edit.attr(arguments[i].attr);
                    $(".tuceSet .slider").eq(i).siblings(".moment").css("width", (105 * realColumn) / arguments[i].max);
                    $(".tuceSet .slider").eq(i).css("left", (105 * realColumn) / arguments[i].max);
                    $(".tuceSet .slider").eq(i).parent().siblings("input").val(realColumn);
                };
            };
            recordSlider({
                init: 3,
                attr: "column",
                max: 10
            }, {
                init: function() {
                    if (edit.find(".atlasWrap5").length != 0) {
                        return 10;
                    } else {
                        return 30;
                    };
                }(),
                attr: "rowSpace",
                max: 100
            }, {
                init: function() {
                    if (edit.find(".atlasWrap5").length != 0) {
                        return 10;
                    } else {
                        return 30;
                    };
                }(),
                attr: "colSpace",
                max: 100
            });
            //根据功能实现
            $(".tuceSet span:contains('图片描述色')").parent().css("display", "none").next().css("display", "none");
            $(".tuceSet span:contains('悬停描述色')").parent().css("display", "none").next().css("display", "none");
            $(".tuceSet span:contains('悬停效果')").parent().css("display", "none").next().css("display", "none");
            //图片标题色
            var titleColor = !edit.attr("txtColor") ? "#333333" : edit.attr("txtColor");
            $(".tuceSet span:contains('图片标题色')").siblings("input").val(titleColor).siblings(".colordeviceBg").find(".colordevice").css("background-color", titleColor);
            //图片标题悬停色
            var titleColorHover = !edit.attr("txtColorHover") ? "#333333" : edit.attr("txtColorHover");
            $(".tuceSet span:contains('悬停标题色')").siblings("input").val(titleColorHover).siblings(".colordeviceBg").find(".colordevice").css("background-color", titleColorHover);
            //图片遮罩色
            var shadeColor = !edit.attr("shadeColor") ? "rgba(255,255,255,0.8)" : edit.attr("shadeColor");
            $(".tuceSet span:contains('悬停遮罩色')").siblings("input").val(shadeColor).siblings(".colordeviceBg").find(".colordevice").css("background-color", shadeColor);
            //根据图册样式选择隐藏
            if (edit.find(".atlasWrap3").length != 0) {
                $(".tuceSet span:contains('图片列数'),.tuceSet span:contains('图片行距'),.tuceSet span:contains('图片标题色'),.tuceSet span:contains('悬停标题色')").parent().css("display", "none").next().css("display", "none");
            };
            if (edit.find(".atlasWrap4").length != 0) {
                $(".tuceSet span:contains('图片列数'),.tuceSet span:contains('图片行距'),.tuceSet span:contains('图片列距')").parent().css("display", "none").next().css("display", "none");
            };
            if (edit.find(".atlasWrap5").length != 0) {
                $(".tuceSet span:contains('图片列数'),.tuceSet span:contains('图片标题色'),.tuceSet span:contains('图片标题色'),.tuceSet span:contains('悬停标题色')").parent().css("display", "none").next().css("display", "none");
            };
            //手机端设置更改
            if ($(".wqdIphoneView").length) {
                $(".tuceSet span:contains('悬停标题色')").text("点击标题色");
                $(".tuceSet span:contains('遮罩色')").text("点击遮罩色");
            };
        }();
        tuceInner.bindEvent = function() {
            var funs = tuceInner.funs;
            //图片列数
            utility.range({
                maxval: 10,
                minval: 1,
                slider: $(".tuceSet .slider").eq(0),
                callback: funs.column
            });
            //图片行距
            utility.range({
                maxval: 100,
                slider: $(".tuceSet .slider").eq(1),
                callback: funs.rowSpace
            });
            //图片列距
            utility.range({
                maxval: 100,
                slider: $(".tuceSet .slider").eq(2),
                callback: funs.colSpace
            });
            //颜色设置
            $(".wqdEditBox.tuceSet .colorval").on("changeColor", function() {
                var colorVal = $(this).val();
                var category = $(this).attr("category");
                tuceInner.funs.selectColor(category, colorVal);
                $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
            });
        }();
    };
    return tuce;
});
