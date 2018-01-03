define(['utility','createColorStyle','popupEdit'],function(utility,createColorStyle,popupEdit) {
    var wqdContainer = {}

    wqdContainer.init = function(){
    	$(document).on("elmenentEdit.wqdContainer",function(e,obj){
    		window.edit = obj.element;
    		if(edit.attr("data-elementtype") == "groupContainer"){
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
		                    html: data.edit.container,
		                    fixed: true,
		                    closeButton: false,
		                    onOpen: function() {
		                        window.scroll_top = $(document).scrollTop();
		                    },
		                    onComplete: function() {
		                       wqdContainer.rendering();
		                    },
		                    onClosed: function() {
		                        window.scrollTo(0, window.scroll_top);
		                    }
		                });
					}
				});
    		}
		});
    };

	wqdContainer.rendering = function(){
		this.lookNavStyle();
		popupEdit.commonInit();
		this.bindEvent();

	};
	//回显已设置的样式
	wqdContainer.lookNavStyle = function(){
		var that = $(".wqdEditBox.containerEdit"),
			thisMark = edit.attr("wqdmark") || "",
			menuObj = edit.siblings("[wqdmark="+thisMark+"]"),
			containerOne = edit.hasClass("groupContainerTwo") ? menuObj : edit,
			containerTwo = edit.hasClass("groupContainerTwo") ? edit : menuObj;
		//模式一：二级容器
		if(edit.hasClass("groupContainerTwo")){
			that.find(".con-set-bar ul li").removeClass("active").eq(1).addClass("active");
			that.find(".edit_panel .edit_contentbox").hide().eq(1).show();
		}
		//颜色
		var Bgcolor1 = containerOne.attr("wqdbgcolor") || "rgba(207,228,228,0.46)",
			Bgcolor2 = containerTwo.attr("wqdbgcolor") || "rgba(190,161,167,0.46)",
			borderColor1 = containerOne.attr("wqdbordercolor") || "#333",
			borderColor2 = containerTwo.attr("wqdbordercolor") || "#333",
			colorObj = {"0":Bgcolor1,"1":borderColor1,"2":Bgcolor2,"3":borderColor2};
		that.find("input.wqdColorPicker").each(function(i){
			$(this).val(colorObj[i]).siblings(".colordeviceBg").find(".colordevice").css("background-color",colorObj[i]);
		});
		//触发二级方式
		var wqdtarget = containerOne.attr("wqdtarget") || "click";
		wqdtarget == "mouseenter" && that.find(".forms-group i").eq(0).removeClass("wq-checkBox-check").addClass("wq-checkBox").parent().siblings(".forms-group").find("i").removeClass("wq-checkBox").addClass("wq-checkBox-check");
		//触发动画
		var wqdfadein = containerOne.attr("wqdfadein") || "";
		that.find(".animaList[animetype=fadeIn] li").each(function(){
			var thisVal = $(this).attr("animaname") || "";
			if(thisVal == wqdfadein){
				$(this).addClass("active").siblings("li").removeClass("active").parents(".dropdow-menu").find(".dropdow-tit span").text($(this).text());
				return false;
			}
		});
		//边框宽度
		var borderWidth1 = containerOne.attr("wqdborderwidth") || 0, borderWidth2 = containerTwo.attr("wqdborderwidth") || 0;
		that.find(".slider").eq(0).parent().siblings("input").val(borderWidth1);
		if(borderWidth1 > 20) borderWidth1 = 20;
		that.find(".slider").eq(0).css("left",borderWidth1/20*98).siblings(".moment").width(borderWidth1/20*98);
		that.find(".slider").eq(1).parent().siblings("input").val(borderWidth2);
		if(borderWidth2 > 20) borderWidth2 = 20;
		that.find(".slider").eq(1).css("left",borderWidth2/20*98).siblings(".moment").width(borderWidth2/20*98);
		//模式二没有隐藏动画设置
		if(containerOne.hasClass("freeContainerOne")){
			that.find(".edit_contentbox").eq(1).find(".edit_content_nav ol li").eq(1).addClass("on").siblings("li").hide();
			that.find(".edit_contentbox").eq(1).find(".edit_graphical_option1").eq(1).addClass("on").siblings().hide();
		}else{
			//触发隐藏
			var wqdtargethide = containerTwo.attr("wqdtargethide") || "click";
			that.find(".animaList[animetype=targetHide] li").each(function(){
				var thisVal = $(this).attr("wqdtarget") || "";
				if(thisVal == wqdtargethide){
					$(this).addClass("active").siblings("li").removeClass("active").parents(".dropdow-menu").find(".dropdow-tit span").text($(this).text());
					return false;
				}
			});
			//隐藏动画
			var wqdfadeout = containerTwo.attr("wqdfadeout") || "click";
			that.find(".animaList[animetype=fadeOut] li").each(function(){
				var thisVal = $(this).attr("animaname") || "";
				if(thisVal == wqdfadeout){
					$(this).addClass("active").siblings("li").removeClass("active").parents(".dropdow-menu").find(".dropdow-tit span").text($(this).text());
					return false;
				}
			});
		}
	};
	//绑定事件
	wqdContainer.bindEvent = function(){
		var that = $(".wqdEditBox.containerEdit");

		that.find(".edit_help").on("click",function(e) {
			window.open("http://127.0.0.1");
		})
		//左侧切换
		that.find(".edit_content_nav ol li").on("click",function(){
			var $this = $(this);
			$this.addClass("on").siblings().removeClass("on");
			$(".edit_content:visible>ul").eq($this.index()).addClass("on").siblings().removeClass("on");
		});
		//展开下拉列表
		that.find(".dropdow-menu").on("click",function(){
			$(this).toggleClass("open");
		});
		//容器切换
		that.find(".con-set-bar ul li").on("click",function(){
			var $this = $(this);
			if($this.hasClass("active")) return;
			var thisMark = edit.attr("wqdmark") || "",
				menuObj = edit.siblings("[wqdmark="+thisMark+"]");
			if(edit.hasClass("groupContainerOne")) menuObj.addClass("insideShow");
			else if(edit.hasClass("groupContainerTwo")) edit.removeClass("insideShow");
			if(menuObj.length) edit = menuObj;
			$this.addClass("active").siblings().removeClass("active");
			$(".edit_panel>.edit_contentbox").eq($this.index()).show().siblings().hide();
		});
		//更改颜色
		that.find(".wqdColorPicker").on("changeColor",function(){
			var colorVal = $(this).val(),
				category = $(this).attr("category") || "",
				elementId = edit.attr("id") || "",
				cssObj = {"1":{"background-color":colorVal},"2":{"border-color":colorVal}},
				attrObj = {"1":"wqdBgcolor","2":"wqdBorderColor"};
			$(this).siblings(".colordeviceBg").find(".colordevice").css("background-color",colorVal);
			createColorStyle.styleInit(elementId,".containerWarp",cssObj[category]);
			edit.attr(attrObj[category],colorVal);
			$(document).trigger("appSetCatch");
		});
		//边框宽度
		that.find(".slider").each(function(i){
			var That = $(this);
			utility.range({
				slider : That,
				maxval :20,
				callback : function(){
					var val = That.parent().siblings("input").val() || 0;
					wqdContainer.changeSize(val);
				}
			});
		});
		//选择触发二级方式
		that.find(".forms-group").on("click",function(){
			if($(this).find("i").hasClass("wq-checkBox-check")) return;
			var target = $(this).attr("wqdtarget") || "click";
			edit.attr("wqdtarget",target);
			$(this).find("i").removeClass("wq-checkBox").addClass("wq-checkBox-check");
			$(this).siblings(".forms-group").find("i").removeClass("wq-checkBox-check").addClass("wq-checkBox");
			//模式二的设置需要同步至其衍生的关联容器
			if(edit.attr("groupmark")){
				edit.siblings("[groupmark="+edit.attr("groupmark")+"]").each(function(){
					$(this).attr("wqdtarget",target);
				});
			}
			$(document).trigger("appSetCatch");
		});
		//选择触发动画
		that.find(".animaList li").on("click",function(event){
			event.stopPropagation();
			if($(this).hasClass("active")) return;
			var animetype = $(this).parent().attr("animetype") || "";
				attrObj = {"fadeIn":"wqdfadein","targetHide":"wqdtargethide","fadeOut":"wqdfadeout"},
				thisVal = $(this).attr("animaname") || "";
			animetype == "targetHide" && (thisVal = $(this).attr("wqdtarget") || "");
			$(this).addClass("active").siblings("li").removeClass("active").parents(".dropdow-menu").removeClass("open").find(".dropdow-tit span").text($(this).text());
			edit.attr(attrObj[animetype],thisVal);
			if(animetype == "fadeIn" && !edit.hasClass("freeContainerOne")) edit.siblings("[wqdmark="+edit.attr("wqdmark")+"]").attr(attrObj[animetype],thisVal);
			//模式二的设置需要同步至其衍生的关联容器
			if(edit.attr("groupmark")){
				edit.siblings("[groupmark="+edit.attr("groupmark")+"]").each(function(){
					var otherMark = $(this).attr("wqdmark") || "wqdNomark";
						$(this).attr(attrObj[animetype],thisVal);
						$(this).siblings(".wqdelementEdit"+"[wqdmark="+otherMark+"]").attr(attrObj[animetype],thisVal);
				});
			}
			$(document).trigger("appSetCatch");

		});
	};
	//修改边框宽度
	wqdContainer.changeSize = function(val){
		edit.attr("wqdBorderWidth",val);
		val = val + "px";
		createColorStyle.styleInit(edit.attr("id")||"",".containerWarp",{"border-width":val,"border-style":"solid"});
		$(document).trigger("appSetCatch");
	};
	return wqdContainer;
});
