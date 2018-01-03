define(['createColorStyle','popupEdit','popupDrag'], function(createColorStyle,popupEdit) {
    var popupFormBoxEdit = {};
    var obj ;
    popupFormBoxEdit.formboxInit = function(node) {
        obj = node;
        this.lookStyle();
        popupEdit.commonInit();
        this.bindEvent();
    };
    //样式回显
    popupFormBoxEdit.lookStyle = function(){
        var that = $(".wqdEditBox.formboxEdit");
        //表单名称
        var formName = obj.attr("wqdFormName") || "表单";
        that.find(".formName").val(formName);
         //颜色
        var colorObj = {"1":"wqdBgcolor","2":"wqdBordercolor"}
        for(var k=1; k<=2; k++){
            that.find(".wqdColorPicker[colortype="+k+"]").val(obj.attr(colorObj[k])||"#fff").siblings(".colordeviceBg").find(".colordevice").css("background-color",obj.attr(colorObj[k])||"#fff");
        }
        //边框细节
        var borderWidth = obj.attr("wqdBorderWidth") || "0";
        that.find(".wqdBorderList li").each(function(){
            if($(this).find("span").attr("border-width") == borderWidth){
                $(this).addClass("on").siblings("li").removeClass("on");
                $(this).parents(".navSelectList").siblings("p").html($(this).html()+"<i></i>")
                return false;
            }
        });
        //站内表单or站外表单
        var formType = obj.attr("wqdFormType") || "1";
        if(formType == "1"){
            that.find(".wqdOutLink").attr("disabled","disabled");
        }else{
            that.find(".formName").attr("disabled","disabled").siblings("label").find("i").removeClass("on");
            that.find(".wqdOutLink").val(obj.find(".wqdFormIframeWarp iframe").attr("src") || "").siblings("label").find("i").addClass("on");
        }
    };

    //绑定事件
    popupFormBoxEdit.bindEvent = function(){
        var that = $(".wqdEditBox.formboxEdit");
        //帮助链接
        that.find(".helpUrl").attr("href","http://127.0.0.1").attr("target","_blank");
        //修改表单名称
        that.find(".formName").on("blur",function(){
            var formName = $(this).val();
            if(formName){
                obj.attr("wqdFormName",formName);
                $(document).trigger("appSetCatch");
            }
        });
        //弹出下拉列表
        that.find(".borerwidthselect").on("click",function(){
            var selectList = $(this).find(".navSelectList");
            if(selectList.is(":visible")){
                selectList.hide()
            }else{
                that.find(".navSelectList").not(selectList).hide();
                selectList.show();
                $(".nano").nanoScroller({alwaysVisible: true});
            }
        });
        //选择边框样式
        that.find(".wqdBorderList li").on("click",function(){
            if($(this).hasClass("on")) return;
            var border = $(this).find("span").attr("border-width") || "0",
                elemId = obj.attr("id") || "";
            obj.attr("wqdBorderWidth",border);
            border = border + "px";
            $(this).parents(".borerwidthselect").find("p").html($(this).html()+"<i></i>");
            $(this).addClass("on").siblings("li").removeClass("on");
            createColorStyle.styleInit(elemId,".wqdControlForm",{"border-width":border,"border-style":"solid"});
            $(document).trigger("appSetCatch");
        });

        //站内表单 or 外链
        that.find(".edit_radioorno").on("click",function(){
            if($(this).find("i").hasClass("on")) return;
            var hrefType = $(this).attr("hreftype") || "",
                iframeWarp = $('<div class="wqdFormIframeWarp"><iframe frameborder="0" allowtransparency="true"></iframe></div>');
            if(hrefType == "1"){
                obj.removeAttr("data-unused").find(".wqdControlForm").children().show();
                obj.find(".wqdControlForm .wqdFormIframeWarp").remove();
                that.find(".wqdOutLink").val("");
            }else{
                if(!obj.find(".wqdControlForm .wqdFormIframeWarp").length){
                    obj.attr("data-unused","edit");
                    obj.find(".wqdControlForm").children().hide();
                    iframeWarp.appendTo(obj.find(".wqdControlForm"));
                }
            }
            that.find(".submit ").attr("disabled","disabled");
            $(this).siblings(".submit").removeAttr("disabled");
            that.find(".edit_radioorno i").removeClass("on");
            $(this).find("i").addClass("on");
            obj.attr("wqdFormType",hrefType);
            $(document).trigger("appSetCatch");
        });
        //选择外链
        that.find(".wqdOutLink").on("blur",function(){
            var urlVal = $(this).val();
            if(urlVal && urlVal != "http://"){
               obj.find(".wqdControlForm .wqdFormIframeWarp iframe").attr("src",urlVal);
               $(document).trigger("appSetCatch");
            }
        });
        //外链自动填补http://
        that.find('.wqdOutLink').on('click',function(){
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
        //修改颜色
        that.find(".wqdColorPicker").on("changeColor", popupFormBoxEdit.changeColor);
    };
    //修改颜色
    popupFormBoxEdit.changeColor = function(){
        var that = $(this),
            elemId = obj.attr("id") || "",
            colorVal = that.val(),
            colortype = that.attr("colortype") || "",
            colorAttr = {"1":"wqdBgcolor","2":"wqdBordercolor"},
            cssstyle = {"1":{"background-color":colorVal},"2":{"border-color":colorVal}};
        createColorStyle.styleInit(elemId,".wqdControlForm",cssstyle[colortype]);
        that.siblings(".colordeviceBg").find(".colordevice").css("background-color",colorVal);
        obj.attr(colorAttr[colortype],colorVal);
        $(document).trigger("appSetCatch");
    };
    return popupFormBoxEdit;
});
