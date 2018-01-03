/**
 * Created by user on 2016/6/14.
 */
define(['utility','createColorStyle','elementInfo','popupEdit','popupBase','wqdNavElement'],function(_util,createColorStyle,_ei,_pe,PopupBase,navEle) {
    var wqdNavDirect = {};
    wqdNavDirect.init = function () {
        this.bindEdit(".wqdelementEdit");
    };
    var _popupBase;
    //打开设计器
    wqdNavDirect.bindEdit=function (elm) {
        var self = this;
        $(document).on("elmenentEdit","[data-elementtype=extendNav]",function (e,data) {
            self.$element = data.element|| $(".wqdelementEdit.onEditing");
            setTimeout(function(){
                _ei.removeElementEditBtn();
                window.edit = self.$element;
                //加载json
                $.getJSON('../js/app/JSON/component/designControlNav.json', function(json, textStatus) {
                    _popupBase = new PopupBase(self.$element,$.extend(json,{boxClass:"extendNav"}));
                    self.$editor = _popupBase.$editor;
                    var obj= window.edit;
                    self.tempModel = _popupBase.tempModel;
                    _popupBase.init();
                    _pe.commonInit();
                    self.initialize(obj);
                    self.base(obj);
                    self.bindEvent(obj);
                    $(document).one("popupClosed", function () {
                        self.$element.find(".wqd-subnavul").removeClass("nav-show");
                    });
                });
            },0);
        });
    };


    //初始化设计器列表
    wqdNavDirect.initialize = function (obj) {
        var self = this;
        //obj.find(".wqd-subnavul").addClass("nav-show");
        this._Model = obj.find(".wqd-mainnavli").map(function (i, _) {
                var res = $(_).find(".wqd-subnava").map(function (j, __) {
                        return {text: $.trim($(__).html()), subselector: $.trim($(__).attr("class"))}
                    }).get() || [];
                return {
                    maintext: $.trim($(_).find(".wqd-mainnava").html()),
                    mainselector: $.trim($(_).find(".wqd-mainnava").attr("class")),
                    sub: res
                }
            }).get() || [];
        for (var i = 0; i < this._Model.length; i++) {
            var cur = this._Model[i];
            var $string = $("<li class='mian-point' ><i class='control' ></i> <p><i class='dragMark'></i><span>" + cur.maintext + "</span> <em class='deleteMenu firstMenu'></em></p> <ul class='subNavlist'></ul> <div class='addSubmenu'> <a href='javascript:void(0);'><i></i>添加二级菜单</a> </div> </li>");
            $(".topNavlist").append($string);
            for (var j = 0; j < cur.sub.length; j++) {
                var _cur = cur.sub[j];
                var $_string = $("<li class='sub-point'><p><i class='dragMark'></i><span>" + _cur.text + "</span><em class='deleteMenu secondMenu'></em></p></li>");
                $(".subNavlist").eq(i).append($_string);


            }
        };
        $("#wqd-about").nanoScroller({alwaysVisible: false});
    };
    //设计器初始化



    //基础设置开始
    wqdNavDirect.base= function (obj) {
        var self = this.$editor;
        var _liWidth;
        //添加一级菜单
        self.find(".edit1").on("click.menu", ".wqd-increasef", function (e) {
            e.stopPropagation();
            if(self.find(".edit5 .full").hasClass("on")){
                $(".page_width").addClass("wqd-border");
                $(".full").removeClass("on");
                $(".nav_width").removeClass("wqd-border");
                _popupBase.setAttr("full-width", "edit_check full");
                obj.removeAttr("fullNav","true");
                obj.removeClass("full_nav");
                obj.width(obj.attr("wqd-width"));
                obj.find(".wqd-mainnava").parent().each(function (i, _) {
                    $(_).width($(_).attr("wqd-width")).removeAttr("style");
                });
            }

            var $string= $("<li class='mian-point'><i class='control' ></i> <p ><i class='dragMark'></i><span>一级菜单</span> <em class='deleteMenu firstMenu'></em></p> <ul class='subNavlist'></ul> <div class='addSubmenu'> <a href='javascript:void(0);'><i></i>添加二级菜单</a> </div> </li>");
            $(".topNavlist").append($string);
            var $firLi = parseFloat(obj.width()) <= 0 ? $("<li class='wqd-mainnavli'><a href='#' class='wqd-mainnava home-page'> 一级菜单 </a></li>") : $("<li class='wqd-mainnavli'><a href='#' class='wqd-mainnava'> 一级菜单 </a> </li>");
            obj.find(".wqd-mainnavul").append($firLi);
            obj.width(obj.width()+$firLi.outerWidth());
            $("#wqd-about").nanoScroller({alwaysVisible: false});
            $(document).trigger("appSetCatch");

        })
            //添加二级菜单
            .on("click.menu", ".addSubmenu", function (e) {
                var __index = $(this).parents(".topNavlist>li").index();
                if (!$(this).prev(".subNavlist").children().length) {
                    var $secondUl = $("<ul class='wqd-subnavul'><li class='wqd-subnavli  peak'><a href='#' class='wqd-subnava'>二级菜单</a></li> </ul>");

                    obj.find(".wqd-mainnavli").eq(__index).append($secondUl);
                    //添加二级菜单时候需要计算高度
                    var _height=self.find(".nav_height .r_val").val();
                    var _top=parseFloat(obj.find(".wqd-mainnavli").css("border-top-width").split(" ")[0]);
                    $secondUl.css("top",_height-_top+"px");
                    $secondUl.addClass("nav-show");

                } else {
                    var $secondLi = $("<li class='wqd-subnavli'><a href='#' class='wqd-subnava'>二级菜单</a></li>");
                    obj.find(".wqd-mainnavli").eq(__index).find(".wqd-subnavul").append($secondLi);
                }
                var $secNav=$("<li class='sub-point'><p><i class='dragMark'></i><span>二级菜单</span><em class='deleteMenu secondMenu'></em></p></li>");
                $(this).prev(".subNavlist").append($secNav);
                $("#wqd-about").nanoScroller({alwaysVisible: false});
                $(document).trigger("appSetCatch");
            })
            //展开二级菜单
            .on("click.menu", ".control", function (e) {
                e.stopPropagation();
                var that = $(this);
                $(".topNavlist > li.open").not(that.parent()).find("i.control").trigger("click");
                if(that.parent().hasClass("open")){
                    that.siblings(".subNavlist, .addSubmenu").slideUp("fast",function(){$("#wqd-about").nanoScroller({alwaysVisible: false});});
                }else{
                    that.siblings(".subNavlist, .addSubmenu").slideDown("fast",function(){$("#wqd-about").nanoScroller({alwaysVisible: false});});
                }
                var _index=that.parent().index();
                obj.find(".wqd-mainnavli").find(".wqd-subnavul").removeClass("nav-show");
                obj.find(".wqd-mainnavli").eq(_index).find(".wqd-subnavul").addClass("nav-show");
                that.parent().toggleClass("open");
                $("#wqd-about").nanoScroller({alwaysVisible: false});

            })
            //删除一级菜单
            .on("click.menu", ".deleteMenu", function (e) {
                _liWidth = obj.find(".wqd-mainnavli").width() || 140;
                var $parentTop=$(this).parents(".topNavlist>li");
                var _index = $parentTop.index();
                if ($(this).hasClass("firstMenu")) {
                    if (_index == 0)obj.find(".wqd-mainnavli").eq(1).children(".wqd-mainnava").addClass("home-page");
                    obj.width(obj.width() - _liWidth).find(".wqd-mainnavli:eq("+_index+")").remove();
                    $parentTop.remove()

                }
                if ($(this).hasClass("secondMenu"))  {
                    //实例删除二级菜单
                    var $parentSub=$(this).parents(".subNavlist>li");
                    var indexS = $parentSub.index();
                    var _slength = obj.find(".wqd-mainnavli").eq(_index).find(".wqd-subnavli").length;
                    var $subnav = _slength == 1 ? obj.find(".wqd-mainnavli").eq(_index).find(".wqd-subnavul") : obj.find(".wqd-mainnavli:eq("+_index+") .wqd-subnavli:eq("+indexS+")");
                    $subnav.remove();
                    //设计器删除二级菜单
                    $parentSub.remove();
                }
                self.find(".link_close").trigger("click.menu");
                $(document).trigger("appSetCatch");
                $("#wqd-about").nanoScroller({alwaysVisible: false});
            })
            //展开链接设置层
            .on("click.menu", ".topNavlist span", function (e) {
                var _this=this;
                $(".topNavlist span").parent("p").removeClass("wqd-selected");
                var index = $(this).parents(".mian-point").index(".topNavlist>li");
                var _index=$(this).parents(".sub-point").index();
                //给链接设置设置选择器
                if($(this).parent("p").hasClass("wqd-selected"))return;
                $(this).parent("p").addClass("wqd-selected");
                var $wqdLink=self.find(".wqd-nnavlink");
                $wqdLink.css("display","block").stop().animate({left: "344px",opacity:"1"}, 300);
                if($(this).parents(".sub-point").length){
                    $wqdLink.attr("data-selector",".wqd-mainnavli:eq("+index+") .wqd-subnava:eq("+_index+")")
                }else{
                    $wqdLink.attr("data-selector",".wqd-mainnava:eq("+index+")")
                }

                self.find(".wqd-nnavlink .edit_select>p>span").text("请选择");
                self.find(".wqd-nnavlink .edit_select ul li").removeClass("on");
                self.find(".wqd-nnavlink").children().each(function (i, _) {
                    var $elmNode = obj.find($(this).parents("[data-selector]").attr("data-selector"));
                    var _wqdhref=$elmNode.attr("wqdhref");
                    var _linkhref=$elmNode.attr("data-link-href");
                    var $_optionsEle=self.find(".linkpoint>li").eq(_wqdhref).find(".edit_select p");
                    if(i==1){
                        $(this).find(".textVal").val($(_this).text());
                    }
                    if(i==2){
                        _popupBase.setEditorLink(self.find(".linkpoint i.radio").eq($elmNode.attr("wqdhref")||0));
                        var _optionsText=$_optionsEle.next().find("li").map(function (i,_) {
                            _wqdhref == "2" && (_linkhref = _linkhref.substring(_linkhref.indexOf("#")+1));
                            if($(_).attr("data-type")==_linkhref){
                                return $(_).html()
                            }
                        })[0];
                        $_optionsEle.find("span").html(_optionsText);
                    }
                });
            })
            //收回列表设置层
            .on("click.menu", ".link_close", function (e) {
                e.stopPropagation();
                $(this).parents(".wqd-nnavlink").stop().animate({left: "0",opacity:"0"}, 300);
            })
            //修改菜单标题
            .on("blur.title",".textVal", function (e) {
                var _selector=self.find(".wqd-nnavlink").attr("data-selector");
                //var textVal = $(this).val().replace(/\s/g," ").replace(/(^ +| +$)/g,"");
                var textVal = $(this).val().replace(/\s/g,"&nbsp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
                if(textVal != obj.find(_selector).text()){
                    obj.find(_selector).html(textVal);
                    self.find(".wqd-selected span").html(textVal);
                }
                var $mainNavA= obj.find(".wqd-mainnava");
                var arr;
                if($(".edit5 .equal").hasClass("on")){
                    createColorStyle.styleInit(obj.attr("id"), ".wqd-mainnava", {'padding':"0 10px"});
                    arr=$mainNavA.map(function (i, _) {
                        return $(_).outerWidth()
                    }).get();
                    var _maxWidth=Math.ceil(Math.max.apply(null,arr))+1;
                    createColorStyle.styleInit(obj.attr("id"), ".wqd-mainnava", {'min-width': _maxWidth+"px"});
                    obj.width(_maxWidth*$mainNavA.length);
                }else{
                    arr=$mainNavA.map(function (i, _) {
                        return $(_).outerWidth()+1
                    }).get();
                    obj.width(eval(arr.join("+")));
                }

                $(document).trigger("appSetCatch");
            });
        //颜色切换
        $(".wqdColorPicker").off("changeColor").on("changeColor", function () {
            var colorVal = $(this).val();
            var setColor= function (_dataType,_selector) {
                _popupBase.setAttr(_dataType, colorVal);
                createColorStyle.styleInit(obj.attr("id"), _selector, {color: colorVal});
                $(document).trigger("appSetCatch");
            };
            var setBgColor= function (_dataType,_selector) {
                _popupBase.setAttr(_dataType, colorVal);
                createColorStyle.styleInit(obj.attr("id"), _selector, {"background-color": colorVal});
                $(document).trigger("appSetCatch");
            };
            var setBdColor= function (_this,_dataType,_selector) {
                _popupBase.setAttr(_dataType, colorVal);
                if($(_this).parents(".line-color").length){
                    createColorStyle.styleInit(obj.attr("id"), _selector, {"border-color": colorVal});
                    $(document).trigger("appSetCatch");
                    return;
                }
                var _borderWidth=$(_this).parents(".edit_unitbox").siblings(".edit_bdwidth").find(".r_val").val();
                if($(_this).parents(".edit_unitbox").next().find(".direction-top").parent(".direction").hasClass("active"))createColorStyle.styleInit(obj.attr("id"), _selector, {"border-top":""+_borderWidth+"px solid "+colorVal+"" });
                if($(_this).parents(".edit_unitbox").next().find(".direction-bottom").parent(".direction").hasClass("active"))createColorStyle.styleInit(obj.attr("id"), _selector, {"border-bottom":""+_borderWidth+"px solid "+colorVal+"" });
                $(document).trigger("appSetCatch");
            };
            if ($(this).parents(".edit2")) {
                if ($(this).parents(".mian-title").length) {
                    if ($(this).parents(".nav-default").length) setColor("title-color",".wqd-mainnava");
                    if ($(this).parents(".nav-hover").length)setColor("title-hovercolor",".wqd-mainnavli:hover .wqd-mainnava");
                    if ($(this).parents(".nav-selected").length)setColor("title-selectcolor",".wqd-mainnavli.active .wqd-mainnava");
                }
                if ($(this).parents(".sub-title").length) {
                    if ($(this).parents(".nav-default").length)setColor("sub-title-color",".wqd-subnava");
                    if ($(this).parents(".nav-hover").length)setColor("sub-title-hcolor",".wqd-subnavli:hover .wqd-subnava");
                }
            }
            if($(this).parents(".edit3")){
                if ($(this).parents(".mian-bg").length) {
                    //一级菜单标题
                    if ($(this).parents(".nav-default").length&&$(this).parent().index()==0) setBgColor("title-bg",".wqd-mainnavli");
                    if ($(this).parents(".nav-hover").length&&$(this).parent().index()==0)setBgColor("title-hoverbg",".wqd-mainnavli:hover");
                    if ($(this).parents(".nav-selected").length&&$(this).parent().index()==0)setBgColor("title-selectbg",".wqd-mainnavli.active");
                }
                if ($(this).parents(".sub-bg").length) {
                    //二级菜单背景
                    if ($(this).parents(".nav-default").length&&$(this).parent().index()==0) setBgColor("sub-bg",".wqd-subnavul");
                    if ($(this).parents(".nav-hover").length&&$(this).parent().index()==0)setBgColor("subnav-hoverbg",".wqd-subnavul:hover");
                    //二级菜单标题
                    if ($(this).parents(".nav-default").length&&$(this).parent().index()==1) setBgColor("subtitle-bgc",".wqd-subnavli");
                    if ($(this).parents(".nav-hover").length&&$(this).parent().index()==1)setBgColor("subtitle-hoverbgc",".wqd-subnavli:hover");
                }
            }
            //边框颜色
            if($(this).parents(".edit4")){
                if ($(this).parents(".main-border").length) {
                    //一级菜单间隔线
                    if ($(this).parents(".nav-default").length&&$(this).parent().index()==0) setBdColor(this,"interval-color",".wqd-mainnava");
                    if ($(this).parents(".nav-hover").length&&$(this).parent().index()==0)setBdColor(this,"interval-hovercolor",".wqd-mainnavli:hover .wqd-mainnava");
                    if ($(this).parents(".nav-selected").length&&$(this).parent().index()==0)setBdColor(this,"interval-selectcolor",".wqd-mainnavli.active .wqd-mainnava");
                    //一级菜单边框颜色
                    if ($(this).parents(".nav-default").length&&$(this).parent().index()==2)setBdColor(this,"border-color",".wqd-mainnavli");
                    if ($(this).parents(".nav-hover").length&&$(this).parent().index()==2)setBdColor(this,"border-hovercolor",".wqd-mainnavli:hover");
                    if ($(this).parents(".nav-selected").length&&$(this).parent().index()==2)setBdColor(this,"border-selectcolor",".wqd-mainnavli.active");
                }
                if ($(this).parents(".sub-border").length) {
                    //二级菜单间隔线
                    if ($(this).parents(".nav-default").length) setBdColor(this,"subinterval-color",".wqd-subnavli");
                    if ($(this).parents(".nav-hover").length)setBdColor(this,"subinterval-hovercolor",".wqd-subnavli:hover");
                }
            }
        });
        //下拉框切换


        self.find(".edit2 .title-font").each(function (i, _) {
            var _text=$(this).find("p span").text();
            $(this).find("li").each(function (i, _) {
                if($(this).find("span").text()==_text){
                    $(this).addClass("on").siblings("li").removeClass("on");
                    return false;
                }
            });
        });
        self.find(".borerwidthselect").off("click.nav").on("click.nav", "p,ul li", function (e) {
            e.preventDefault();
            if (this.tagName.toLowerCase() == "p") {
                if ($(this).parent().hasClass("on")) {
                    $(this).removeClass("on").parent().removeClass("on").find("i").removeClass("on");
                } else {
                    $(this).addClass("on").parent().addClass("on").find("i").addClass("on");
                }
                return
            }
            if (this.tagName.toLowerCase() == "li") {
                $(this).parents(".borerwidthselect").removeClass("on").find("p").removeClass("on").find("i").removeClass("on");
                $(this).addClass("on").siblings("li").removeClass("on").parent().siblings("p").find("span").remove().end().prepend($(this).children().clone());
                $(this).parents(".switch").nextAll(".switch-point").removeClass("selected").eq($(this).index()).addClass("selected");
                var _curval=$(this).text();

                var setFont= function (_this,_dataType,_selector) {
                    _popupBase.setAttr(_dataType, _curval);
                    createColorStyle.styleInit(obj.attr("id"), _selector, {'font-family': _curval});

                };
                if($(this).parents(".title-font").length){
                    if ($(this).parents(".mian-title").length) {//一级标题
                        if ($(this).parents(".nav-default").length)setFont(this,"main-font",".wqd-mainnava");
                        if ($(this).parents(".nav-hover").length)setFont(this,"title-hoverfont",".wqd-mainnavli:hover .wqd-mainnava");
                        if ($(this).parents(".nav-selected").length)setFont(this,"title-selectfont",".wqd-mainnavli.active .wqd-mainnava");
                    }
                    if ($(this).parents(".sub-title").length) {
                        if ($(this).parents(".nav-default").length)setFont(this,"sub-title-font",".wqd-subnava");
                        if ($(this).parents(".nav-hover").length)setFont(this,"subtitle-hoverfont",".wqd-subnavli:hover .wqd-subnava");
                    }
                }
            }
            $(document).trigger('appSetCatch');

        });


        //显示边框
        self.find(".edit4 .check-btn").each(function (e) {
            if(!$(this).hasClass("on"))$(this).parent().nextAll().addClass("wqd-border");
        });
        self.find(".edit_navLI .check-btn").on("click", function (e) {
            e.stopPropagation();
            var _flag,dataval;
            $(this).hasClass("on")?_flag=true:_flag=false;
            _flag?$(this).removeClass("on"):$(this).addClass("on");
            _flag?$(this).parent().nextAll().addClass("wqd-border"):$(this).parent().nextAll().removeClass("wqd-border");
            dataval=_flag?"edit_check check-btn":"edit_check check-btn on";
            var setBorder=function (_dataType,_dataval,_selector) {
                _popupBase.setAttr(_dataType, _dataval);
                _flag?createColorStyle.styleInit(obj.attr("id"), _selector, {"border": "none"}):createColorStyle.deleteStyle(obj.attr("id"), _selector, {"border": "none"});
                $(document).trigger("appSetCatch");
            };

            if ($(this).parents(".main-border").length) {
                if ($(this).parents(".nav-default").length)setBorder("nav-border",dataval,".wqd-mainnavli");
                if ($(this).parents(".nav-hover").length)setBorder("nav-hoverborder",dataval,".wqd-mainnavli:hover");
                if ($(this).parents(".nav-selected").length)setBorder("nav-selectborder",dataval,".wqd-mainnavli.active");
            }
        });
        //上下边框
        self.find(".edit_navLI .direction span").on("click", function (e) {
            e.stopPropagation();
            var setBorderTop=function (_dataType,_dataval,_selector,_curval) {
                _popupBase.setAttr(_dataType, _dataval);
                createColorStyle.styleInit(obj.attr("id"), _selector, {"border-top": _curval});
                $(document).trigger("appSetCatch");
            };
            var setBorderBottom=function (_dataType,_dataval,_selector,_curval) {
                _popupBase.setAttr(_dataType, _dataval);
                createColorStyle.styleInit(obj.attr("id"), _selector, {"border-bottom": _curval});
                $(document).trigger("appSetCatch");
            };
            var _flag,dataval,curval;
            var _borderColor=$(this).parents(".edit_unitbox").prev().find(".colordevice").css("background-color");
            var _borderWidth=$(this).parents(".edit_unitbox").next().find(".r_val").val();

            $(this).parent().hasClass("active")?_flag=true:_flag=false;
            _flag?$(this).parent().removeClass("active"):$(this).parent().addClass("active");
            dataval=_flag?"direction":"direction active";
            curval=_flag?"none":""+_borderWidth+"px solid "+_borderColor+"";
            if($(this).hasClass("direction-top")){
                if ($(this).parents(".main-border").length) {
                    if ($(this).parents(".nav-default").length)setBorderTop("border-top",dataval,".wqd-mainnavli",curval);
                    if ($(this).parents(".nav-hover").length)setBorderTop("border-top-h",dataval,".wqd-mainnavli:hover",curval);
                    if ($(this).parents(".nav-selected").length)setBorderTop("border-top-s",dataval,".wqd-mainnavli.active",curval);
                }
            }
            if($(this).hasClass("direction-bottom")){
                if ($(this).parents(".main-border").length) {
                    if ($(this).parents(".nav-default").length)setBorderBottom("border-bottom",dataval,".wqd-mainnavli",curval);
                    if ($(this).parents(".nav-hover").length)setBorderBottom("border-bottom-h",dataval,".wqd-mainnavli:hover",curval);
                    if ($(this).parents(".nav-selected").length)setBorderBottom("border-bottom-s",dataval,".wqd-mainnavli.active",curval);
                }
            }
        });


        //文字细节切换
        self.find(".edit_detail").on("click","strong,em", function (e) {
            e.stopPropagation();
            var setFontWeight= function (_this,_color,_dataType,_dataval,_selector,_curval) {
                //$(_this).css("background-color", _color);
                _popupBase.setAttr(_dataType, _dataval);
                createColorStyle.styleInit(obj.attr("id"), _selector, {"font-weight": _curval});
                $(document).trigger("appSetCatch");
            };
            var setFontStyle=function (_this,_color,_dataType,_dataval,_selector,_curval) {
                //$(_this).css("background-color", _color);
                _popupBase.setAttr(_dataType, _dataval);
                createColorStyle.styleInit(obj.attr("id"), _selector, {"font-style": _curval});
                $(document).trigger("appSetCatch");
            };
            var _flag,_on,_weight,_color,_style;
            if (this.tagName.toLowerCase() == "strong"){
                $(this).hasClass("on")?_flag=true:_flag=false;
                _flag?$(this).removeClass("on"):$(this).addClass("on");
                _on=_flag?"__on":"on";
                _weight=_flag?"400":"700";
                _color=_flag?"rgba(0, 0, 0, 0)":"#eee";
                if ($(this).parents(".mian-title").length) {
                    if ($(this).parents(".nav-default").length)setFontWeight(this,_color,"font-weight",_on,".wqd-mainnava",_weight);
                    if ($(this).parents(".nav-hover").length)setFontWeight(this,_color,"font-hoverweight",_on,".wqd-mainnavli:hover .wqd-mainnava",_weight);
                    if ($(this).parents(".nav-selected").length)setFontWeight(this,_color,"font-selectweight",_on,".wqd-mainnavli.active .wqd-mainnava",_weight);
                }
                if ($(this).parents(".sub-title").length) {
                    if ($(this).parents(".nav-default").length)setFontWeight(this,_color,"sub-font-weight",_on,".wqd-subnava",_weight);
                    if ($(this).parents(".nav-hover").length)setFontWeight(this,_color,"sub-font-hweight",_on,".wqd-subnavli:hover .wqd-subnava",_weight);
                }
            }

            if (this.tagName.toLowerCase() == "em"){
                $(this).hasClass("on")?_flag=true:__flag=false;
                _flag?$(this).removeClass("on"):$(this).addClass("on");
                _on=_flag?"___on":"on";
                _style=_flag?"inherit":"italic";
                _color=_flag?"rgba(0, 0, 0, 0)":"#eee";
                if ($(this).parents(".mian-title").length) {
                    if ($(this).parents(".nav-default").length)setFontStyle(this,_color,"font-style",_on,".wqd-mainnava",_style);
                    if ($(this).parents(".nav-hover").length)setFontStyle(this,_color,"font-hoverstyle",_on,".wqd-mainnavli:hover .wqd-mainnava",_style);
                    if ($(this).parents(".nav-selected").length)setFontStyle(this,_color,"font-selectstyle",_on,".wqd-mainnavli.active .wqd-mainnava",_style);
                }
                if ($(this).parents(".sub-title").length) {
                    if ($(this).parents(".nav-default").length)setFontStyle(this,_color,"sub-font-style",_on,".wqd-subnava",_style);
                    if ($(this).parents(".nav-hover").length)setFontStyle(this,_color,"sub-font-hstyle",_on,".wqd-subnavli:hover .wqd-subnava",_style);
                }
            }

        });

        //对齐方式切换 沿用旧版回显
        var _default=obj.attr("default")||"center";
        var _hover=obj.attr("hover")||"center";
        var _select=obj.attr("select")||"center";
        $(".mian-title .nav-default .edit_alignment span.alignment-"+_default+"").addClass("on");
        $(".mian-title .nav-hover .edit_alignment span.alignment-"+_hover+"").addClass("on");
        $(".mian-title .nav-selected .edit_alignment span.alignment-"+_select+"").addClass("on");
        var _subDefault=obj.attr("sub-default")||"center";
        var _subHover=obj.attr("sub-hover")||"center";
        var _subSelect=obj.attr("sub-select")||"center";
        $(".sub-title .nav-default .edit_alignment span.alignment-"+_subDefault+"").addClass("on");
        $(".sub-title .nav-hover .edit_alignment span.alignment-"+_subHover+"").addClass("on");
        $(".sub-title .nav-selected .edit_alignment span.alignment-"+_subSelect+"").addClass("on");
        self.find(".edit_alignment").on("click", "span:not(:first)", function (e) {
            $(this).addClass("on").siblings("span:not(:first)").removeClass("on");
            var setTestStyle = function (_type, _typeval, _selector) {
                obj.attr(_type, _typeval);
                createColorStyle.styleInit(obj.attr("id"), _selector, {"text-align": _typeval});
                $(document).trigger("appSetCatch");
            };
            if ($(this).parents(".mian-title").length) {
                if ($(this).parents(".nav-default").length) {
                    if ($(this).hasClass("alignment-left"))setTestStyle("default", "left", ".wqd-mainnava");
                    if ($(this).hasClass("alignment-center"))setTestStyle("default", "center", ".wqd-mainnava");
                    if ($(this).hasClass("alignment-right"))setTestStyle("default", "right", ".wqd-mainnava");
                }
                if ($(this).parents(".nav-hover").length) {
                    if ($(this).hasClass("alignment-left")) setTestStyle("hover", "left", ".wqd-mainnavli:hover .wqd-mainnava");
                    if ($(this).hasClass("alignment-center"))setTestStyle("hover", "center", ".wqd-mainnavli:hover .wqd-mainnava");
                    if ($(this).hasClass("alignment-right")) setTestStyle("hover", "right", ".wqd-mainnavli:hover .wqd-mainnava");
                }
                if ($(this).parents(".nav-selected").length) {
                    if ($(this).hasClass("alignment-left"))setTestStyle("select", "left", ".wqd-mainnavli.active .wqd-mainnava");
                    if ($(this).hasClass("alignment-center")) setTestStyle("select", "center", ".wqd-mainnavli.active .wqd-mainnava");
                    if ($(this).hasClass("alignment-right")) setTestStyle("select", "right", ".wqd-mainnavli.active .wqd-mainnava");
                }
            }
            if ($(this).parents(".sub-title").length) {
                if ($(this).parents(".nav-default").length) {
                    if ($(this).hasClass("alignment-left"))setTestStyle("sub-default", "left", ".wqd-subnavli");
                    if ($(this).hasClass("alignment-center"))setTestStyle("sub-default", "center", ".wqd-subnavli");
                    if ($(this).hasClass("alignment-right"))setTestStyle("sub-default", "right", ".wqd-subnavli");
                }
                if ($(this).parents(".nav-hover").length) {
                    if ($(this).hasClass("alignment-left"))setTestStyle("sub-hover", "left", ".wqd-subnavli:hover");
                    if ($(this).hasClass("alignment-center"))setTestStyle("sub-hover", "center", ".wqd-subnavli:hover");
                    if ($(this).hasClass("alignment-right"))setTestStyle("sub-hover", "right", ".wqd-subnavli:hover");
                }
            }
        });



        //滑块拖动
        self.find(".slider").each(function (i,_) {
            var setFontSize= function (_this,_dataType,_selector,_val) {
                _popupBase.setAttr(_dataType, _val);
                createColorStyle.styleInit(obj.attr("id"), _selector, {'font-size': _val+"px"});
                if($(_this).parents(".mian-title").length){
                    var $mainNavA= obj.find(".wqd-mainnava");
                    var arr;
                    if($(".edit5 .equal").hasClass("on")){
                        createColorStyle.styleInit(obj.attr("id"), ".wqd-mainnava", {'padding':"0 10px"});
                        arr=$mainNavA.map(function (i, _) {
                            return $(_).outerWidth()+1
                        }).get();
                        var _maxWidth=Math.ceil(Math.max.apply(null,arr));
                        createColorStyle.styleInit(obj.attr("id"), ".wqd-mainnava", {'min-width': _maxWidth+"px"});
                        obj.width(_maxWidth*$mainNavA.length);
                    }else{
                        arr=$mainNavA.map(function (i, _) {
                            return $(_).outerWidth()+1
                        }).get();
                        obj.width(eval(arr.join("+")));
                    }

                };
                $(document).trigger("appSetCatch");
            };
            var setBorerSize= function (_dataType,_selector,_val) {
                _popupBase.setAttr(_dataType, _val);
                if($(".direction-top").parent(".direction").hasClass("active")){
                    createColorStyle.styleInit(obj.attr("id"), _selector, {'border-top-width': _val+"px"});
                    var _height=self.find(".nav_height .r_val").val();
                    obj.find(".wqd-subnavul").css("top",_height-_val+"px");
                }
                if($(".direction-bottom").parent(".direction").hasClass("active"))createColorStyle.styleInit(obj.attr("id"), _selector, {'border-bottom-width': _val+"px"});
                var _lineHeight=$(".wqd-mainnava").height();
                createColorStyle.styleInit(obj.attr("id"), ".wqd-mainnava", {'line-height': _lineHeight+"px"});
                $(document).trigger("appSetCatch");
            };
            var $this=$(_);
            if($this.parents(".edit2").length) _util.range({
                slider: $this,
                obj: obj,
                minval:12,
                maxval: 30,
                callback: function (radio, _type, maxval,rangeVal) {
                    var range = Math.round(radio * maxval);
                    if ($this.parents(".mian-title").length) {
                        if ($this.parents(".nav-default").length) setFontSize($this,"font-size",".wqd-mainnava",range);
                        if ($this.parents(".nav-hover").length)setFontSize($this,"font-hoversize",".wqd-mainnavli:hover .wqd-mainnava",range);
                        if ($this.parents(".nav-selected").length)setFontSize($this,"font-selectsize",".wqd-mainnavli.active .wqd-mainnava",range);
                    }
                    if ($this.parents(".sub-title").length) {
                        if ($this.parents(".nav-default").length)setFontSize($this,"subfont-size",".wqd-subnava",range);
                        if ($this.parents(".nav-hover").length)setFontSize($this,"subfont-hoversize",".wqd-subnavli:hover .wqd-subnava",range);
                    }
                }
            });
            if($this.parents(".edit4").length) _util.range({
                slider: $this,
                obj: obj,
                minval:1,
                maxval: 10,
                callback: function (radio, _type, maxval,rangeVal) {
                    var range = Math.round(radio * maxval);
                    if ($this.parents(".main-border").length) {
                        if ($this.parents(".nav-default").length) setBorerSize("border-size",".wqd-mainnavli",range);
                        if ($this.parents(".nav-hover").length)setBorerSize("border-hoversize",".wqd-mainnavli:hover",range);
                        if ($this.parents(".nav-selected").length)setBorerSize("border-selectsize",".wqd-mainnavli.active",range);
                    }
                }
            });
            if($this.parents(".edit5").length){
                var _minval=$this.parents(".nav_width").length?10:$this.parents(".page_width").length?0:60;
                var _maxval=$this.parents(".nav_width").length?50:$this.parents(".page_width").length?15:100;
                _util.range({
                    slider: $this,
                    obj: obj,
                    minval:_minval,
                    maxval: _maxval,
                    callback: function (radio, _type, maxval,rangeVal) {
                        var range = Math.round(radio * maxval);
                        var $mainNavA= obj.find(".wqd-mainnava");
                        var $subnavul=obj.find(".wqd-subnavul");
                        var arr;
                        if ($this.parents(".nav_width").length) {
                            _popupBase.setAttr("width-size", range);
                            if(self.find(".equal").hasClass("on")){
                                createColorStyle.styleInit(obj.attr("id"), ".wqd-mainnava", {'min-width':"100%"});
                                createColorStyle.styleInit(obj.attr("id"), ".wqd-mainnava", {'padding':"0 "+range+"px"});
                                arr=$mainNavA.map(function (i, _) {
                                    return $(_).outerWidth()+1
                                }).get();
                                var _maxWidth=Math.ceil(Math.max.apply(null,arr));
                                createColorStyle.styleInit(obj.attr("id"), ".wqd-mainnava", {'min-width': _maxWidth+"px"});
                                obj.width(_maxWidth*$mainNavA.length);
                                createColorStyle.styleInit(obj.attr("id"), ".wqd-mainnava", {'padding':"0 10px"});

                            }else{
                                createColorStyle.styleInit(obj.attr("id"), ".wqd-mainnava", {'padding':"0 "+range+"px"});
                                arr=$mainNavA.map(function (i, _) {
                                    return $(_).outerWidth()+1
                                }).get();
                                obj.width(eval(arr.join("+")));

                            }
                        };
                        if ($this.parents(".nav_height").length){
                            _popupBase.setAttr("height-size", range);
                            obj.height(range);
                            var _lineHeight=$(".wqd-mainnava").height();
                            var _height=self.find(".nav_height .r_val").val();
                            var _top=parseFloat(obj.find(".wqd-mainnavli").css("border-top-width").split(" ")[0]);
                            $subnavul.css("top",_height-_top+"px");
                            createColorStyle.styleInit(obj.attr("id"), ".wqd-mainnava", {'line-height': _lineHeight+"px"});
                            //obj.find(".wqd-mainnava").css("line-height",_lineHeight+"px");
                            $(document).trigger("appSetCatch");

                        };
                        if ($this.parents(".page_width").length){
                            _popupBase.setAttr("page-width", range);
                            obj.attr("page-range",range);
                            obj.width(Math.ceil($(window).width()*((100-range*2)/100)));
                            $mainNavA.parent().each(function (i, _) {
                                $(_).width($(_).attr("nav-percent")*obj.width());
                            });

                        };
                    }
                });
            };


        });
        //单选框
        if(!self.find(".equal").hasClass("on")){
            self.find(".edit2 .edit_alignment").addClass("wqd-border");
            self.find(".edit5 .full").parent().addClass("wqd-border");
        }
        if(self.find(".edit5 .full").hasClass("on")){
            $(".nav_width").addClass("wqd-border");
            $(".page_width").removeClass("wqd-border");
        }
        self.find(".edit5 .edit_check").on("click.radio", function (e) {
            e.stopPropagation();
            var _val=self.find(".nav_width .r_val").val();
            var $mainNavA= obj.find(".wqd-mainnava");
            var arr=$mainNavA.map(function (i, _) {
                return $(_).outerWidth()+1
            }).get();
            var _maxWidth=Math.ceil(Math.max.apply(null,arr));
            if($(this).hasClass("equal")){
                if($(this).hasClass("on")){
                    $(this).removeClass("on");
                    $(this).parents(".edit_unitbox ").next().addClass("wqd-border");
                    if(self.find(".edit5 .full").hasClass("on")){
                        $(".page_width").addClass("wqd-border");
                        $(".nav_width").removeClass("wqd-border");
                        $(".full").removeClass("on");
                        _popupBase.setAttr("full-width", "edit_check full");
                        obj.removeAttr("fullNav","true");
                        obj.removeClass("full_nav");
                        obj.width(obj.attr("wqd-width"));
                        obj.find(".wqd-mainnava").parent().each(function (i, _) {
                            $(_).width($(_).attr("wqd-width"))
                        });
                        $(".wqd-mainnavli").removeAttr("style");
                    }
                    createColorStyle.styleInit(obj.attr("id"), ".wqd-mainnava", {'padding':"0 "+_val+"px"});
                    createColorStyle.styleInit(obj.attr("id"), ".wqd-mainnava", {'min-width': 0+"px"});
                    arr=$mainNavA.map(function (i, _) {
                        return $(_).outerWidth()+1;
                    }).get();
                    obj.width(eval(arr.join("+")));
                    self.find(".edit2 .edit_alignment").addClass("wqd-border");
                    _popupBase.setAttr("nav-width", "edit_check equal");

                }else{

                    $(this).addClass("on");
                    $(this).parents(".edit_unitbox ").next().removeClass("wqd-border");
                    createColorStyle.styleInit(obj.attr("id"), ".wqd-mainnava", {'min-width': _maxWidth+"px"});
                    obj.width(_maxWidth*$mainNavA.length);
                    self.find(".edit2 .edit_alignment").removeClass("wqd-border");
                    _popupBase.setAttr("nav-width", "edit_check equal on");
                    createColorStyle.styleInit(obj.attr("id"), ".wqd-mainnava", {'padding':"0 10px"});

                }
                $(document).trigger("appSetCatch");
            };
            if($(this).hasClass("chase")){
                var navObj=$(".sectionV2.wqdCommonNav");
                if(navObj.attr("wqdnavstickyed")){
                    $(this).removeClass("on");
                    _popupBase.setAttr("nav-follow", "edit_check chase");
                    navObj.removeAttr("wqdnavstickyed")

                }else{
                    $(this).addClass("on");
                    _popupBase.setAttr("nav-follow", "edit_check chase on");
                    navObj.attr("wqdnavstickyed","on")
                }
                $(document).trigger("appSetCatch");
            };

            if($(this).hasClass("full")){
                if(!$(this).hasClass("on")){
                    $(".nav_width").addClass("wqd-border");
                    $(".page_width").removeClass("wqd-border");
                    $(this).addClass("on");
                    var _range=obj.attr("page-range")?parseFloat( obj.attr("page-range")):0;
                    obj.attr("wqd-width",obj.width());
                    $mainNavA.parent().each(function (i, _) {
                        $(this).attr("wqd-width",$(_).outerWidth()+1)
                    });

                    _popupBase.setAttr("full-width", "edit_check full on");
                    var _arr=$mainNavA.map(function (i, _) {
                        return (($(_).outerWidth())/obj.width());
                    }).get();
                    obj.attr("fullNav","true");
                    obj.addClass("full_nav");
                    var width = $(window).width(),
                        sectionWidth = +$(this).parents(".sectionV2").attr("sectionwidth") || 1200;
                    width = width < sectionWidth ? sectionWidth : width;
                    obj.width(Math.ceil(width*((100-_range*2)/100)));
                    $mainNavA.parent().each(function (i, _) {
                        $(_).width(Math.floor(_arr[i]*obj.width()))
                            .attr("nav-percent",_arr[i]);
                    });

                }else{
                    $(".page_width").addClass("wqd-border");
                    $(".nav_width").removeClass("wqd-border");
                    $(this).removeClass("on");
                    _popupBase.setAttr("full-width", "edit_check full");
                    obj.removeAttr("fullNav","true");
                    obj.removeClass("full_nav");
                    obj.width(obj.attr("wqd-width"));
                    $mainNavA.parent().each(function (i, _) {
                        $(_).width($(_).attr("wqd-width")).removeAttr("nav-percent").css("width","none");
                        $(_).removeAttr("style")
                    });
                }
                $(document).trigger("appSetCatch");
            }
        });
    };

    //绑定事件
    wqdNavDirect.bindEvent= function (obj) {
        this.dragDrop({'eventNode' : 'i.dragMark','parent' : 'li' });
    };
    //菜单拖拽
    wqdNavDirect.dragDrop= function(options){
        var eventNode = null;
        if(!options) return;
        eventNode = $(options.eventNode);
        $(".navTemplateEditor").off('mousedown.dragDrop').on('mousedown.dragDrop',options.eventNode,function(event){
            var action = null,
                x1 = event.pageX,
                y1 = event.pageY,
                isshow = false,
                node = $(this).closest(options.parent),
                nodeIndex = tempIndex = null,
                moreScoll = nodeY = nodeX = nodeW = nodeH = 0 ,
                isPage = moveTarget = pagetarget = near = null;
            nodeIndex = node.index();
            if(node.hasClass('open')) isshow = true;
            if(node.parent('ul').hasClass('subNavlist')){
                isPage = false;
                eventNode = $('.subNavlist').find('i.dragMark');
                moveTarget = '.subNavlist li';
                node.parents(".subNavlist").parent().siblings("li").removeClass("open").find(".subNavlist, .addSubmenu").hide();
            }else if(node.parent('ul').hasClass('topNavlist')){
                isPage = true;
                eventNode = $('.topNavlist > li > p > .dragMark');
                moveTarget = '.topNavlist > li';
                node.parents(".topNavlist").children("li").removeClass("open").find(".subNavlist, .addSubmenu").hide();
            }else{
                return;
            }

            node.attr('active','ing');
            nodeY = node.position().top;
            nodeX = node.position().left;
            nodeH = node.outerHeight();
            nodeW = node.outerWidth();
            $(document).bind('mousemove.dragDrop',function(event){
                var x2 = event.pageX,
                    y2 = event.pageY,
                    moveX = x2 - x1 + nodeX,
                    moveY = y2 - y1 + nodeY;

                action = (y1 - y2 > 0) ? 'before' : 'after';
                if(!$('#_t').length){
                    node.before($('<li id="_t"></li>'));
                    $('#_t').css({"height":nodeH});
                }

                if(isPage){
                    node.css({'position':'absolute','z-index':'9999','width':nodeW,'top':moveY+'px'});
                    $('#_t').addClass('page');
                }else{
                    node.css({'position':'absolute','z-index':'9999','width':nodeW,'top':moveY+'px'});
                    $('#_t').addClass('part');
                }

                var minDis = 99999;
                eventNode.each(function(){
                    var r = $(this).parents(moveTarget);
                    if(r.attr('active')!='ing'){
                        if(collide(node,r)){
                            var dis = getDis(node,r);
                            if(dis<minDis){
                                minDis = dis;
                                near = r;
                                pagetarget = null;
                            }
                        }
                    }
                });

                if(near && ((near.outerHeight()/2)>minDis)){
                    $('#_t').remove();
                    near[action]($('<li id="_t" style="height:'+nodeH+'px;"></li>'));
                }else if(!isPage){
                    $('.topNavlist').children('li').each(function(){
                        if(collide(node,$(this))){
                            var dis = getDis(node,$(this));
                            if(dis<minDis){
                                minDis = dis;
                                pagetarget = !$(this).hasClass('open') ? $(this).data('minDis',minDis) : null;
                            }
                        }
                    });
                }
            });

            function moveRes(){
                var ul = node.parents('ul') ,newlocat = null;

                if(!ul.find('#_t').length){
                    node.removeAttr('active');
                    $(document).off('mousemove.dragDrop');
                    $(document).off('mouseup.dragDrop');
                    return;
                }
                tempIndex = ul.find('#_t').index();
                if(isPage){
                    if(tempIndex != nodeIndex && tempIndex != nodeIndex+1){
                        var topMenu = $(".wqd-mainnavli").eq(nodeIndex),
                            cloneMenu = topMenu.clone();
                        if(tempIndex > nodeIndex){
                            $(".wqd-mainnavli").eq(tempIndex-1).after(cloneMenu);
                        }else{
                            $(".wqd-mainnavli").eq(tempIndex).before(cloneMenu);
                        }
                        topMenu.remove();

                        $(".wqd-mainnavli").find(".wqd-mainnava").removeClass("home-page");
                        $(".wqd-mainnavli").find(".wqd-mainnava").eq(0).addClass("home-page");
                        $(document).trigger("appSetCatch");
                    }
                }else{
                    var subList = $(".wqd-mainnavli").eq(node.parents(".subNavlist").parent("li").index()).find(".wqd-subnavul"),
                        subMenu = subList.find("li").eq(nodeIndex),
                        cloneMenu = subMenu.clone();
                    if(pagetarget!=null  && (pagetarget.outerHeight()/2 >pagetarget.data('minDis')/2)){
                        var editMenu = node.removeAttr('style').removeAttr('active').clone(true);
                        pagetarget.find(".subNavlist").append(editMenu);
                        node.remove();
                        ul.find('#_t').remove();
                        $(".wqd-mainnavli").eq(pagetarget.index()).find(".wqd-subnavul").append(cloneMenu);
                        subMenu.remove();
                        $(document).trigger("appSetCatch");
                    }else{
                        if(tempIndex != nodeIndex && tempIndex != nodeIndex+1){

                            if(tempIndex > nodeIndex){
                                subList.find("li").eq(tempIndex-1).after(cloneMenu);
                            }else{
                                subList.find("li").eq(tempIndex).before(cloneMenu);
                            }
                            subMenu.remove();
                            $(document).trigger("appSetCatch");
                        }
                    }

                    subList.find(".wqd-subnavli").removeClass("peak");
                    subList.find(".wqd-subnavli").eq(0).addClass("peak");



                }
                (isPage || pagetarget==null || pagetarget.outerHeight()/2 <pagetarget.data('minDis')/2) && node.removeAttr('style').removeAttr('active').replaceAll($('#_t'));

                $(document).off('mousemove.dragDrop');
                $(document).off('mouseup.dragDrop');
            }
            $(document).on('mouseup.dragDrop',moveRes);
        });

        function getDis(obj1,obj2){
            var a = obj1.offset().left - obj2.offset().left;
            var b = obj1.offset().top - obj2.offset().top;
            return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
        }

        function collide(obj1,obj2){
            var t1 = obj1.offset().top;
            var r1 = obj1.outerWidth() + obj1.offset().left;
            var b1 = obj1.outerHeight() + obj1.offset().top;
            var l1 = obj1.offset().left;

            var t2 = obj2.offset().top;
            var r2 = obj2.outerWidth() + obj2.offset().left;
            var b2 = obj2.outerHeight() + obj2.offset().top;
            var l2 = obj2.offset().left;

            if(t1>b2||r1<l2||b1<t2||l1>r2){
                return false;
            }else{
                return true;
            }
        }
    };

    return wqdNavDirect;
});