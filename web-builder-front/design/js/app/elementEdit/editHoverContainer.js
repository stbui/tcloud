/*
* @Author: liumingren
* @Date:   2016-03-17 13:42:08
* @Last Modified by:   liumingren
* @Last Modified time: 2016-06-13 09:50:05
*/
define(['utility','elementInfo','popupEdit','createColorStyle','popupBase'],function(_util,_ei,_pe,_css,PopupBase) {
	return {
        init:function () {
            this.bindEdit(".wqdelementEdit");
            $(document).on("mouseover",".wqdelementEdit.hoverContainer",function (e) {
                $(this).addClass("hover");
            }).on("mouseout",".wqdelementEdit.hoverContainer",function () {
                $(this).removeClass("hover");
            })
        },
        // 绑定编辑
        bindEdit:function (elm) {
            var self = this;
            $(document).on("elmenentEdit",function (e,data) {
                var $node = self.$element = data.element;
                if($node.attr("data-elementtype") == "hoverContainer") {
                    setTimeout(function () {
                        _ei.removeElementEditBtn();
                        //获取编辑器内容并打开
                        $.getJSON('../js/app/JSON/component/designHoverContainer.json', function (json, textStatus) {
                            var _popupBase = new PopupBase(self.$element, $.extend(json, {boxClass: "hoverContainer"}));
                            self.$editor = _popupBase.$editor;
                            self.tempModel = _popupBase.tempModel;
                            _pe.commonInit();
                            _popupBase.init();
                            self.setUI();
                            self.bindEvent();
                        });
                    }, 0);
                }
            });
        },
        /**
         * 回显样式
         */
        setUI:function () {
            var self = this;
            var setBaseStyle = function ($selected) {
                var selecttype = $selected.attr("data-selecttype");
                $selected.find("ul li").each(function (i,_) {
                    if($(_).attr("data-type") == selecttype){
                        $(_).addClass("on").siblings().removeClass("on").end()
                            .parents(".edit_select").eq(0).find("p span").html($(_).html());
                        var curr = selecttype == "scale" ? ".hc-scale" :
                                selecttype == "shadow" ? ".hc-shadow" :
                                    /right|top|bottom|left/ig.test(selecttype) ? ".hc-hoverposition" :
                                $selected.hasClass("editor-border-selected") && selecttype != "none" ? ".hc-border" : "";
                        curr && self.$editor.find(curr).show();
                        return false;
                    }
                })
            };
            //下拉框回显
            this.$editor.find(".edit_select").each(function (i,_) {
                setBaseStyle($(_));
            })
        },
        bindEvent:function () {
            var self = this,
                $decu = $(document);
            this.$editor.on("changeColor.hoverContainer", ".wqdColorPicker",function(e) {//更改颜色
                var $this = $(this);
                    $this.parents(".hc-shadow-color").length ? self.setShadow(false,$this.val()) : self.changeColor($this);
                $decu.trigger("appSetCatch");
            })
            .on("click.hoverContainer", ".editor-border-selected li", function() {//选择边框样式下拉项
                var $this = $(this),
                    type = $this.attr("data-type");
                self.setCss({"border-style":type});
                self.$editor.find(".hc-border").toggle(type != "none");
                $decu.trigger("appSetCatch");
            })
            .on("click.hoverContainer", ".editor-animate-box li", function() {//选择动画类型下拉项
                var $this = $(this);
                var type = $this.attr("data-type");
                self.setAttr("hoverAnimate",type);
                self.setScale($this,type != "scale");
                self.setShadow(type != "shadow");

                self.$editor.find(".hc-shadow,.hc-scale").hide();
                if(type == "shadow") {
                    self.$editor.find(".hc-shadow").show();
                }else if(type == "scale") {
                    self.$editor.find(".hc-scale").show();
                }
                $decu.trigger("appSetCatch");
            })
            .on("click.hoverContainer", ".editor-position-selected li", function() {//选择位置下拉项
                self.setPosition($(this));
                $decu.trigger("appSetCatch");
            })
            // .on("click.hoverContainer", ".quickest-list li", function() {//选择位置下拉项
            //     self.setAttr("link-quickest",$(this).attr("data-type"));
            //     $decu.trigger("appSetCatch");
            // })
            .on("click.hoverContainer", ".direction .editor-border-checkspan", function () {//边框位置
                var $par = $(this).parents(".direction");
                $par.toggleClass("active");
                var css = {};
                var isRemove = $par.hasClass("active");
                var type = $par.attr("data-type");
                // css[type] = isRemove ? "" : 0;
                css[type] = 0;
                self.setCss(css,isRemove);
                $(document).trigger("appSetCatch");
            })
            .on("click.hoverContainer",".editor-status-selected li" ,function () {
                self.setShowType($(this).attr("data-type"));
            })
            .on("click.hoverContainer",".hc-hover-play",function (e) {
                // self.$element.addClass("hc-play hover");
                var parentId = self.$element.attr("id"),
                    selector = "",
                    css = {
                        transform:"scale("+ (self.$element.attr("data-scale") || 2) + ")"
                    };
                _css.styleInit(parentId,selector,css);
                setTimeout(function () {
                    // self.$element.removeClass("hc-play hover");
                    _css.deleteStyle(parentId,selector,css);
                },300);
            })
            // 设置链接在新页面打开
            .on("popup:linkNewWindow",function (e,isNew) {
                self.setAttr("link-newWindow",isNew ? "on":"");
                $decu.trigger("appSetCatch");
            })
            .on("popup:setLink",function (e,value) {
                // self.setAttr("link-href",value , !!value);
                // $decu.trigger("appSetCatch");
            })
            .on("blur","input",function (e) {
                var type = $(this).attr("data-styletype"),
                    value = $(this).val();
                switch (type){
                    case "box-shadow-x": self.setShadowValue(type,value);break;
                    case "box-shadow-y": self.setShadowValue(type,value);break;
                }
                $decu.trigger("appSetCatch");
            })
            .find(".slider").each(function (i,_) {
                var $this = $(_);
                $this.parents(".scale").siblings("input").off("keydown");//range中也绑定了这事件了，先这里off掉
                var shadowblur = !!($this.parents(".hc-shadow-blur").length || $this.parents(".hc-border-width").length) ;
                var maxVal = shadowblur ? 100 : 3,
                    spaceNumber = shadowblur ? 0.1 : 1;
                _util.range({
                    slider : $this,
                    maxval : maxVal,
                    spaceNumber:spaceNumber,
                    callback : function(val,type,maxval,rangeVal,$node){
                        var styleType = $this.parents("[data-styletype]").attr("data-styletype");
                        if(styleType == "scale") {
                            self.setScaleNumber(rangeVal);
                            /hoverScale/g.test(self.$element.attr("data-style")) && self.setScale($node);
                        } else if(styleType == "box-shadow-blur") {
                            self.setShadowValue("box-shadow-blur",rangeVal);
                            self.setShadow();
                        } else if(styleType == "border-width") {
                            self.setBorder(rangeVal);
                        }
                        // $(document).trigger("appSetCatch");
                    }
                });
            });
        },
        setBorder:function (value) {
            this.setCss({
                "border-width":value
            })
        },
        setShowType:function (value) {
            this.$element.removeClass("hc-show-bottom hc-show-notfirst");
            switch (value) {
                case "all" : ;break;
                case "notfirst" : this.$element.addClass("hc-show-notfirst");break;
                case "bottom" : this.$element.addClass("hc-show-bottom");break;
            }
            this.setAttr("status",value);
            $(document).trigger("appSetCatch");
        },
        /**
         * 设置定位
         * @param $this
         */
        setPosition:function ($this) {
            var type = $this.attr("data-type"),css;
            var staticCss = this.$element.attr("data-static-position");
            var marTop = -this.$element.height()/2;
            switch (type) {
                case "none":css = $.extend(JSON.parse(staticCss),{"position":"","margin-top":0,"margin-left":0});break;
                case "right-top":css = {"position":"fixed","top":0,"right":0,"left":"auto","bottom":"auto","margin-top":0};break;
                case "right":css = {"position":"fixed","top":"50%","right":0,"left":"auto","bottom":"auto","margin-top":marTop};break;
                case "right-bottom":css = {"position":"fixed","top":"auto","right":0,"left":"auto","bottom":"0","margin-top":marTop};break;
                case "left-top":css = {"position":"fixed","top":0,"right":"auto","left":0,"bottom":"auto","margin-top":0};break;
                case "left":css = {"position":"fixed","top":"50%","right":"auto","left":0,"bottom":"auto","margin-top":marTop};break;
                case "left-bottom":css = {"position":"fixed","top":"auto","right":"auto","left":0,"bottom":"0","margin-top":marTop};break;
            }

            var $hoverPostions = this.$editor.find(".hc-hoverposition");


            if(type != "none") {
                this.insertSection();
                staticCss = {
                    left:this.$element.css("left"),
                    top:this.$element.css("top")
                };
                this.$element.attr("data-static-position",JSON.stringify(staticCss)).addClass("hc-fixed").removeClass("hc-fixed-right hc-fixed-bottom");
                /right/g.test(type) && this.$element.addClass("hc-fixed-right");
                /bottom/g.test(type) && this.$element.addClass("hc-fixed-bottom");

                $hoverPostions.show();
            } else {
                var baseSection = $("#"+this.$element.attr("data-base-section")).find(".sectionV2");
                this.$element.removeClass("hc-fixed").appendTo(baseSection);
                $hoverPostions.hide();
            }
            this.moveStyle();
            this.$element.css(css).attr("data-position-type",type);
            this.setAttr("hoverPosition",type);
        },
        getStyle:function () {
            var styles = this.$element.find(".wqdelementEdit").map(function (i,v) {
                var $style = $("style."+$(v).attr("id"));
                return $style.length ? $style[0] : null;
            });
            styles.push($("style."+this.$element.attr("id"))[0]);
            return styles;
        },
        moveStyle:function () {
            var self = this;
            var styles = this.getStyle();
            $.each(styles,function (i,_) {
                $(_).prependTo(self.$element.parents(".wqdSectiondiv"));
            });
        },
        /**
         * 设置放大的css样式
         * @param $node
         * @param isRemove
         */
        setScale:function ($node,isRemove) {
            var scaleStyle = "scale("+ (this.$element.attr("data-scale") || 2) + ")";
            this.setCss({"hoverScale":scaleStyle},isRemove);
        },
        /**
         * 设置放大的样式值
         * @param rangeVal
         */
        setScaleNumber:function(rangeVal){
            this.setAttr("scale",rangeVal);
            this.$element.attr("data-scale",rangeVal);
        },
        setShadow:function (remove,color) {
            var style = "";
            if(color) {
                this.tempModel["box-shadow-color"] = color;
                this.setAttr("box-shadow-color",color);
            }
            var css = {};
            $.each(this.tempModel,function (i,val) {
                i.replace(/box-shadow-(.*)/g,function(m,k){
                    css[k] = val;
                });
            });
            style = css.x + "px "+css.y+"px "+css.blur+"px "+css.color;
            this.setCss({"box-shadow":style},remove);
        },
        setShadowValue:function (type,value) {
            this.setAttr(type,value);
            this.tempModel["box-shadow"] && this.setShadow();
        },
        /**
         * 设置颜色
         * @param $colorInput
         */
        changeColor : function ($colorInput) {
            var color = $colorInput.val(),
                css   = {};
            var cssType = $colorInput.parents("[data-styletype]").eq(0).attr("data-styletype");
            css[cssType] = color;
            this.setCss(css);
            $colorInput.prev("span").find("i").css({"background":color});
        },
        setCss : function (data,isRemove) {
            var parentId = this.$element.attr("id"),
                css = {}, selector = "",removes;
            for (var i in data) {
                if(/hoverColor|hoverScale|shadow/ig.test(i)) {
                    var key = {
                            "bgHoverColor":"background-color",
                            "borderHoverColor":"border-color",
                            "hoverScale":"transform"
                        }[i] || i,
                        value = i == "hoverScale" ? data[i] : data[i]+"!important";
                    css[key] = value;
                    selector +=  i == "borderHoverColor" ? ">.wqdelementEditBox:hover" :":hover";
                    isRemove ? _css.deleteStyle(parentId,selector,css,true) : _css.styleInit(parentId,selector,css,true);
                } else if(/border/.test(i)){
                    selector += ">.wqdelementEditBox";
                    //无边框时添加虚线
                    i == "border-style" && data[i] == "none" ? this.$element.addClass("no-border") : this.$element.removeClass("no-border");
                    css[i] = /width/g.test(i) ? data[i]+"px" : data[i];
                    isRemove ? _css.deleteStyle(parentId,selector,css,true) : _css.styleInit(parentId,selector,css,true);
                } else {
                    this.$element.css(i,isRemove ? "" : data[i]);
                }
                //设置样式后设置属性回显
                this.setAttr(i,data[i],isRemove);
            }
        },
        /**
         * 设置data-style属性用于回显
         */
        setAttr:function (type,value,isRemove) {
            if(!type) return;
            var style    = this.$element.attr("data-style")||"",
                reg      = new RegExp(type+":[^;]+;","g"),
                stylrStr;

            stylrStr= isRemove ? "" : type + ":" + value + ";";
            style = reg.test(style) ? style.replace(reg,stylrStr) : style + stylrStr;
            this.tempModel[type] = value;//模版数据中更新值
            this.$element.attr("data-style",style);
        },
        insertSection:function () {
            var self = this,
                temp = "<div class='wqdSectiondiv hoverCon-section'>\
                            <section class='sectionV2 wqdBkEditos moveMainArea elementsContainer' style='{{sectionStyle}}' sectionwidth='1200'></section>\
                        </div>",
                partId = "wqd" + new Date().getTime() + "serial",
                sectionStyle = "",$parent;
            sectionString = _util.format(temp,{
                sectionStyle:"height: 0;position: relative;z-index: 998;"
            });
            this.$element.attr("data-base-section",this.$element.parents(".wqdSectiondiv").attr("id"));
            $parent = $(".hoverCon-section").length ? $(".hoverCon-section") : $(sectionString);
            $parent.find(".sectionV2").append(this.$element).end().appendTo('#HTMLDATAFOOTER .wqdView');
        }
    };
});

