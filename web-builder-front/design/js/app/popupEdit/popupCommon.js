define(['popupDrag', 'createColorStyle', 'utility', 'elementInfo', 'popupImgEdit'], function(popupDrag, createColorStyle, utility, elementInfo, popupImgEdit) {
    var popupCommon = {};
    popupCommon.funs = {
        //拉伸背景高度时候 通屏轮播图实时设置
        setFulllunbo: function(section) {
            if (section.hasClass('fullscreen')) {
                section.find('[data-elementtype=carouse]').height('100%');
            }
        },
        /////////////////拖拽函数///////////////////////////////
        rang: function(json) {
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
                            if (_obj.find(".wqd-button").attr("wqdbtnborder") == "false") {
                                _obj.find(".wqd-button").css({
                                    "border-radius": val + "px"
                                });
                                _obj.attr("wqdborderradius", val);
                            }
                            $(document).trigger('appSetCatch');
                        } else if (_type == "borderwidth") {
                            json.callback && json.callback(val);
                        }
                    }
                    _this.css({
                        "left": val * maxwidth / maxval
                    }).siblings(".moment").css({
                        "width": val * maxwidth / maxval
                    });
                    if (val >= maxval) {
                        $(this).val(val);
                        _this.css({
                            "left": maxwidth
                        }).siblings(".moment").css({
                            "width": maxwidth
                        });
                    } else if (val < 0) {
                        val = 0;
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
                    $(this).off("blur").on("blur", typeFn);
                    $(this).val(val);
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
                if (keyval == 38 || keyval == 40) {
                    switch (keyval) {
                        case 38:
                            key_val++;
                            break;
                        case 40:
                            key_val--;
                            if (key_val < 0) key_val = 0;
                            break;
                        default:
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
                            json.callback && json.callback(key_val);
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
                            json.callback && json.callback(key_val);
                        }
                    }
                    $(document).trigger('appSetCatch');
                }
            });
        },
        //图片入口函数
        imgEntry: function(curObj, html, oldObj, fn) {
            if ($(this).attr("readonly")) return false;
            window.edit = curObj;
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
                            window.edit = oldObj;
                            //关闭图片资源层，回到原来图层
                            if (window.edit.length) {
                                $.ajax({
                                    url: '../js/app/JSON/designComponentEdit.json',
                                    type: "GET",
                                    dataType: "json",
                                    success: function(json) {
                                        $.colorbox({
                                            transition: "none",
                                            opacity: 0.5,
                                            html: json.edit[html],
                                            fixed: true,
                                            closeButton: false,
                                            onOpen: function() {
                                                window.scroll_top = $(document).scrollTop();
                                            },
                                            onComplete: function() {
                                                popupCommon.commonInit();
                                                fn();
                                                $(document).trigger('appSetCatch');
                                            },
                                            onClosed: function() {
                                                window.scrollTo(0, window.scroll_top);
                                            }
                                        });
                                    }
                                });
                            };
                            // curObj.css({
                            //     "background-size": "cover",
                            //     "background-position": " center center",
                            //     "background-repeat": "no-repeat",
                            //     "background-color": curObj.attr("wqdbgcolor")
                            // }).attr("wqdback_position", 1);
                            curObj.attr("wqdback_position", 1);
                            window.scrollTo(0, window.scroll_top);
                            $(document).trigger('appSetCatch');
                        }
                    });
                }
            });
        },
        //背景图片设置按钮
        bgButton: function(obj, ele) {
            if (ele.hasClass("novisual")) {
                ele.removeClass("novisual").siblings("input.colorval").removeClass("novisual").removeAttr("disabled").addClass("bgimg");
                obj.attr("wqdbgSet", "1");
                var imgsrc = ele.siblings(".colorval").val();
                var reg = /http:\/\/\w+/;
                if (reg.test(imgsrc)) {
                    obj.css("background-image", "url(" + imgsrc + ")");
                }
            } else {
                ele.addClass("novisual").siblings("input.colorval").addClass("novisual").attr("disabled", "disabled").removeClass("bgimg");
                obj.attr("wqdbgSet", "0");
                obj.css("background-image", "");
            }
            $(document).trigger('appSetCatch');
            return false;
        },
        bgPosition: function(obj, ele) {
            var imgSrc = obj.css("background-image");
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
            switch (ele.index() + 1) {
                case 1: //适应
                    obj.css(arrPos[0]);
                    break;
                case 2: //拉伸
                    obj.css(arrPos[1]);
                    break;
                case 3: //平铺
                    obj.css(arrPos[2]);
                    break;
                case 4: //居中
                    obj.css(arrPos[3]);
                    $(".wqdEditBox.backgroundEdit .imagefocuslist>li").each(function() {
                        ele.removeClass("on");
                    });
                    $(".wqdEditBox.backgroundEdit .imagefocuslist>li").eq(4).addClass("on");
                    break;
            }
            ele.parents("[wqdbackposition]").removeClass("on").find("i").removeClass("on").parent().removeClass("on").end().end().end().addClass("on").siblings().removeClass("on");
            ele.parent().siblings("p").find("span").remove().end().prepend(ele.children().clone());
            obj.find("div.active").attr("wqdback_position", ele.index() + 1);
            $(document).trigger('appSetCatch');
        },
        upLoadPic: function(json) {
            json.ele.fileupload({
                pasteZone: null,
                url: "/user/gallery/upload", //文件上传地址，可以直接写在input的data-url属性内
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                maxFileSize: 2000000, // 2 MB
                dataType: 'text',
                sequentialUploads : true,
                formData: {
                    typeId: "10061"
                }, //参数
                done: function(e, result) {
                    if (result.result) {
                        var data = JSON.parse(result.result);
		            	if (data && data.status==500) {
		            		alert(data.msg);
		            		return;
		            	}
                        json.target.attr("src", data.path);
                        json.saveEle.attr(json.save, data.path);
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
        },
        colorpickerDel: function() {
            $("div.colorpicker").each(function() {
                $(this).remove();
            });
        }
    };
    popupCommon.commonInit = function() {
        var funs = popupCommon.funs;
        $(".colorpicker.dropdown-menu").remove();
        var colorpic=edit.attr("data-elementtype")=="carouse"?null:$('.wqdColorPicker').colorpicker({format: false, colorSelectors: {'#777777': 'rgba(119, 119, 119,1)', '#337ab7': 'rgba(51, 122, 183,1)', '#5cb85c': 'rgba(92, 184, 92,1)', '#5bc0de': 'rgba(91, 192, 222,1)', '#f0ad4e': 'rgba(240, 173, 78,1)', '#d9534f': 'rgba(217, 83, 79,1)'} });
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
        //弹窗位置
        $(".wqdEditBox").css("opacity", 0);
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
            funs.colorpickerDel();
        });
        /*背景设置---左侧导航*/
        $(".wqdEditBox  .edit_content_nav li").click(function() {
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
            } else if ($(this).siblings("h1:contains('轮播图设置')").length != 0) {
                window.open("http://127.0.0.1");
            } else if ($(this).siblings("h1:contains('图形设置')").length != 0) {
                window.open("http://127.0.0.1");
            }else if ($(this).siblings("h1:contains('图册样式')").length != 0) {
                window.open("http://127.0.0.1");
            };
        });
    };

    return popupCommon;
});
