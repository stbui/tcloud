define(function() {
	/* 导航链接的通用处理方法，包括自动选中和页面链接的修改删除的同步————黄剑剑 */
    var navCommon = {
    	init : function(){
            var self = this;
    		this.navAutoInside();
        	//监听页面改变事件，触发导航自动选中
        	$(document).on("domInit",self.navAutoInside);
            //监听导航添加
            $(document).on("addElement:end",self.addNavPlugin);
        	//页面地址更改、页面通条删除回调
            $(document).on("wqdNavCallback",self.navChangeCallback);
    	},
        //导航添加
        addNavPlugin : function(e,type){
            switch(type){
                case "navTemplate1":
                    var nav = $(".wqdCommonNav").children(".wqdNavTemplate:last-child");
                    nav.css({width:720,height:50});
                    nav.find(".navTemplateWrap1").movebg();
                    break;
                case "navTemplate2":
                    var nav = $(".wqdCommonNav").children(".wqdNavTemplate:last-child");
                    nav.css({width:800,height:60});
                    break;
                default:
                    break;
            }
        },
    	//导航自动选中
    	navAutoInside : function(){
            var lingAll = $(".wqdNavTemplate a[data-link-href]").not(".a_top"),
            pageid = $(".pagedeatllist>li.on").attr("pageid"),
            navSelect = false; //是否在导航中设置了本页链接
            lingAll.each(function(){
                if($(this).attr("pageid") == pageid){
                    navSelect = true;
                    $(this).parent().addClass("active");
                    lingAll.parent().not($(this).parent()).removeClass("active");
                }
            });
            !navSelect && lingAll.parent(".active").length && lingAll.parent(".active").removeClass("active");
        },
        //页面地址更改、页面通条删除回调
        navChangeCallback : function(e,obj){
            var change = false,
                category = obj.category,
                pageid = obj.pageids || null,
                parame = obj.parameter || "",
                elements = $(".wqdCommonNav .wqdNavTemplate").find("a[data-link-href]");
            //删除页面
            if(category==1){
                if(parame) elements.removeAttr("homepage");
                elements.each(function(){
                    if($(this).attr("pageid")==pageid){
                        $(this).removeAttr("wqdhref data-link-newwindow pageid homepage data-link-href").parent().removeClass("active");
                        change = true;
                    }
                    if(parame){
                        if($(this).attr("pageid")==parame){
                            $(this).attr("homepage","true");
                            change = true;
                        }
                    }
                });
            }else if(category==2){  //重命名页面地址
                elements.each(function(){
                    if($(this).attr("wqdhref")=="3" && $(this).attr("pageid")==pageid){
                        $(this).attr("data-link-href",parame);
                        change = true;
                    }else if($(this).attr("wqdhref")=="2" && $(this).attr("pageid")==pageid){
                        var href = $(this).attr("data-link-href") || "";
                        $(this).attr("data-link-href",parame+href.substring(href.indexOf("#")));
                        change = true;
                    }
                });
            }else if(category==3){  //排序
                elements.each(function(){
                    if($(this).attr("pageid")==pageid){
                        elements.removeAttr("homepage");
                        $(this).attr("homepage","true");
                        change = true;
                        return false;
                    }else if($(this).attr("homepage")=="true"){
                        $(this).removeAttr("homepage");
                        change = true;
                    }
                });
            }else if(category==4){  //删除通条
                elements.each(function(){
                    var href = $(this).attr("data-link-href") || "";
                    if($(this).attr("wqdhref")=="2" && href.indexOf(pageid)!=-1){
                        $(this).removeAttr("wqdhref data-link-newwindow pageid homepage data-link-href");
                        change = true;
                    }
                });
            }
            if(change){
                $(document).trigger("appSetCatch");
                $(document).trigger("appSave");
            }
        }
    };

    return navCommon;
});
