define(['utility','createColorStyle','popupEdit','wqdNavigate','popupDrag'],function(utility,createColorStyle,popupEdit,wqdNav) {
    var wqdNavigate = {}

    wqdNavigate.init = function(){
    	//监听侧边导航按钮的编辑事件
		$(document).on("sideNavButtonSet",".wqdSideNavButton",wqdNavigate.sideNavBtnEdit);

    	$(document).on("wqdNavMenuSet",function(e,obj){
    		window.edit = $(obj);
			$.ajax({
				type: "GET",
				url: "../js/app/JSON/designComponentEdit.json",
				data : {},
				async: true,
				dataType: "json",
				success:function(data){
					$.colorbox({
	                    transition: "none",
	                    opacity: 0.2,
	                    html: data.edit.newnavEdit,
	                    fixed: true,
	                    closeButton: false,
	                    onOpen: function() {
	                        window.scroll_top = $(document).scrollTop();
	                    },
	                    onComplete: function() {
	                       wqdNavigate.rendering();
	                    },
	                    onClosed: function() {
	                        window.scrollTo(0, window.scroll_top);
	                    }
	                });
				}
			});
		});
    };

	wqdNavigate.rendering = function(){
		this.lookNavStyle();
		popupEdit.commonInit();
		this.bindEvent();

	};
	//回显已设置的样式
	wqdNavigate.lookNavStyle = function(){
		var that = $(".wqdEditBox.newnavEdit"),
			parents = edit.parents(".wqdCommonNav"),
			parent = edit.parents(".wqdTopNavbox"),
			colorObj = {"1":"wqd-textcolor","2":"wqd-menucolor","3":"wqd-texthovercolor","4":"wqd-menuhovercolor","5":"wqd-borcolor","6":"wqd-borhovercolor"}
		that.find(".textVal").val($.trim(edit.find("a").text()));
		//颜色
		for(var k=1; k<=6; k++){
			that.find(".wqdColorPicker[colortype="+k+"]").val(parent.attr(colorObj[k])||"#fff").siblings(".colordeviceBg").find(".colordevice").css("background-color",parent.attr(colorObj[k])||"#fff");
		}
		//竖版导航
		if(parents.hasClass("wqdSideNavWrap")){
			that.find(".fontSetWrap>li:last").find(".edit_unitbox").eq(1).hide().prev().hide();
			that.find(".bgeffect label").eq(0).attr("navstate","3").html('<i class="on radio"></i>浮动');
			that.find(".bgeffect label").eq(1).attr("navstate","4").html('<i class="radio"></i>固定');
			if(!parents.hasClass("floatStatus")){
				that.find(".bgeffect label").eq(0).find("i").removeClass("on");
				that.find(".bgeffect label").eq(1).find("i").addClass("on");
			}
		}else{
			if(parents.attr("wqdnavstickyed")){
				that.find(".bgeffect label").eq(0).find("i").removeClass("on");
				that.find(".bgeffect label").eq(1).find("i").addClass("on");
			}
		}
		//半径、间距、高度
		var interval_1 =  parent.attr("wqdBorderRadius")||0, interval_2 =  parent.attr("wqdPaddingX")||0, interval_3 =  parent.attr("wqdPaddingY")||0;
		that.find(".slider").eq(0).parent().siblings("input").val(interval_1);
		if(interval_1 > 30) interval_1 = 30;
		that.find(".slider").eq(0).css("left",interval_1/30*106).siblings(".moment").width(interval_1/30*106);
		that.find(".slider").eq(1).parent().siblings("input").val(interval_2);
		if(interval_2 > 50) interval_2 = 50;
		that.find(".slider").eq(1).css("left",interval_2/50*106).siblings(".moment").width(interval_2/50*106);
		that.find(".slider").eq(2).parent().siblings("input").val(interval_3);
		if(interval_3 > 30) interval_3 = 30;
		that.find(".slider").eq(2).css("left",interval_3/30*106).siblings(".moment").width(interval_3/30*106);

		//字体样式
		that.find(".edit_unitbox .style input").val(parent.attr("wqdfontsize")||14);
		if(parent.attr("wqdFontWeight")) that.find(".edit_unitbox .style strong").addClass("on");
		if(parent.attr("wqdFontStyle")) that.find(".edit_unitbox .style em").addClass("on");
		var fontStyle = parent.attr("wqdFontFamily") || "微软雅黑";
		that.find(".wqdFontList").parents(".navSelectList").siblings("p").find("span").text(fontStyle);
		that.find(".wqdFontList li").each(function(){
			if($(this).text() == fontStyle){
				$(this).addClass("on").siblings("li").removeClass("on");
				return false;
			}
		});
		//边框细节
		var borderWidth = parent.attr("wqdBorderWidth") || "0";
		that.find(".wqdBorderList li").each(function(){
			if($(this).find("span").attr("border-width") == borderWidth){
				$(this).addClass("on").siblings("li").removeClass("on");
				$(this).parents(".navSelectList").siblings("p").html($(this).html()+"<i></i>")
				return false;
			}
		});
		//边框位置
		var borderPosition = parent.attr("wqdborderdir") || "top,bottom,left,right";
			borderPosition = borderPosition.split(",");
		for(var m=0; m<borderPosition.length; m++){
			that.find(".borderPosition .direction[direction=" + borderPosition[m] + "]").addClass("active");
		}
		//是否新窗口打开
		if(edit.find("a").attr("target")) that.find(".desp span").addClass("on");
		//菜单链接
		var partList = $(".pagedeatllist>li.on").find(".usercontent li"), pageList = $(".pagedeatllist>li").not("[viewnews]"), partHtml = "", pageHtml = "";
		partList.each(function(){
			partHtml += '<li state="1" partid="'+$(this).attr("partid")+'">'+$(this).find("em").text()+'</li>';
		});
		that.find(".wqdPartList").html(partHtml);
		pageList.each(function(i){
			if(i == 0){
				pageHtml += '<li state="2" pageid="'+$(this).attr("pageid")+'" data-uri="'+$(this).attr("data-uri")+'">'+$(this).find(".pageShow em").text()+'</li>';
			}else{
				pageHtml += '<li state="1" pageid="'+$(this).attr("pageid")+'" data-uri="'+$(this).attr("data-uri")+'">'+$(this).find(".pageShow em").text()+'</li>';
			}
		});
		that.find(".wqdPageList").html(pageHtml);
		//链接详情
		var categorylink = edit.find("a").attr("categorylink") || "",
			linkUrl = edit.find("a").attr("href") || "";
		if(categorylink){
			that.find(".marginD").eq(0).find(".edit_radioorno i").removeClass("on");
			if(categorylink=="1"){
				that.find(".wqdPartList").parents(".borerwidthselect").removeClass("disabled").removeAttr("disabled").siblings(".edit_radioorno").find("i").addClass("on");
				var pard_id = edit.find("a").attr("partid") || "", being = true;
				that.find(".wqdPartList li").each(function(){
					if($(this).attr("partid") == pard_id){
						being = false;
						$(this).addClass("on").siblings("li").removeClass("on");
						$(this).parents(".navSelectList").siblings("p").find("span").text($(this).text());
						return false;
					}
				});
				if(being) that.find(".wqdPartList").parents(".navSelectList").siblings("p").find("span").text("该菜单已链接其他页栏目");
			}else if(categorylink=="2"){
				that.find(".wqdPageList").parents(".borerwidthselect").removeClass("disabled").removeAttr("disabled").siblings(".edit_radioorno").find("i").addClass("on");
				var page_id = edit.find("a").attr("pageid") || "";
				that.find(".wqdPageList li").each(function(){
					if($(this).attr("pageid") == page_id){
						$(this).addClass("on").siblings("li").removeClass("on");
						$(this).parents(".navSelectList").siblings("p").find("span").text($(this).text());
						return false;
					}
				});
			}else{
				that.find(".wqdOutLink").val(linkUrl).removeClass("disabled").removeAttr("disabled").siblings(".edit_radioorno").find("i").addClass("on");

			}
		}else{
			that.find(".desp").hide();
		}
	};

	wqdNavigate.bindEvent = function(){
		var that = $(".wqdEditBox.newnavEdit");
		//帮助链接
		that.find("em.edit_help").on("click",function(){
			window.open("http://127.0.0.1");
		});
		//修改菜单文字
		that.find(".textVal").on("blur",function(){
			var textVal = $(this).val().replace(/\s/g,"&nbsp;");
			if(textVal != edit.find("a").text()){
				edit.find("a").html(textVal);
				$(document).trigger("appSetCatch");
			}
		});
		$(".wqdColorPicker").on("changeColor", wqdNavigate.changeColor);
		that.find(".bgeffect .edit_radioorno").on("click",wqdNavigate.changeNavState);
		//弹出下拉列表
		that.find(".borerwidthselect").on("click",function(){
			if($(this).hasClass("disabled")) return;
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
				elemId = edit.parents(".wqdTopNavbox").attr("id") || "";
			edit.parents(".wqdTopNavbox").attr("wqdBorderWidth",border);
			border = border + "px";
			$(this).parents(".borerwidthselect").find("p").html($(this).html()+"<i></i>");
			$(this).addClass("on").siblings("li").removeClass("on");
			createColorStyle.styleInit(elemId,".wqdNavList li a",{"border-width":border,"border-style":"solid"});
			wqdNav.changePosition(edit.parents(".wqdTopNavbox"));
			$(document).trigger("appSetCatch");
		});
		//选择边框位置
		that.find(".borderPosition .direction").on("click",function(){
			var elemId = edit.parents(".wqdTopNavbox").attr("id") || "",
				direction = $(this).attr("direction") || "",
				wqdborderDir = "",
				dirObj = {"top":{"border-top-width":"0 !important"},"bottom":{"border-bottom-width":"0 !important"},"left":{"border-left-width":"0 !important"},"right":{"border-right-width":"0 !important"}};
				dirObj = !$(this).hasClass("active") ? {"top":"border-top-width:0 !important;","bottom":"border-bottom-width:0 !important;","left":"border-left-width:0 !important;","right":"border-right-width:0 !important;"} : dirObj;
			!$(this).hasClass("active") ? createColorStyle.deleteStyle(elemId,".wqdNavList li a",dirObj[direction]) : createColorStyle.styleInit(elemId,".wqdNavList li a",dirObj[direction]);
			wqdNav.changePosition(edit.parents(".wqdTopNavbox"));
			$(this).toggleClass("active");
			$(this).parent().find(".direction").each(function(){
				if($(this).hasClass("active")){
					wqdborderDir += $(this).attr("direction") + ",";
				}
			});
			wqdborderDir = wqdborderDir.substr(0,wqdborderDir.length-1);
			wqdborderDir = wqdborderDir || "noborder";
			edit.parents(".wqdTopNavbox").attr("wqdborderDir",wqdborderDir);
			$(document).trigger("appSetCatch");
		});
		//选择字体
		that.find(".wqdFontList li").on("click",function(){
			if($(this).hasClass("on")) return;
			var font = $(this).text() || "微软雅黑",
				elemId = edit.parents(".wqdTopNavbox").attr("id") || "";
			$(this).parents(".borerwidthselect").find("p span").html(font);
			$(this).addClass("on").siblings("li").removeClass("on");
			createColorStyle.styleInit(elemId,".wqdNavList li a",{"font-family":font});
			edit.parents(".wqdTopNavbox").attr("wqdFontFamily",font);
			$(document).trigger("appSetCatch");
		});
		//修改字体大小
		that.find(".edit_unitbox .style input").on("keydown",function(e){
			//this.value = this.value.replace(/\D/g,'');
			var fontVal = $(this).val();
			if(e.keyCode == 38){
				fontVal = fontVal-0+1;
				$(this).val(fontVal);
			}else if(e.keyCode == 40){
				fontVal = fontVal-1;
				$(this).val(fontVal);
			}else if(e.keyCode == 13){
				$(this).trigger("blur");
			}
		}).on("input",function(){
        	this.value = this.value.replace(/[^\d\.]/g, '');
        }).on("blur",function(){
			var fontVal = $(this).val() || "",
			elemId = edit.parents(".wqdTopNavbox").attr("id") || "";
			fontVal = fontVal.match(/\D+/g) ? 12 : fontVal;
			if(fontVal-0<12) fontVal = 12;
			if(fontVal-0>30) fontVal = 30;
			$(this).val(fontVal);
			edit.parents(".wqdTopNavbox").attr("wqdFontSize",fontVal);
			fontVal = fontVal + "px";
			createColorStyle.styleInit(elemId,".wqdNavList li a",{"font-size":fontVal});
			wqdNav.changePosition(edit.parents(".wqdTopNavbox"));
			$(document).trigger("appSetCatch");
		});
		//字体加粗\斜体
		that.find(".edit_unitbox .style strong , .edit_unitbox .style em").on("click",function(){
			var elemId = edit.parents(".wqdTopNavbox").attr("id") || "",
				textVal = $(this).text(),
				attrObj = {"B":"wqdFontWeight","I":"wqdFontStyle"},
				newObj = {};
			if(textVal == "B"){
				if($(this).hasClass("on")){
					newObj = {"font-weight":"400"};
				}else{
					newObj = {"font-weight":"700"};
				}
			}else{
				if($(this).hasClass("on")){
					newObj = {"font-style":"normal"};
				}else{
					newObj = {"font-style":"italic"};
				}
			}
			createColorStyle.styleInit(elemId,".wqdNavList li a",newObj);
			$(this).hasClass("on") ? edit.parents(".wqdTopNavbox").removeAttr(attrObj[textVal]) : edit.parents(".wqdTopNavbox").attr(attrObj[textVal],"on");
			$(this).toggleClass("on");
			$(document).trigger("appSetCatch");
		});
		//半径、间距、高度
		that.find(".slider").each(function(i){
			var That = $(this),
				type = That.attr("sizetype"),
				typeObj = {"1":30,"2":50,"3":30};
			utility.range({
				slider : That,
				maxval : typeObj[type],
				callback : function(){
					var val = That.parent().siblings("input").val() || 0;
					wqdNavigate.changeSize(type,val);
				}
			});
		});
		//切换链接类型
		that.find(".marginD .edit_radioorno").on("click",function(){
			if($(this).find("i").hasClass("on")) return;
			if($(this).siblings().length){
				that.find(".desp").show();
			}else{
				that.find(".wqdPartList li, .wqdPageList li").removeClass("on").parents(".navSelectList").hide().siblings("p").find("span").text("请选择");
				that.find(".wqdOutLink").val("");
				edit.find("a").removeAttr("href").removeAttr("partid").removeAttr("pageid").removeAttr("homepage").removeAttr("categorylink").removeAttr("pagepath");
				if(edit.hasClass("active")) edit.removeClass("active");
				$(document).trigger("appSetCatch");
				that.find(".desp").hide();
			}
			that.find(".marginD").not($(this).parents(".marginD")).find(".borerwidthselect, .wqdOutLink").addClass("disabled").attr("disabled","disabled");
			$(this).siblings().removeClass("disabled").removeAttr("disabled");
			that.find(".marginD .edit_radioorno i").removeClass("on");
			$(this).find("i").addClass("on");
			$(".navSelectList").hide();
		});
		//选择链接通条
		that.find(".wqdPartList li").on("click",function(){
			if($(this).hasClass("on")) return;
			var partId = $(this).attr("partid"),
				url = $(".pagedeatllist>li.on").attr("data-uri") + "#" +partId;
			$(this).addClass("on").siblings("li").removeClass("on");
			$(this).parents(".navSelectList").siblings("p").find("span").text($(this).text());
			edit.find("a").attr("href",url).attr("categorylink","1").attr("partId",partId).attr("pagepath",$(".pagedeatllist>li.on").attr("pageid")).removeAttr("homepage").removeAttr("pageid");
			that.find(".wqdPageList li").removeClass("on").parents(".navSelectList").hide().siblings("p").find("span").text("请选择");
			if(edit.hasClass("active")) edit.removeClass("active");
			$(document).trigger("appSetCatch");
		});
		//选择链接页面
		that.find(".wqdPageList li").on("click",function(){
			if($(this).hasClass("on")) return;
			var pageId = $(this).attr("pageId"),
				thisPage = $(".pagedeatllist>li.on").attr("pageid"),
				pageurl = $(this).attr("data-uri");
			$(this).addClass("on").siblings("li").removeClass("on");
			$(this).parents(".navSelectList").siblings("p").find("span").text($(this).text());
			edit.find("a").attr("href",pageurl).attr("categorylink","2").attr("pageid",pageId).removeAttr("homepage").removeAttr("partId").removeAttr("pagepath");
			if($(this).attr("state")=="2") edit.find("a").attr("homepage","true");
			//链接的是当前页加选中状态
			if(thisPage == pageId){
				edit.addClass("active");
				$(".wqdTopNavbox .wqdNavList li").not(edit).removeClass("active");
			}else{
				edit.removeClass("active");
			}
			//一个页面只能被一个菜单指向
			$(".wqdTopNavbox .wqdNavList li").not(edit).find("a").each(function(){
				if($(this).attr("pageid") == pageId) $(this).removeAttr("href").removeAttr("partid").removeAttr("pageid").removeAttr("pagepath").removeAttr("homepage").removeAttr("categorylink").parent().removeClass("active");
			});
			that.find(".wqdPartList li").removeClass("on").parents(".navSelectList").hide().siblings("p").find("span").text("请选择");
			$(document).trigger("appSetCatch");
		});
		//选择外链
		that.find(".wqdOutLink").on("blur",function(){
			var urlVal = $(this).val() || "";
			if(urlVal.indexOf("http")!=0 && !/(mailto:)|(tel:)|(sms:)|(market:)|(geopoint:)/g.test(urlVal)) {
				urlVal = "http://"+urlVal;
                $(this).val(urlVal);
			}
			if(urlVal && urlVal != "http://"){
				edit.find("a").attr("href",urlVal).attr("categorylink","3").removeAttr("homepage").removeAttr("partId").removeAttr("pageid").removeAttr("pagepath");
				that.find(".wqdPartList li, .wqdPageList li").removeClass("on").parents(".navSelectList").hide().siblings("p").find("span").text("请选择");
				if(edit.hasClass("active")) edit.removeClass("active");
				$(document).trigger("appSetCatch");
			}
		});
		//是否新窗口打开
		that.find(".desp span").on("click",function(){
			if($(this).hasClass("on")){
				edit.find("a").removeAttr("target");
			}else{
				edit.find("a").attr("target","_blank");
			}
			$(this).toggleClass("on");
			$(document).trigger("appSetCatch");
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
	};
	//修改颜色
	wqdNavigate.changeColor = function(){
		var that = $(this),
			elemId = edit.parents(".wqdTopNavbox").attr("id") || "",
			colorVal = that.val(),
			colortype = that.attr("colortype") || "",
			colorAttr = {"1":"wqd-textcolor","2":"wqd-menucolor","3":"wqd-texthovercolor","4":"wqd-menuhovercolor","5":"wqd-borcolor","6":"wqd-borhovercolor"},
			elemObj = {"1":".wqdNavList li a","2":".wqdNavList li a","3":".wqdNavList li a:hover","4":".wqdNavList li a:hover","5":".wqdNavList li a","6":".wqdNavList li a:hover"},
			cssstyle = {"1":{color:colorVal},"2":{"background-color":colorVal},"3":{color:colorVal},"4":{"background-color":colorVal},"5":{"border-color":colorVal},"6":{"border-color":colorVal}};
		createColorStyle.styleInit(elemId,elemObj[colortype],cssstyle[colortype]);
		that.siblings(".colordeviceBg").find(".colordevice").css("background-color",colorVal);
		if(colortype == "3" || colortype == "4" ||colortype == "6"){
			createColorStyle.styleInit(elemId,".wqdNavList li.active a",cssstyle[colortype]);
		}
		edit.parents(".wqdTopNavbox").attr(colorAttr[colortype],colorVal);
		$(document).trigger("appSetCatch");
	};
	//横版导航跟随、固定，竖版导航浮动、固定
	wqdNavigate.changeNavState = function(){
		if($(this).find("i").hasClass("on")) return;
		var that = $(this),
		navobj = edit.parents(".wqdCommonNav"),
		navState = that.attr("navState") || "";
		if(navState == "1"){
			navobj.removeAttr("wqdnavstickyed");
		}else if(navState == "2"){
			navobj.attr("wqdnavstickyed","on");
		}else if(navState == "3"){
			navobj.addClass("floatStatus");
			$("#HTMLDATACENTER .wqdAreaView, #HTMLDATAFOOTER .wqdAreaView").removeAttr("style");
		}else if(navState == "4"){
			navobj.removeClass("floatStatus");
			$("#HTMLDATACENTER .wqdAreaView, #HTMLDATAFOOTER .wqdAreaView").css("padding-left",navobj.width());
		}
		that.siblings("label").find("i").removeClass("on");
		that.find("i").addClass("on");
		$(document).trigger("appSetCatch");
	};
	//半径、间距、高度
	wqdNavigate.changeSize = function(type,val){
		var thisVal = val + "px",
			parents = edit.parents(".wqdTopNavbox"),
			elemId = parents.attr("id") || "",
			attrObj = {"1":"wqdBorderRadius","2":"wqdPaddingX","3":"wqdPaddingY"},
			cssObj = {"1":{"border-radius":thisVal},"2":{"padding-left":thisVal,"padding-right":thisVal},"3":{"padding-top":thisVal,"padding-bottom":thisVal}};
		parents.attr(attrObj[type],val);
		createColorStyle.styleInit(elemId,".wqdNavList li a",cssObj[type]);
		wqdNav.changePosition(parents);
		$(document).trigger("appSetCatch");
	}
	//侧边导航按钮编辑器
	wqdNavigate.sideNavBtnEdit = function(){
		window.edit = $(this);
		$.ajax({
			type: "GET",
			url: "../js/app/JSON/designComponentEdit.json",
			data : {},
			async: true,
			dataType: "json",
			success:function(data){
				$.colorbox({
                    transition: "none",
                    opacity: 0.2,
                    html: data.edit.secondNavEdit,
                    fixed: true,
                    closeButton: false,
                    onOpen: function() {
                        window.scroll_top = $(document).scrollTop();
                    },
                    onComplete: function() {
                       	wqdNavigate.sideNavInit();
                       	popupEdit.commonInit();
                        wqdNavigate.sideNavBindEvent();
                    },
                    onClosed: function() {
                        window.scrollTo(0, window.scroll_top);
                    }
                });
			}
		});
	};
	//侧边导航按钮样式回显
	wqdNavigate.sideNavInit = function(){
		//复制出一个颜色选项
		var addColor = $(".secondNavEdit .fontSetWrap li .edit_unitbox:first").clone();
		addColor.find(".name").text("按钮颜色").siblings("input").attr("colortype","3");
		$(".secondNavEdit .fontSetWrap li hr:first").after(addColor);
		addColor.after("<hr>");
		//样式回显
		var that = $(".wqdEditBox.secondNavEdit"),
    		parents = edit.siblings(".wqdCommonNav"),
    		bgColor = parents.attr("wqdSidebtnBgColor") || "#fff",
    		textColor = parents.attr("wqdSidebtnColor") || "#fff",
    		borderColor = parents.attr("wqdSidebtnBorderColor") || "#fff",
    		borderWidth =  parents.attr("wqdSidebtnBorder") || "0";
    	that.find(".wqdColorPicker[colortype=1]").val(bgColor).siblings(".colordeviceBg").find(".colordevice").css("background-color",bgColor);
    	that.find(".wqdColorPicker[colortype=3]").val(textColor).siblings(".colordeviceBg").find(".colordevice").css("background-color",textColor);
    	that.find(".wqdColorPicker[colortype=2]").val(borderColor).siblings(".colordeviceBg").find(".colordevice").css("background-color",borderColor);
    	that.find(".wqdBorderList li").each(function(){
			if($(this).find("span").attr("border-width") == borderWidth){
				$(this).addClass("on").siblings("li").removeClass("on");
				$(this).parents(".navSelectList").siblings("p").html($(this).html()+"<i></i>")
				return false;
			}
		});
	};
	wqdNavigate.sideNavBindEvent = function(){
		var that = $(".wqdEditBox.secondNavEdit");
		//弹出下拉列表
		that.find(".borerwidthselect").on("click",function(){
			var selectList = $(this).find(".navSelectList");
			if(selectList.is(":visible")){
				selectList.hide()
			}else{
				selectList.show();
				$(".nano").nanoScroller({alwaysVisible: true});
			}

		});
		//选择边框样式
		that.find(".wqdBorderList li").on("click",function(){
			if($(this).hasClass("on")) return;
			var border = $(this).find("span").attr("border-width") || "0",
				elemId = edit.parents(".wqdSectiondiv").attr("id") || "";
			edit.siblings(".wqdCommonNav").attr("wqdSidebtnBorder",border);
			border = border + "px";
			$(this).parents(".borerwidthselect").find("p").html($(this).html()+"<i></i>");
			$(this).addClass("on").siblings("li").removeClass("on");
			createColorStyle.styleInit(elemId,".wqdSideNavButton",{"border-width":border,"border-style":"solid"});
			$(document).trigger("appSetCatch");
		});
		//更改颜色
		$(".wqdColorPicker").on("changeColor",function(){
			var that = $(this),
				elemId = edit.parents(".wqdSectiondiv").attr("id") || "",
				colorVal = that.val(),
				colortype = that.attr("colortype") || "";
			if(colortype == "1"){
				createColorStyle.styleInit(elemId,".wqdSideNavButton",{"background-color":colorVal});
				edit.siblings(".wqdCommonNav").attr("wqdSidebtnBgColor",colorVal);
			}else if(colortype == "3"){
				createColorStyle.styleInit(elemId,".wqdSideNavButton",{"color":colorVal});
				edit.siblings(".wqdCommonNav").attr("wqdSidebtnColor",colorVal);
			}else{
				createColorStyle.styleInit(elemId,".wqdSideNavButton",{"border-color":colorVal});
				edit.siblings(".wqdCommonNav").attr("wqdSidebtnBorderColor",colorVal);
			}
			that.siblings(".colordeviceBg").find(".colordevice").css("background-color",colorVal);
			$(document).trigger("appSetCatch");
		});
	}

	return wqdNavigate;
});
