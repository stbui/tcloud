define(['popupDrag', 'createColorStyle', 'utility', 'elementInfo', 'popupImgEdit','pageList'], function(popupDrag, createColorStyle, utility, elementInfo, popupImgEdit,_pageList) {
    var popupEdit = {};
    popupEdit.commonInit = function(linkPanel) {
        // $(".wqdColorPicker").colorpicker('destroy');
        $(".colorpicker.dropdown-menu").remove();
        var colorpic = $('.wqdColorPicker').colorpicker({
            format: false,
            colorSelectors: {
                '#777777': 'rgba(119, 119, 119,1)',
                '#337ab7': 'rgba(51, 122, 183,1)',
                '#5cb85c': 'rgba(92, 184, 92,1)',
                '#5bc0de': 'rgba(91, 192, 222,1)',
                '#f0ad4e': 'rgba(240, 173, 78,1)',
                '#d9534f': 'rgba(217, 83, 79,1)'
            }
        });
        //初始化颜色编辑器位置
        $('.wqdColorPicker').on("showPicker", function(e) {
            var elm = $(this),
                viewTop = elm.offset().top + elm.outerHeight() - $(window).scrollTop() + "px";
            setTimeout(function() {
                $(".colorpicker-visible").addClass("wqdDeleteArrows").css({
                    "top": viewTop,
                    "position": "fixed",
                    "z-index": "9999"
                });
            }, 0);
        });
        //初始化编辑器位置(保持居中)
        var editBoxW = $(".wqdEditBox").width(),
            editBoxH = $(".wqdEditBox").height(),
            nowLeft = $(window).width() / 2 - editBoxW / 2,
            nowTop = $(window).height() / 2 - editBoxH / 2;
        $(".wqdEditBox").css({
            "left": nowLeft,
            "top": nowTop,
            "opacity": 1
        });
        //编辑器弹窗关闭
        $(".wqdEditBox .edit_close").on("click", function() {
            $.fn.colorbox.close();
        });
        /*背景设置---左侧导航*/
        $(".wqdEditBox  .edit_content_nav li").click(function() {
            if ($(this).hasClass("imagesEdit") || $(this).hasClass("imagesSet")) {
                $(".super_editor .editor_footer>a").attr("picBox", "true");
            } else {
                $(".super_editor .editor_footer>a").attr("picBox", "false");
            }
            $('.super_editor .part4_content .img_box_panel>a').css("display", "none");
            if ($(this).hasClass("on")) return false;
            $(this).addClass("on").siblings().removeClass("on");
            var index = $(this).index();
            $(this).parents("nav.edit_content_nav").siblings("ul.edit_content").children().removeClass("on").eq(index).addClass("on");
            $(".nano").nanoScroller({
                alwaysVisible: true
            });
            return false;
        });
        //编辑框问号点击链接
        $(".wqdEditBox  .edit_help").click(function() {
            if ($(this).siblings("h1:contains('分享设置')").length != 0 || $(this).siblings("h1:contains('关注设置')").length != 0) {
                window.open("http://127.0.0.1");
            };
        });

        //编辑框问号点击链接
        $(".wqdEditBox  .edit_help").off("click").click(function() {
            if ($(this).siblings("h1:contains('分享设置')").length != 0 || $(this).siblings("h1:contains('关注设置')").length != 0) {
                window.open("http://127.0.0.1");
            } else if ($(this).siblings("h1:contains('轮播图设置')").length != 0) {
                window.open("http://127.0.0.1");
            } else if ($(this).siblings("h1:contains('图形设置')").length != 0) {
                window.open("http://127.0.0.1");
            } else if ($(this).siblings("h1:contains('图标设置')").length != 0) {
                window.open("http://127.0.0.1");
            } else if ($(this).siblings("h1:contains('按钮设置')").length != 0) {
                window.open("http://127.0.0.1");
            } else if ($(this).siblings("h1:contains('图册样式')").length != 0) {
                window.open("http://127.0.0.1");
            }else if ($(this).siblings("h1:contains('动态数字设置')").length != 0) {
                window.open("http://127.0.0.1");
            }else if ($(this).siblings("h1:contains('柱状图设置')").length != 0) {
                window.open("http://127.0.0.1");
            }else if ($(this).siblings("h1:contains('饼状图设置')").length != 0) {
                window.open("http://127.0.0.1");
            };
        });
        // linkPanel()
    };
    //拉伸背景高度时候 通屏轮播图实时设置
    function setFulllunbo(section) {
        if (section.hasClass('fullscreen')) {
            section.find('[data-elementtype=carouse]').height('100%');
        }
    }
    /////////////////背景、图形、图标拖拽回调函数///////////////////////////////
    function rangCallback(radio, _type, maxval,rangeVal) {
        var range = radio * maxval;
        if (edit.hasClass("wqdSideNavWrap")){
           //n是比例值
            var width = radio * windowW;
            obj.attr("wqdnavwidth", width);
            obj.css("width", width);
        };
        if (_type == "backgroundHeight") {
            //liumingren
            $(document).trigger("changeHeight:section", {
                parent: edit,
                newHeight: Math.round(rangeVal)
            });
            setFulllunbo(edit);
            setTimeout(function() {
                if (edit.hasClass("artDetlSection")) {
                    edit.css("min-height", Math.round(rangeVal));
                    edit.attr("wqdheight", Math.round(edit.css("min-height").replace("px", ""), 10));
                } else {
                    edit.height(Math.round(rangeVal));
                    edit.attr("wqdheight", edit.height());
                }
            }, 0);
        } else if (_type == "borderRadius") {
            var $button=edit.find(".wqd-button");
            if ($button.attr("wqdbtnborder") == "false") {
                $button.css({
                    "border-radius": (Math.round(range))
                });
                edit.attr("wqdborderradius", Math.round(range));
            }
        } else if (_type == "borderwidth") {

            var n=range;
            if (edit.attr("data-elementtype") == "icon"&&edit.attr("wqdpath_width")&&!edit.attr("viewX")) { //兼容以前老的导航图标
                var $icon=edit.find("svg");
                edit.attr("wqdPath_width", n);
                $icon[0].setAttribute("viewBox", (-250 - n * 26.42) + " " + (-250 - n * 26.42) + " " + (2392 + 2 * n * 26.42) + " " + (2392 + 2 * n * 26.42));
                $icon.children().attr("stroke-width", n * 26.42).attr("stroke-linecap", "square");
            }else if (/freeRect|svg|line|icon/g.test(edit.attr("data-elementtype"))) { //图形,图标
                //获取svg viewbox极值
                var view,$svg=edit.find("svg"),viewWidth,viewHei,viewX,viewY;
                if(!edit.attr("wqdpath_width")&&$svg.length){//获取初始值
                    var json= $svg[0].attributes;
                    for(var x in json){
                        if(typeof json[x].nodeValue=="string"&&json[x].nodeValue.split(" ").length>3)
                            view= json[x].nodeValue.split(" ");
                    };
                    view[0]=="new"&&view.splice(0,1);//兼容以前的基础图形
                    edit.attr({"viewX":view[0],"viewY":view[1],"viewWidth":view[2],"viewHei":view[3]})
                };

                //设置边框 并且修复border值不受控制问题
                edit.attr("wqdPath_width", Math.round(n));
                if ($svg.length) {
                    viewWidth=edit.attr("viewWidth"),viewHei=edit.attr("viewHei"),viewX=edit.attr("viewX"),viewY=edit.attr("viewY");
                    min=viewWidth>=viewHei?viewHei:viewWidth;
                    $svg[0].setAttribute("viewBox", (parseInt(viewX) - 0.5*n * min*0.01) + " " + (parseInt(viewY) - 0.5*n * min*0.01 ) + " " + (parseInt(viewWidth) +  n * min*0.01 ) + " " + (parseInt(viewHei)+  n * min*0.01 ));
                    // $svg[0].setAttribute("viewBox", (0 - n * min*0.01) + " " + (0 - n * min*0.01 ) + " " + (parseInt(viewWidth) +  2*n * min*0.01 ) + " " + (parseInt(viewHei)+  2*n * min*0.01 ));
                    $svg.children().attr("stroke-width", n * min*0.01).attr("stroke-linecap", "square");
                } else if (edit.find(".wqd-line").length) {
                    edit.find(".wqd-line").css("border-width", n);
                } else if (edit.find(".wqd-freeRect").length) {
                    edit.find(".wqd-freeRect").css({
                        "border-width": n,
                        "border-style": "solid",
                        "border-color": "#fff"
                    });
                }
            };
        }
        $(document).trigger('appSetCatch');
    };
    //图片入口函数
    function imgEntry(obj) {
        if ($(this).attr("readonly")) return false;
        $.ajax({
            url: '../js/app/JSON/designComponentEdit.json',
            type: "GET",
            dataType: "json",
            success: function(json) {
                $.colorbox({
                    transition: "none",
                    opacity: 0.5,
                    html: json.edit.editImg,
                    fixed: true,
                    closeButton: false,
                    onOpen: function() {
                        window.scroll_top = $(document).scrollTop();
                    },
                    onComplete: function() {
                        popupImgEdit.editImgInit();
                    },
                    onClosed: function() {
                        //关闭图片资源层，回到原来图层
                        obj.css({
                            "background-size": "cover",
                            "background-position": " center center",
                            "background-repeat": "no-repeat",
                            "background-color": obj.attr("wqdbgcolor")
                        }).attr("wqdback_position", 1);
                        window.scrollTo(0, window.scroll_top);
                        $(document).trigger('appSetCatch');
                        $(".tool-list2").removeClass("on");
                    }

                });
            },
        });

    }
    //背景图片设置按钮
    function bgButton(obj, ele) {
        if (ele.hasClass("novisual")) {
            ele.removeClass("novisual").siblings("input.colorval").removeClass("novisual").removeAttr("disabled").addClass("bgimg");
            obj.attr("wqdbgSet", "1");
            var imgsrc = ele.siblings(".colorval").val();
            var reg = /http:\/\/\w+/;
            if (reg.test(imgsrc)) {
                obj.find(".carousel-innerbg").length?obj.find(".carousel-innerbg").css("background-image", "url(" + imgsrc + ")"):obj.find("header").hasClass('wqdSideNavWrap')?obj.find("header").css("background-image", "url(" + imgsrc + ")"):obj.css("background-image", "url(" + imgsrc + ")");
            }
        } else {
            console.log(obj)
            ele.addClass("novisual").siblings("input.colorval").addClass("novisual").attr("disabled", "disabled").removeClass("bgimg");
            obj.attr("wqdbgSet", "0");
            obj.find(".carousel-innerbg").length?obj.find(".carousel-innerbg").css("background-image", ""):obj.find("header").hasClass('wqdSideNavWrap')?obj.find("header").css("background-image", ""):obj.css("background-image", "");
        }
        $(document).trigger('appSetCatch');
        return false;
    }
    //链接设置
    function linkPanel(_ele, obj, masterFin) {
        //设置-链接
        //链接-本页
        $(".pagedeatllist .plist.on .usercontent li").each(function(index, element) {
            var partid = $(this).attr("partid");
            var content = $("[partid=" + partid + "] em").html();
            var ele = $("<li><span partid=" + partid + ">" + content + "</span></li>");
            $("[wqdpage=0] ul").append(ele);


        });
        //链接-站内
        var pageLi = $(".pagedeatllist>li").not("[viewnews]");
        for (var i = 0; i < pageLi.length; i++) {
            (function(index) {
                if (pageLi.eq(index).find('.navnewsicon').length == 0) {
                    var href = pageLi.eq(index).attr("data-uri");
                    var content = pageLi.eq(index).find("em").html();
                } else {
                    var related = pageLi.eq(index).attr('related');
                    var ele = $('[related=' + related + ']').eq(0);
                    var href = pageLi.eq(index).attr("data-uri");
                    var content = ele.find("em").html();
                    i++;
                }
                var ele = $("<li><span partid=" + href + ">" + content + "</span></li>");
                $("[wqdpage=1] ul").append(ele);
            })(i);
        }
        //设置--基础--文字细节
        //获取  此处回显设置-链接
        if (obj.attr("wqdhref")) {
            var wqdhref_n = parseInt(obj.attr("wqdhref"));
            $('.desp').hide();
            if (wqdhref_n == 1) {
                //$('.desp').show();
                if ($("[wqdpage0]").length) {
                    $("[wqdpage=0]").find("p span").remove().end().find("p").prepend($("[wqdpage=0] ul li").eq(obj.attr("wqdpage0")).find("span").clone());
                    $("[wqdpage=0] ul li").eq(parseInt(obj.attr("wqdpage0"))).addClass("on");
                }
            } else if (wqdhref_n == 2) {
                $('.desp').show();
                if ($("[wqdpage0]").length) {
                    $("[wqdpage=1]").find("p span").remove().end().find("p").prepend($("[wqdpage=1] ul li").eq(obj.attr("wqdpage0")).find("span").clone());
                    $("[wqdpage=1] ul li").eq(parseInt(obj.attr("wqdpage0"))).addClass("on");
                }
            } else if (wqdhref_n == 3) {
                $('.desp').show();
                if (masterFin == ".wqd-button") {
                    $(".linkpoint .submit", _ele).val(obj.find(masterFin).attr("href"));
                } else {
                    $(".linkpoint .submit", _ele).val(obj.find(masterFin).parent("a").attr("href"));
                }
            }
        } else {
            var wqdhref_n = 0;
            $('.desp').hide();
        }
        /*设置--链接--*/
        //判断点击链接中的单选框的是无或者本页的时候禁止新窗口打开
        var $getEleContent = obj.find(".wqdelementEditBox")

        $(".edit_unitbox>ul.linkpoint li i.radio", _ele).on("click", function() {
			if($(this).hasClass("on")) return;

            var radioIndex=$(".linkpoint label>i").index($(this));
            if (radioIndex == 0||radioIndex==1) {
                if (masterFin == ".wqd-button") {
                    obj.find(masterFin).removeAttr("href");
                } else {
                    var $getSvg = obj.find(masterFin).clone();
                    $getEleContent.empty();
                    $getSvg.appendTo($getEleContent);
                }
                obj.find(masterFin).removeAttr("target").parents(".wqdelementEdit").removeAttr("targetnew");
                $(this).parents(".linkpoint").find(".desp span").removeClass("on");
                //是否在新页面打开
                $('.desp').hide();
            } else {
                //是否在新页面打开

                $('.desp').show();
            }

            obj.attr("wqdhref", $(".linkpoint label i").index($(this)));
            $(this).parents(".linkpoint li").siblings().find("i.radio").removeClass("on").end().end().end().addClass("on");
            $(this).parents(".linkpoint li").siblings().find(".borerwidthselect p").addClass("readonly").end().end().end().parent().siblings(".borerwidthselect").find("p").removeClass("readonly");
            $(this).parent().siblings(".submit").removeAttr("readonly").end().end().parents(".linkpoint li").siblings().children("input").attr("readonly", "readonly");
            $(".borerwidthselect").removeClass("on").find("p").removeClass("on").find("i").removeClass("on");
			$(".selectWarp").hide();
            $(document).trigger('appSetCatch');
            return false;
        });
        obj.attr("wqdhref", wqdhref_n);
        $(".linkpoint>li", _ele).eq(wqdhref_n).find("p.readonly").removeClass("readonly").end().find(".submit").removeAttr("readonly");
        $(".linkpoint>li", _ele).find("label>i").removeClass("on").eq(wqdhref_n).addClass("on");
        $(".linkpoint>li", _ele).find("label>input[radio]").attr("checked", "checked");
        //设置
         $("[wqdpage] ul>li").on("click", function() {
            if ($(this).parents("[wqdpage]").attr("wqdpage") == 0) {
                if (masterFin == ".wqd-button") {
                    obj.find(masterFin).attr("href", "#" + $(this).find("span").attr("partid")).end().attr("wqdpage0", $(this).index());
                } else {
                    var $getSvg = obj.find(masterFin).clone();
                    $getEleContent.empty();
                    if (obj.attr("targetnew") == "ture") {
                        $("<a target='_blank' href='" + "#" + $(this).find("span").attr("partid") + "'></a>").appendTo($getEleContent);
                    } else {
                        $("<a href='" + $('ul.pagedeatllist>li.on').attr('data-uri') + "?#" + $(this).find("span").attr("partid") + "'></a>").appendTo($getEleContent);
                    }
                    $getEleContent.find("a").append($getSvg);
                    obj.attr("wqdpage0", $(this).index());
                }
            } else if ($(this).parents("[wqdpage]").attr("wqdpage") == 1) {
                if (masterFin == ".wqd-button") {
                    obj.find(masterFin).attr("href", $(this).find("span").attr("partid")).end().attr("wqdpage0", $(this).index());
                } else {
                    var $getSvg = obj.find(masterFin).clone();
                    $getEleContent.empty();
                    if (obj.attr("targetnew") == "ture") {
                        $("<a target='_blank' href='" + $(this).find("span").attr("partid") + "'></a>").appendTo($getEleContent);
                    } else {
                        $("<a href='" + $(this).find("span").attr("partid") + "'></a>").appendTo($getEleContent);
                    }
                    $getEleContent.find("a").append($getSvg);
                    obj.attr("wqdpage0", $(this).index());
                }
            }
            $(this).parents("[wqdpage]").removeClass("on").find("i").removeClass("on").parent().removeClass("on").end().end().end().addClass("on").siblings().removeClass("on");
            $(this).parents(".selectWarp").hide().siblings("p").find("span").remove().end().prepend($(this).children().clone());
            $(document).trigger('appSetCatch');
        });
        $(".linkpoint .submit").on("input propertychange", function() {
            if (masterFin == ".wqd-button") {
                obj.find(masterFin).attr("href", $(this).val());
            } else {
                var $getSvg = obj.find(masterFin).clone();
                $getEleContent.empty();
                if (obj.attr("targetnew") == "ture") {
                    $("<a target='_blank' href='" + $(this).val() + "'></a>").appendTo($getEleContent);
                } else {
                    $("<a href='" + $(this).val() + "'></a>").appendTo($getEleContent);
                }
                $getEleContent.find("a").append($getSvg);
            }
            $(this).attr("value", $(this).val());
            $(document).trigger('appSetCatch');
        });
        $(".linkpoint .submit").on("blur", function() {
            var t=$(this);
            //判断输入内容
            var url=function(){
                var http=["http://","https://"],//网页文本协议
                    third=["mailto:","tel:","sms:","market:","geopoint:"],
                    val=t.val().replace(/^\s+/,"");//第三方
                function test(val,arr){
                    var flag=false;
                    for(var x in arr){
                        if(val.indexOf(arr[x])==0) return true;
                    };
                    return flag;
                };
                if(test(val,http)||test(val,third))//以http或https开头的时候
                {
                    return val;
                }else{//以mailto等开头的时候
                    return "http://"+val;
                };
            }();
            // if (!/http:\/\//.test($(this).val())) {}
            if (masterFin == ".wqd-button") {
                obj.find(masterFin).attr("href", url);
            } else {
                var $getSvg = obj.find(masterFin).clone();
                $getEleContent.empty();
                if (obj.attr("targetnew") == "ture") {
                    $("<a target='_blank' href='" +url + "'></a>").appendTo($getEleContent);
                } else {
                    $("<a href='" + url + "'></a>").appendTo($getEleContent);
                }
                $getEleContent.find("a").append($getSvg);
            }
            $(this).attr("value", url);

            $(document).trigger("appSetCatch");
        });
        //外链自动填补http://
        $('.linkpoint .submit', _ele).on('click', function() {
            if ($(this).val() == "") {
                $(this).val("http://");
                toEnd($(this));
            }

            function toEnd(id) {
                var obj = window.event.srcElement;
                if (obj && obj.createTextRange) {
                    var range = obj.createTextRange();
                    range.moveStart("character", $(id).val().length);
                    range.select();
                }
            }
            $(document).trigger('appSetCatch');
        });
        /*模拟下拉列表*/
        $(".wqdEditBox .borerwidthselect p").on("click", function(e) {
            if ($(this).hasClass("readonly")) return false;
            if ($(this).parent().hasClass("on")) {
                $(this).removeClass("on").parent().removeClass("on").find("i").removeClass("on");
				$(this).siblings(".selectWarp").hide();
            } else {
                $(this).addClass("on").parent().addClass("on").find("i").addClass("on");
				$(this).siblings(".selectWarp").show().nanoScroller({alwaysVisible: true});
            }
            e.preventDefault();
        });
    }
    //背景编辑器
    popupEdit.backgroundInit = function() {
        var obj = window.edit;
        var imgUrlText=obj.attr("wqdimgurlos")!="http"?obj.attr("wqdimgurlos"):"点击更换背景图";
        var $bgInput=$("span:contains('背景图片')").siblings("input");
        $bgInput.val(imgUrlText);
        if(obj.parent().attr("wqdbgset")=="0"&&obj.attr("wqdimgurlos")){
            $bgInput.attr({"class":"colorval novisual","disabled":"disabled"}).siblings("i").attr("class","visual novisual");
        }else{
            $bgInput.attr({"class":"colorval bgimg"}).removeAttr("disabled").siblings("i").attr("class","visual");
        };
        //获取背景颜色  调节wqdColorPicker的顺序 获得一次value的值

        var bgcolor = obj.attr("wqdbgcolor")||obj.parent().css("background-color");
        $(".wqdEditBox.backgroundEdit [category=4]").val(bgcolor).siblings(".colordeviceBg").find(".colordevice").css("background-color",bgcolor);
        this.commonInit();

        if (obj.hasClass("wqdCommonNav")) {
            $("span:contains('栏目宽度')").parent().css({
                display: "none"
            }).next().css({
                display: "none"
            });
        };

        //编辑框问号点击链接
        $(".wqdEditBox .edit_help").click(function() {
            window.open("http://127.0.0.1");
        });

        if (obj.parents("#HTMLDATAFOOTER").length != 0) {
            $("span:contains('栏目宽度')").parent().css({
                display: "none"
            }).next().css({
                display: "none"
            });
            $("span:contains('背景效果')").parent().css({
                display: "none"
            }).next().css({
                display: "none"
            });
        };
        if ($('body').attr('id') == 'wqdIphonePage') {
            $('.bgeffect').next().hide().end().hide();
        }
        var windowW = $(window).width();

        function fnwidth(n) {
            //n是比例值
            var width = n * windowW;
            obj.attr("wqdnavwidth", width);
            obj.css("width", width);
        }
        if (obj.hasClass("wqdSideNavWrap")) {
            $(".edit_unitbox").eq(3).find("span").eq(0).html("背景宽度");
            var w = parseFloat(obj.attr("wqdnavwidth"));
            $(".scale .slider").eq(0).css("left", w * 106 / windowW);
            $(".scale .moment").eq(0).css("width", w * 106 / windowW);
            $(".edit_unitbox").eq(3).find(".r_val").eq(0).val(w);
            utility.range({
                maxval: windowW,
                slider: $(".scale .slider").eq(0),
                callback: fnwidth
            })
        } else {
            //通条初始化的高度
            $(document).trigger("setNewPosition", obj.parent(), obj.height());
            if (obj.attr("wqdheight")) {
                var wqdheight_n = parseFloat(obj.attr("wqdheight"));
                if (wqdheight_n >= 2000) {
                    $(".backgroundEdit .slider").css("left", $(".backgroundEdit .scale").width());
                    $(".backgroundEdit .moment").css("width", $(".backgroundEdit .scale").width());
                } else {
                    $(".backgroundEdit .slider").css("left", wqdheight_n * $(".backgroundEdit .scale").width() / 2000);
                    $(".backgroundEdit .moment").css("width", wqdheight_n * $(".backgroundEdit .scale").width() / 2000);
                }
                $(".backgroundEdit .r_val").val(wqdheight_n);

            } else {
                obj.attr("wqdheight", obj.height());
                $(".backgroundEdit .r_val").val(obj.height());
                $(".backgroundEdit .slider").css("left", obj.height() * $(".backgroundEdit .scale").width() / 2000);
                $(".backgroundEdit .moment").css("width", obj.height() * $(".backgroundEdit .scale").width() / 2000);
            }
            //背景设置--图片--背景高度
            utility.range({
                slider: $(".backgroundEdit .edit_unitbox>div.scale .slider").eq(0),
                obj: obj,
                maxval: 20000,
                moveMaxVal:2000,
                type: "backgroundHeight",
                callback:rangCallback
            });
            $(document).trigger('appSetCatch');
        }


        //背景设置--图片--背景颜色
        if ($(".wqdEditBox.backgroundEdit .colordevice").css("background-color") == "rgba(0, 0, 0, 0)") {
            $(".wqdEditBox.backgroundEdit .colordevice").addClass("colordevice-fff");
        }



        //获取背景图片资源
        if (obj.attr("wqdimgurlos") == "http") {
            $(".wqdEditBox.backgroundEdit .bgimg").val("点击更换背景图"); //无图片默认提示？？？？？？？？？？？？？？
        } else {
            $(".wqdEditBox.backgroundEdit .bgimg").val(obj.attr("wqdimgurlos"));
        }

      	$(".wqdEditBox.backgroundEdit .bgimg").on("click", function() {
            imgEntry(obj.parent());
            obj.attr("bac_position", 5).find(" .edit_unitbox>.imagefocuslist li").eq(4).addClass("on").siblings().removeClass("on");
        });

        /*背景图片是否可操作*/
        //初始化
        /*if(obj.attr("wqdeye")){
            if(obj.attr("wqdeye")==0){

            }else if(obj.attr("wqdeye")==1){

            }
        }else{

        }*/
        //设置
        $(".wqdEditBox.backgroundEdit .edit_unitbox>i.visual").on("click", function() {
            bgButton(obj.parent(".wqdSectiondiv"), $(this));
        });

        //背景设置--图片--图片位置
        //获取
        if (obj.attr("wqdback_position")) {
            var back_n = parseInt(obj.attr("wqdback_position"));
        } else {
            var back_n = 1;
        }
        $("[wqdbackposition]").attr("wqdbackposition", back_n);
        $("[wqdbackposition]").find("li").removeClass("on").eq(back_n - 1).addClass("on");
        $("[wqdbackposition] p span").html($("[wqdbackposition] ul li").eq(back_n - 1).find("span").html());
        //设置
        $("[wqdbackposition]>ul>li").on("click", function() {
            var imgSrc = obj.parent().css("background-image");
            var arrPos = [{
                "background-size": "cover",
                "background-position": " center center",
                "background-repeat": "no-repeat",
                "background-image": imgSrc
            }, {
                "background-size": "100% 100%",
                "background-position": " center center",
                "background-repeat": "no-repeat",
                "background-image": imgSrc
            }, {
                "background-size": "",
                "background-position": " center center",
                "background-repeat": "repeat",
                "background-image": imgSrc
            }, {
                //"background-size": "initial",
                "background-size": "",
                "background-position": " center center",
                "background-repeat": "no-repeat",
                "background-image": imgSrc
            }];
            switch ($(this).index() + 1) {
                case 1: //适应
                    obj.parent().css(arrPos[0]);
                    break;
                case 2: //拉伸
                    obj.parent().css(arrPos[1]);
                    break;
                case 3: //平铺
                    obj.parent().css(arrPos[2]);
                    break;
                case 4: //居中
                    obj.parent().css(arrPos[3]);
                    $(".wqdEditBox.backgroundEdit .imagefocuslist>li").each(function() {
                        $(this).removeClass("on");
                    });
                    $(".wqdEditBox.backgroundEdit .imagefocuslist>li").eq(4).addClass("on");
                    break;
            }
            $(this).parents("[wqdbackposition]").removeClass("on").find("i").removeClass("on").parent().removeClass("on").end().end().end().addClass("on").siblings().removeClass("on");
            $(this).parent().siblings("p").find("span").remove().end().prepend($(this).children().clone());
            obj.attr("wqdback_position", $(this).index() + 1);
            $(document).trigger('appSetCatch');
        });

        /*背景设置---图片焦点选择*/
        function position(n) {
            $(".wqdEditBox.backgroundEdit .imagefocuslist>li").each(function(index, element) {
                $(this).removeClass("on");
            });
            $(".wqdEditBox.backgroundEdit .imagefocuslist>li").eq(n).addClass("on");
        }
        if (obj.attr("bac_position")) {
            position(parseInt(obj.attr("bac_position")) - 1);
        } else {
            var index_li;
            switch (obj.parent().css("background-position")) {
                case "0% 0%":
                    index_li = 1;
                    break;
                case "50% 0%":
                    index_li = 2;
                    break;
                case "100% 0%":
                    index_li = 3;
                    break;
                case "0% 50%":
                    index_li = 4;
                    break;
                case "50% 50%":
                    index_li = 5;
                    break;
                case "100% 50%":
                    index_li = 6;
                    break;
                case "0% 100%":
                    index_li = 7;
                    break;
                case "50% 100%":
                    index_li = 8;
                    break;
                case "100% 100%":
                    index_li = 9;
                    break;
            }
            parseInt(obj.attr("bac_position", index_li));
            position(index_li - 1);
        }

        $(".wqdEditBox.backgroundEdit .edit_unitbox>.imagefocuslist li").on("click", function() {
            var index = $(this).index() + 1;
            var bgpositionarr = ["0% 0%", "50% 0%", "100% 0%", "0% 50%", "50% 50%", "100% 50%", "0% 100%", "50% 100%", "100% 100%"];
            obj.parent().css("background-position", bgpositionarr[index - 1]);
            obj.attr("bac_position", index)
            if ($(this).hasClass("on")) return false;
            $(this).addClass("on").siblings().removeClass("on");
            $(document).trigger('appSetCatch');
        });


        //按钮文字颜色和按钮背景颜色的设置和保存
        $(".wqdColorPicker").on("changeColor", function() {
            var category = $(this).attr("category") || "",
                colorVal = $(this).val();
            $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
            if (category == "4") {
                //蒙版设置
                var realEle = obj.hasClass("wqdSideNavWrap") ? ".wqdSideNavWrap:before" :obj.find(".carousel-innerbg").length?".carousel-innerbg:before":":before";
                createColorStyle.styleInit(obj.parent().attr("id"), realEle, {
                    "content": "' '",
                    "position": "absolute",
                    "top": 0,
                    "left": 0,
                    "width": "100%",
                    "height": "100%",
                    'background-color': colorVal
                });
                obj.attr("wqdbgcolor", colorVal);
            }
            $(document).trigger('appSetCatch');
        });

        /*模拟下拉列表*/
        $(".wqdEditBox .borerwidthselect p").on("click", function(e) {
            if ($(this).hasClass("readonly")) return false;
            if ($(this).parent().hasClass("on")) {
                $(this).removeClass("on").parent().removeClass("on").find("i").removeClass("on");
            } else {
                $(this).addClass("on").parent().addClass("on").find("i").addClass("on");
            }
            e.preventDefault();
        });

        //背景设置_图片_背景效果
        //初始化
        if (obj.attr("wqdBgattachment")) {
            $(".wqdEditBox.backgroundEdit .bgeffect .edit_radioorno").eq(obj.attr("wqdBgattachment")).children("i").addClass("on").end().children("input[type=radio]").attr("checked", "checked").end().siblings("label").children("i").removeClass("on").end().children("input[type=radio]").removeAttr("checked");
            obj.parent().css("background-attachment", parseInt(obj.attr("wqdBgattachment")) ? "fixed" : "scroll");
        } else {
            obj.attr("wqdBgattachment", 0);
            $(".wqdEditBox.backgroundEdit .bgeffect .edit_radioorno").eq(0).children("i").addClass("on").end().children("input[type=radio]").attr("checked", "checked").end().siblings("label").children("i").removeClass("on").end().children("input[type=radio]").removeAttr("checked");
            obj.parent().css("background-attachment", "scroll");
        };

        //栏目宽度设置
        // if (obj.find("[data-elementtype='carouse']")) {
        //     $(".widthlimit").css("display", "block");

        // } else if (!obj.find("[data-elementtype='carouse']")) {
        //     $(".widthlimit").css("display", "none");
        // };
        //栏目宽度设置初始化
        if ($('#wqdIphonePage').length) {
            $('.wqdEditBox.backgroundEdit .widthlimit').next('hr').hide();
            $('.wqdEditBox.backgroundEdit .widthlimit').hide();
        }

        if (obj.attr("wqdwidthlimit")) {
            $(".wqdEditBox.backgroundEdit .widthlimit .edit_radioorno").eq(obj.attr("wqdwidthlimit")).children("i").addClass("on").end().children("input[type=radio]").attr("checked", "checked").end().siblings("label").children("i").removeClass("on").end().children("input[type=radio]").removeAttr("checked");
            $(document).trigger('appSetCatch');
        } else {
            obj.attr("wqdwidthlimit", 0);
            $(".wqdEditBox.backgroundEdit .widthlimit .edit_radioorno").eq(0).children("i").addClass("on").end().children("input[type=radio]").attr("checked", "checked").end().siblings("label").children("i").removeClass("on").end().children("input[type=radio]").removeAttr("checked");
            $(document).trigger('appSetCatch');
        };

        //设置
        $(".wqdEditBox.backgroundEdit .edit_unitbox .edit_radioorno").off("click").on("click", function() {
            if ($(this).children("i").hasClass("on")) return false;
            $(this).children("i").toggleClass("on").end().children("input[type=radio]").attr("checked", "checked").end().siblings("label").children("i").toggleClass("on").end().children("input[type=radio]").removeAttr("checked");

            if ($(this).siblings("span:contains('背景效果')").length) {
                obj.attr("wqdBgattachment", $(this).index() - 1);
                obj.parent().css("background-attachment", ($(this).index() - 1) ? "fixed" : "scroll");
                $(document).trigger('appSetCatch');
            } else if ($(this).siblings("span:contains('栏目宽度')")) {
                obj.attr("wqdwidthlimit", $(this).index() - 1);
                if ($(this).index() == 1) {
                    //限制情况
                    obj.removeClass("fullscreen");
                    obj.find('.carousel-inner .bannerContainer').each(function() {
                        $(this).attr('style', $(this).parent().attr('style'));
                        $(this).parent().removeAttr('style');
                    });
                } else {
                    //不限制情况
                    obj.addClass("fullscreen");
                    $(document).trigger("carouse.fullscreen", {
                        "parent": obj
                    });
                }
                $(document).trigger('appSetCatch');
            }
        });
    };

    //轮播图拖拽进来后 直接设置为100%
    $(document).on("carouse.fullscreen", function(e, obj) {
        var obj = obj.parent;
        obj.find('[data-elementtype=carouse]').css({
            // 'width': '100%',
            'height': '100%',
            'top': '0',
            'left': '0'
        });
        obj.find('.wqdCarousel .carousel-inner').css('width', '100%');
        obj.find('.carousel-inner .item').each(function() {
            $(this).attr('style', $(this).find('.bannerContainer').attr('style'));
            $(this).find('.bannerContainer').removeAttr('style');
        });
        var uw = $('.viewwidth input').val() || "";
        $('style#styleCss').attr('uw', uw).html('.wqdView,.wqdAreaView .wqdSectiondiv{min-width:' + uw + 'px;} .wqdAreaView .wqdBkEditos,.hoverCon-section .wqdBkEditos{width:' + uw + 'px;}.fullscreen .bannerContainer{margin:0 auto;width:' + uw + 'px!important;}');
    })
        //按钮编辑器
    popupEdit.buttonInit = function() {
        var obj = window.edit;
        if ($('body').attr('id') == 'wqdIphonePage') {
            $('.on_off').parent().prev().hide().end().hide();
        }
        //是否新页面打开
        var targetNew;
        if (obj.attr('targetNew')) {
            targetNew = obj.attr('targetNew');
            if (targetNew == 'ture') {
                $('.buttonEdit .desp span').addClass('on');
            } else {
                $('.buttonEdit .desp span').removeClass('on');
            }
        } else {
            targetNew = 'false';
            $('.buttonEdit .desp span').removeClass('on');
        }
        //是否新页面打开，设置
        $('.buttonEdit .desp').on('click', 'span', function() {
            if ($(this).hasClass('on')) {
                $(this).removeClass('on');
                obj.removeAttr('targetNew');
                obj.find('a').removeAttr('target');
            } else {
                obj.attr('targetNew', 'ture');
                $(this).addClass('on');
                obj.find('a').attr('target', '_blank');
            }
            $(document).trigger('appSetCatch');
        });
        linkPanel(".wqdEditBox.buttonEdit", obj, ".wqd-button");
        //按钮设置--其他--按钮半径
        if (obj.attr("wqdheight")) {
            var wqdheight_n = parseFloat(obj.attr("wqdheight"));
            $(".backgroundEdit .r_val").val(wqdheight_n);
            $(".backgroundEdit .slider").css("left", wqdheight_n * $(".backgroundEdit .scale").width() / 2000);
            $(".backgroundEdit .moment").css("width", wqdheight_n * $(".backgroundEdit .scale").width() / 2000);
        } else {
            obj.attr("wqdheight", obj.height());
            $(".backgroundEdit .r_val").val(obj.height());
            $(".backgroundEdit .slider").css("left", obj.height() * $(".backgroundEdit .scale").width() / 2000);
            $(".backgroundEdit .moment").css("width", obj.height() * $(".backgroundEdit .scale").width() / 2000);
        }
        if (obj.find(".wqd-button").attr("wqdbtnborder") == "false") {
            if (obj.attr("wqdborderRadius")) {
                var wqdborderRadius_n = parseFloat(obj.attr("wqdborderRadius"));
                if (wqdborderRadius_n > 50) {
                    $(".buttonEdit .slider").css("left", 106);
                    $(".buttonEdit .moment").css("width", 106);
                } else {
                    $(".buttonEdit .slider").css("left", wqdborderRadius_n * $(".buttonEdit .scale").width() / 50);
                    $(".buttonEdit .moment").css("width", wqdborderRadius_n * $(".buttonEdit .scale").width() / 50);
                }
                $(".buttonEdit .r_val").val(wqdborderRadius_n);
            } else {
                var wqdborderRadius_n = parseFloat(obj.find(".wqd-button").css('border-top-left-radius'));
                obj.attr("wqdborderRadius", wqdborderRadius_n);
                $(".buttonEdit .r_val").val(wqdborderRadius_n);
                $(".buttonEdit .slider").css("left", wqdborderRadius_n * $(".buttonEdit .scale").width() / 50);
                $(".buttonEdit .moment").css("width", wqdborderRadius_n * $(".buttonEdit .scale").width() / 50);
            }

        }
        utility.range({
            slider: $(".buttonEdit .edit_unitbox>div.scale .slider").eq(0),
            obj: obj,
            maxval: 50,
            type: "borderRadius",
            callback: rangCallback
        });

        //获取文字颜色
        if (obj.attr("wqdcolor")) {
            $(".wqdEditBox.buttonEdit [category=1]").val(obj.attr("wqdcolor"));
            $(".wqdEditBox.buttonEdit [category=1]").attr("value", obj.attr("wqdcolor"));
            $(".wqdEditBox.buttonEdit [category=1]").siblings(".colordeviceBg").find(".colordevice").css("background-color", obj.attr("wqdcolor"));
        } else {
            obj.attr("wqdcolor", obj.find(".wqd-button em").css("color"));
            $(document).trigger('appSetCatch');
            $(".wqdEditBox.buttonEdit [category=1]").val(obj.find(".wqd-button em").css("color"));
            $(".wqdEditBox.buttonEdit [category=1]").attr("value", obj.find(".wqd-button em").css("color"));
            $(".wqdEditBox.buttonEdit [category=1]").siblings(".colordeviceBg").find(".colordevice").css("background-color", obj.find(".wqd-button em").css("color"));
        }

        //获取背景颜色
        if (obj.find(".wqd-button").attr("wqdbtnborder") == "false") {
            if (obj.attr("wqdbgcolor")) {
                $(".wqdEditBox.buttonEdit [category=2]").val(obj.attr("wqdbgcolor"));
                $(".wqdEditBox.buttonEdit [category=2]").attr("value", obj.attr("wqdbgcolor"));
                $(".wqdEditBox.buttonEdit [category=2]").siblings(".colordeviceBg").find(".colordevice").css("background-color", obj.attr("wqdbgcolor"));
            } else {
                obj.attr("wqdbgcolor", obj.find(".wqd-button").css("background-color"));
                $(document).trigger('appSetCatch');
                $(".wqdEditBox.buttonEdit [category=2]").val(obj.find(".wqd-button").css("background-color"));
                $(".wqdEditBox.buttonEdit [category=2]").attr("value", obj.find(".wqd-button").css("background-color"));
                $(".wqdEditBox.buttonEdit [category=2]").siblings(".colordeviceBg").find(".colordevice").css("background-color", obj.find(".wqd-button").css("background-color"));
            }
        } else {
            if (obj.attr("wqdbgcolor")) {
                $(".wqdEditBox.buttonEdit [category=2]").val(obj.attr("wqdbgcolor"));
                $(".wqdEditBox.buttonEdit [category=2]").attr("value", obj.attr("wqdbgcolor"));
                $(".wqdEditBox.buttonEdit [category=2]").siblings(".colordeviceBg").find(".colordevice").css("background-color", obj.attr("wqdbgcolor"));
            } else {
                var bgcolor = obj.find(".wqd-button .componentCenter").css("background-color");
                obj.attr("wqdbgcolor", bgcolor);
                $(document).trigger('appSetCatch');
                $(".wqdEditBox.buttonEdit [category=2]").val(bgcolor);
                $(".wqdEditBox.buttonEdit [category=2]").attr("value", bgcolor);
                $(".wqdEditBox.buttonEdit [category=2]").siblings(".colordeviceBg").find(".colordevice").css("background-color", bgcolor);
            }

        }

        //按钮设置--其他--边框颜色
        if (obj.find(".wqd-button").attr("wqdbtnborder") == "false") {
            if (obj.attr("wqdbordercolor")) {
                $(".wqdEditBox.buttonEdit [category=3]").val(obj.attr("wqdbordercolor"));
                $(".wqdEditBox.buttonEdit [category=3]").attr("value", obj.attr("wqdbordercolor"));
                $(".wqdEditBox.buttonEdit [category=3]").siblings(".colordeviceBg").find(".colordevice").css("background-color", obj.attr("wqdbordercolor"));
            } else {
                //obj.attr("wqdbordercolor", obj.find(".wqd-button").css("border-color")||obj.find(".wqd-button").css("border-top-color"));
                obj.attr("wqdbordercolor", obj.find(".wqd-button").css("border-top-color"));
                $(document).trigger('appSetCatch');
                $(".wqdEditBox.buttonEdit [category=3]").val(obj.find(".wqd-button").css("border-top-color"));
                $(".wqdEditBox.buttonEdit [category=3]").attr("value", obj.find(".wqd-button").css("border-top-color"));
                $(".wqdEditBox.buttonEdit [category=3]").siblings(".colordeviceBg").find(".colordevice").css("background-color", obj.find(".wqd-button").css("border-top-color"));
            }
        } else {
            $(".wqdEditBox.buttonEdit [category=3]").val("rgba(0,0,0,0)");
            $(".wqdEditBox.buttonEdit [category=3]").attr("value", "rgba(0,0,0,0)");
            $(".wqdEditBox.buttonEdit [category=3]").siblings(".colordeviceBg").find(".colordevice").css("background-color", "rgba(0,0,0,0)");
        };

        //按钮文字颜色和按钮背景颜色的设置和保存
        $(".wqdColorPicker").on("changeColor", function() {
            var category = $(this).attr("category") || "",
                colorVal = $(this).val();
            $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
            if (!obj.attr("id")) obj.attr("id", obj.attr("elementid"));
            if (category == "1") {
                createColorStyle.styleInit(obj.attr("id"), "a em", {
                    'color': colorVal
                });
                obj.attr("wqdcolor", colorVal);
            } else if (category == "2") {
                if (obj.find(".wqd-button").attr("wqdbtnborder") == "false") {
                    createColorStyle.styleInit(obj.attr("id"), "a", {
                        'background-color': colorVal
                    });
                    obj.attr("wqdbgcolor", colorVal);
                } else {
                    createColorStyle.styleInit(obj.attr("id"), "a div", {
                        'border-color': colorVal
                    });
                    createColorStyle.styleInit(obj.attr("id"), "a .componentCenter", {
                        'background-color': colorVal
                    });
                    obj.attr("wqdbgcolor", colorVal);
                }
            } else
            if (category == "3") { //按钮设置--其他--边框颜色
                if (obj.find(".wqd-button").attr("wqdbtnborder") == "false") {
                    obj.attr("wqdbordercolor", colorVal);
                    createColorStyle.styleInit(obj.attr("id"), "a", {
                        'border-color': colorVal
                    });
                    createColorStyle.styleInit(obj.attr("id"), "a", {
                        'border-color': colorVal
                    });
                }
            } else
            if (category == "5") { //按钮hovercolor
                obj.attr("hovercol", colorVal);
                createColorStyle.styleInit(obj.attr("id"), ".on:hover em", { color: colorVal});
                //关联容器选中颜色
                if (obj.parents(".containerWarp").length) createColorStyle.styleInit(obj.attr("id"), ".active .on em", { color: colorVal});
            } else
            if (category == "6") { //按钮hoverbaccolor
                obj.attr("hoverbaccol", colorVal);
                if (obj.find(".wqd-button").attr("wqdbtnborder") == "false") {
                    createColorStyle.styleInit(obj.attr("id"), ".on:hover", { 'background-color': colorVal });
                    //关联容器选中颜色
                    if (obj.parents(".containerWarp").length) createColorStyle.styleInit(obj.attr("id"), ".active .on", { 'background-color': colorVal });
                    // obj.attr("wqdbgcolor", colorVal);
                } else {
                    createColorStyle.styleInit(obj.attr("id"), ".on:hover .hoverTrue", { 'border-color': colorVal });
                    createColorStyle.styleInit(obj.attr("id"), ".on:hover .componentCenter", { 'background-color': colorVal });
                    //关联容器选中颜色
                    if (obj.parents(".containerWarp").length) {
                        createColorStyle.styleInit(obj.attr("id"), ".active .on .hoverTrue", { 'border-color': colorVal });
                        createColorStyle.styleInit(obj.attr("id"), ".active .on .componentCenter", { 'background-color': colorVal });
                    }
                    //obj.attr("wqdbgcolor", colorVal);
                }
            } else


            if (category == "7") { //按钮hoverborcol
                // obj.attr("hoverborcol", colorVal);
                if (obj.find(".wqd-button").attr("wqdbtnborder") == "false") {
                    createColorStyle.styleInit(obj.attr("id"), ".on:hover", { 'border-color': colorVal });
                    //关联容器选中颜色
                    if (obj.parents(".containerWarp").length) createColorStyle.styleInit(obj.attr("id"), ".active .on", { 'border-color': colorVal });
                    obj.attr("hoverborcol", colorVal);
                }
            }
            $(document).trigger('appSetCatch');
        });

        /*按钮设置--基础--按钮文字提交,先获取,在修改*/
        //获取
        $(".wqdEditBox  .edit_unitbox>input.submit.submittex").val(obj.find("a.wqd-button em").text().replace(/&nbsp;/g, " "));

        //修改
        $(".wqdEditBox .edit_unitbox>input.submit.submittex").on("input propertychange", function() {
            obj.find("a.wqd-button em").html($(this).val().replace(/\s/g, "&nbsp;"));
            $(document).trigger('appSetCatch');
        });
		//修改
         $("[wqdfontfamily]").next(".style").find("input").on("input propertychange", function() {
            var font_size = $(this).val()||"";
            $(this).val(font_size.replace(/\D/g,""));
        }).on("blur",function () {
            var val = $(this).val();
            if(val=""){
                $(this).val(12+"px")
             }
            obj.find("a").css("font-size", val+"px");
            $(document).trigger("appSetCatch");
        })

		$("[wqdfontfamily]").next(".style").find("input").on("keydown.anbtn",function(event){
            fontSize=$(this).val();
			if(event.keyCode==38){
				$(this).val(++fontSize);
			}else if(event.keyCode==40){
				if(parseInt($(this).val())==12) return;
				$(this).val(--fontSize);
			}
             obj.find("a").css("font-size", fontSize+"px")
		});
        //按钮设置--基础--按钮文字字体
        //获取
        if (obj.attr("wqdfont_family")) {
            var family_n = parseInt(obj.attr("wqdfont_family"));
        } else {
            var family_n = 4;
        }
        $("[wqdfontfamily]").attr("wqdfontfamily", family_n);
        $("[wqdfontfamily]").find("li").removeClass("on").eq(family_n - 1).addClass("on");
        $("[wqdfontfamily] p span").html($("[wqdfontfamily] ul li").eq(family_n - 1).find("span").html());
        //设置
        $("[wqdfontfamily]>ul>li").on("click", function() {
            $(this).parents("[wqdfontfamily]").removeClass("on").find("i").removeClass("on").parent().removeClass("on").end().end().end().addClass("on").siblings().removeClass("on");
            $(this).parent().siblings("p").find("span").remove().end().prepend($(this).children().clone());
            obj.attr("wqdfont_family", $(this).index() + 1);
            switch ($(this).index() + 1) {
                case 1:
                    obj.find("a").css("font-family", "宋体");
                    break;
                case 2:
                    obj.find("a").css("font-family", "新宋体");
                    break;
                case 3:
                    obj.find("a").css("font-family", "黑体");
                    break;
                case 4:
                    obj.find("a").css("font-family", "微软雅黑");
                    break;
                case 5:
                    obj.find("a").css("font-family", "Arial");
                    break;
                case 6:
                    obj.find("a").css("font-family", "Verdana");
                    break;
            }
            $(document).trigger('appSetCatch');
        });

        //按钮设置--基础--按钮文字字号
        $("[wqdfontfamily]").next(".style").find("input").val(parseInt(obj.find("a").css("font-size")));
        //设置
        $("[wqdfontfamily]").next(".style").find("input").on("input propertychange", function() {
            var font_size = parseInt($(this).val());
            obj.find("a").css("font-size", font_size);
            $(document).trigger('appSetCatch');
        });

        //按钮设置--基础--按钮文字加粗
        //获取
        if (obj.find("a em").css("font-weight") == 400) {

            $("[wqdfontfamily]").next(".style").find("strong").removeClass("on");
        } else {
            $("[wqdfontfamily]").next(".style").find("strong").addClass("on");
        }
        //设置
        $("[wqdfontfamily]").next(".style").find("strong").on("click", function() {

            if ($(this).hasClass("on")) {
                obj.find("a em").css("font-weight", 400);
            } else {
                obj.find("a em").css("font-weight", "bold");
            }
            $(this).toggleClass("on");
            $(document).trigger('appSetCatch');
        });

        //按钮设置--基础--按钮文字斜体
        //获取
        if (obj.find("a em").css("font-style") == "normal") {

            $("[wqdfontfamily]").next(".style").find("em").removeClass("on");
        } else {
            $("[wqdfontfamily]").next(".style").find("em").addClass("on");
        }
        //设置
        $("[wqdfontfamily]").next(".style").find("em").on("click", function() {
            if ($(this).hasClass("on")) {
                $(this).removeClass("on");
                obj.find("a em").css("font-style", "normal");
            } else {
                $(this).addClass("on");
                obj.find("a em").css("font-style", "italic");
            }
            $(document).trigger('appSetCatch');
        });

        //按钮设置--其他--边框宽度
        //获取
        if (obj.find(".wqd-button").attr("wqdbtnborder") == "false") {
            if (obj.attr("wqdborder_width")) {
                var width_n = parseInt(obj.attr("wqdborder_width"));
            } else {
                //var width_n = parseInt(obj.find(".wqd-button").css("border-width")) + 1;
                var width_n = parseInt(obj.find(".wqd-button").css("border-left-width")) + 1;
            }
            $(".buttonEdit [wqdborderwidth]").attr("wqdborderwidth", width_n);
            $(".buttonEdit [wqdborderwidth]").find("li").removeClass("on").eq(width_n - 1).addClass("on");
            $(".buttonEdit [wqdborderwidth] p ").find("span").remove().end().prepend($(".buttonEdit [wqdborderwidth] ul li").eq(width_n - 1).find("span").clone());
        }
        //设置
        $(".buttonEdit [wqdborderwidth]>ul>li").on("click", function() {
            $(this).parents("[wqdborderwidth]").removeClass("on").find("i").removeClass("on").parent().removeClass("on").end().end().end().addClass("on").siblings().removeClass("on");
            $(this).parent().siblings("p").find("span").remove().end().prepend($(this).children().clone());
            obj.attr("wqdborder_width", $(this).index() + 1);
            var i;
            switch ($(this).index() + 1) {
                case 1:
                    i = 0;
                    break;
                case 2:
                    i = 1;
                    break;
                case 3:
                    i = 2;
                    break;
                case 4:
                    i = 4;
                    break;
                case 5:
                    i = 6;
                    break;
                case 6:
                    i = 8;
                    break;
                case 7:
                    i = 10;
                    break;
            }
            if (obj.find(".wqd-button").attr("wqdbtnborder") == "false") {
                obj.find(".wqd-button").css({
                    "border-width": i,
                    "border-style": "solid"
                });
            }
            $(document).trigger('appSetCatch');
        });

        /*背景设置---悬浮效果*/
        var wqdon;
        if (obj.attr("wqdon")) {
            wqdon = obj.attr("wqdon");
        } else {
            wqdon = "false";
            obj.attr("wqdon", "false");
        }
        if (wqdon == "false") {
            $(".buttonEdit .on_off").removeClass("on");
            $(".buttonEdit .martb10").hide();
            obj.find("a").removeClass("on");
        } else if (wqdon == "true") {
            $(".buttonEdit .on_off").addClass("on");
            $(".buttonEdit .martb10").show();
            obj.find("a").addClass("on");
        }
        $(".wqdEditBox.buttonEdit .edit_unitbox>div.on_off").on("click", function() {
            if ($(this).hasClass("on")) {
                $(this).removeClass("on");
                obj.attr("wqdon", "false");
                obj.find("a").removeClass("on");
                $(this).parents(".edit_unitbox").siblings(".wqdEditBox.buttonEdit .martb10").hide();
            } else {
                $(this).addClass("on");
                obj.attr("wqdon", "true");
                obj.find("a").addClass("on");
                $(this).parents(".edit_unitbox").siblings(".wqdEditBox.buttonEdit .martb10").show();
                 //获取文字的hover颜色
                if(obj.attr("hovercol")&&obj.attr("wqdon")=="true"){
                    $(".wqdEditBox.buttonEdit [category=5]").val(obj.attr("hovercol"))
                    createColorStyle.styleInit(obj.attr("id"), ".on:hover em", { color: obj.attr("hovercol")});
                    $(".wqdEditBox.buttonEdit [category=5]").siblings(".colordeviceBg").find(".colordevice").css("background-color", obj.attr("hovercol"));
                }
                //获取文字背景hover颜色
                if(obj.attr("hoverbaccol")&&obj.attr("wqdon")=="true"){
                    $(".wqdEditBox.buttonEdit [category=6]").val(obj.attr("hoverbaccol"))
                        createColorStyle.styleInit(obj.attr("id"), ".on:hover", { 'background-color': obj.attr("hoverbaccol") })
                }
                //获取文字border颜色
                if(obj.attr("hoverborcol")&&obj.attr("wqdon")=="true"){
                    $(".wqdEditBox.buttonEdit [category=7]").val(obj.attr("hoverborcol"))
                        createColorStyle.styleInit(obj.attr("id"), ".on:hover", { 'border-color': obj.attr("hoverborcol") })
                }
            }
            $(document).trigger('appSetCatch');
        });
        //文字颜色
        //if (obj.attr("hovercol")) {
        //    $("[category=5]").val(obj.attr("hovercol")).attr("value", obj.attr("hovercol")).siblings(".colordeviceBg").find(".colordevice").css("background-color", obj.attr("hovercol"));
        //} else {
        //    var col = obj.find("a em").css("color");
        //    $("[category=5]").val(obj.find("a em").css("color")).attr("value", obj.find("a em").css("color")).siblings(".colordeviceBg").find(".colordevice").css("background-color", obj.find("a em").css("color"));
        //}
        //修改简化代码(此处代码)
        //文字颜色
        var hoverColorwd=obj.attr("hovercol")||obj.attr("hovercol","#000000");
        $("[category=5]").prop("value",hoverColorwd).siblings(".colordeviceBg").find(".colordevice").css("background-color", hoverColorwd);
        //背景颜色
        var hoverColorbg=obj.attr("hoverbaccol")||obj.attr("hoverbaccol","#fff");
        $("[category=6]").prop("value",hoverColorbg).siblings(".colordeviceBg").find(".colordevice").css("background-color", hoverColorbg);
        //边框颜色
        var hoverColorbd = obj.attr("hoverborcol") || obj.attr("hoverborcol","#fff");
        $("[category=7]").prop("value",hoverColorbd).siblings(".colordeviceBg").find(".colordevice").css("background-color", hoverColorbd);
        this.commonInit();
    };

    //图形编辑器
    popupEdit.svgInit = function() {

        var obj = window.edit;
        //是否新页面打开
        var targetNew;
        if (obj.attr('targetNew')) {
            targetNew = obj.attr('targetNew');
            if (targetNew == 'ture') {
                $('.graphicalEdit .desp span').addClass('on');
            } else {
                $('.graphicalEdit .desp span').removeClass('on');
            }
        } else {
            targetNew = 'false';
            $('.graphicalEdit .desp span').removeClass('on');
        }
        //是否新页面打开，设置
        $('.graphicalEdit .desp').on('click', 'span', function() {
            if ($(this).hasClass('on')) {
                $(this).removeClass('on');
                obj.removeAttr('targetNew');
                obj.find('a').removeAttr('target');
            } else {
                obj.attr('targetNew', 'ture');
                $(this).addClass('on');
                obj.find('a').attr('target', '_blank');
            }
            $(document).trigger('appSetCatch');
        });
        //图形设置--基础--图形颜色
        //获取
        if (obj.find(".wqd-svg").length) { //判断是不是svg
            //链接设置
            linkPanel(".wqdEditBox.graphicalEdit", obj, ".wqd-svg");
            if (obj.attr("wqdpathfill")) {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(0).val(obj.attr("wqdpathfill"));
                $(".wqdEditBox.graphicalEdit .colordevice").eq(0).css("background-color", obj.attr("wqdpathfill"));
            } else {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(0).val(obj.find(".wqd-svg").children().attr("fill"));
                $(".wqdEditBox.graphicalEdit .colordevice").eq(0).css("background-color", obj.find(".wqd-svg").children().attr("fill"));
            }
            if (obj.attr("wqdhovercolor")) {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(1).val(obj.attr("wqdhovercolor"));
                $(".wqdEditBox.graphicalEdit .colordevice").eq(1).css("background-color", obj.attr("wqdhovercolor"));
            } else {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(1).val(" ");
                $(".wqdEditBox.graphicalEdit .colordevice").eq(1).css("background-color", "transparent");
            }
            if (obj.attr("wqdpathstrok")) {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(2).val(obj.attr("wqdpathstrok"));
                $(".wqdEditBox.graphicalEdit .colordevice").eq(2).css("background-color", obj.attr("wqdpathstrok"));
            } else {
                if (obj.find(".wqd-svg").children().attr("stroke")) {
                    $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(2).val(obj.find(".wqd-svg").children().attr("stroke"));
                    $(".wqdEditBox.graphicalEdit .colordevice").eq(2).css("background-color", obj.find(".wqd-svg").children().attr("stroke"));
                } else {
                    $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(2).val(" ");
                    $(".wqdEditBox.graphicalEdit .colordevice").eq(2).css("background-color", "transparent");
                }
            }
        } else if (obj.find(".wqd-line").length) { //判断是不是线
            //链接设置
            linkPanel(".wqdEditBox.graphicalEdit", obj, ".wqd-line");
            $(".graphicalEdit .edit_content hr").eq(2).hide();
            $(".graphicalEdit .edit_content .edit_unitbox").eq(3).hide();
            if (obj.attr("wqdpathfill")) {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(0).val(obj.attr("wqdpathfill"));
                $(".wqdEditBox.graphicalEdit .colordevice").eq(0).css("background-color", obj.attr("wqdpathfill"));
            } else {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(0).val(obj.find(".wqd-line").css("border-top-color"));
                $(".wqdEditBox.graphicalEdit .colordevice").eq(0).css("background-color", obj.find(".wqd-line").css("border-top-color"));
            }
            if (obj.attr("wqdhovercolor")) {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(1).val(obj.attr("wqdhovercolor"));
                $(".wqdEditBox.graphicalEdit .colordevice").eq(1).css("background-color", obj.attr("wqdhovercolor"));
            } else {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(1).val(" ");
                $(".wqdEditBox.graphicalEdit .colordevice").eq(1).css("background-color", "transparent");
            }
            if (obj.attr("wqdpathstrok")) {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(2).val(obj.attr("wqdpathstrok"));
                $(".wqdEditBox.graphicalEdit .colordevice").eq(2).css("background-color", obj.attr("wqdpathstrok"));
            } else {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(2).val(obj.find(".wqd-line").css("border-top-color"));
                $(".wqdEditBox.graphicalEdit .colordevice").eq(2).css("background-color", obj.find(".wqd-line").css("border-top-color"));
            }
        } else if (obj.find(".wqd-freeRect").length) {
            //链接设置
            linkPanel(".wqdEditBox.graphicalEdit", obj, ".wqd-freeRect");
            if (obj.attr("wqdpathfill")) {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(0).val(obj.attr("wqdpathfill"));
                $(".wqdEditBox.graphicalEdit .colordevice").eq(0).css("background-color", obj.attr("wqdpathfill"));
            } else {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(0).val(obj.find(".wqd-freeRect").css("background-color"));
                $(".wqdEditBox.graphicalEdit .colordevice").eq(0).css("background-color", obj.find(".wqd-freeRect").css("background-color"));
            }
            if (obj.attr("wqdhovercolor")) {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(1).val(obj.attr("wqdhovercolor"));
                $(".wqdEditBox.graphicalEdit .colordevice").eq(1).css("background-color", obj.attr("wqdhovercolor"));
            } else {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(1).val(" ");
                $(".wqdEditBox.graphicalEdit .colordevice").eq(1).css("background-color", "transparent");
            }
            if (obj.attr("wqdpathstrok")) {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(2).val(obj.attr("wqdpathstrok"));
                $(".wqdEditBox.graphicalEdit .colordevice").eq(2).css("background-color", obj.attr("wqdpathstrok"));
            } else {
                $(".wqdEditBox.graphicalEdit .wqdColorPicker").eq(2).val("#ffffff");
                $(".wqdEditBox.graphicalEdit .colordevice").eq(2).css("background-color", "#fff");
            }
        };
        this.commonInit();
        //颜色设置
        $(".wqdColorPicker").on("changeColor", function() {
            var $this = $(this),
                category = $this.attr("category") || "",
                colorVal = $this.val();
            $this.attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
            if (obj.find(".wqd-svg").length) {
                if (!obj.attr("id")) {
                    obj.attr("id", obj.attr("elementid"));
                } else {
                    if ($this.hasClass("pictColor")) {
                        createColorStyle.styleInit(obj.attr("id"), ".wqd-svg>*", {
                            'fill': colorVal
                        });
                        obj.attr("wqdpathfill", colorVal);
                    }
                    if ($this.hasClass("hoverColor")) {
                        createColorStyle.styleInit(obj.attr("id"), ".wqd-svg path:hover", { 'fill': colorVal });
                        createColorStyle.styleInit(obj.attr("id"), ".wqd-svg circle:hover", { 'fill': colorVal });
                        createColorStyle.styleInit(obj.attr("id"), ".wqd-svg rect:hover", { 'fill': colorVal });
                        createColorStyle.styleInit(obj.attr("id"), ".wqd-svg polygon:hover", { 'fill': colorVal });
                        createColorStyle.styleInit(obj.attr("id"), ".wqd-svg ellipse:hover", { 'fill': colorVal });
                        //关联容器选中颜色
                        if (obj.parents(".containerWarp").length) {
                            createColorStyle.styleInit(obj.attr("id"), ".active .wqd-svg path", { 'fill': colorVal });
                            createColorStyle.styleInit(obj.attr("id"), ".active .wqd-svg circle", { 'fill': colorVal });
                            createColorStyle.styleInit(obj.attr("id"), ".active .wqd-svg rect", { 'fill': colorVal });
                            createColorStyle.styleInit(obj.attr("id"), ".active .wqd-svg polygon", { 'fill': colorVal });
                            createColorStyle.styleInit(obj.attr("id"), ".active .wqd-svg ellipse", { 'fill': colorVal });
                        }
                        obj.attr("wqdHoverColor", colorVal);
                    }
                    if ($this.hasClass("borderColor")) {
                        createColorStyle.styleInit(obj.attr("id"), ".wqd-svg>*", {
                            'stroke': colorVal
                        });
                        obj.attr("wqdpathstrok", colorVal);
                    }
                }
                //obj.find(".wqd-svg").children().attr("fill", colorVal);
            } else if (obj.find(".wqd-line").length) {
                if (!obj.attr("id")) {
                    obj.attr("id", obj.attr("elementid"));
                } else {
                    if ($this.hasClass("pictColor")) {
                        createColorStyle.styleInit(obj.attr("id"), ".wqd-line", {
                            'border-top-color': colorVal + "!important"
                        });
                        obj.attr("wqdpathfill", colorVal);
                    }
                    if ($this.hasClass("hoverColor")) {
                        createColorStyle.styleInit(obj.attr("id"), ".wqd-line:hover", { 'border-top-color': colorVal + "!important" });
                        //关联容器选中颜色
                        if (obj.parents(".containerWarp").length) createColorStyle.styleInit(obj.attr("id"), ".active .wqd-line", { 'border-top-color': colorVal + "!important" });
                        obj.attr("wqdHoverColor", colorVal);
                    }
                    if ($this.hasClass("borderColor")) {
                        createColorStyle.styleInit(obj.attr("id"), ".wqd-line", {
                            'border-top-color': colorVal + "!important"
                        });
                        obj.attr("wqdpathstrok", colorVal);
                    }
                }
            } else if (obj.find(".wqd-freeRect").length) {
                if (!obj.attr("id")) {
                    obj.attr("id", obj.attr("elementid"));
                } else {
                    if ($this.hasClass("pictColor")) {
                        createColorStyle.styleInit(obj.attr("id"), ".wqd-freeRect", {
                            'background-color': colorVal + "!important"
                        });
                        obj.attr("wqdpathfill", colorVal);
                    }
                    if ($this.hasClass("hoverColor")) {
                        createColorStyle.styleInit(obj.attr("id"), ".wqd-freeRect:hover", { 'background-color': colorVal + "!important" });
                        //关联容器选中颜色
                        if (obj.parents(".containerWarp").length) createColorStyle.styleInit(obj.attr("id"), ".active .wqd-freeRect", { 'background-color': colorVal + "!important" });
                        obj.attr("wqdHoverColor", colorVal);
                    }
                    if ($this.hasClass("borderColor")) {
                        createColorStyle.styleInit(obj.attr("id"), ".wqd-freeRect", {
                            'border-color': colorVal + "!important",
                            'border-width': '1px',
                            'border-style': 'solid'
                        });
                        obj.attr("wqdpathstrok", colorVal);
                    }
                }
                // obj.find(".wqd-freeRect").css("background-color", colorVal);
            }
            $(document).trigger('appSetCatch');
        });
        //图形设置--基础--边线宽度
        //获取
        if (obj.find(".wqd-svg").length) {
            if (obj.attr("wqdPath_width")) {
                var width_n = Math.ceil(obj.attr("wqdPath_width"));
                if (width_n > 10) {
                    $(".scale .moment").css("width", 106);
                    $(".scale .slider").css("left", 106);
                    $(".scale").next().val(width_n);
                } else {
                    $(".scale .moment").css("width", width_n * 10.6);
                    $(".scale .slider").css("left", width_n * 10.6);
                    $(".scale").next().val(width_n);
                }
            } else {
                var width_n = 0;
                $(".scale .moment").css("width", 0);
                $(".scale .slider").css("left", 0);
                $(".scale").next().val(0);
            }
        } else if (obj.find(".wqd-line").length) {
            if (obj.attr("wqdPath_width")) {
                var width_n = Math.ceil(obj.attr("wqdPath_width"));
                if (width_n > 10) {
                    $(".scale .moment").css("width", 106);
                    $(".scale .slider").css("left", 106);
                    $(".scale").next().val(width_n);
                } else {
                    $(".scale .moment").css("width", width_n * 10.6);
                    $(".scale .slider").css("left", width_n * 10.6);
                    $(".scale").next().val(width_n);
                }
            } else {
                // var width_n =parseFloat(obj.find(".wqd-line").css("border-width"));
                // $(".scale .moment").css("width",width_n*10.6);
                // $(".scale .slider").css("left",width_n*10.6);
                // $(".scale").next().val(width_n);
                var width_n = 1;
                $(".scale .moment").css("width", width_n * 10.6);
                $(".scale .slider").css("left", width_n * 10.6);
                $(".scale").next().val(width_n);
            }
        } else if (obj.find(".wqd-freeRect").length) {
            if (obj.attr("wqdPath_width")) {
                var width_n = Math.ceil(obj.attr("wqdPath_width"));
                if (width_n > 10) {
                    $(".scale .moment").css("width", 106);
                    $(".scale .slider").css("left", 106);
                    $(".scale").next().val(width_n);
                } else {
                    $(".scale .moment").css("width", width_n * 10.6);
                    $(".scale .slider").css("left", width_n * 10.6);
                    $(".scale").next().val(width_n);
                }
            } else {
                var width_n = parseFloat(obj.find(".wqd-freeRect").css("border-width"));
                $(".scale .moment").css("width", width_n * 10.6);
                $(".scale .slider").css("left", width_n * 10.6);
                width_n == NaN ? $(".scale").next().val(width_n) : $(".scale").next().val(0);
            }
        }
        utility.range({
            slider: $(".graphicalEdit .edit_unitbox>div.scale .slider").eq(0),
            obj: obj,
            maxval: 10,
            type: "borderwidth",
            callback: rangCallback
        });
    };

    //图标编辑器
    popupEdit.svgIconInit = function() {

        var obj = window.edit;
        //是否新页面打开
        var targetNew;
        if (obj.attr('targetNew')) {
            targetNew = obj.attr('targetNew');
            if (targetNew == 'ture') {
                $('.svgIconEdit .desp span').addClass('on');
            } else {
                $('.svgIconEdit .desp span').removeClass('on');
            }
        } else {
            targetNew = 'false';
            $('.svgIconEdit .desp span').removeClass('on');
        }
        //是否新页面打开，设置
        $('.svgIconEdit .desp').on('click', 'span', function() {
            if ($(this).hasClass('on')) {
                $(this).removeClass('on');
                obj.removeAttr('targetNew');
                obj.find('a').removeAttr('target');
            } else {
                obj.attr('targetNew', 'ture');
                $(this).addClass('on');
                obj.find('a').attr('target', '_blank');
            }
            $(document).trigger('appSetCatch');
        });
        //链接设置
        linkPanel(".wqdEditBox.svgIconEdit", obj, ".wqd-svgicon");
        //图标设置--基础--图形颜色
        //获取
        if (obj.attr("wqdpathfill")) {
            $(".wqdEditBox.svgIconEdit .wqdColorPicker").eq(0).val(obj.attr("wqdpathfill"));
            $(".wqdEditBox.svgIconEdit .colordevice").eq(0).css("background-color", obj.attr("wqdpathfill"));
        } else {
            $(".wqdEditBox.svgIconEdit .wqdColorPicker").eq(0).val(obj.find("path").attr("fill"));
            $(".wqdEditBox.svgIconEdit .colordevice").eq(0).css("background-color", obj.find("path").attr("fill"));
        }
        if (obj.attr("wqdhovercolor")) {
            $(".wqdEditBox.svgIconEdit .wqdColorPicker").eq(1).val(obj.attr("wqdhovercolor"));
            $(".wqdEditBox.svgIconEdit .colordevice").eq(1).css("background-color", obj.attr("wqdhovercolor"));
        } else {
            $(".wqdEditBox.svgIconEdit .wqdColorPicker").eq(1).val("#ffffff");
            $(".wqdEditBox.svgIconEdit .colordevice").eq(1).css("background-color", "transparent");
        }
        if (obj.attr("wqdPathstrok")) {
            $(".wqdEditBox.svgIconEdit .wqdColorPicker").eq(2).val(obj.attr("wqdPathstrok"));
            $(".wqdEditBox.svgIconEdit .colordevice").eq(2).css("background-color", obj.attr("wqdPathstrok"));
        } else {
            $(".wqdEditBox.svgIconEdit .wqdColorPicker").eq(2).val("#ffffff");
            $(".wqdEditBox.svgIconEdit .colordevice").eq(2).css("background-color", "#ffffff");
        };
        this.commonInit();
        //设置
        $(".wqdColorPicker").on("changeColor", function() {
            var $this = $(this),
                category = $this.attr("category") || "",
                colorVal = $this.val();
            $this.attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
            if (!obj.attr("id")) {
                obj.attr("id", obj.attr("elementid"));
            } else {
                if ($this.hasClass("pictColor")) {
                    createColorStyle.styleInit(obj.attr("id"), "path", {
                        'fill': colorVal
                    });
                    obj.attr("wqdpathfill", colorVal);
                }
                if ($this.hasClass("hoverColor")) {
                    createColorStyle.styleInit(obj.attr("id"), "path:hover", { 'fill': colorVal });
                    //关联容器选中颜色
                    if (obj.parents(".containerWarp").length) createColorStyle.styleInit(obj.attr("id"), ".active path", { 'fill': colorVal });
                    obj.attr("wqdHoverColor", colorVal);
                }
                if ($this.hasClass("borderColor")) {
                    createColorStyle.styleInit(obj.attr("id"), "svg>*", {
                        'stroke': colorVal
                    });
                    obj.attr("wqdPathstrok", colorVal);
                }
            }
            $(document).trigger('appSetCatch');
        });
        //图标设置--基础--边线宽度
        //获取
        if (obj.attr("wqdPath_width")) {
            var width_n = Math.ceil(obj.attr("wqdPath_width"));
            if (width_n > 10) {
                $(".scale .moment").css("width", 106);
                $(".scale .slider").css("left", 106);
            } else {
                $(".scale .moment").css("width", width_n * 10.6);
                $(".scale .slider").css("left", width_n * 10.6);
            }
            $(".scale").next().val(width_n);
        } else {
            var width_n = 0;
            $(".scale .moment").css("width", 0);
            $(".scale .slider").css("left", 0);
        }
        $(".scale").next().val(width_n);
        //设置
        function callback(n) {
            obj.attr("wqdPath_width", n);
            obj.find("svg")[0].setAttribute("viewBox", (-250 - n * 26.42) + " " + (-250 - n * 26.42) + " " + (2392 + 2 * n * 26.42) + " " + (2392 + 2 * n * 26.42));
            obj.find("svg").children().attr("stroke-width", n * 26.42);
            obj.find("svg").children().attr("stroke-linecap", "square");
            $(document).trigger('appSetCatch');
        }
        utility.range({
            slider: $(".svgIconEdit .edit_unitbox>div.scale .slider").eq(0),
            obj: obj,
            maxval: 10,
            type: "borderwidth",
            callback: rangCallback
        });
    };
    //关注设置
    popupEdit.followInit = function() {

        var obj = window.edit;
        var attenParent = obj.find(".wqd-follow");
        var attenIcon = attenParent.children();
        var viewLen=obj.find(".wqdControlFollow>li").not(".novisible").length;
        $(".attentionSet .shareBox").html(obj.find(".follow-default").clone());
        var initMargin0 = 0;
        var initMargin8 = 8;//原始间距
        var initSize = 36;//原始图标大小
        var iconSet = {}; //图标设置
        var ele = {
            ele_size: $(".attentionSet").find("span:contains('图标大小')").siblings("input"),
            ele_space: $(".attentionSet").find("span:contains('图标间距')").siblings("input"),
            ele_size_moment: $(".attentionSet").find("span:contains('图标大小')").siblings(".scale").find(".moment"),
            ele_space_moment: $(".attentionSet").find("span:contains('图标间距')").siblings(".scale").find(".moment"),
            ele_size_slider: $(".attentionSet").find("span:contains('图标大小')").siblings(".scale").find(".slider"),
            ele_space_slider: $(".attentionSet").find("span:contains('图标间距')").siblings(".scale").find(".slider"),
        };
        //图标初始化及记录
        iconSet.init = function() {
            //图标大小
            var iconsize = Number(obj.attr("size"))
            if (!iconsize) {
                ele.ele_size.val(initSize);
                ele.ele_size_moment.css("width", (105 * initSize) / 128);
                ele.ele_size_slider.css("left", (105 * initSize) / 128);
                attenIcon.width(initSize);
            } else if (iconsize) {
                ele.ele_size.val(iconsize);
                ele.ele_size_moment.css("width", (105 * iconsize) / 128);
                ele.ele_size_slider.css("left", (105 * iconsize) / 128);
                attenIcon.width(iconsize);
            }

            //横竖版
            if (!obj.attr("vertical") || obj.attr("vertical") == "0") {
                var space =obj.attr("Hiconspace") ? obj.attr("Hiconspace") : initMargin8;
                ele.ele_space_moment.css("width", (105 * space) / 50);
                ele.ele_space_slider.css("left", (105 * space) / 50);
                ele.ele_space.val(space);

            } else if (obj.attr("vertical") == 1) {
                var space = !obj.attr("Hiconspace") ? initMargin8 : obj.attr("Hiconspace");
                ele.ele_space_moment.css("width", (105 * space) / 50);
                ele.ele_space_slider.css("left", (105 * space) / 50);
                ele.ele_space.val(space);
            }
        };
        iconSet.init();
        //编辑框宽高设置
        iconSet.editBoxSet = function() {
            if (!obj.attr("vertical") || obj.attr("vertical") == "0") {
                var size = parseInt(!obj.attr("size") ? initSize : obj.attr("size"), 10);
                var margin =(!obj.attr("Hiconspace") ? initMargin8 : Number(obj.attr("Hiconspace"))+0.5);
                elementInfo.setNewPosition({
                    element: obj,
                    parent: obj.parent(),
                    width: (size * viewLen + (viewLen-1) * margin + initMargin0),
                    height: (size),
                    left: parseInt(obj[0].style.left, 10),
                    top: parseInt(obj[0].style.top, 10)
                });
            } else if (obj.attr("vertical") == "1") {
                var size = parseInt(!obj.attr("size") ? initSize : obj.attr("size"), 10);
                var margin = (!obj.attr("Hiconspace") ? initMargin8 : Number(obj.attr("Hiconspace"))+0.5);
                elementInfo.setNewPosition({
                    element: obj,
                    parent: obj.parent(),
                    width: (size),
                    height: (size * viewLen + (viewLen-1) * margin + initMargin0),
                    left: parseInt(obj[0].style.left, 10),
                    top: parseInt(obj[0].style.top, 10)
                });
            }
        }

        //图标大小
        iconSet.size = function(n) {
            var min = (128 * n) < 16 ? 16 : (128 * n);
            (128 * n) < 16 ? ele.ele_size.val(16) : ele.ele_size.val(Math.ceil(128 * n));
            ele.ele_size_moment.css("width", (105 * min) / 128);
            ele.ele_size_slider.css("left", (105 * min) / 128);
            obj.attr("size", ele.ele_size.val());
            attenIcon.each(function() {
                attenIcon.css({
                    "width": min,
                    height: min,
                })
            });
            if (!obj.attr("vertical") || obj.attr("vertical") == "0") {
                attenIcon.css("margin", initMargin0 + "px " + (!obj.attr("Hiconspace") ? (initMargin8) : obj.attr("Hiconspace")) + "px " + initMargin0 + "px " + initMargin0 + "px");
                attenIcon.eq(viewLen - 1).css({
                    marginRight: 0
                });
                attenIcon.not(":eq(0)").css({ //后面的左margin去掉
                    marginLeft: 0
                });
                iconSet.editBoxSet();
            } else if (obj.attr("vertical") == "1") {
                attenIcon.css("margin", initMargin0 + "px " + initMargin0 + "px" + (!obj.attr("Hiconspace") ? (initMargin8) : obj.attr("Hiconspace")) + "px " + initMargin0 + "px");
                attenIcon.eq(viewLen - 1).css({
                    marginBottom: 0
                });
                attenIcon.not(":eq(0)").css({ //后面的下margin去掉
                    marginTop: 0
                });
                iconSet.editBoxSet();
            }
            $(document).trigger('appSetCatch');
        };
        //图标间距
        iconSet.space = function(n) {
            var that = $(this);
            ele.ele_space.val(Math.round(n*50))
            obj.attr("Hiconspace", ele.ele_space.val());
            if (!obj.attr("vertical") || obj.attr("vertical") == "0") {
                attenIcon.css({
                    margin: initMargin0 + "px " + (50 * n) + "px " + initMargin0 + "px " + initMargin0 + "px ",
                });
                attenIcon.not(":eq(0)").css({ //后面的左margin去掉
                    marginLeft: 0
                });
                attenIcon.eq(viewLen - 1).css("margin-right", "0");
                iconSet.editBoxSet();
            } else if (obj.attr("vertical") == "1") {
                attenIcon.css({
                    "margin": initMargin0 + "px " + initMargin0 + "px " + (50 * n) + "px " + initMargin0 + "px",
                });
                attenIcon.eq(viewLen - 1).css("margin-bottom", "0");
                attenIcon.not(":eq(0)").css({ //后面的上margin去掉
                    marginTop: 0
                });
                iconSet.editBoxSet();
            }
            $(document).trigger("appSetCatch");
        }
        //圆标大小设置
        utility.range({
            maxval: 128,
            minval: 16,
            slider: $(".attentionSet .slider").eq(0),
            callback: iconSet.size
        });
        //圆标间距设置
        utility.range({
            maxval: 50,
            slider: $(".attentionSet .slider").eq(1),
            callback: iconSet.space
        });
        //ie检测
        function isIE() { //ie?
            if (!!window.ActiveXObject || "ActiveXObject" in window)
                return true;
            else
                return false;
        };
        /*变现宽度下拉列表--下拉项*/
        $(".attentionSet  .borerwidthselect ul li").click(function(e) {
            $(this).parents(".borerwidthselect").removeClass("on").find("i").removeClass("on").parent().removeClass("on").end().end().end().addClass("on").siblings().removeClass("on");
            $(this).parent().siblings("p").find("span").remove().end().prepend($(this).children().clone());
            var index = $(this).index()
            if (index == "0" && attenParent.hasClass("vertical")) {
                var margin = parseInt(!obj.attr("Hiconspace") ? initMargin8 : obj.attr("Hiconspace"), 10);
                !obj.attr("size") ? attenIcon.css({
                    width: initSize,
                    height: initSize,
                    "margin": initMargin0 + "px " + margin + "px " + initMargin0 + "px " + initMargin0 + "px"
                }) : attenIcon.css({
                    width: obj.attr("size"),
                    height: obj.attr("size"),
                    "margin": initMargin0 + "px " + margin + "px " + initMargin0 + "px " + initMargin0 + "px"
                });
                attenIcon.eq(attenIcon.length - 1).css("margin-right", "0");
                attenIcon.not(":eq(0)").css({ //后面的左margin去掉
                    marginLeft: 0
                });
                attenParent.removeClass("vertical");
                obj.attr("vertical", "0");
                iconSet.editBoxSet();
                $(document).trigger('appSetCatch');
            } else if (index == "1" && !attenParent.hasClass("vertical")) {
                var size = parseInt(!obj.attr("size") ? initSize : obj.attr("size"), 10);
                var margin = parseInt(!obj.attr("Hiconspace") ? initMargin8 : obj.attr("Hiconspace"), 10);
                attenIcon.css("margin", initMargin0 + "px " + initMargin0 + "px " + margin + "px " + initMargin0 + "px");
                attenIcon.eq(attenIcon.length - 1).css("margin-bottom", "0");
                !obj.attr("size") ? attenIcon.css({
                    width: initSize,
                    height: initSize,
                    "margin": initMargin0 + "px " + initMargin0 + "px " + margin + "px " + initMargin0 + "px"
                }) : attenIcon.css({
                    width: obj.attr("size"),
                    height: obj.attr("size"),
                    "margin": initMargin0 + "px " + initMargin0 + "px " + margin + "px " + initMargin0 + "px"
                });
                attenIcon.not(":eq(0)").css({ //后面的左margin去掉
                    marginTop: 0
                });
                attenParent.addClass("vertical");
                obj.attr("vertical", "1");
                iconSet.editBoxSet();
                $(document).trigger("appSetCatch");
            };
        });
        //记录横竖排
        if (obj.attr("vertical") == 0 || !obj.attr("vertical")) {
            $(".attentionSet [vertical]>p span").text($(".attentionSet [vertical] ul li").eq(0).find("span").text());

        } else if (obj.attr("vertical") == 1) {
            $(".attentionSet [vertical]>p span").text($(".attentionSet [vertical] ul li").eq(1).find("span").text());

        };
        /*模拟下拉列表*/
        $(".wqdEditBox .borerwidthselect p").on("click", function(e) {
            if ($(this).hasClass("readonly")) return false;
            if ($(this).parent().hasClass("on")) {
                $(this).removeClass("on").parent().removeClass("on").find("i").removeClass("on");
            } else {
                $(this).addClass("on").parent().addClass("on").find("i").addClass("on");
            }
            e.preventDefault();
        });
        $(".attentionSet .shareBox li").each(function(i) {
            var self = $(this);
            //记录图标信息
            self.removeClass("novisible");
            if (attenIcon.eq(i).attr("visible") == "1") {
                $(".attentionSet .contentLi:first ").children(".shareShow").eq(i).removeClass("novisible");

            } else if (attenIcon.eq(i).attr("visible") == "0") {
                self.addClass("del");
                $(".attentionSet .contentLi:first ").children(".shareShow").eq(i).addClass("novisible");
            }
            self.click(function() {
                if (self.hasClass("del")) {
                    //添加的时候
                    self.removeClass("del");
                    $(".attentionSet .contentLi:first ").children(".shareShow").eq(i).removeClass("novisible");
                    attenIcon.eq(i).attr("visible", "1").removeClass("novisible");

                } else if (!self.hasClass("del")) {
                    attenIcon.eq(i).attr("visible", "0").addClass("novisible");
                    self.addClass("del");
                    $(".attentionSet .contentLi:first ").children(".shareShow").eq(i).addClass("novisible");
                }
                $(document).trigger('appSetCatch');
            })
        });

        //按钮颜色
        $(".attentionSet .colorval").on("changeColor", function() {
            var colorVal = $(this).val();
            // var $carouselInner = obj.find(".carousel-inner");
            var $curele = obj.find(".wqd-follow li path");
            // var $curhfli = $(".wqdEditBox.lunboSet  .thumbnail li.on");
            obj.attr("iconcolor", colorVal);
            $curele.attr("fill", colorVal);
            $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
            $(document).trigger('appSetCatch');
        });
        //记录颜色
        if (ispurecolor()) {
            $(".attentionSet :contains('图标背景')").parent(".edit_unitbox").css("display", "block");
            if (!obj.attr("iconcolor")) {
                $(".attentionSet .colorval.wqdColorPicker").val("#aaaaa").siblings(".colordeviceBg").find(".colordevice").css("background-color", "#aaa");

            } else {

                $(".attentionSet .colorval.wqdColorPicker").val(obj.attr("iconcolor")).siblings(".colordeviceBg").find(".colordevice").css("background-color", obj.attr("iconcolor"));

            }
        } else if (!ispurecolor()) {
            $(".attentionSet :contains('图标背景')").parent(".edit_unitbox").css("display", "none");

        };
        this.commonInit();
        //判断是否纯色
        function ispurecolor() {
            if (attenIcon.eq(0).find("path").attr("fill") == attenIcon.eq(1).find("path").attr("fill")) {
                return true;
            }
        };
        //输入地址
        $(".attentionSet .shareURl input").each(function(i) {
            var that = $(this);
            var index = that.parents().index() - 2; //设置对应图标的下标
            //记录地址
            if (attenIcon.eq(index).attr("url")) {
                that.val(attenIcon.eq(index).attr("url"));
            };
            that.on("input", function() {
                attenIcon.eq(index).attr("url", $(this).val());
                $(document).trigger('appSetCatch');
            }).blur(function() {
                var val = that.val();
                if (!/^http:\/\//.test(val)) {
                    that.val("http://" + val);
                };
                attenIcon.eq(index).attr("url", $(this).val());
                $(document).trigger('appSetCatch');
            });
        });

        //关注分享公共对象
        var asCommon = {};
        //点击图片也可上传
        asCommon.imgBind = function(json) {
            json.par.css({
                "position": "relative"
            }).append('<input type="file" value="上传图片" name="fileUpload" id="fileupload_input" style="position: absolute;width: 65px;top: 0;height: 65px;opacity: 0;cursor: pointer;font-size: 0;">')
        };
        asCommon.imgBind({
            par: $(".upLoadBox:eq(0) dt")
        });
        asCommon.imgBind({
            par: $(".upLoadBox:eq(1) dt")
        });
        //上传图片
        asCommon.upLoadPic = function(json) {
            json.ele.fileupload({
                pasteZone: null,
                url: "/user/gallery/upload", //文件上传地址，可以直接写在input的data-url属性内
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                maxFileSize: 2000000, // 2 MB
                dataType: 'text',
                sequentialUploads: true,
                formData: {
                    typeId: "10061"
                }, //参数
                done: function(e, result) {
                    if (result.result) {
                        var data = JSON.parse(result.result);
                        if (data && data.status == 500) {
                            alert(data.msg);
                            return;
                        }
                        json.target.attr("src", data.path);
                        obj.attr(json.save, data.path);
                        $(document).trigger('appSetCatch');
                    }
                },
                messages: {
                    acceptFileTypes: '图片格式不正确',
                    maxFileSize: '图片大小不超过2M'
                }
            }).off("fileuploadprocessalways").on('fileuploadprocessalways', function(e, data) {
                var index = data.index,
                    file = data.files[index];
                if (file.error) {
                    alert(file.error);
                }
            });
        };
        //qq二维码设置
        asCommon.upLoadPic({
            ele: $(".upLoadBox:eq(0) #fileupload_input"),
            target: $(".upLoadBox:eq(0) img"),
            save: "qqerweima"
        });
        //微信二维码设置
        asCommon.upLoadPic({
            ele: $(".upLoadBox:eq(1) #fileupload_input"),
            target: $(".upLoadBox:eq(1) img"),
            save: "wxerweima"
        });
        //记录图片
        if (obj.attr("qqerweima")) {
            $(".upLoadBox:eq(0) dt img").attr("src", obj.attr("qqerweima"));

        }
        if (obj.attr("wxerweima")) {
            $(".upLoadBox:eq(1) dt img").attr("src", obj.attr("wxerweima"));

        };
    };
    //分享设置
    popupEdit.shareInit = function() {

        var obj = window.edit;
        var attenParent = obj.find(".wqd-share");
        var attenIcon = attenParent.children();
        var viewLen=obj.find(".wqdControlShare>li").not(".novisible").length;
        $(".shareSet .shareBox").html(obj.find(".share-default").clone());
        var initMargin0 = 0;
        var initMargin8 = 8;//原始间距
        var initSize = 36;//原始图标大小
        var iconSet = {}; //图标设置
        var ele = {
            ele_size: $(".shareSet").find("span:contains('图标大小')").siblings("input"),
            ele_space: $(".shareSet").find("span:contains('图标间距')").siblings("input"),
            ele_size_moment: $(".shareSet").find("span:contains('图标大小')").siblings(".scale").find(".moment"),
            ele_space_moment: $(".shareSet").find("span:contains('图标间距')").siblings(".scale").find(".moment"),
            ele_size_slider: $(".shareSet").find("span:contains('图标大小')").siblings(".scale").find(".slider"),
            ele_space_slider: $(".shareSet").find("span:contains('图标间距')").siblings(".scale").find(".slider"),
        };
        //图标初始化及记录
        iconSet.init = function() {
            //图标大小
            var iconsize = Number(obj.attr("size"))
            if (!iconsize) {
                ele.ele_size.val(initSize);
                ele.ele_size_moment.css("width", (105 * initSize) / 128);
                ele.ele_size_slider.css("left", (105 * initSize) / 128);
                attenIcon.width(initSize);
            } else if (iconsize) {
                ele.ele_size.val(iconsize);
                ele.ele_size_moment.css("width", (105 * iconsize) / 128);
                ele.ele_size_slider.css("left", (105 * iconsize) / 128);
                attenIcon.width(iconsize);
            }

            //横竖版
            if (!obj.attr("vertical") || obj.attr("vertical") == "0") {
                var space =obj.attr("Hiconspace") ? obj.attr("Hiconspace") : initMargin8;
                ele.ele_space_moment.css("width", (105 * space) / 50);
                ele.ele_space_slider.css("left", (105 * space) / 50);
                ele.ele_space.val(space);

            } else if (obj.attr("vertical") == 1) {
                var space = !obj.attr("Hiconspace") ? initMargin8 : obj.attr("Hiconspace");
                ele.ele_space_moment.css("width", (105 * space) / 50);
                ele.ele_space_slider.css("left", (105 * space) / 50);
                ele.ele_space.val(space);
            }

        };
        iconSet.init();
        //编辑框宽高设置
        iconSet.editBoxSet = function() {
            if (!obj.attr("vertical") || obj.attr("vertical") == "0") {
                var size = parseInt(!obj.attr("size") ? initSize : obj.attr("size"), 10);
                var margin =(!obj.attr("Hiconspace") ? initMargin8 : Number(obj.attr("Hiconspace"))+0.5);
                elementInfo.setNewPosition({
                    element: obj,
                    parent: obj.parent(),
                    width: (size * viewLen + (viewLen-1) * margin + initMargin0),
                    height: (size),
                    left: parseInt(obj[0].style.left, 10),
                    top: parseInt(obj[0].style.top, 10)
                });
            } else if (obj.attr("vertical") == "1") {
                var size = parseInt(!obj.attr("size") ? initSize : obj.attr("size"), 10);
                var margin = (!obj.attr("Hiconspace") ? initMargin8 : Number(obj.attr("Hiconspace"))+0.5);
                elementInfo.setNewPosition({
                    element: obj,
                    parent: obj.parent(),
                    width: (size),
                    height: (size * viewLen + (viewLen-1) * margin + initMargin0),
                    left: parseInt(obj[0].style.left, 10),
                    top: parseInt(obj[0].style.top, 10)
                });
            }
        }

        //图标大小
        iconSet.size = function(n) {
            var min = (128 * n) < 16 ? 16 : (128 * n);

            (128 * n) < 16 ? ele.ele_size.val(16) : ele.ele_size.val(Math.ceil(128 * n));
            ele.ele_size_moment.css("width", (105 * min) / 128);
            ele.ele_size_slider.css("left", (105 * min) / 128);
            obj.attr("size", ele.ele_size.val());
            attenIcon.each(function() {
                attenIcon.css({
                    "width": min,
                    height: min,
                })
            });
            if (!obj.attr("vertical") || obj.attr("vertical") == "0") {
                attenIcon.css("margin", initMargin0 + "px " + (!obj.attr("Hiconspace") ? (initMargin8) : obj.attr("Hiconspace")) + "px " + initMargin0 + "px " + initMargin0 + "px");
                attenIcon.eq(viewLen - 1).css({
                    marginRight: 0
                });
                attenIcon.not(":eq(0)").css({ //后面的左margin去掉
                    marginLeft: 0
                });
                iconSet.editBoxSet();
            } else if (obj.attr("vertical") == "1") {
                attenIcon.css("margin", initMargin0 + "px " + initMargin0 + "px" + (!obj.attr("Hiconspace") ? (initMargin8) : obj.attr("Hiconspace")) + "px " + initMargin0 + "px");
                attenIcon.eq(viewLen - 1).css({
                    marginBottom: 0
                });
                attenIcon.not(":eq(0)").css({ //后面的下margin去掉
                    marginTop: 0
                });
                iconSet.editBoxSet();
            }
            $(document).trigger('appSetCatch');

        };
        //图标间距
        iconSet.space = function(n) {
            var that = $(this);
            ele.ele_space.val(Math.round(n*50))
            obj.attr("Hiconspace", ele.ele_space.val());
            if (!obj.attr("vertical") || obj.attr("vertical") == "0") {
                attenIcon.css({
                    margin: initMargin0 + "px " + (50 * n) + "px " + initMargin0 + "px " + initMargin0 + "px ",
                });
                attenIcon.not(":eq(0)").css({ //后面的左margin去掉
                    marginLeft: 0
                });
                attenIcon.eq(viewLen - 1).css("margin-right", "0");
                iconSet.editBoxSet();
            } else if (obj.attr("vertical") == "1") {
                attenIcon.css({
                    "margin": initMargin0 + "px " + initMargin0 + "px " + (50 * n) + "px " + initMargin0 + "px",
                });
                attenIcon.eq(viewLen - 1).css("margin-bottom", "0");
                attenIcon.not(":eq(0)").css({ //后面的上margin去掉
                    marginTop: 0
                });
                iconSet.editBoxSet();
            }
            $(document).trigger("appSetCatch");
        }
        //圆标大小设置
        utility.range({
                maxval: 128,
                minval:16,
                slider: $(".shareSet .slider").eq(0),
                callback: iconSet.size
            })
            //圆标间距设置
        utility.range({
                maxval: 50,
                slider: $(".shareSet .slider").eq(1),
                callback: iconSet.space
            })
            //ie检测
        function isIE() { //ie?
            if (!!window.ActiveXObject || "ActiveXObject" in window)
                return true;
            else
                return false;
        }
        /*变现宽度下拉列表--下拉项*/
        $(".shareSet  .borerwidthselect ul li").click(function(e) {
            $(this).parents(".borerwidthselect").removeClass("on").find("i").removeClass("on").parent().removeClass("on").end().end().end().addClass("on").siblings().removeClass("on");
            $(this).parent().siblings("p").find("span").remove().end().prepend($(this).children().clone());
            var index = $(this).index()
            if (index == "0" && attenParent.hasClass("vertical")) {
                var margin = parseInt(!obj.attr("Hiconspace") ? initMargin8 : obj.attr("Hiconspace"), 10);
                !obj.attr("size") ? attenIcon.css({
                    width: initSize,
                    height: initSize,
                    "margin": initMargin0 + "px " + margin + "px " + initMargin0 + "px " + initMargin0 + "px"
                }) : attenIcon.css({
                    width: obj.attr("size"),
                    height: obj.attr("size"),
                    "margin": initMargin0 + "px " + margin + "px " + initMargin0 + "px " + initMargin0 + "px"
                });
                attenIcon.eq(attenIcon.length - 1).css("margin-right", "0");
                attenIcon.not(":eq(0)").css({ //后面的左margin去掉
                    marginLeft: 0
                });
                attenParent.removeClass("vertical");
                obj.attr("vertical", "0");
                iconSet.editBoxSet();
                $(document).trigger('appSetCatch');
            } else if (index == "1" && !attenParent.hasClass("vertical")) {
                var size = parseInt(!obj.attr("size") ? initSize : obj.attr("size"), 10);
                var margin = parseInt(!obj.attr("Hiconspace") ? initMargin8 : obj.attr("Hiconspace"), 10);
                attenIcon.css("margin", initMargin0 + "px " + initMargin0 + "px " + margin + "px " + initMargin0 + "px");
                attenIcon.eq(attenIcon.length - 1).css("margin-bottom", "0");
                !obj.attr("size") ? attenIcon.css({
                    width: initSize,
                    height: initSize,
                    "margin": initMargin0 + "px " + initMargin0 + "px " + margin + "px " + initMargin0 + "px"
                }) : attenIcon.css({
                    width: obj.attr("size"),
                    height: obj.attr("size"),
                    "margin": initMargin0 + "px " + initMargin0 + "px " + margin + "px " + initMargin0 + "px"
                });
                attenIcon.not(":eq(0)").css({ //后面的左margin去掉
                    marginTop: 0
                });
                attenParent.addClass("vertical");
                obj.attr("vertical", "1");
                iconSet.editBoxSet();
                $(document).trigger('appSetCatch');
            };
        });
        //记录横竖排
        if (obj.attr("vertical") == 0 || !obj.attr("vertical")) {
            $(".shareSet [vertical]>p span").text($(".shareSet [vertical] ul li").eq(0).find("span").text());

        } else if (obj.attr("vertical") == 1) {
            $(".shareSet [vertical]>p span").text($(".shareSet [vertical] ul li").eq(1).find("span").text());

        }
        /*模拟下拉列表*/
        $(".wqdEditBox .borerwidthselect p").on("click", function(e) {
            if ($(this).hasClass("readonly")) return false;
            if ($(this).parent().hasClass("on")) {
                $(this).removeClass("on").parent().removeClass("on").find("i").removeClass("on");
            } else {
                $(this).addClass("on").parent().addClass("on").find("i").addClass("on");
            }
            e.preventDefault();
        });
        $(".shareSet .shareBox li").each(function(i) {
            var self = $(this);
            //记录图标信息
            self.removeClass("novisible");
            if (attenIcon.eq(i).attr("visible") == "1") {
                $(".shareSet .contentLi:first ").children(".shareShow").eq(i).removeClass("novisible");

            } else if (attenIcon.eq(i).attr("visible") == "0") {
                self.addClass("del");
                $(".shareSet .contentLi:first ").children(".shareShow").eq(i).addClass("novisible");
            }
            self.click(function() {
                if (self.hasClass("del")) {
                    //添加的时候
                    self.removeClass("del");
                    $(".shareSet .contentLi:first ").children(".shareShow").eq(i).removeClass("novisible");
                    attenIcon.eq(i).attr("visible", "1").removeClass("novisible");

                } else if (!self.hasClass("del")) {
                    attenIcon.eq(i).attr("visible", "0").addClass("novisible");
                    self.addClass("del");
                    $(".shareSet .contentLi:first ").children(".shareShow").eq(i).addClass("novisible");
                }
                $(document).trigger('appSetCatch');
            })
        });

        //按钮颜色
        $(".shareSet .colorval").on("changeColor", function() {
            var colorVal = $(this).val();
            // var $carouselInner = obj.find(".carousel-inner");
            var $curele = obj.find(".wqd-share li path");
            // var $curhfli = $(".wqdEditBox.lunboSet  .thumbnail li.on");
            obj.attr("iconcolor", colorVal);
            $curele.attr("fill", colorVal);
            $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
            $(document).trigger('appSetCatch');
        });
        //记录颜色
        if (ispurecolor()) {
            $(".shareSet :contains('图标背景')").parent(".edit_unitbox").css("display", "block");
            if (!obj.attr("iconcolor")) {
                $(".shareSet .colorval.wqdColorPicker").val("#aaaaa").siblings(".colordeviceBg").find(".colordevice").css("background-color", "#aaa");

            } else {

                $(".shareSet .colorval.wqdColorPicker").val(obj.attr("iconcolor")).siblings(".colordeviceBg").find(".colordevice").css("background-color", obj.attr("iconcolor"));

            }
        } else if (!ispurecolor()) {
            $(".shareSet :contains('图标背景')").parent(".edit_unitbox").css("display", "none");

        };
        this.commonInit();
        //判断是否纯色
        function ispurecolor() {
            if (attenIcon.eq(0).find("path").attr("fill") == attenIcon.eq(1).find("path").attr("fill")) {
                return true;
            }
        };
        //分享文字
        $(".shareSet  .shareText").on("propertychange input", function() {

                var shareText = $(".shareSet  .shareText").val();
                if (shareText.length >= 120) {
                    $(this).val($(this).val().substring(0, 120));
                }
                $(".shareText").text(shareText);
                obj.attr("shareText", shareText);

                $(document).trigger('appSetCatch');

            })
            //记录文字
        if (obj.attr("shareText")) {
            $(".shareSet  .shareText").val(obj.attr("shareText"));
        }
        //关注分享公共对象
        var asCommon = {};
        //点击图片也可上传
        asCommon.imgBind = function(json) {
            json.par.css({
                "position": "relative"
            }).append('<input type="file" value="上传图片" name="fileUpload" id="fileupload_input" style="position: absolute;width: 65px;top: 0;height: 65px;opacity: 0;cursor: pointer;font-size: 0;">')
        };
        asCommon.imgBind({
            par: $(".upLoadBox:eq(0) dt")
        });
        //上传图片
        asCommon.upLoadPic = function(json) {
            json.ele.fileupload({
                pasteZone: null,
                url: "/user/gallery/upload", //文件上传地址，可以直接写在input的data-url属性内
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                maxFileSize: 2000000, // 2 MB
                dataType: 'text',
                sequentialUploads: true,
                formData: {
                    typeId: "10061"
                }, //参数
                done: function(e, result) {
                    if (result.result) {
                        var data = JSON.parse(result.result);
                        if (data && data.status == 500) {
                            alert(data.msg);
                            return;
                        }
                        json.target.attr("src", data.path);
                        obj.attr(json.save, data.path);
                        $(document).trigger('appSetCatch');
                    }
                },
                messages: {
                    acceptFileTypes: '图片格式不正确',
                    maxFileSize: '图片大小不超过2M'
                }
            }).off("fileuploadprocessalways").on('fileuploadprocessalways', function(e, data) {
                var index = data.index,
                    file = data.files[index];
                if (file.error) {
                    alert(file.error);
                }
            });
        };
        //微信二维码设置
        asCommon.upLoadPic({
            ele: $(".upLoadBox:eq(0) #fileupload_input"),
            target: $(".upLoadBox:eq(0) img"),
            save: "qqerweima"
        });
        //记录图片
        if (obj.attr("qqerweima")) {
            $(".upLoadBox dt img").attr("src", obj.attr("qqerweima"));

        }
    };
    return popupEdit;
});
