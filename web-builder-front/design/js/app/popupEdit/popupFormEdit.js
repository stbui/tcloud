define(['popupDrag', 'createColorStyle', 'utility', 'elementInfo'], function(popupDrag, createColorStyle, utility, elementInfo) {
    var popupFormEdit = {};
    popupFormEdit.commonInit = function() {
        $(".colorpicker.dropdown-menu").remove();
        var colorpic = $('.wqdColorPicker').colorpicker({
            format: false,
            colorSelectors: {
                '#777777': '#777777',
                '#337ab7': '#337ab7',
                '#5cb85c': '#5cb85c',
                '#5bc0de': '#5bc0de',
                '#f0ad4e': '#f0ad4e',
                '#d9534f': '#d9534f'
            }
        });
        //初始化编辑器位置
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
            nowLeft = $(window).width()/2 - editBoxW/2,
            nowTop = $(window).height()/2 - editBoxH/2;
        $(".wqdEditBox").css({"left":nowLeft,"top":nowTop,"opacity":1});
        //编辑器弹窗关闭
        $(".wqdEditBox .edit_close").on("click", function() {
            $.fn.colorbox.close();
        });
        //编辑框问号点击链接
        $(".wqdEditBox  .edit_help").click(function() {
            window.open("http://127.0.0.1");
        });
        /*背景设置---左侧导航*/
        $(".wqdEditBox  .edit_content_nav li").click(function() {
            if ($(this).hasClass("on")) return false;
            $(this).addClass("on").siblings().removeClass("on");
            var index = $(this).index();
            $(this).parents("nav.edit_content_nav").siblings("ul.edit_content").children().removeClass("on").eq(index).addClass("on");
            return false;
        });
         var obj = window.edit;
        $(".wqdEditBox .style input").on("blur", function() {
            var font_size = $(this).val();
            if(font_size<12){
               font_size=12;
               $(this).val(12);
            }
            font_size && obj.find(".wqd-form-element").children().css("font-size",font_size+"px").end()
               .find("span").css("font-size",font_size+"px");
            var elementtype = obj.attr("data-elementtype");
            var type= elementtype=="formCheckbox"?"formCheckbox":elementtype == "formRadio" ? "formRadio" : void 0;
            if(type){
                obj.parent().children('.wqdelementEdit[data-elementtype="'+type+'"]').each(function(index, el) {
                  $(el).find("label").css("font-size",font_size+"px");
                 });
            }
            $(document).trigger('appSetCatch');
           })
        .on("input",function () {
            var val = $(this).val()||"";
            $(this).val(val.replace(/\D/g,""));
        })
        .on("keydown",function(e) {
            var fontSize=$(this).val();
            if(e.keyCode==38){
                $(this).val(++fontSize)
            }
            if(e.keyCode==40){
                $(this).val(--fontSize)
            }
            if(e.keyCode==13){
                $(this).blur();
            }
        });

    };
    /////////////////拖拽函数///////////////////////////////
    function rang(json) {
        var maxval = json.maxval;
        var _this = json.slider;
        var _obj = json.obj;
        var _type = json.type;
        var maxwidth = _this.parent().width();
        //拖拽
        _this.mousedown(function(e) {
            var offl = parseFloat($(this).css("left"));
            var dx = e.clientX;

            function move(e) {
                var len = offl + e.clientX - dx;
                if (len >= 0 && len <= maxwidth) {
                    _this.css("left", len);
                    _this.prev().css("width", len);
                    _this.parent().next().val(Math.round(len * maxval / maxwidth));
                    ///////类型判断
                    if (_type == "backgroundHeight") {
                        //liumingren
                        $(document).trigger("changeHeight:section", {
                            parent: $(_obj),
                            newHeight: Math.round(len * maxval / maxwidth)
                        });

                        setFulllunbo($(_obj));

                        setTimeout(function() {
                            _obj.height(Math.round(len * maxval / maxwidth));
                            _obj.attr("wqdheight", _obj.height());
                        }, 0);
                    } else if (_type == "borderRadius") {
                        if (_obj.find(".wqd-button").attr("wqdbtnborder") == "false") {
                            _obj.find(".wqd-button").css({
                                "border-radius": (Math.round(len * maxval / maxwidth))
                            });
                            _obj.attr("wqdborderradius", Math.round(len * maxval / maxwidth));
                        }
                    } else if (_type == "borderwidth") {
                        json.callback && json.callback(len / 10.6);
                    }
                    $(document).trigger('appSetCatch');
                }
            };

            function up() {
                $(document).trigger("appSetCatch");
                $(document).off("mousemove.popup");
                $(document).off("mouseup.popup");
            };
            $(document).on("mousemove.popup", move);
            $(document).on("mouseup.popup", up);
        });

        ////输入数字，跳转////
        _this.parent().siblings(".r_val").off('input propertychange').on('input propertychange', function() {
            var str = $(this).val();
            var text = 0;
            if (!$(this).val()) {
                $(this).val(0);
            }
            if (str.length > 1 && str.charAt(0) == "0") {
                $(this).val(str.substring(1));
            }
            if (!isNaN(str)) {
                text = str;
                var val = parseFloat(text);

                function typeFn() {
                    ///////类型判断
                    if (_type == "backgroundHeight") {
                        //liumingren
                        $(document).trigger("changeHeight:section", {
                            parent: $(_obj),
                            newHeight: val
                        });
                        setFulllunbo($(_obj));
                        setTimeout(function() {
                            _obj.height(val);
                            _obj.attr("wqdheight", _obj.height());
                            $(document).trigger('appSetCatch');
                        }, 0)

                    } else if (_type == "borderRadius") {
                        $('.r_val').val(val);
                        if (_obj.find(".wqd-button").attr("wqdbtnborder") == "false") {
                            _obj.find(".wqd-button").css({
                                "border-radius": val + "px"
                            });
                            _obj.attr("wqdborderradius", val);
                        }
                        $(document).trigger('appSetCatch');
                    } else if (_type == "borderwidth") {
                        json.callback && json.callback(val/5);
                    }
                }
                //_this.css({
                //    "left": val * maxwidth / maxval
                //}).siblings(".moment").css({
                //    "width": val * maxwidth / maxval
                //});
                if (val >= maxval) {
                    $(this).val(maxval);
                    _this.css({
                        "left": maxwidth
                    }).siblings(".moment").css({
                        "width": maxwidth
                    });
                } else if (val < 0) {
                    val = 0;
                    $(this).val(0);
                    _this.css({
                        "left": 0
                    }).siblings(".moment").css({
                        "width": 0
                    });
                } else {

                    _this.css({
                        "left": val * maxwidth / maxval
                    }).siblings(".moment").css({
                        "width": val * maxwidth / maxval
                    });
                }
                typeFn();
                //$(this).off("blur").on("blur", typeFn);

                _obj.attr("wqdheight", val);
            } else {
                $(this).val(text);
            }
            $(document).trigger('appSetCatch');
        });

        /*输入数字——上下键*/
        _this.parent().siblings("input.r_val").keydown(function(e) {
            var key_val = Number($(this).val());
            var keyval = e.keyCode;
            if (keyval == 38 || keyval == 40||keyval==8) {
                switch (keyval) {
                    case 38:
                        key_val++;
                        //控制他的最大值
                        if (key_val >50) key_val = 50;
                        break;
                    case 40:
                        key_val--;
                        if (key_val <=0) key_val = 0;
                        break;
                    default :
                        break;
                }
                $(this).val(key_val);

                if (key_val > maxval) {
                    _this.css({
                        "left": maxwidth
                    }).siblings(".moment").css({
                        "width": maxwidth
                    });
                    ///////类型判断
                    if (_type == "backgroundHeight") {
                        //liumingren
                        $(document).trigger("changeHeight:section", {
                            parent: $(_obj),
                            newHeight: key_val
                        });
                        setFulllunbo($(_obj));
                        setTimeout(function() {
                            _obj.height(key_val);
                            _obj.attr("wqdheight", _obj.height());
                        }, 0);
                    } else if (_type == "borderRadius") {
                        if (_obj.find(".wqd-button").attr("wqdbtnborder") == "false") {
                            _obj.find(".wqd-button").css({
                                "border-radius": key_val + "px"
                            });
                            _obj.attr("wqdborderradius", key_val);
                        }
                    } else if (_type == "borderwidth") {
                        json.callback && json.callback(key_val/5);
                    }
                } else {
                    _this.css({
                        "left": key_val * maxwidth / maxval
                    }).siblings(".moment").css({
                        "width": key_val * maxwidth / maxval
                    });
                    ///////类型判断
                    if (_type == "backgroundHeight") {
                        //liumingren
                        $(document).trigger("changeHeight:section", {
                            parent: $(_obj),
                            newHeight: key_val
                        });
                        setFulllunbo($(_obj));
                        setTimeout(function() {
                            _obj.height(key_val);
                            _obj.attr("wqdheight", _obj.height());
                        }, 0);
                    } else if (_type == "borderRadius") {
                        if (_obj.find(".wqd-button").attr("wqdbtnborder") == "false") {
                            _obj.find(".wqd-button").css({
                                "border-radius": key_val + "px"
                            });
                            _obj.attr("wqdborderradius", key_val);
                        }
                    } else if (_type == "borderwidth") {
                        json.callback && json.callback(key_val/5);
                    }
                }
                $(document).trigger('appSetCatch');
            }
        });
    };
    //新建项排序
    popupFormEdit.sort=function(name,obj){
        var ele=$('.wqd-carouseOverlay [name='+name+']');
        var top=parseFloat(obj.css("top"));
        var height=parseFloat(obj.css("height"));
        ele.each(function(n,elem){
            if(n == 0) ele.eq(n).parents('.wqdelementEdit').eq(0).css({'top':top});
            else ele.eq(n).parents('.wqdelementEdit').eq(0).css({'top':top+height*n});
        });
    }
    popupFormEdit.formInputInit = function() {
        this.commonInit();
        var obj = window.edit;
        //表单输入框设置__基础__提示文字
        //
        //初始化__获取文字
        var wqdformtitle;
        if (obj.attr("wqdformtitle")) {
            wqdformtitle = obj.attr("wqdformtitle");
        } else {
            if (obj.attr("data-elementtype") == "formInput") wqdformtitle = "姓名";
            else wqdformtitle = "详情"
        }
        if (obj.attr("data-elementtype") == "formInput") {
            obj.find("input").eq(0).attr("placeholder", wqdformtitle);
        } else if (obj.attr("data-elementtype") == "formTextarea") {
            obj.find("textarea").eq(0).attr("placeholder", wqdformtitle);
        }
        $(".formInputEdit .submit").val(wqdformtitle);
        //设置文字
        $(".formInputEdit .submit").on("input propertychange", function() {
            obj.attr("wqdformtitle", $(this).val());
            if (obj.attr("data-elementtype") == "formInput") {
                obj.find("input").eq(0).attr("placeholder", $(this).val());
            } else if (obj.attr("data-elementtype") == "formTextarea") {
                obj.find("textarea").eq(0).val($(this).val());
                obj.find("textarea").eq(0).attr("placeholder", $(this).val());
            }
            $(document).trigger('appSetCatch');
        });
        //表单输入框设置__基础__颜色
        //初始化__文字颜色
        var txtcol;
        if (obj.find(".wqd-form-element").children().attr("txtcol")) {
            txtcol = obj.find(".wqd-form-element").children().attr("txtcol");
        } else {
            txtcol = obj.find(".wqd-form-element").children().css("color");
        }
        $(".formInputEdit .colorval").eq(0).attr("value", txtcol).siblings(".colordeviceBg").find(".colordevice").css("background-color", txtcol);
        //初始化__背景颜色
        var backcol;
        if (obj.find(".wqd-form-element").children().attr("backcol")) {
            backcol = obj.find(".wqd-form-element").children().attr("backcol");
        } else {
            backcol = obj.find(".wqd-form-element").children().css("background-color");
        }
        $(".formInputEdit .colorval").eq(1).attr("value", backcol).siblings(".colordeviceBg").find(".colordevice").css("background-color", backcol);
        //初始化__边框颜色
        var bordercol;
        if (obj.find(".wqd-form-element").children().attr("bordercol")) {
            bordercol = obj.find(".wqd-form-element").children().attr("bordercol");
        } else {
            bordercol = obj.find(".wqd-form-element").children().css("border-color");
        }
        $(".formInputEdit .colorval").eq(2).attr("value", bordercol).siblings(".colordeviceBg").find(".colordevice").css("background-color", bordercol);
        //设置颜色
        $(".wqdColorPicker").on("changeColor", function() {
            var colorVal = $(this).val();
            $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
            var index = $(".wqdEditBox.formInputEdit .edit_content .wqdColorPicker").index($(this));
            if (index == "0") { //文字颜色
                obj.find(".wqd-form-element").children().css("color", colorVal).attr("txtcol", colorVal);
            } else if (index == "1") { //背景颜色
                obj.find(".wqd-form-element").children().css("background-color", colorVal).attr("backcol", colorVal);
            } else if (index == "2") { //边框颜色
                obj.find(".wqd-form-element").children().css("border-color", colorVal).attr("bordercol", colorVal);
            }
            $(document).trigger('appSetCatch');
        });
        //表单输入框设置__基础__是否必填
        //初始化__获取
        var isRequired;
        if (obj.attr("isRequired"))
            isRequired = obj.attr("isRequired");
        else
            isRequired = 0;

        function Required(obj, n) {
            obj.find(".edit_radioorno").eq(n).
            children("i").addClass("on").end().
            children("input[type=radio]").attr("checked", "checked").end().
            siblings(".edit_radioorno").
            children("i").removeClass("on").end().
            children("input[type=radio]").removeAttr("checked").end();
        }
        Required($(".formInputEdit"), isRequired);
        //设置
        $(".formInputEdit .edit_radioorno").on("click", function() {
            Required($(".formInputEdit"), $(this).index() - 1);
        });

        //表单输入框设置__其他__边框宽度
        /*模拟下拉列表*/
        $(".formInputEdit .borerwidthselect p").on("click", function(e) {
            if ($(this).hasClass("readonly")) return false;
            if ($(this).parent().hasClass("on")) {
                $(this).removeClass("on").parent().removeClass("on").find("i").removeClass("on");
            } else {
                $(this).addClass("on").parent().addClass("on").find("i").addClass("on");
            }
            e.preventDefault();
        });
        //获取
        var borderwidth;
        if (obj.attr("borderwidth")) {
            borderwidth = parseInt(obj.attr("borderwidth"));
        } else {
            borderwidth = 1;
            obj.attr("borderwidth", borderwidth);
        }
        $(".borerwidthselect").eq(0).find("li").removeClass("on").eq(borderwidth).addClass("on");
        $(".borerwidthselect").eq(0).children("p").find("span").remove().end().prepend($(".borerwidthselect").eq(0).find("ul li").eq(borderwidth).find("span").clone());
        //表单输入框设置__其他__文字细节
        //获取
        var fontfamily;
        if (obj.attr("fontfamily")) {
            fontfamily = parseInt(obj.attr("fontfamily"));
        } else {
            fontfamily = 3;
            obj.attr("fontfamily", fontfamily);
        }
        $(".borerwidthselect").eq(1).find("li").removeClass("on").eq(fontfamily).addClass("on");
        $(".borerwidthselect").eq(1).children("p").find("span").remove().end().prepend($(".borerwidthselect").eq(1).find("ul li").eq(fontfamily).find("span").clone());
        //设置
        $(".borerwidthselect ul li").on("click", function() {
            $(this).parents(".borerwidthselect").removeClass("on").find("i").removeClass("on").parent().removeClass("on").end().end().end().addClass("on").siblings().removeClass("on");
            $(this).parent().siblings("p").find("span").remove().end().prepend($(this).children().clone());
            var index = $(".formInputEdit .borerwidthselect").index($(this).parents(".borerwidthselect"));
            if (index == 0) { //边框宽度
                var arr = [0, 1, 2, 4, 6, 8, 10];
                obj.find(".wqd-form-element").children().css({
                    "border-width": arr[$(this).index()] + "px",
                    "border-style": "solid"
                });
                obj.attr("borderwidth", $(this).index());
            } else if (index = 1) { //文字细节
                var arrfontfamily = ["宋体", "新宋体", "黑体", "微软雅黑", "Arial", "Verdana"];
                obj.find(".wqd-form-element").children().css({
                    "font-family": arrfontfamily[$(this).index()]
                });
                obj.attr("fontfamily", $(this).index());
            }
            $(document).trigger('appSetCatch');
        });
        //字号，加粗，斜体
        //获取字号
        $(".formInputEdit .style input").val(parseInt(obj.find(".wqd-form-element").children().css("font-size")));
        //获取字体加粗
        if (obj.find(".wqd-form-element").children().css("font-weight") == 400) {
            $(".formInputEdit .style strong").removeClass("on");
        } else {
            $(".formInputEdit .style strong").addClass("on");
        }
        //设置
        $(".formInputEdit .style strong").on("click", function() {
            if ($(this).hasClass("on")) {
                obj.find(".wqd-form-element").children().css("font-weight", 400);
            } else {
                obj.find(".wqd-form-element").children().css("font-weight", "bold");
            }
            $(this).toggleClass("on");
            $(document).trigger('appSetCatch');
        });
        //获取是否斜体
        if (obj.find(".wqd-form-element").children().css("font-style") == "normal") {
            $(".formInputEdit .style em").removeClass("on");
        } else {
            $(".formInputEdit .style em").addClass("on");
        }
        //设置
        $(".formInputEdit .style em").on("click", function() {
            if ($(this).hasClass("on")) {
                $(this).removeClass("on");
                obj.find(".wqd-form-element").children().css("font-style", "normal");
            } else {
                $(this).addClass("on");
                obj.find(".wqd-form-element").children().css("font-style", "italic");
            }
            $(document).trigger('appSetCatch');
        });
    }
    popupFormEdit.formCheckboxInit = function(node) {
        this.commonInit();
        var obj = node.element;

        //表单选择项设置__基础__选择标题
        //初始化__获取文字
        var wqdformtitle;
        if (obj.attr("wqdformtitle")) {
            wqdformtitle = obj.attr("wqdformtitle");
        } else {
            if (obj.attr("data-elementtype") == "formRadio") {
                wqdformtitle = "单选";
            } else {
                wqdformtitle = "多选";
            }
        }
        $(".formCheckboxEdit .submit").val(wqdformtitle);
        //设置文字
        $(".formCheckboxEdit .submit").on("input propertychange", function() {
            //obj.attr("wqdformtitle", $(this).val());
            //$("[elementid=" + obj.attr("elementid") + "]").attr("wqdformtitle", $(this).val());
            //$("[name=" + obj.find('input').attr("name")+"]").parents('.wqdelementEdit').eq(0).attr("wqdformtitle", $(this).val());
            var _this=$(this);
            $("[name=" + obj.find('input').attr("name")+"]").each(function(n,ele){
                $(this).parents('.wqdelementEdit').eq(0).attr("wqdformtitle", _this.val());
            });

            $(document).trigger('appSetCatch');
        });
        //表单选择项设置__基础__选择项目
        var length;
        if (obj.find("input").attr("name")) {
            length = $(".wqd-carouseOverlay").find("input[name=" + obj.find("input").attr("name") + "]").length;
        } else {
            length = 1;
            obj.find("input").attr("name", obj.attr("elementid"));
            $(document).trigger('appSetCatch');
        };
        if(obj.attr('data-elementtype')=='formRadio'){
            for (var i = 0; i < length; i++) {
                (function(n) {
                    if ($(".wqd-carouseOverlay input[name=" + obj.find('input').attr("name") + "]").eq(n).prev('i').hasClass("on")) {
                        $(".formCheckboxEdit .edit_caselist").append($("<li ziji='" + $(".wqd-carouseOverlay input[name=" + obj.find('input').attr("name")).eq(n).parents('.wqdelementEdit').attr('id') + "'><label class='edit_radioorno'><i class='radio on'></i></label><input type='text' rel='" + obj.attr('id') + "'  value='" + $("input[name=" + obj.find('input').attr("name") + "]").eq(n).next("label").html() + "'><span class='addlist_li'></span><span class='removelist_li'></span></li></li>"));
                    } else {
                        $(".formCheckboxEdit .edit_caselist").append($("<li ziji='" + $(".wqd-carouseOverlay input[name=" + obj.find('input').attr("name")).eq(n).parents('.wqdelementEdit').attr('id') + "'><label class='edit_radioorno'><i class='radio'></i></label><input type='text' rel='" + obj.attr('id') + "' value='" + $("input[name=" + obj.find('input').attr("name") + "]").eq(n).next("label").html() + "'><span class='addlist_li'></span><span class='removelist_li'></span></li>"));
                    }
                })(i);
            }
        }else if(obj.attr('data-elementtype')=='formCheckbox'){
            for (var i = 0; i < length; i++) {
                (function(n) {
                    if ($(".wqd-carouseOverlay input[name=" + obj.find('input').attr("name") + "]").eq(n).prev('i').hasClass("on")) {
                        $(".formCheckboxEdit .edit_caselist").append($("<li ziji='" + $(".wqd-carouseOverlay input[name=" + obj.find('input').attr("name")).eq(n).parents('.wqdelementEdit').attr('id') + "'><label class='edit_radioorno'><i class='radio checkbox on'></i></label><input type='text' rel='" + obj.attr('id') + "'  value='" + $("input[name=" + obj.find('input').attr("name") + "]").eq(n).next("label").html() + "'><span class='addlist_li'></span><span class='removelist_li'></span></li></li>"));
                    } else {
                        $(".formCheckboxEdit .edit_caselist").append($("<li ziji='" + $(".wqd-carouseOverlay input[name=" + obj.find('input').attr("name")).eq(n).parents('.wqdelementEdit').attr('id') + "'><label class='edit_radioorno'><i class='radio checkbox'></i></label><input type='text' rel='" + obj.attr('id') + "' value='" + $("input[name=" + obj.find('input').attr("name") + "]").eq(n).next("label").html() + "'><span class='addlist_li'></span><span class='removelist_li'></span></li>"));
                    }
                })(i);
            }
        }
        //第一个选项不可删除
        $(".formCheckboxEdit .edit_caselist li:first").find(".removelist_li").remove();
        //选项文字输入
        $(".formCheckboxEdit").on("input propertychange", ".edit_caselist input", function() {
            var id = $(this).parents('li').attr('ziji');
            $(".wqd-carouseOverlay").find("#" + id).find("label").html($(this).val());
            $(document).trigger('appSetCatch');
        });
        //选项删除
        $(".formCheckboxEdit").on("click", ".edit_caselist li .removelist_li", function() {
            $(".wqd-carouseOverlay").find('div#' + $(this).parents('li').attr('ziji')).remove();
            $(this).parent().remove();
            utility.removeElmStyle($(this).parent().attr("ziji"));
            $(document).trigger('appSetCatch');
        });
        //选项添加
        $(".formCheckboxEdit ").on("click", ".edit_caselist li .addlist_li", function() {
            var elementid = utility.creatID('elementId'),
                thisId = $(this).parent("li").attr("ziji") || "",
                clone = $(".wqd-carouseOverlay #"+thisId).clone(true),
                clone_ = $(this).parent().clone(true);
            if(!clone_.find(".removelist_li").length) clone_.append("<span class='removelist_li'></span>");
            $(this).parents(".edit_caselist").append(clone_.attr('ziji', elementid).find("i").removeClass("on").end());
            clone.find('i').removeClass('on').end().find('input').removeAttr('checked');
            var name=obj.find('input').attr('name');
            //obj.find('input[name='+name+']').eq($(this).index($(this).parents('.edit_caselist').find('.addlist_li'))).after(clone.attr('elementid', elementid).attr('id', elementid));
            var index=$(this).parents('.edit_caselist').find('.addlist_li').index($(this));
            var thisDom = $(".wqd-carouseOverlay .wqd-form.wqdControlForm").find('input[name='+name+']').eq(index).parents('.wqdelementEdit').eq(0);
            var maxTop = 0;
            $(".wqd-carouseOverlay .wqd-form.wqdControlForm").find('input[name='+name+']').each(function() {
                var nowTop = $(this).parents(".wqdelementEdit").eq(0).position().top;
                if(nowTop > maxTop) maxTop = nowTop;
            });
           $(".wqd-carouseOverlay .wqd-form.wqdControlForm").append(clone.attr('elementid', elementid).attr('id', elementid).css("top",maxTop+thisDom.height()));
            $(document).trigger("appSetCatch");
        });
        //默认选项
        $(".formCheckboxEdit ").on("click", ".edit_caselist li .radio", function() {
            var v = $(this).parents('li').attr('ziji'),
                box=$('.wqd-carouseOverlay .wqd-form.wqdControlForm');
            if (obj.attr("data-elementtype") == 'formRadio') {
                if ($(this).hasClass("on")) {
                    box.find('#' + v).find("input").removeAttr('checked').siblings("i").removeClass('on');
                }else{
                    $(this).parents('.edit_caselist').find("i.on").removeClass("on");
                    box.find(".formRadio i.on").removeClass("on").siblings("input").removeAttr("checked");
                    box.find('#' + v).find("input").attr('checked',true).siblings("i").addClass('on');
                }
                $(this).toggleClass("on");
            } else if (obj.attr("data-elementtype") == 'formCheckbox') {
                if ($(this).hasClass("on")) {
                    box.find('#' + v).find('input').removeAttr('checked').siblings("i").removeClass('on');
                } else {
                    box.find('#' + v).find('input').attr('checked',true).siblings("i").addClass('on');
                }
                $(this).toggleClass("on");
            } else {
                $(this).parent().after($(this).parent().clone().append("<span class='removelist_li'></span>").find("i").removeClass("on").end());
            }
            $(document).trigger("appSetCatch");
        });
        //表单选择项设置__基础__选项文字
        var txtcol;
        if (obj.attr("txtcol")) {
            txtcol = obj.attr("txtcol");
        } else {
            txtcol = obj.find("label").css("color");
        }
        $(".formCheckboxEdit .colorval").eq(0).attr("value", txtcol).siblings(".colordeviceBg").find(".colordevice").css("background-color", txtcol);
        //设置颜色
        $(".wqdColorPicker").on("changeColor", function() {
            var colorVal = $(this).val();
            $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
            obj.attr("txtcol", colorVal);
            //$("[elementid=" + obj.attr("elementid") + "]").find("label").css("color", colorVal);
            $('[name='+obj.find('input').attr('name')+']').each(function(n,ele){
                createColorStyle.styleInit($(ele).parents(".wqdelementEdit").attr('id'), "label", {
                    'color': colorVal
                });
            });

            $(document).trigger('appSetCatch');
        });
        //表单选择项设置__其他__项目文字
        /*模拟下拉列表*/
        $(".formCheckboxEdit .borerwidthselect p").on("click", function(e) {
            if ($(this).hasClass("readonly")) return false;
            if ($(this).parent().hasClass("on")) {
                $(this).removeClass("on").parent().removeClass("on").find("i").removeClass("on");
            } else {
                $(this).addClass("on").parent().addClass("on").find("i").addClass("on");
            }
            e.preventDefault();
        });
        //获取
        var fontfamily;
        if (obj.attr("fontfamily")) {
            fontfamily = parseInt(obj.attr("fontfamily"));
        } else {
            fontfamily = 3;
            obj.attr("fontfamily", fontfamily);
        }
        $(".formCheckboxEdit .borerwidthselect").find("li").removeClass("on").eq(fontfamily).addClass("on");
        $(".formCheckboxEdit .borerwidthselect").children("p").find("span").remove().end().prepend($(".borerwidthselect").find("ul li").eq(fontfamily).find("span").clone());
        //设置
        $(".formCheckboxEdit .borerwidthselect ul li").on("click", function() {
            $(this).parents(".borerwidthselect").removeClass("on").find("i").removeClass("on").parent().removeClass("on").end().end().end().addClass("on").siblings().removeClass("on");
            $(this).parent().siblings("p").find("span").remove().end().prepend($(this).children().clone());
            //文字细节
            var arrfontfamily = ["宋体", "新宋体", "黑体", "微软雅黑", "Arial", "Verdana"];
            $("[name=" + obj.find('[type]').attr("name") + "]").parent().find("label").css({
                "font-family": arrfontfamily[$(this).index()]
            });
            obj.attr("fontfamily", $(this).index());
            $(document).trigger('appSetCatch');
        });
        //字号，加粗，斜体
        //获取字号
        $(".formCheckboxEdit .style input").val(parseInt(obj.find("label").css("font-size")));
        //设置
        $(".formCheckboxEdit .style input").on("input propertychange", function() {
            var font_size = parseInt($(this).val());
            //$("[elementid=" + obj.attr("elementid") + "]").find("label").css("font-size", font_size);
            $("[name=" + obj.find('[type]').attr("name") + "]").parent().find("label").css("font-size", font_size);
            $(document).trigger('appSetCatch');
        });
        //获取字体加粗
        if (obj.find("label").css("font-weight") == 400) {
            $(".formCheckboxEdit .style strong").removeClass("on");
        } else {
            $(".formCheckboxEdit .style strong").addClass("on");
        }
        //设置
        $(".formCheckboxEdit .style strong").on("click", function() {
            if ($(this).hasClass("on")) {
                //$("[elementid=" + obj.attr("elementid") + "]").find("label").css("font-weight", 400);
                $("[name=" + obj.find('[type]').attr("name") + "]").parent().find("label").css("font-weight", 400);
            } else {
                //$("[elementid=" + obj.attr("elementid") + "]").find("label").css("font-weight", "bold");
                $("[name=" + obj.find('[type]').attr("name") + "]").parent().find("label").css("font-weight", "bold");
            }
            $(this).toggleClass("on");
            $(document).trigger('appSetCatch');
        });
        //获取是否斜体
        if (obj.find("label").css("font-style") == "normal") {
            $(".formCheckboxEdit .style em").removeClass("on");

        } else {
            $(".formCheckboxEdit .style em").addClass("on");
        }
        //设置
        $(".formCheckboxEdit .style em").on("click", function() {
            if ($(this).hasClass("on")) {
                $(this).removeClass("on");
                $("[name=" + obj.find('[type]').attr("name") + "]").parent().find("label").css("font-style", "normal");
               // $("[elementid=" + obj.attr("elementid") + "]").find("label").css("font-style", "normal");
            } else {
                $(this).addClass("on");
                $("[name=" + obj.find('[type]').attr("name") + "]").parent().find("label").css("font-style", "italic");
                //$("[elementid=" + obj.attr("elementid") + "]").find("label").css("font-style", "italic");
            }
            $(document).trigger('appSetCatch');
        });
    }
    popupFormEdit.formSelectInit = function() {
        this.commonInit();
        var obj = window.edit;
        //初始化__获取文字
        var wqdformtitle = obj.attr("wqdformtitle") || "学历";
        $(".formSelectEdit .submit").val(wqdformtitle);
        //设置文字
        $(".formSelectEdit .submit").on("input propertychange", function() {
            obj.attr("wqdformtitle", $(this).val());
            $(document).trigger('appSetCatch');
        });
        //表单下拉框设置__基础__选择项目
        var index;
        if (obj.attr("index")) {
            index = parseInt(obj.attr("index"));
        } else {
            index = 0;
        }
        var list = obj.find("ul li").length;
        for (var i = 0; i < list; i++) {
            (function(n) {
                if (n == index) {
                    $(".formSelectEdit .edit_caselist").append($("<li><label class='edit_radioorno'><i class='radio on'></i></label><input type='text' value='" + obj.find("ul li").eq(n).find("span").html() + "'><span class='addlist_li'></span></li>"));
                } else {
                    $(".formSelectEdit .edit_caselist").append($("<li><label class='edit_radioorno'><i class='radio'></i></label><input type='text' value='" + obj.find("ul li").eq(n).find("span").html() + "'><span class='addlist_li'></span><span class='removelist_li'></span></li>"));
                }
            })(i);
        }
        //选项文字输入
        $(".formSelectEdit").on("input propertychange", ".edit_caselist input", function() {
            if($(this).siblings("label").find("i").hasClass("on")){
                obj.find("p span").text($(this).val());
            }
            var n = $(".edit_caselist input").index($(this));
            obj.find("ul li").eq(n).find("span").html($(this).val());
            $(document).trigger('appSetCatch');
        });
        //选项删除
        $(".formSelectEdit").on("click", ".edit_caselist li .removelist_li", function() {
            $(this).parent().remove();
            obj.find("ul li").eq($(this).parent().index()).remove();
            utility.removeElmStyle($(this).parent().attr("ziji"));
            $(document).trigger('appSetCatch');
        });
        //选项添加
        $(".formSelectEdit ").on("click", ".edit_caselist li .addlist_li", function() {
            if ($(this).parent().find(".removelist_li").length) {
                $(this).parent().after($(this).parent().clone());
            } else {
                $(this).parent().after($(this).parent().clone().append("<span class='removelist_li'></span>").find("i").removeClass("on").end());
            }
            obj.find("ul li").eq($(this).parent().index()).after(obj.find("ul li").eq($(this).parent().index()).clone().removeClass("on"));
            $(document).trigger('appSetCatch');
        });
        //默认选项设置
        $(".formSelectEdit ").on("click", ".edit_caselist li .radio", function() {
            if($(this).hasClass("on")) return;
            var index = $(this).parents("li").index();
            obj.find("p span").text($(this).parent().siblings("input").val());
            $(this).addClass("on").parents("li").siblings("li").find(".radio").removeClass("on");
            obj.find(".formSelect ul li").eq(index).addClass("on").siblings("li").removeClass("on");
            $(document).trigger("appSetCatch");
        });
        //表单下拉框设置__基础__选项文字
        var txtcol;
        if (obj.attr("txtcol")) {
            txtcol = obj.attr("txtcol");
        } else {
            txtcol = obj.find("ul li").css("color");
        }
        $(".formSelectEdit .colorval").eq(0).attr("value", txtcol).siblings(".colordeviceBg").find(".colordevice").css("background-color", txtcol);
        //初始化__边框颜色
        var bordercol;
        if (obj.find("p").attr("bordercol")) {
            bordercol = obj.find("p").attr("bordercol");
        } else {
            bordercol = obj.find("p").css("border-color");
        }
        $(".formSelectEdit .colorval").eq(1).attr("value", bordercol).siblings(".colordeviceBg").find(".colordevice").css("background-color", bordercol);
        //设置颜色
        $(".wqdColorPicker").on("changeColor", function() {
            var colorVal = $(this).val();
            $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
            var index = $(".wqdEditBox.formSelectEdit .wqdColorPicker").index($(this));
            if (index == "0") { //文字颜色
                obj.find("ul li").css("color", colorVal).end().attr("txtcol", colorVal);
                obj.find("p span").css("color", colorVal);
                createColorStyle.styleInit(obj.attr("id"), "p span", {
                    'color': colorVal
                });
            } else if (index == "1") { //边框颜色
                obj.find("p").css("border-color", colorVal).attr("bordercol", colorVal);
            }
            $(document).trigger('appSetCatch');
        });
        //表单下拉框设置__其他__边框宽度
        /*模拟下拉列表*/
        $(".formSelectEdit .borerwidthselect p").on("click", function(e) {
            if ($(this).hasClass("readonly")) return false;
            if ($(this).parent().hasClass("on")) {
                $(this).removeClass("on").parent().removeClass("on").find("i").removeClass("on");
            } else {
                $(this).addClass("on").parent().addClass("on").find("i").addClass("on");
            }
            e.preventDefault();
        });
        //获取
        var borderwidth;
        if (obj.attr("borderwidth")) {
            borderwidth = parseInt(obj.attr("borderwidth"));
        } else {
            borderwidth = 1;
            obj.attr("borderwidth", borderwidth);
        }
        $(".formSelectEdit .borerwidthselect").eq(0).find("li").removeClass("on").eq(borderwidth).addClass("on");
        $(".formSelectEdit .borerwidthselect").eq(0).children("p").find("span").remove().end().prepend($(".borerwidthselect").eq(0).find("ul li").eq(borderwidth).find("span").clone());
        //表单下拉框设置__其他__项目文字
        //获取
        var fontfamily;
        if (obj.attr("fontfamily")) {
            fontfamily = parseInt(obj.attr("fontfamily"));
        } else {
            fontfamily = 3;
            obj.attr("fontfamily", fontfamily);
        }
        $(".formSelectEdit .borerwidthselect").eq(1).find("li").removeClass("on").eq(fontfamily).addClass("on");
        $(".formSelectEdit .borerwidthselect").eq(1).children("p").find("span").remove().end().prepend($(".borerwidthselect").eq(1).find("ul li").eq(fontfamily).find("span").clone());
        //设置
        $(".formSelectEdit .borerwidthselect ul li").on("click", function() {
            $(this).parents(".borerwidthselect").removeClass("on").find("i").removeClass("on").parent().removeClass("on").end().end().end().addClass("on").siblings().removeClass("on");
            $(this).parent().siblings("p").find("span").remove().end().prepend($(this).children().clone());
            var index = $(".formSelectEdit .borerwidthselect").index($(this).parents(".borerwidthselect"));
            if (index == 0) { //边框宽度
                var arr = [0, 1, 2, 4, 6, 8, 10];
                obj.find("p").css({
                    "border-width": arr[$(this).index()] + "px",
                    "border-style": "solid"
                });
                obj.find("p i").css({
                    // "height":(obj.height()-arr[$(this).index()]) + "px",
                    //"top":arr[$(this).index()] + "px",
                    "right":arr[$(this).index()] + "px"
                });
                obj.attr("borderwidth", $(this).index());
            } else if (index = 1) { //文字细节
                var arrfontfamily = ["宋体", "新宋体", "黑体", "微软雅黑", "Arial", "Verdana"];
                obj.find("ul li").css({
                    "font-family": arrfontfamily[$(this).index()]
                });
                obj.find("p span").css({
                    "font-family": arrfontfamily[$(this).index()]
                });
                obj.attr("fontfamily", $(this).index());
            }
            $(document).trigger('appSetCatch');
        });
        //字号，加粗，斜体
        //获取字号
        $(".formSelectEdit .style input").val(parseInt(obj.find("ul li").css("font-size")));
        //设置
        $(".formSelectEdit .style input").on("input propertychange", function() {
            var font_size = parseInt($(this).val());
            obj.find("ul li").css("font-size", font_size);
            obj.find("p span").css("font-size", font_size);
            $(document).trigger('appSetCatch');
        });
        //获取字体加粗
        if (obj.find("ul li").children().css("font-weight") == 400) {
            $(".formSelectEdit .style strong").removeClass("on");
        } else {
            $(".formSelectEdit .style strong").addClass("on");
        }
        //设置
        $(".formSelectEdit .style strong").on("click", function() {
            if ($(this).hasClass("on")) {
                obj.find("ul li").css("font-weight", 400);
                obj.find("p span").css("font-weight", 400);
            } else {
                obj.find("ul li").css("font-weight", "bold");
                obj.find("p span").css("font-weight", "bold");
            }
            $(this).toggleClass("on");
            $(document).trigger('appSetCatch');
        });
        //获取是否斜体
        if (obj.find("ul li").css("font-style") == "normal") {
            $(".formSelectEdit .style em").removeClass("on");
        } else {
            $(".formSelectEdit .style em").addClass("on");
        }
        //设置
        $(".formSelectEdit .style em").on("click", function() {
            if ($(this).hasClass("on")) {
                $(this).removeClass("on");
                obj.find("ul li").css("font-style", "normal");
                obj.find("p span").css("font-style", "normal");
            } else {
                $(this).addClass("on");
                obj.find("ul li").css("font-style", "italic");
                obj.find("p span").css("font-style", "italic");
            }
            $(document).trigger('appSetCatch');
        });
    }
    popupFormEdit.formDateInit = function() {
        this.commonInit();
        var obj = window.edit;
        //表单日历设置__基础__选择标题
        //初始化__获取文字
        var wqdformtitle;
        if (obj.attr("wqdformtitle")) {
            wqdformtitle = obj.attr("wqdformtitle");
        } else {
            wqdformtitle = "日期";
        }
        obj.find("input").attr("placeholder", wqdformtitle);
        $(".formDateEdit .submit").val(wqdformtitle);
        //设置文字
        $(".formDateEdit .submit").on("input propertychange", function() {
            obj.attr("wqdformtitle", $(this).val());
            obj.find("input").attr("placeholder", $(this).val());
            $(document).trigger('appSetCatch');
        });
        //表单日历设置__基础__选项文字
        //obj.atrr("wqdFormDate","");
        var txtcol;
        if (obj.attr("txtcol")) {
            txtcol = obj.attr("txtcol");
        } else {
            txtcol = obj.find(".wqdControlFormEl6>input").css("color");
        }
        $(".formDateEdit .colorval").eq(0).attr("value", txtcol).siblings(".colordeviceBg").find(".colordevice").css("background-color", txtcol);
        //初始化__边框颜色
        var bordercol;
        if (obj.attr("bordercol")) {
            bordercol = obj.attr("bordercol");
        } else {
            bordercol = obj.find(".wqdControlFormEl6>input").css("border-color");
        }
        $(".formDateEdit .colorval").eq(1).attr("value", bordercol).siblings(".colordeviceBg").find(".colordevice").css("background-color", bordercol);
        //设置颜色
        $(".wqdColorPicker").on("changeColor", function() {
            var colorVal = $(this).val();
            $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
            var index = $(".wqdEditBox.formDateEdit .wqdColorPicker").index($(this));
            if (index == "0") { //文字颜色
                obj.find(".wqdControlFormEl6>input").css("color", colorVal).end().attr("txtcol", colorVal);
            } else if (index == "1") { //边框颜色
                obj.find(".wqdControlFormEl6>input").css("border-color", colorVal).end().attr("bordercol", colorVal);
            }
            $(document).trigger('appSetCatch');
        });
        //表单日历设置__其他__边框宽度
        /*模拟下拉列表*/
        $(".formDateEdit .borerwidthselect p").on("click", function(e) {
            if ($(this).hasClass("readonly")) return false;
            if ($(this).parent().hasClass("on")) {
                $(this).removeClass("on").parent().removeClass("on").find("i").removeClass("on");
            } else {
                $(this).addClass("on").parent().addClass("on").find("i").addClass("on");
            }
            e.preventDefault();
        });
        //获取
        var borderwidth;
        if (obj.attr("borderwidth")) {
            borderwidth = parseInt(obj.attr("borderwidth"));
        } else {
            borderwidth = 1;
            obj.attr("borderwidth", borderwidth);
        }
        $(".formDateEdit .borerwidthselect").eq(0).find("li").removeClass("on").eq(borderwidth).addClass("on");
        $(".formDateEdit .borerwidthselect").eq(0).children("p").find("span").remove().end().prepend($(".borerwidthselect").eq(0).find("ul li").eq(borderwidth).find("span").clone());
        //表单日历设置__其他__项目文字
        //获取
        var fontfamily;
        if (obj.attr("fontfamily")) {
            fontfamily = parseInt(obj.attr("fontfamily"));
        } else {
            fontfamily = 3;
            obj.attr("fontfamily", fontfamily);
        }
        $(".formDateEdit .borerwidthselect").eq(1).find("li").removeClass("on").eq(fontfamily).addClass("on");
        $(".formDateEdit .borerwidthselect").eq(1).children("p").find("span").remove().end().prepend($(".borerwidthselect").eq(1).find("ul li").eq(fontfamily).find("span").clone());
        //设置
        $(".formDateEdit .borerwidthselect ul li").on("click", function() {
            $(this).parents(".borerwidthselect").removeClass("on").find("i").removeClass("on").parent().removeClass("on").end().end().end().addClass("on").siblings().removeClass("on");
            $(this).parent().siblings("p").find("span").remove().end().prepend($(this).children().clone());
            var index = $(".formDateEdit .borerwidthselect").index($(this).parents(".borerwidthselect"));
            if (index == 0) { //边框宽度
                var arr = [0, 1, 2, 4, 6, 8, 10];
                obj.find(".wqdControlFormEl6>input").css({
                    "border-width": arr[$(this).index()] + "px",
                    "border-style": "solid"
                });
                obj.attr("borderwidth", $(this).index());
            } else if (index == 1) { //文字细节
                var arrfontfamily = ["宋体", "新宋体", "黑体", "微软雅黑", "Arial", "Verdana"];
                obj.find(".wqdControlFormEl6>input").css({
                    "font-family": arrfontfamily[$(this).index()]
                });
                obj.attr("fontfamily", $(this).index());
            }
            $(document).trigger('appSetCatch');
        });
        //字号，加粗，斜体
        //获取字号
        $(".formDateEdit .style input").val(parseInt(obj.find(".wqdControlFormEl6>input").css("font-size")));
        //设置
        $(".formDateEdit .style input").on("input propertychange", function() {
            var font_size = parseInt($(this).val());
            obj.find(".wqdControlFormEl6>input").css("font-size", font_size);
            $(document).trigger('appSetCatch');
        });
        //获取字体加粗
        if (obj.find(".wqdControlFormEl6>input").css("font-weight") == 400) {
            $(".formDateEdit .style strong").removeClass("on");
        } else {
            $(".formDateEdit .style strong").addClass("on");
        }
        //设置
        $(".formDateEdit .style strong").on("click", function() {
            if ($(this).hasClass("on")) {
                obj.find(".wqdControlFormEl6>input").css("font-weight", 400);
            } else {
                obj.find(".wqdControlFormEl6>input").css("font-weight", "bold");
            }
            $(this).toggleClass("on");
            $(document).trigger('appSetCatch');
        });
        //获取是否斜体
        if (obj.find(".wqdControlFormEl6>input").css("font-style") == "normal") {
            $(".formDateEdit .style em").removeClass("on");
        } else {
            $(".formDateEdit .style em").addClass("on");
        }
        //设置
        $(".formDateEdit .style em").on("click", function() {
            if ($(this).hasClass("on")) {
                $(this).removeClass("on");
                obj.find(".wqdControlFormEl6>input").css("font-style", "normal");
            } else {
                $(this).addClass("on");
                obj.find(".wqdControlFormEl6>input").css("font-style", "italic");
            }
            $(document).trigger('appSetCatch');
        });
    }
    popupFormEdit.formButtonInit = function() {
        this.commonInit();
        var obj = window.edit;
        /*表单按钮设置--基础--按钮文字*/
        //获取
        $(".formButtonEdit  .edit_unitbox>input.submit").val(obj.find("a.wqd-button em").text().replace(/&nbsp;/g, " "));
        //修改
        $(".formButtonEdit .edit_unitbox>input.submit").on("input propertychange", function() {
            obj.find("a.wqd-button em").html($(this).val().replace(/\s/g, "&nbsp;"));
            $(document).trigger('appSetCatch');
        });
        //表单按钮设置__基础__选项文字
        var txtcol;
        if (obj.attr("txtcol")) {
            txtcol = obj.attr("txtcol");
        } else {
            txtcol = obj.find("a").css("color");
            obj.attr("txtcol", txtcol);
        }
        $(".formButtonEdit .colorval").eq(0).attr("value", txtcol).siblings(".colordeviceBg").find(".colordevice").css("background-color", txtcol);
        //初始化__按钮背景颜色
        var backcol;
        if (obj.attr("backcol")) {
            backcol = obj.attr("backcol");
        } else {
            backcol = obj.find("a").css("background-color");
            obj.attr("backcol", backcol);
        }
        $(".formButtonEdit .colorval").eq(1).attr("value", backcol).siblings(".colordeviceBg").find(".colordevice").css("background-color", backcol);
        //初始化__边框颜色
        var bordercol;
        if (obj.attr("bordercol")) {
            bordercol = obj.attr("bordercol");
        } else {
            bordercol = obj.find("a").css("border-color");
            obj.attr("bordercol", bordercol);
        }
        $(".formButtonEdit .colorval").eq(2).attr("value", bordercol).siblings(".colordeviceBg").find(".colordevice").css("background-color", bordercol);
        //表单按钮悬浮设置__基础__选项文字
        var hovtxtcol;
        if (obj.attr("hovtxtcol")) {
            hovtxtcol = obj.attr("hovtxtcol");
        } else {
            hovtxtcol = obj.find("a").css("color");
        }
        $(".formButtonEdit .colorval").eq(3).attr("value", hovtxtcol).siblings(".colordeviceBg").find(".colordevice").css("background-color", hovtxtcol);
        //初始化__按钮背景颜色
        var hovbackcol;
        if (obj.attr("hovbackcol")) {
            hovbackcol = obj.attr("hovbackcol");
        } else {
            hovbackcol = obj.find("a").css("background-color");
        }
        $(".formButtonEdit .colorval").eq(4).attr("value", hovbackcol).siblings(".colordeviceBg").find(".colordevice").css("background-color", hovbackcol);
        //初始化__边框颜色
        var hovbordercol;
        if (obj.attr("hovbordercol")) {
            hovbordercol = obj.attr("hovbordercol");
        } else {
            hovbordercol = obj.find("a").css("border-color");
        }
        $(".formButtonEdit .colorval").eq(5).attr("value", hovbordercol).siblings(".colordeviceBg").find(".colordevice").css("background-color", hovbordercol);
        //设置颜色
        $(".wqdColorPicker").on("changeColor", function() {
            var colorVal = $(this).val();
            $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);

            var index;
            if($(".wqdEditBox.formButtonEdit .wqdColorPicker").length) {
                index = $(".wqdEditBox.formButtonEdit .wqdColorPicker").index($(this));
            } else {
                index = $(".wqdEditBox.ButtonEdit .wqdColorPicker").index($(this));
            }
            if (index == "0") { //文字颜色
                obj.attr("txtcol", colorVal);
                createColorStyle.styleInit(obj.attr("id"), "em", {
                    'color': colorVal
                });
            } else if (index == "1") { //背景颜色
                obj.attr("backcol", colorVal);
                createColorStyle.styleInit(obj.attr("id"), "a", {
                    'background-color': colorVal
                });
            } else if (index == "2") { //边框颜色
                obj.attr("bordercol", colorVal);
                createColorStyle.styleInit(obj.attr("id"), "a", {
                    'border-color': colorVal
                });
            } else if (index == "3") { //文字hover颜色
                obj.attr("hovtxtcol", colorVal);
                if($('body').attr('id')!='wqdIphonePage'){
                    createColorStyle.styleInit(obj.attr("id"), ".on:hover", {
                        'color': colorVal
                    });
                }

            } else if (index == "4") { //背景hover颜色
                obj.attr("hovbackcol", colorVal);
                if($('body').attr('id')!='wqdIphonePage'){
                    createColorStyle.styleInit(obj.attr("id"), ".on:hover", {
                        'background-color': colorVal
                    });
                }
            } else if (index == "5") { //边框hover颜色
                obj.attr("hovbordercol", colorVal);
                if($('body').attr('id')!='wqdIphonePage'){
                    createColorStyle.styleInit(obj.attr("id"), ".on:hover", {
                        'border-color': colorVal
                    });
                }
            }
            $(document).trigger('appSetCatch');
        });
        //表单按钮设置__其他__边框宽度
        /*模拟下拉列表*/
        $(".formButtonEdit .borerwidthselect p").on("click", function(e) {
            if ($(this).hasClass("readonly")) return false;
            if ($(this).parent().hasClass("on")) {
                $(this).removeClass("on").parent().removeClass("on").find("i").removeClass("on");
            } else {
                $(this).addClass("on").parent().addClass("on").find("i").addClass("on");
            }
            e.preventDefault();
        });
        //获取
        var borderwidth;
        if (obj.attr("borderwidth")) {
            borderwidth = parseInt(obj.attr("borderwidth"));
        } else {
            borderwidth = 0;
            obj.attr("borderwidth", borderwidth);
        }
        $(".formButtonEdit .borerwidthselect").eq(1).find("li").removeClass("on").eq(borderwidth).addClass("on");
        $(".formButtonEdit .borerwidthselect").eq(1).children("p").find("span").remove().end().prepend($(".borerwidthselect").eq(1).find("ul li").eq(borderwidth).find("span").clone());
        //表单按钮设置__其他__项目文字
        //获取
        var fontfamily;
        if (obj.attr("fontfamily")) {
            fontfamily = parseInt(obj.attr("fontfamily"));
        } else {
            fontfamily = 3;
            obj.attr("fontfamily", fontfamily);
        }
        $(".formButtonEdit .borerwidthselect").eq(0).find("li").removeClass("on").eq(fontfamily).addClass("on");
        $(".formButtonEdit .borerwidthselect").eq(0).children("p").find("span").remove().end().prepend($(".borerwidthselect").eq(0).find("ul li").eq(fontfamily).find("span").clone());
        //设置
        $(".formButtonEdit .borerwidthselect ul li").on("click", function() {
            $(this).parents(".borerwidthselect").removeClass("on").find("i").removeClass("on").parent().removeClass("on").end().end().end().addClass("on").siblings().removeClass("on");
            $(this).parent().siblings("p").find("span").remove().end().prepend($(this).children().clone());
            var index = $(".formButtonEdit .borerwidthselect").index($(this).parents(".borerwidthselect"));
            if (index == 1) { //边框宽度
                var arr = [0, 1, 2, 4, 6, 8, 10];
                obj.find("a").css({
                    "border-width": arr[$(this).index()] + "px",
                    "border-style": "solid"
                });
                obj.attr("borderwidth", $(this).index());
            } else if (index == 0) { //文字细节
                var arrfontfamily = ["宋体", "新宋体", "黑体", "微软雅黑", "Arial", "Verdana"];
                obj.find("a").css({
                    "font-family": arrfontfamily[$(this).index()]
                });
                obj.attr("fontfamily", $(this).index());
            }
            $(document).trigger('appSetCatch');
        });
        //字号，加粗，斜体
        //获取字号
        $(".formButtonEdit .style input").val(parseInt(obj.find("a").css("font-size")));
        //设置
        $(".formButtonEdit .style input").on("input propertychange", function() {
            var font_size = parseInt($(this).val());
            obj.find("a").css("font-size", font_size);
            $(document).trigger('appSetCatch');
        });
        //获取字体加粗
        if (obj.find("a").css("font-weight") == 400) {
            $(".formButtonEdit .style strong").removeClass("on");
        } else {
            $(".formButtonEdit .style strong").addClass("on");
        }
        //设置
        $(".formButtonEdit .style strong").on("click", function() {
            if ($(this).hasClass("on")) {
                obj.find("a").css("font-weight", 400);
            } else {
                obj.find("a").css("font-weight", "bold");
            }
            $(this).toggleClass("on");
            $(document).trigger('appSetCatch');
        });
        //获取是否斜体
        if (obj.find("a em").css("font-style") == "normal") {
            $(".formButtonEdit .style em").removeClass("on");
        } else {
            $(".formButtonEdit .style em").addClass("on");
        }
        //设置
        $(".formButtonEdit .style em").on("click", function() {
            if ($(this).hasClass("on")) {
                $(this).removeClass("on");
                obj.find("a em").css("font-style", "normal");
            } else {
                $(this).addClass("on");
                obj.find("a em").css("font-style", "italic");
            }
            $(document).trigger('appSetCatch');
        });
        //悬浮效果
        if($("#wqdIphoneContainer").length){
            $(".formButtonEdit .on_off").parent(".edit_unitbox").hide();
            $(".formButtonEdit .martb10").hide();
        }else{
            var wqdon;
            if (obj.attr("wqdon")) {
                wqdon = obj.attr("wqdon");
            } else {
                wqdon = "false";
                obj.attr("wqdon", "false");
            }
            if (wqdon == "false") {
                $(".formButtonEdit .on_off").removeClass("on");
                $(".formButtonEdit .martb10").hide();
                obj.find("a").removeClass("on");
            } else if (wqdon == "true") {
                $(".formButtonEdit .on_off").addClass("on");
                $(".formButtonEdit .martb10").show();
                obj.find("a").addClass("on");
            }
        }
        $(".wqdEditBox.formButtonEdit .edit_unitbox>div.on_off").on("click", function() {
            if ($(this).hasClass("on")) {
                $(this).removeClass("on");
                obj.attr("wqdon", "false");
                obj.find("a").removeClass("on");
                $(this).parents(".edit_unitbox").siblings(".wqdEditBox.formButtonEdit .martb10").hide();
            } else {
                $(this).addClass("on");
                obj.attr("wqdon", "true");
                obj.find("a").addClass("on");
                $(this).parents(".edit_unitbox").siblings(".wqdEditBox.formButtonEdit .martb10").show();
            }
            $(document).trigger('appSetCatch');
        });
        //表单按钮设置--其他--按钮半径
        //获取

        var eleradius;
        if (obj.attr("wqdeleradius")) {
            //设置 borderRadius 的n-1问题

            eleradius = Math.round(parseFloat(obj.attr("wqdeleradius")));
            eleradius>50?eleradius=50:eleradius<0?0:eleradius;
        } else {
            eleradius = parseInt(obj.find("a").css("borderRadius"));

            //eleradius = parseInt(obj.find("a").css("border-top-left-radius"));
            obj.attr("wqdeleradius", eleradius);
        }
        $(".wqdEditBox.formButtonEdit .slider").css("left", Math.round(eleradius / 50 * 106) + "px");
        $(".wqdEditBox.formButtonEdit .moment").css("width", Math.round(eleradius / 50 * 106) + "px");
        $(".wqdEditBox.formButtonEdit .r_val").val(eleradius);
        //设置
        function callback(n) {
            obj.attr("wqdeleradius", n*5);
            obj.find("a").css("border-radius", n*5+ "px");
            $(document).trigger('appSetCatch');
        }
        rang({
            slider: $(".formButtonEdit .edit_unitbox>div.scale .slider").eq(0),
            obj: obj,
            maxval: 50,
            type: "borderwidth",
            callback: callback
        });
    }
    return popupFormEdit;
});
