/*
 * @Author: liumingren
 * @desc:   设置弹窗公共类
 * @Date:   2016-05-12 10:03:17
 * @Last Modified by:   liumingren
 * @Last Modified time: 2016-06-28 15:34:29
 */
define(['utility'],function(_util) {
    /**
     * 目前部分原有popupEdit.commonInit的并未提取过来，仅作为一个补充。后续应当逐步合并去除popupEdit.commonInit方法的使用
     *         弹窗结构亦暂且沿用之前结构，各元素设置弹窗统一之后统一调整。
     * @param $elem 所操作的元素的jquery对象
     * @param json  弹窗模版的json文件内容
     * @param config
     * @constructor
     */
    function PopupEditor($elem,json,config) {
        this.$element = $elem;
        this.tempModel = json.defaultStyle;
        this.setColorBox(json,config);
    }
    PopupEditor.prototype = {
        init:function () {
            this.setUI();
            this.bindEvent();
        },
        setUI:function () {
            var self = this;
            var linkTemp = "<li data-type='{{partid}}'>{{text}}</li>";
            var thispage = $(".pagedeatllist .plist.on .usercontent li").map(function (i,_) {
                var $this = $(_);
                return {
                    partid:$this.attr("partid")||"",
                    text:$this.find("em").text()||""
                };
            }).get();
            var sitepage = $(".pagedeatllist > li").not("[viewnews]").map(function (i,_) {
                var $this = $(_);
                return {
                    partid:$this.attr("data-uri")||"",
                    text:$this.find(".pageShow em").text()||""
                }
            }).get();
            this.$editor.find(".thispage-list").html(_util.format(linkTemp,thispage));
            this.$editor.find(".sitepage-list").html(_util.format(linkTemp,sitepage));
            //回显超链接页样式
            this.setEditorLink(this.$editor.find(".linkpoint i.radio").eq(this.$element.attr("wqdhref")));
            //下拉框设置为选中
            // this.$editor.find(".edit_selectBox").each(function (i,_) {
            //     var selecttext = $(_).find("p span").text();
            //     $(_).find("ul li").each(function (i,__) {
            //         if($.trim($(__).text()) == $.trim(selecttext)) {
            //             $(__).addClass("on").siblings("li").removeClass("on");
            //             return false;
            //         }
            //     })
            // }).end();
            this.$editor.find(".edit_selectBox").each(function (i,_) {
                var $this = $(_),
                    selecttext = $this.find("p span").text(),
                    value = $this.closest("[tp-value]").attr("tp-value"),
                    isfont = $this.closest("[tp-type]").attr("tp-type") == "font-family";
                $this.find("ul li").each(function (i,__) {
                    var text = $.trim($(__).text());
                    if( text == $.trim(selecttext) || $(__).attr("data-type") == value) {
                        $(__).addClass("on").siblings("li").removeClass("on");
                        isfont || $this.find(".edit_select > p > span").text(text);
                        return false;
                    }
                })
            });
            this.$editor.find(".edit-selectview").each(function (i,_) {
                var value = $(_).closest("[tp-value]").attr("tp-value");
                $(_).find(".selectview-bl").each(function (i,__) {
                    if($(__).attr("data-type") == value) return $(__).addClass("active").siblings(".selectview-bl").removeClass("active"),false;
                })
            })
            this.$editor.find(".on_off").each(function (i,_) {
                if($(_).attr("tp-on") == "on") {
                    self.toggleOn($(_),true);
                }
            })
        },
        bindEvent:function () {
            var self = this;
            this.$editor.off(".popupBase")
                .on("click.popupBase", ".edit_search ul li", function() {//tab列表切换
                    self.changeTab($(this));
                })
                .on("changeColor.popupBase", ".wqdColorPicker",function(e) {//更改颜色
                    $(this).siblings(".colordeviceBg").find("i").css({"background":$(this).val()});
                })
                // .on("click.popupBase", ".edit_content_nav li", function() {//左侧子tab切换 沿用popupEdit中的
                //     if ($(this).hasClass("imagesEdit") || $(this).hasClass("imagesSet")) {
                //         $(".super_editor .editor_footer>a").attr("picBox", "true");
                //     } else {
                //         $(".super_editor .editor_footer>a").attr("picBox", "false");
                //     }
                //     $('.super_editor .part4_content .img_box_panel>a').css("display", "none");
                //     // if ($(this).hasClass("on")) return false;
                //     var index = $(this).index();
                //     $(this).addClass("on").siblings().removeClass("on")
                //         .parents("nav.edit_content_nav").siblings("ul.edit_content").children().removeClass("on").eq(index).addClass("on");
                //     $(".nano").nanoScroller({
                //         alwaysVisible: true
                //     });
                //     return false;
                // })
                .on("click.popupBase",".edit_navlist li",function () {//默认、悬停、选中点击
                    var $this = $(this),
                        index= $this.index();
                    $this.addClass("on").siblings("li").removeClass("on").end()
                        .parents(".edit_navlist").siblings(".edit_box").removeClass("selected").eq(index).addClass("selected");
                })
                .on("click.popupBase", ".edit_selectBox p", function() {//展开收起下拉
                    if($(this).hasClass("readonly") || $(this).hasClass("disabled")) return;
                    self.$editor.find(".edit_selectBox .edit_select").not($(this).parents(".edit_select")).find("ul").hide();
                    $(this).toggleClass("on").parents(".edit_select").find("ul").toggle().end().find(".selectWarp").toggle();
                    $(this).siblings(".nano").height(128).nanoScroller({alwaysVisible: true});
                })
                .on("click.popupBase", ".edit_selectBox li", function() {//选择下拉项
                    var $this = $(this),url = $this.attr("data-type");
                    $this.addClass("on").siblings().removeClass("on").end()
                        .parents(".edit_select").find("ul,.selectWarp").hide().end()
                        .find("p").removeClass("on")
                        .find("span").html($(this).html()).end();
                    if($this.parents(".linkpoint").length){
                        if($this.parents(".thispage").length) url = "#" + url;
                        self.setLink( url ,$this);
                    }
                })
                .on("click.popupBase",".selectview-bl",function (e) {//设置标签样式
                    $(this).parents(".selectview-box").find(".selectview-bl").removeClass("active");
                    $(this).addClass("active");
                })
                .on("click",".on_off",function () {//收起展开悬浮隐藏等
                    self.toggleOn($(this));
                    $(this).trigger("changeOnOff");
                })
                .on("keydown.popupBase",".edit_fontbox input,.edit_unitbox input",function(e){//修改字体大小
                    var value = $(this).val();
                    if(e.keyCode == 38){
                        $(this).val(++value);
                    }else if(e.keyCode == 40){
                        $(this).val(--value);
                    } else if(e.keyCode == 13) {
                        $(this).blur();
                    }
                })
                //编辑器弹窗关闭
                .on("click",".edit_close",function() {
                    $.fn.colorbox.close();
                })
                .find(".edit_fontbox input,.editor-font-size input").on("blur.popupBase",function(){
                    var val = $(this).val().replace(/[^0-9]/g,"");
                    if(val < 12) val = 12;
                    $(this).val(val);
                })
                .on("input.popupBase",function(e){
                    var val = $(this).val().replace(/[^0-9]/g,"");
                    $(this).val(val);
                }).end()
                .on("click.popupBase", ".edit_detail .editor-font-weight,.edit_detail .editor-font-style", function() {//字体加粗 倾斜
                    var $this = $(this), value = "";
                    if($this.hasClass("on")) {
                        $this.removeClass("on");
                        value = "normal";
                    } else {
                        $this.addClass("on");
                        value = $this.hasClass("editor-font-weight") ? "700" : "italic";
                    }
                    self.$element.trigger("changeFont",{
                        node:$this,
                        value:value
                    });
                })
                .on("click.popupBase", ".linkpoint i.radio", function () {//选择链接，基本沿用popupedit文件中，略作修改
                    self.setEditorLink($(this),true);
                    self.$editor.find(".edit_selectBox .edit_select ul").hide();
                    self.$editor.find(".linkpoint i.radio").index($(this))==0 && $(document).trigger('appSetCatch');
                    return false;
                })
                .find(".linkpoint .desp span").on("click",function () {

                    var selector = $(this).closest("[data-selector]").length ? $(this).closest("[data-selector]").attr("data-selector") : "";
                    var $elem = selector ? self.$element.find(selector) : self.$element;

                    $(this).toggleClass("on");
                    var isNew = $(this).hasClass("on");
                    $elem.attr("data-link-newWindow",isNew);
                    $(this).trigger("popup:linkNewWindow",isNew);
                    $(document).trigger("appSetCatch");
                }).end()
                .on("popup:setLink",function(e,obj){
                    var linkpoint = self.$editor.find("ul.linkpoint"),
                        node = $(e.target),
                        elem = obj.elem,
                        val = obj.val,
                        index = obj.ind;
                    if(!elem.parents(".wqdNavTemplate").length) return;
                    if(index == 1){
                        linkpoint.find(".sitepage-list, .thispage-list").find("li").removeClass("on").parents(".edit_select").find("p span").text("请选择");
                        linkpoint.find(".outside-chain input").val("").siblings(".desp").find("span").removeClass("on");
                         elem.removeAttr("pageid");
                    }else if(index == 3){
                        linkpoint.find(".quickest-list, .thispage-list").find("li").removeClass("on").parents(".edit_select").find("p span").text("请选择");
                        linkpoint.find(".outside-chain input").val("");
                        var link =elem.attr("data-link-href") || "",
                            pageid = $(".pagedeatllist>li[data-uri='"+link+"']").attr("pageid");
                        elem.attr("pageid",pageid);
                    }else if(index == 2){
                        linkpoint.find(".quickest-list, .sitepage-list").find("li").removeClass("on").parents(".edit_select").find("p span").text("请选择");
                        linkpoint.find(".outside-chain input").val("");
                        elem.attr("pageid",$(".pagedeatllist>li.on").attr("pageid"));
                    }else{
                        linkpoint.find(".quickest-list, .sitepage-list, .sitepage-list").find("li").removeClass("on").parents(".edit_select").find("p span").text("请选择");
                        elem.removeAttr("pageid");
                    }
                    if(node.parents(".sitepage-list").length){
                        //判断链接是不是本页 然后增加选中状态
                        var pageSrc = $(".pagedeatllist>li.on").attr("data-uri"),
                            isHomepage = elem.attr("data-link-href") == $(".pagedeatllist>li").eq(0).attr("data-uri") ? true : false;
                        elem.parent().siblings("li").each(function(){
                            if($(this).children("a").attr("data-link-href")==elem.attr("data-link-href")) $(this).children("a").removeAttr("wqdhref data-link-newwindow pageid homepage data-link-href");
                        });
                        if(elem.attr("data-link-href") == pageSrc){
                            elem.parent().addClass("active").siblings("li").removeClass("active");
                        }else{
                            elem.parent().removeClass("active");
                        }
                        isHomepage && elem.attr("homePage",true);
                        !isHomepage && elem.removeAttr("homePage");
                    }else{
                        elem.removeAttr("homePage").parent().removeClass("active");
                        if(node.parents(".thispage-list").length){
                            val = $(".pagedeatllist>li.on").attr("data-uri")+"#"+val;
                            elem.attr("data-link-href",val);
                        }
                    }
                });
                self.$editor.find(".outside-chain input").on('click',function(){
                    if($(this).val()==""){
                        $(this).val("http://");
                        toEnd($(this));
                    }
                    function toEnd (id){
                        var obj = window.event.srcElement;
                        if(obj && obj.createTextRange){
                            var range = obj.createTextRange();
                            range.moveStart("character", $(id).val().length);
                            range.select();
                        }
                    }
                });
                self.$editor.find(".outside-chain input").on("blur",function () {
                    var val = $(this).val() || "";
                    if(!/http:|https:|mailto:|tel:|sms:|market:|geopoint:/.test(val) && val) {
                        val = "http://"+ val;
                        $(this).val(val);
                    } else if(val == "http://") {
                        val = "";
                    }
                    self.setLink(val,$(this));
                });

        },
        toggleOn:function ($node,status) {
            $node.toggleClass("on").parents(".edit_unitbox").siblings(".hoverset").toggleClass("on");
            status = status || $node.hasClass("on");
            this.$editor.find("."+$node.attr("tp-of")).toggleClass("hidden",!status);
        },
        setEditorLink:function ($node,isSelect) {
            if(!$node.length) return;
            var $linkpoint = $node.parents(".linkpoint").eq(0),
                $theLi = $node.parents("li").eq(0);


            var radioIndex = $linkpoint.find("label>i.radio").index($node);
            if (radioIndex == 0 || radioIndex == 1 ||radioIndex == 2) {
                this.$element.find(".wqdelementEditBox").removeAttr("target").parents(".wqdelementEdit").removeAttr("targetnew");
                //$linkpoint.find(".desp span").removeClass("on");
                //是否在新页面打开
                $('.desp').hide();
            } else {
                //是否在新页面打开
                $('.desp').show();
            }
            var selector = $node.closest("[data-selector]").length ? $node.closest("[data-selector]").attr("data-selector") : "";
            var $elem = selector ? this.$element.find(selector) : this.$element;
            //$elem.attr("wqdhref",radioIndex)
            $elem.attr("data-link-newwindow") == "true" && $linkpoint.find(".desp span").addClass("on");
            $elem.attr("data-link-newwindow") != "true" && $linkpoint.find(".desp span").removeClass("on");
            $linkpoint.find("i.radio").removeClass("on").end()
                .find(".edit_select p").addClass("disabled").end()
                .find("input.submit").attr("disabled", "disabled");

            $node.addClass("on");
            $theLi.find(".edit_select p").removeClass("disabled").end().find(".submit").removeAttr("disabled");
            $linkpoint.find(".edit_select").removeClass("on").find("p").removeClass("on").find("i").removeClass("on");
            $linkpoint.find(".selectWarp").hide();
            var $outSideLink = $linkpoint.find(".outside-chain input.submit");
            if(radioIndex == 0) {
                $elem.removeAttr("data-link-href pageid homepage wqdhref data-link-newwindow");
                $linkpoint.find(".outside-chain input").attr("disabled", "disabled");
                //点击无连接的时候  全部清空 选中的首页样式也取消
                if($elem.parents(".wqdNavTemplate").length){
                    $node.parent().parent().siblings("li").find(".edit_select p span").text("请选择");
                    $elem.parent().removeClass("active");
                }
            }
            if(radioIndex != 4) {
                $outSideLink.val("");
            } else if(!isSelect) {
                $linkpoint.find(".outside-chain input.submit").val($elem.attr("data-link-href")||"");
            } else if(!$outSideLink.val()) {
                
            }



        },
        setLink:function (value,$node) {
            var index = $node.parents("li.no").index(),
            selector = $node.closest("[data-selector]").length ? $node.closest("[data-selector]").attr("data-selector") : "";
            value = value || "";
            var $elem = selector ? this.$element.find(selector) : this.$element;
            value ? $elem.attr("data-link-href",value) : $elem.removeAttr("data-link-href");
            if(value.indexOf("#") == 0) {
                value = value.substring(1);
            }
            this.setAttr("link-href",value ,value == "");
            $elem.attr("wqdhref",index);
            $node.trigger("popup:setLink",{elem:$elem,val:value,ind:index});
            $(document).trigger("appSetCatch");
        },
        changeTab : function ($node) {
            $node.addClass("on").siblings().removeClass("on").end()
                .parents(".edit_search").parent().find(".common_content").eq($node.index()).removeClass("hidden").siblings(".common_content").addClass("hidden");
        },
        /**
         * 设置data-style属性用于回显
         */
        setAttr:function (type,value,isRemove) {
            if(!type) return;
            var style    = this.$element.attr("data-style")||"",
                reg      = new RegExp(type+":[^;]*;","g"),
                stylrStr;
            // if(/font-weight|font-style/g.test(type)) {
            //     value = value == "normal" ? "":"on";
            // }

            stylrStr= isRemove ? "" : type + ":" + value + ";";
            style = reg.test(style) ? style.replace(reg,stylrStr) : style + stylrStr;
            this.tempModel[type] = value;//模版数据中更新值
            this.$element.attr("data-style",style);
        },
        //根据模版生成设置菜单
        getTempalte : function (json) {
            var data = $.extend({},json);
            data.search = data.search || "";
            data.content = json.content.default || $.map(json.content,function (v,i) {
                    return v;
                }).join("") || "";
            data.boxClass = data.boxClass || "";
            var html = "<div class='wqdEditBox {{boxClass}}'>{{header}}{{search}}\
                            <div class='edit_content edit_contentbox'>{{content}}</div>\
                        </div>";
            //替换变量
            html = this.setTemp(_util.format(html,data));
            if(json.selectContent) {
                html += json.selectContent;
            }
            return html;
        },
        //根据模版替换变量
        setTemp : function (temp,callback) {
            var self  = this,
                style = this.$element.attr("data-style") || "";
            $.each(style.split(";"),function (i,_) {
                if(!_) return true;
                var key = _.split(":");
                self.tempModel[key[0]] = key[1];
            });
            callback && typeof(callback) === "function" && callback(self);
            return _util.format(temp,this.tempModel);
        },
        setColorBox : function(json,config) {
            var  self= this;
            config = $.extend({
                transition:"none",
                opacity:0.5,
                fixed:true,
                html:self.getTempalte(json),
                closeButton:false,
                onOpen:function(){
                    window.scroll_top = $(document).scrollTop();
                },
                onComplete:function(){
                    self.$editor = $(".wqdEditBox");
                },
                onCleanup:function(){
                    self.$element.trigger("popupClosed");
                },
                onClosed:function(){
                }
            },config||{});
            $.colorbox(config);
        }
    };

    return PopupEditor;
});

