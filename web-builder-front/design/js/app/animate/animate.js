define(['utility','wqdAnimation','app/animate/aniModel'],function(_ut,wqdAnimation,_aniModel){

	$(document).on('animateinit',function(e,obj){
		animate.init(obj.element);
	});
	var animate = {};
	animate.template = {};
	animate.animatesList = _aniModel.animatesList;
	animate.animateAttr = ["data-animate","data-animation-duration","data-animation-delay","data-animation-iteration-count","triggertype","triggerElem","triggeraction"];

	var elementTypes = _aniModel.elementTypes;

	animate.init = function(obj){
		window.edit = obj;
		$.ajax({
			type: "GET",
			url: "../js/app/JSON/component/designComponentAnimate.json",
			data : {},
			async: true,
			dataType: "json",
			success:function(data){
				animate.template = $(data.edit.animateEdit).find(".animPanelTemp").text();
				$.colorbox({
                    transition: "none",
                    opacity: 0.2,
                    html: data.edit.animateEdit,
                    fixed: true,
                    closeButton: false,
                    onOpen: function() {
                        window.scroll_top = $(document).scrollTop();
                    },
                    onComplete: function() {
                       	animate.boxBindEvent();
                       	animate.contentBindEvent();
                       	$("#colorbox").css("zIndex",9999);
                       	var $box = $(".wqdEditBox");
                       	if(parseFloat($box.css("left"))<0 ) {
                       		$box.css("left",$(window).width() / 2 - $box.width() / 2);
                       	}
                    },
                    onClosed: function() {
                        window.scrollTo(0, window.scroll_top);
                    }
                });
			}
		});
	};

	// 更新元素列表数据
	var updateAniListElem = function ($list) {
		if(!$list || !$list.length) {
			$list = $("#colorbox").find(".triggerElem .animateList ul");
		}
		var elementTypeNum = {};
		var n = 1;
		var $overlay = edit.parents(".wqd-carouseOverlay"),
            $overlayCarouse = $overlay.find(".item.active .bannerContainer"),
            $overlayForm = $overlay.find(".wqd-form.elemContBox"),
			$parent = $overlayCarouse.length ? $overlayCarouse : $overlayForm.length ? $overlayForm : edit.parents(".sectionV2");
		var $elements = $parent.find(">[data-elemandgroup='true'],>.wqdGroup > .wqdelementEditBox > [data-elemandgroup='true']")
						.filter(function(index) {
							return $(this).attr("id") != edit.attr("id");
						});

		var list = $elements.map(function (i,_) {
			var elTypeAttr = $(_).attr("data-elementtype") || "elem",
				isGroup = $(_).hasClass("wqdGroup"),
				elemType = elementTypes[elTypeAttr] || (isGroup ? "元素组" :"元素"),
				unUsed = $(_).attr("data-unused") || "",
				num = 0;
			if($.inArray(elTypeAttr,["groupContainer"]) != -1 || unUsed.indexOf("aniTrig") != -1) return null;
			$.each(elementTypes,function (j,v) {
				j = j === void 0 ? "elem" : isGroup ? "group" : j;
				elementTypeNum[j] = elementTypeNum[j] || 0;
			});
			elementTypeNum[elTypeAttr] = elementTypeNum[elTypeAttr] || 0;
			$.inArray(elTypeAttr,["svg","freeRect","line"]) != -1 ? num = ++elementTypeNum["svg"] : num = ++elementTypeNum[elTypeAttr];
			return "<li triggerElem="+$(_).attr("id")+"> <a href='javascript:void(0);'> <span> "+ elemType + num +" </span> </a> </li>";
		}).get();
		var thisElem = "<li class='thisElem' triggerelem='"+window.edit.attr("id")+"'> <a href='javascript:void(0);'> <span> 当前元素 </span> </a> </li>";
		$list.html(thisElem + list.join(""));
		if(list.length > 5) {
			$list.parents(".nano").height(150);
		}else {
			$list.parents(".nano,.nano-content").removeClass("nano-content nano");
		}
	};

	//更改触发动作时，切换工具盒中的动画效果列表页
	var changeAniList = function ($elm,obj,triggerAction) {
		var list = animate.animatesList[triggerAction] || {},
			liList = ["<li class='active'> <a href='javascript:void(0);'> <i class='wqd wqd-disabled'></i> <span> 无效果 </span> </a> </li>"];
		for(var i in list){
			liList[liList.length] = "<li animatetype='"+i+"'><a href='javascript:void(0);'> <span>"+list[i]+"</span> </a></li>"
		}
		obj.find(".hassetfont .animateList").html(liList.join(""));
	};

	animate.animateInit =function(){//hjj
		var nowLeft = null,
			nowTop = null;
		//初始化位置
		if($("#HTMLDATA .wqdIphoneView").length){
			nowLeft = $("#wqdIphoneContainer").offset().left + $("#wqdIphoneContainer").outerWidth() + 5;
			nowTop = $("#wqdIphoneContainer").offset().top + 80 ;
		}else{
			nowTop = $(window).height()/2 - $(".wqdEditBox.animateEdit").outerHeight()/2;
			var boxWidth = $(".wqdEditBox.animateEdit").outerWidth(),
				elemWidth = edit.outerWidth();
			if($(window).width() - edit.offset().left - elemWidth > boxWidth + 5){
				nowLeft = edit.offset().left + elemWidth + 5;
			}else{
				nowLeft = edit.offset().left - boxWidth -5;
			}
		}
		$(".wqdEditBox.animateEdit").css({"left":nowLeft,"top":nowTop,"opacity":1});

		$(".wqdEditBox.animateEdit .panel-group").html("");

		// 根据模版生成动画列表 liu
		if(edit.attr("data-animate")){
			for(var i=0, alength = edit.attr("data-animate").split(",").length; i < alength; i++){
				var template = $(animate.template);
				template.find(".animateHead a span").text("动画-"+(i+1));
				template.appendTo(".wqdEditBox.animateEdit .panel-group");
				updateAniListElem(template.find(".triggerElem .animateList ul"));
				animate.updateAniPanel(i);
			}
			//手机触发事件没有悬浮
			if($("#HTMLDATA .wqdIphoneView").length) template.find(".triggerType .typeList li[triggertype='mouseenter.wqdAnimate']").remove();
			this.setSlider($(".wqdEditBox.animateEdit .animateBox"));
		}else{
			$(".wqdEditBox.animateEdit .animat button").eq(1).addClass("disabled");
		}

	};
	animate.setAnimate = function (index,type,value) {
		var array = (edit.attr(animate.animateAttr[type]) || "").split(",");
		array[index] = value;
		edit.attr(animate.animateAttr[type],array.join(","));
		if(type==5) $("#"+value).addClass("aniunveil");
	};
	//回显已经设置的动画参数
	animate.updateAniPanel = function (index) {
		var $box = $(".wqdEditBox.animateEdit .animateBox").eq(index),
			thisParameter = $.map(animate.animateAttr,function (_,i) {
				return (edit.attr(animate.animateAttr[i]) || "").split(",")[index];
			}),
			triggertypes = thisParameter[4] || "unveil.wqdAnimate",
			$triggerType,animateName;
		//回显选择的触发事件
		$triggerType = $box.find(".triggerType li[triggertype='"+ triggertypes +"']").addClass("active").siblings("li").removeClass("active").end();
		animateName = $triggerType.find("a span").text();
		$box.find(".triggerType .animateBtn").text(animateName);

		// 设定触发动作
		var aniActName = {"show":"显示","accentuate":"强调","hide":"隐藏"},
			actionType;
		var getActionType = function () {
			for(var i in animate.animatesList) {
				for (var j in animate.animatesList[i]) {
					if(j == thisParameter[0]) {
						return i;
					}
				};
			}
		};
		actionType = thisParameter[6] || getActionType();
		changeAniList(edit,$box,actionType);
		$box.find(".triggerAction").find(".animateBtn").text(aniActName[actionType]).end()
	    	.find("li[triggeraction='"+actionType+"']").trigger("click.aniDrapList").addClass("active").siblings("li").removeClass("active");

		// 触发元素
		var triggerElem = thisParameter[5] || edit.attr("id");
		var $triggerElem = $box.find(".triggerElem li[triggerElem='"+ triggerElem +"']").addClass("active").siblings("li").removeClass("active").end();
		$box.find(".triggerElem .animateBtn").text($triggerElem.find("a span").text());

		// 动画
		$box.find(".hassetfont .animateList li").removeClass("active").each(function(){
			if($(this).attr("animatetype")==thisParameter[0]){
				$(this).addClass("active");
				$box.find(".hassetfont .animateBtn").text($(this).find("a span").text());
				$box.find(".hassetfont").attr("data-animate",thisParameter[0]);
				return false;
			}
		});

		// 时间
		$box.find(".panel-list>.ani-duration").find("input").val(thisParameter[1]).end()
			.find(".slider").css("left",thisParameter[1] / 5 * 90).siblings(".moment").width(thisParameter[1] / 5 * 90);
		// 延迟
		$box.find(".panel-list>.ani-delay").find("input").val(thisParameter[2]).end()
			.find(".slider").css("left",thisParameter[2] / 20 * 90).siblings(".moment").width(thisParameter[2] / 20 * 90);
		// 次数
		var $aniCount = $box.find(".panel-list>.ani-count");
		thisParameter[3]=="infinite" ? $aniCount.find(".ani-count-check").addClass("active").end().find("input").attr("disabled","disabled") :
										$aniCount.find("input").val(thisParameter[3]);
	};


	animate.boxBindEvent = function () {
		this.animateInit();
		//关闭弹窗
		$(".wqdEditBox.animateEdit")
            .on("click",".edit_close",$.fn.colorbox.close)
            .on("click",".edit_help",function(e) {
                window.open("http://github.com");
            }) 
            //播放动画
            .on("click",".aniReplay",function(e){
                if(!edit.attr("data-animate")) return;
                e.preventDefault();
                var aniArr = [],
                    animates = edit.attr("data-animate") || "";
                while(aniArr.length < animates.split(",").length){
                    aniArr.push(aniArr.length)
                }
                window.edit.wqdAnimate(aniArr);
                var triAction = edit.attr("triggeraction");
                if(!triAction || triAction.indexOf("show") == -1) edit.removeClass('aniHide');
            })
            //添加动画
            .on("click",".animat .addAnimat",function(){
                var num = $(".wqdEditBox.animateEdit .animateBox").length,
                    template = $(animate.template);

                num || $(this).siblings("button.aniReplay").removeClass("disabled");//添加第一个动画时去掉播放动画按钮的禁用状态
                if(num >= 10) return;
                if(num == 9) $(this).addClass("disabled");

                template.find(".animateHead a span").text("动画-" + (num + 1));
                template.find(".ani-duration .slider").css("left",1 / 5 * 90).siblings(".moment").width( 1 / 5 * 90);
                template.appendTo(".wqdEditBox.animateEdit .panel-group");
                updateAniListElem(template.find(".triggerElem .animateList ul"));
                changeAniList(edit,template,"show");
                animate.setSlider(template);
                animate.setAnimate(num,0,"wqdNoAnimate");
                animate.setAnimate(num,1,1);
                animate.setAnimate(num,2,0);
                animate.setAnimate(num,3,1);
                animate.setAnimate(num,4,"unveil.wqdAnimate");
                animate.setAnimate(num,5,edit.attr("id"));
                animate.setAnimate(num,6,"show");

                num == 0 && edit.addClass('aniHide');

                $(document).trigger("appSetCatch");
            });
	};
	// 移除之前绑定的动画触发事件
	animate.removeTriggerEvent = function (index,triggertype) {
		var oldTriggerType = (edit.attr("triggertype") || "").split(",")[index];
		if(oldTriggerType && triggertype != oldTriggerType || !triggertype) {
			var oldElemId = (edit.attr("triggerelem") || "").split(",")[index];
			$("#"+oldElemId).off(".wqdAnimate");
		}
	};
	//动画面板事件绑定
	animate.contentBindEvent = function (obj) {
		var $docu = $(document).off(".aniSetMenu");
		var $aniSetBox = $(".animateEdit").off(".aniSetMenu");

		//弹出drapdown列表
		$aniSetBox.on("click.aniSetMenu",".animateBtn",function(e){
			var ullist = $(this).siblings(".wqd-drapdown-list");
			if(ullist.css("display") != "none"){
				ullist.hide();
			}else{
				$(".wqd-drapdown-list").hide();
				ullist.show();
				$(".nano").nanoScroller({alwaysVisible: true});
			}
			// if($(this).parents(".triggerElem").length) {
			// 	$(this).siblings(".wqd-drapdown-list").find(".nano").nanoScroller({alwaysVisible: true});
			// }
		});

		//选择下拉li
		$aniSetBox.on("click.aniSetMenu",".animateList li",function(e){
			$(this).addClass("active").siblings("li").removeClass("active").end()
				.parents(".wqd-drapdown-list").eq(0).hide().siblings(".animateBtn").text($(this).find("a span").text());
		});

		//选择触发事件
		$aniSetBox.on("click.aniSetMenu",".triggerType .typeList li",function(){
			var $this = $(this),
				triggertype = $this.attr("triggertype") || "unveil.wqdAnimate",
				index = $this.parents(".animateBox").index();

			animate.removeTriggerEvent(index,triggertype);//移除之前绑定的事件
			animate.setAnimate(index,4,triggertype);
			// wqdAnimation.init();
			$docu.trigger("appSetCatch");
		});

		//选择触发动作

		$aniSetBox.on("click.aniSetMenu",".triggerAction .typeList li",function(){
			var triggerAction = $(this).attr("triggerAction") || "show",
				index = $(this).parents(".animateBox").index();
			changeAniList(edit,$(this).parents(".animateBox"),triggerAction);
			$(this).parents("li.triggerAction").siblings(".hassetfont").find(".animateList li").eq(0).trigger("click");
			// wqdAnimation.init();

			animate.setAnimate(index,6,triggerAction);
			// !edit.attr("triggeraction") || edit.attr("triggeraction").indexOf("show") == -1 ? edit.removeClass('aniHide') : edit.addClass('aniHide');
			var nodeTriAction = (edit.attr("triggeraction") || "" ).split(",")[index];
			if(index == 0) {
				triggerAction == "show" ? edit.addClass('aniHide') : edit.removeClass('aniHide');
			}
			$docu.trigger("appSetCatch");
		});

		// 鼠标划过触发元素时添加样式
		$aniSetBox.on("mouseenter.triggerElem.aniSetMenu",".triggerElem .animateList li",function (e) {
			$(".oAniTrElNode").remove();
			$(".onAniTriggerElemSelect,.onAniH").removeClass("onAniTriggerElemSelect onAniH");
			$(".onAniTriggerElem").removeClass("onAniTriggerElem");
			if($("body").attr("data-carouseediting") == "true") {
				var $node = edit.parent().find("#"+$(this).attr("triggerelem") );
				$node = $node.length ? $node : edit;
				$node.clone().removeAttr("id").addClass("oAniTrElNode").css({
					top: $node.offset().top,
					left: $node.offset().left,
					zIndex:9998
				}).appendTo('body');
				$node.addClass('onAniH');
			}
			var $node = $("#"+$(this).attr("triggerelem") );
			$node.addClass("onAniTriggerElemSelect")
				.parents(".sectionV2,.wqd-carouseOverlay-box").addClass("onAniTriggerElem");
			$node.parents(".wqdGroup").length && $node.parent().parent(".wqdGroup").addClass('onAniTriggerElem')
					.children('.wqdelementEditBox').addClass('onAniTriggerElem');
		})
		.on("mouseleave.triggerElem.aniSetMenu",".triggerElem .animateList li",function (e) {
			$(".oAniTrElNode").remove();
			$(".onAniTriggerElem").removeClass("onAniTriggerElem");
			$("#"+$(this).attr("triggerelem") ).removeClass("onAniTriggerElemSelect onAniH");
			$(".onAniH").removeClass("onAniH");
		})
		.on("click.triggerElem.aniSetMenu",".triggerElem .animateList li",function (e) {//触发元素
			var elemId = $(this).attr("triggerelem");
			var index = $(this).parents(".animateBox").eq(0).index();

			animate.removeTriggerEvent(index);//移除之前绑定的事件
			animate.setAnimate(index,5,elemId);
			// wqdAnimation.init();
			$docu.trigger("appSetCatch");
		});

		//是否循环播放
		$aniSetBox.on("click.aniSetMenu",".ani-count-check",function(){
			var num = $aniSetBox.find(".animateBox").index($(this).parents(".animateBox")),//第几个动画
				value = null;
			if($(this).hasClass("active")){
				value = $(this).siblings("input").val() || 1;
				$(this).siblings("input").removeAttr("disabled")
			}else{
				value = "infinite";
				$(this).siblings("input").attr("disabled","disabled");
			}
			animate.setAnimate(num,3,value);
			$(this).toggleClass("active");
			$docu.trigger("appSetCatch");
			window.edit.wqdAnimate();
		});
		//弹出动画内容
		$aniSetBox.on("click.aniSetMenu",".animateHead",function(){
			var state = $(this).siblings(".animatBody");
			$(this).parents(".animateBox").siblings().find(".animatBody:visible").siblings(".animateHead").trigger("click");
			if(state.is(":visible")){
				state.slideUp(300);
				$(this).find(".panel-title a i").css("background-position","-167px -181px");
			}else{
				state.slideDown(300);
				$(this).find(".panel-title a i").css("background-position","-148px -181px");
			}
		});
		//删除动画
		$aniSetBox.on("click.aniSetMenu",".animateHead .dele",function(e){
			e.stopPropagation();
			$(".addAnimat.disabled").removeClass("disabled");
			var index = $(".wqdEditBox.animateEdit .animateBox").index($(this).parents(".animateBox"));
			if($(".wqdEditBox.animateEdit .animateBox").length==1){
				edit.removeClass(edit.attr("data-animate") || "").removeAttr(animate.animateAttr.join(" ")).off("click.wqdAnimate").off("mouseenter.wqdAnimate");
				$("button.aniReplay").addClass("disabled");
			}else{
				for(var i = 0; i < animate.animateAttr.length; i++) {
					var arr = edit.attr((animate.animateAttr[i])||"").split(",");
					i == 0 && edit.removeClass(arr[index]);
					arr.splice(index,1);
					edit.attr(animate.animateAttr[i],arr.join(","));
				}
			}
			if(edit.find(".wqdelementEditBox").attr("style")) edit.find(".wqdelementEditBox").attr("style",edit.find(".wqdelementEditBox").attr("style").replace(/(-|\w|\s|)*animation(-|\w|\s|:)+;/g,""));
			$(this).parents(".animateBox").remove();
			$(".wqdEditBox.animateEdit .animateBox").each(function(i){
				$(this).find(".animateHead a span").text("动画-"+(i+1));
			});
			// var triAction = edit.attr("triggeraction");
			// if(!triAction || triAction.indexOf("show") == -1) edit.removeClass('aniHide');
			var triAction = (edit.attr("triggeraction") || "" ).split(",")[index];
			index == 0 && triAction == "show" ? edit.addClass('aniHide') : edit.removeClass('aniHide');
			$(document).trigger("appSetCatch");
		});
		//选择动画效果
		$aniSetBox.on("click.aniSetMenu",".hassetfont .animateList li",function(e){
			var index = $(".wqdEditBox.animateEdit .animateBox").index($(this).parents(".animateBox")),
			animateName = $(this).attr("animatetype") || "wqdNoAnimate";
			$(this).parents("li").eq(0).attr("data-animate",animateName);
			edit.removeClass(edit.attr("data-animate").split(",")[index]);
			animate.setAnimate(index,0,animateName);
			$(document).trigger("appSetCatch");
			window.edit.wqdAnimate();
		});
		// 选择触发元素
		$aniSetBox.on("click.aniSetMenu",".triggerElem .animateBtn",function (e) {
			window.edit.parents(".sectionV2").addClass('onAniTriggerElem');
			// var triElem = edit.attr("triggerElem") || "",
			// 	triNum = [];
			// $.each(triElem.split(","),function (i,_) {
			// 	triNum.indexOf(_) == -1 && triNum.push(_);
			// });

			// var $li = $(this).siblings(".wqd-drapdown-list").find("ul> li").show(),
			// 	isUnevil = $(this).parents(".triggerElem").siblings(".triggerType").find(".animateBtn").text() == "元素出现";
			// isUnevil && triNum.length > 1 && $li.each(function(index, el) {
   //              $.inArray($(el).attr("triggerelem"),triNum) == -1 && $(el).hide();
			// });

		});

		//展示次数
		$aniSetBox.on("keyup.aniSetMenu",".rouShow input",function(e){
			this.value = this.value.replace(/\D/g,'');
			var intval = Number(this.value) || 0;
			if(e.keyCode == 38){
				intval++;
			}else if(e.keyCode == 40){ 
				intval--;
			}
			this.value = intval;
		}).on("blur.aniSetMenu",".rouShow input",function(){
			var index = $(".wqdEditBox.animateEdit .animateBox").index($(this).parents(".animateBox")),
			value = this.value || 1;
			animate.setAnimate(index,3,value);
			$(document).trigger("appSetCatch");
		});
	};

	// 设置拖动滑块
	animate.setSlider = function (obj) {
		obj.find(".slider").each(function(i){
			var that = $(this),
				num = $(".wqdEditBox.animateEdit .animateBox").index(that.parents(".animateBox")),
				type = that.attr("timetype"),
				maxvalue = type == "1" ? 5 : 20;
			_ut.range({
				slider : that,
				maxval : maxvalue,
				callback : function(val){
					var val = that.parent().siblings("input").val() || 0;
					animate.setAnimate(num,type,val);
				}
			});
		});
	};

	return animate;
});
