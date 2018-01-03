define(['popupEdit','createColorStyle'],function(popupEdit,createColorStyle) {
    var wqdsecondNav = {}
    wqdsecondNav.init = function(){
    	$(document).on("elmenentEdit",function (e,data) {
			var $node = data.element;
			if($node.attr("data-elementtype") == "secondNav") {
				window.edit = $node;
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
		                      	wqdsecondNav.bindEvent();
		                    },
		                    onClosed: function() {
		                        window.scrollTo(0, window.scroll_top);
		                    }
		                });
					}
				});
			}
		})
    };
    wqdsecondNav.lookStyle = function(){
    	var that = $(".wqdEditBox.secondNavEdit"),
    		parents = edit.parents(".wqdCommonNav"),
    		bgColor = parents.attr("wqd-bgColor") || "#fff",
    		borderColor = parents.attr("wqd-borderColor") || "#fff",
    		borderWidth =  parents.attr("wqdsecondBorder") || "0";
    	that.find(".wqdColorPicker[colortype=1]").val(bgColor).siblings(".colordeviceBg").find(".colordevice").css("background-color",bgColor);
    	that.find(".wqdColorPicker[colortype=2]").val(borderColor).siblings(".colordeviceBg").find(".colordevice").css("background-color",borderColor);
    	that.find(".wqdBorderList li").each(function(){
			if($(this).find("span").attr("border-width") == borderWidth){
				$(this).addClass("on").siblings("li").removeClass("on");
				$(this).parents(".navSelectList").siblings("p").html($(this).html()+"<i></i>")
				return false;
			}
		});
    };

    wqdsecondNav.bindEvent = function(){
    	this.lookStyle();
    	popupEdit.commonInit();

    	var that = $(".wqdEditBox.secondNavEdit");
    	//帮助链接
		that.find("em.edit_help").on("click",function(){
			window.open("http://127.0.0.1");
		});
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
			edit.parents(".wqdCommonNav").attr("wqdsecondBorder",border);
			border = border + "px";
			$(this).parents(".borerwidthselect").find("p").html($(this).html()+"<i></i>");
			$(this).addClass("on").siblings("li").removeClass("on");
			createColorStyle.styleInit(elemId,".wqdSecondNavbox .wqdSecondNav, .wqd-carouseOverlay .wqdSecondNavbox .wqdSecondNav",{"border-width":border,"border-style":"solid"});
			$(document).trigger("appSetCatch");
		});
		//更改颜色
		$(".wqdColorPicker").on("changeColor",function(){
			var that = $(this),
				elemId = edit.parents(".wqdSectiondiv").attr("id") || "",
				colorVal = that.val(),
				colortype = that.attr("colortype") || "";
			if(colortype == "1"){
				createColorStyle.styleInit(elemId,".wqdSecondNavbox .wqdSecondNav, .wqd-carouseOverlay .wqdSecondNavbox .wqdSecondNav",{"background-color":colorVal});
				edit.parents(".wqdCommonNav").attr("wqd-bgColor",colorVal);
			}else{
				createColorStyle.styleInit(elemId,".wqdSecondNavbox .wqdSecondNav, .wqd-carouseOverlay .wqdSecondNavbox .wqdSecondNav",{"border-color":colorVal});
				edit.parents(".wqdCommonNav").attr("wqd-borderColor",colorVal);
			}
			that.siblings(".colordeviceBg").find(".colordevice").css("background-color",colorVal);
			$(document).trigger("appSetCatch");
		});

    };
     wqdsecondNav.init();
	return wqdsecondNav;
});
