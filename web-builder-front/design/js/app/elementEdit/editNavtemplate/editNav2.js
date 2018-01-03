/**
 * Created by user on 2016/6/14.
 */
define(['utility','createColorStyle','popupEdit','popupBase'],function(utility,createColorStyle,popupEdit,popupBase) {
    var wqdNavTemp = {};
    wqdNavTemp.init = function () {
        var self = this;
        $(document).on("elmenentEdit",function (e,data) {
            if(data && data.element && data.element.attr("data-elementtype") == "navTemplate2"){
                self.editDom = data.element|| $(".wqdelementEdit.onEditing");
                setTimeout(function(){
                    //加载json
                    $.getJSON('../js/app/JSON/navtemplate/designControlNav2.json', function(json, textStatus) {
                        self.popupBase = new popupBase(self.editDom,$.extend(json,{boxClass:"extendNav"}));
                        self.editor = self.popupBase.$editor;
                        self.popupBase.init();
                        popupEdit.commonInit();
                        self.bindEvent();
                    });
                },0);
            }
        });
    };

    //初始化设计器列表
    wqdNavTemp.initialize= function () {
        var dom = this.editDom,
            editor = this.editor;
        //生成菜单列表
        var html = "";
        dom.find(".navTop_list>li>a.a_bottom").each(function(){
            html += '<li class="mian-point"><p><i class="dragMark"></i><span>'+$(this).html()+'</span><em class="deleteMenu firstMenu" title="删除"></em></p></div>';
        });
        editor.find(".topNavlist").append(html);
        editor.find(".nano").nanoScroller({alwaysVisible: false});
        var titleFont = editor.find(".borerwidthselect.title-font >p>span").eq(0).text();
        editor.find(".borerwidthselect .title-font li").map(function(index,item){
            if($(item).find("span").text()==titleFont) return item;
        }).addClass("on").siblings().removeClass("on");
        //固定、跟随
        dom.parents(".wqdCommonNav").attr("wqdnavstickyed") && editor.find(".bgeffect .edit_radioorno i").removeClass("on").eq(1).addClass("on");
        var borderDom = editor.find(".edit_navUl .edit4 .nav-default .check-btn");
        !borderDom.hasClass("on") && borderDom.parent().nextAll().addClass("wqd-border").parent(".nav-default").siblings(".nav-selected").children(".pro-content").addClass("wqd-border");
        //隐藏一些选项
        editor.find(".switch, .edit_alignment").hide();
        editor.find(".edit_navUl .edit2, .edit_navUl .edit3, .edit_navUl .edit4").css("margin-top",-20);
        editor.find(".edit_navUl .edit3 .edit_box .pro-content:first-child").hide();
        editor.find(".edit_navUl .edit4 .edit_box .pro-content:first-child").hide();
        editor.find(".edit_navUl .edit5 .pro-content:last-child").hide();
        editor.find(".edit_navlist").find("li:eq(1)").hide();
        editor.find(".edit_navlist li").css("width","49.9%");
        editor.find(".switch-point").css("top",0);
    };
    wqdNavTemp.bindEvent=function () {
        this.initialize();
        var dom = this.editDom,
            editor = this.editor;
        utility.wqdListDrag({
            navDom : dom,
            obj : editor,
            dragAfter : function(parame1,param2,param3,parame4){
                if(parame1==1){
                    var topMenu = $(this).find(".navTop_list > li").eq(param2),
                        cloneMenu = topMenu.clone();
                    $(this).find(".navTop_list > li").eq(parame4)[param3](cloneMenu);
                    topMenu.remove();
                }
            }
        });
        editor.find(".dragMark").on("click",function(event){event.stopPropagation();});
        //添加一级菜单
        editor.find(".wqd-increasef").on("click",function(){
            var navDom = dom.find(".navTop_list>li:first-child").clone(true),
                newDom = editor.find(".topNavlist li").eq(0).clone(true);
            newDom.find("span").text("新菜单");
            navDom.removeClass("active").children("a").removeAttr("wqdhref data-link-newwindow homepage data-link-href").text("新菜单");
            dom.find(".navTop_list").append(navDom);
            editor.find(".topNavlist").append(newDom);
            editor.find(".nano").nanoScroller({alwaysVisible: false});
            $(document).trigger("appSetCatch");
        });
        //删除一级菜单
        editor.find(".topNavlist li .deleteMenu").on("click",function(){
            if(editor.find(".topNavlist li").length == 1){
                alert("请最少保留一个一级菜单！");
                return;
            }
            var index = $(this).parent().parent().index();
            dom.find(".navTop_list li").eq(index).remove();
            $(this).parent().parent().remove();
            $(document).trigger("appSetCatch");
        });
        //颜色
        editor.on("changeColor", ".wqdColorPicker",function(){
            var that = $(this),
                type = that.attr("data-type") || "",
                dataStyle = wqdNavTemp.updataStyle((dom.attr("data-style") || ""),type),
                elemId = dom.attr("id") || "",
                colorVal = that.val(),
                cssstyle = {"title-color":{"color":colorVal},"title-selectcolor":{"color":colorVal},"title-bg":{"background-color":colorVal},"title-selectbg":{"background-color":colorVal},"border-color":{"border-color":colorVal},"border-selectcolor":{"border-color":colorVal}},
                selecter = {"title-color":".navTop_list li a.a_bottom","title-selectcolor":".navTop_list li a.a_top","title-bg":".navTop_list li a.a_bottom","title-selectbg":".navTop_list li a.a_top","border-color":".navTop_list li a.a_bottom","border-selectcolor":".navTop_list li a.a_top"};
            createColorStyle.styleInit(elemId,selecter[type],cssstyle[type]);
            dataStyle += type + ":" + colorVal + ";";
            dom.attr("data-style",dataStyle);
            $(document).trigger("appSetCatch");

        });
        //弹出收起下拉列表
        editor.find(".borerwidthselect").on("click",function(){
            if($(this).hasClass("disabled")) return;
            var selectList = $(this).find("ul");
            if(selectList.is(":visible")){
                selectList.hide()
            }else{
                editor.find(".borerwidthselect ul").not(selectList).hide();
                selectList.show();
                $(this).find(".nano").nanoScroller({alwaysVisible: false});
            }
        });
        //选择字体
        editor.find(".borerwidthselect .title-font li").on("click",function(){
            if($(this).hasClass("on")) return;
            var that = $(this),
                font =that.find("span").text() || "微软雅黑",
                type = that.parents(".borerwidthselect").attr("data-type") || "",
                dataStyle = wqdNavTemp.updataStyle((dom.attr("data-style") || ""),type),
                elemId = dom.attr("id") || "",
                selecter = {"title-font":".navTop_list li a"};
            $(this).addClass("on").siblings().removeClass("on").parents(".borerwidthselect").find("P span").text(that.find("span").text());
            createColorStyle.styleInit(elemId,selecter[type],{"font-family":font});
            dataStyle += type + ":" + font + ";";
            dom.attr("data-style",dataStyle);
            $(document).trigger("appSetCatch");
        });
        //字体加粗\斜体
        editor.find(".edit_unitbox.edit_detail strong , .edit_unitbox.edit_detail em").on("click",function(){
            var that = $(this),
                type = that.attr("data-type") || "",
                dataStyle = wqdNavTemp.updataStyle((dom.attr("data-style") || ""),type),
                elemId = dom.attr("id") || "",
                val = that.hasClass("on") ? " " : "on",
                cssObj = that.hasClass("on") ? {"font-weight":{"font-weight":"400"},"font-style":{"font-style":"normal"}} : {"font-weight":{"font-weight":"700"},"font-style":{"font-style":"italic"}};
            dataStyle += type + ":" + val + ";";
            createColorStyle.styleInit(elemId,".navTop_list li a",cssObj[type]);
            dom.attr("data-style",dataStyle);
            that.toggleClass("on");
            $(document).trigger("appSetCatch");
        });
        //间距、高度
        editor.find(".slider").each(function(i){
            var That = $(this),
                type = That.attr("data-type"),
                typeObj1 = {"font-size":30,"border-size":10,"menu-redius":50,"menu-width":50,"menu-height":50},
                typeObj2 = {"font-size":12,"border-size":0,"menu-redius":0,"menu-width":0,"menu-height":0};
            utility.range({
                slider : That,
                maxval : typeObj1[type],
                minval : typeObj2[type],
                callback : function(){
                    var val = That.parent().siblings("input").val() || 0;
                    wqdNavTemp.changeSize(type,val);
                }
            });
        });
        //边框显示、隐藏
        editor.find(".pro-content .check-btn").on("click",function(){
            var that = $(this),
                action = "nav-border:;",
                cssObj = {border:"none!important"},
                dataStyle = wqdNavTemp.updataStyle((dom.attr("data-style") || ""),"nav-border"),
                elemId = dom.attr("id") || "";
            if(that.hasClass("on")){
                that.parent().nextAll().addClass("wqd-border").parent(".nav-default").siblings(".nav-selected").children(".pro-content").addClass("wqd-border");
                createColorStyle.styleInit(elemId,".navTop_list li a",cssObj);
            }else{
                that.parent().nextAll().removeClass("wqd-border").parent(".nav-default").siblings(".nav-selected").children(".pro-content").removeClass("wqd-border");
                createColorStyle.deleteStyle(elemId,".navTop_list li a",cssObj);
                action = "nav-border:on;";
            }
            dataStyle += action;
            dom.attr("data-style",dataStyle);
            that.toggleClass("on");
            $(document).trigger("appSetCatch");
        });
        //边框位置
        editor.find(".borderPosition .direction").on("click",function(){
            var that = $(this),
                type = that.attr("data-type") || "",
                action = that.hasClass("active") ? "none" : "solid",
                arr = that.hasClass("active") ? "" : "active",
                dataStyle = wqdNavTemp.updataStyle((dom.attr("data-style") || ""),type),
                elemId = dom.attr("id") || "",
                cssstyle = {"border-top":{"border-top-style":action},"border-bottom":{"border-bottom-style":action},"border-left":{"border-left-style":action},"border-right":{"border-right-style":action}};
            
            createColorStyle.styleInit(elemId,".navTop_list li a",cssstyle[type]);
            dataStyle += type + ":" + arr + ";";
            dom.attr("data-style",dataStyle);
            that.toggleClass("active");
            $(document).trigger("appSetCatch");
        });
        //固定、跟随
        editor.find(".bgeffect .edit_radioorno").on("click",function(){
            if($(this).find("i").hasClass("on")) return;
            var that = $(this),
                navobj = dom.parents(".wqdCommonNav"),
                navState = that.attr("navState") || "";
            navState == "1" ? navobj.removeAttr("wqdnavstickyed") : navobj.attr("wqdnavstickyed","on");
            that.siblings("label").find("i").removeClass("on");
            that.find("i").addClass("on");
            $(document).trigger("appSetCatch");
        });
        //菜单文字
        editor.find(".wqd-nnavlink .content-set .textVal").on("blur",function(){
            var textVal = $(this).val().replace(/\s/g,"&nbsp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),
                menu = editor.find(".topNavlist .wqd-selected").parent();
            if(!textVal){
                textVal = menu.find("p span").text();
                $(this).val(textVal);
            }
            if(textVal != menu.find("p span").text()){
                menu.find("p span").html(textVal);
                dom.find(".navTop_list li").eq(menu.index()).children("a").html(textVal);
                $(document).trigger("appSetCatch");
            }
        });
        //展开链接设置层
        editor.on("click.menu", ".topNavlist span", function (e) {
             var _this=this, self = editor;
            $(".topNavlist span").parent("p").removeClass("wqd-selected");
            var index = $(this).parents(".mian-point").index(".topNavlist>li");
            //var _index=$(this).parents(".sub-point").index(".subNavlist>li");
            //给链接设置设置选择器
            if($(this).parent("p").hasClass("wqd-selected"))return;
            $(this).parent("p").addClass("wqd-selected");
            var $wqdLink=self.find(".wqd-nnavlink");
            $wqdLink.css("display","block").stop().animate({left: "344px",opacity:"1"}, 300);
            if($(this).parents(".sub-point").length){
                //$wqdLink.attr("data-selector",".wqd-mainnavli:eq("+index+") .wqd-subnava:eq("+_index+")")
            }else{
                $wqdLink.attr("data-selector",".navTop_list li:eq("+index+") a");
            }
            self.find(".wqd-nnavlink .edit_select>p>span").text("请选择")
            self.find(".wqd-nnavlink .edit_select ul li").removeClass("on");
            self.find(".wqd-nnavlink").children().each(function (i, _) {
                var $elmNode = dom.find($(this).parents("[data-selector]").attr("data-selector"));
                var _wqdhref=$elmNode.attr("wqdhref");
                var _linkhref=$elmNode.attr("data-link-href");
                var _newwindow=$elmNode.attr("data-link-newwindow");
                var $outSideLink = $(".linkpoint").find(".outside-chain input.submit");
                var $radio=self.find(".linkpoint i.radio");
                var $edit_select=self.find(".edit_select");
                var $_optionsEle=self.find(".linkpoint>li").eq(_wqdhref).find(".edit_select p");
                if(i==1){
                    $(this).find(".textVal").val($(_this).text());
                }
                if(i==2){
                    wqdNavTemp.popupBase.setEditorLink(self.find(".linkpoint i.radio").eq($elmNode.attr("wqdhref")||0));
                    if(_newwindow==true)self.find(".desp span").addClass("on");
                    // if(!_wqdhref){
                    //     $radio.removeClass("on").eq(0).addClass("on");
                    //     $edit_select.find("p").addClass("disabled").children("span").html("请选择");
                    //     self.find(".desp").hide();
                    // }
                    // if(_wqdhref != 4) {
                    //     $outSideLink.val("");
                    // }
                    var _optionsText=$_optionsEle.next().find("li").map(function (i,_) {
                        _wqdhref == "2" && _linkhref && (_linkhref = _linkhref.substring(_linkhref.indexOf("#")+1));
                        if($(_).attr("data-type")==_linkhref){
                            return $(_).html()
                        }
                    })[0];
                    $_optionsEle.find("span").html(_optionsText);
                }
            });
        });
        //收回列表设置层
        editor.on("click.menu", ".link_close", function (e) {
            e.stopPropagation();
            $(this).parents(".wqd-nnavlink").stop().animate({left: "0",opacity:"0"}, 300);
        });

    };
    wqdNavTemp.changeSize = function(type,val){
        var dom = wqdNavTemp.editDom,
            editor = wqdNavTemp.editor;
            dataStyle = wqdNavTemp.updataStyle((dom.attr("data-style") || ""),type),
            thisVal = val + "px",
            elemId = dom.attr("id") || "",
            cssObj = {"font-size":{"font-size":thisVal},"border-size":{"border-width":thisVal},"menu-redius":{"border-radius":thisVal},"menu-width":{"padding-left":thisVal,"padding-right":thisVal},"menu-height":{"padding-top":thisVal,"padding-bottom":thisVal}};
        dataStyle += type + ":" + val + ";";
        dom.attr("data-style",dataStyle);
        createColorStyle.styleInit(elemId,".navTop_list li a",cssObj[type]);
        $(document).trigger("appSetCatch");
    }
    //去掉已存在data-style项
    wqdNavTemp.updataStyle = function(str,key){
        if(str && key){
            var arr = str.split(";");
            arr = $.map(arr,function(item,index){
                if(item.indexOf(key+":")<0) return item;
            });
            str = arr.join(";");
        } 
        return str;
    }
    return wqdNavTemp;
});