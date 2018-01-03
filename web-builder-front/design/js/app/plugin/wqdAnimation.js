define(['utility'],function(utility) {
	// liumingren 执行动画
	$(document).on("animationInit",function (e) {
		// wqdUnveil.init();
	})
	$.fn.extend({
		wqdAnimate: function (indexArr) {
			 $(this).trigger("wqdAnimationEnd");
			var $this    = $(this),$box = $this.find(".wqdelementEditBox"),
				animate  = $this.attr("data-animate") && $this.attr("data-animate").split(",") || [],//动画名称
				duration = $this.attr("data-animation-duration") && $this.attr("data-animation-duration").split(",") || [],//动画所花费的时间
				delay    = $this.attr("data-animation-delay") && $this.attr("data-animation-delay").split(",") || [],//延迟时间
				iterationCount = $this.attr("data-animation-iteration-count") && $this.attr("data-animation-iteration-count").split(",") || [],//动画应该播放的次数
				action   = $this.attr("triggeraction") && $this.attr("triggeraction").split(",") || [],//触发动作
				i = 0,animateCss,animateStyle;
			indexArr = $.merge([],indexArr||[]);
			var addAnimate = function (i) {
				animateCss         = {};
				duration[i]        = duration[i] || 0;
				delay[i]           = delay[i] || 0;
				// 如果动画执行次数为无限并且动画不为最后一个，设置动画style为1次
				// iterationCount[i]  = iterationCount[i] ==="infinite" && i !== indexArr.length-1 ? 1 : iterationCount[i] ? iterationCount[i] : 0;
				iterationCount[i]  = iterationCount[i] ==="infinite" && indexArr.length > 1 ? 1 : iterationCount[i] ? iterationCount[i] : 0;
				animateCss["animation-name"] = animate[i];
				animateCss["animation-duration"]        = duration[i]+"s";
				animateCss["animation-delay"]           = delay[i]+"s";
				animateCss["animation-iteration-count"] = iterationCount[i];

				// action[i] == "show" && setTimeout(function () {
				// 	$this.removeClass("aniHide");
				// },(duration[i]-0)*iterationCount[i]+(delay[i]-0)*1000+10||0);
				// action[i] == "hide" && $this.addClass("aniHide");
				// 此处与host中的不同！！！！！！！！！！！
				// if(action[i] == "show" || action[i] == "hide") {
				// 	setTimeout(function () {
				// 		action[i] == "show" ? $this.removeClass("aniHide") : $this.addClass("aniHide");
				// 	},(duration[i]-0)*iterationCount[i]+(delay[i]-0)*1000+10||0);
				// }
				$box.css(animateCss).addClass("wqdAnimatedos");
				// 当前动画执行完毕后执行下一步
				$box.one("wqdAnimationEnd",function (e) {
					// 移除行内的动画样式
					animateStyle = $box.attr("style").replace(/(-|\w|\s|)*animation(-|\w|\s|:)+;/g,"");
					// iterationCount[i] != "infinite" && $box.removeClass(animate[i]).attr("style",animateStyle);
					iterationCount[i] != "infinite" ? $box.removeClass(animate[i]).attr("style",animateStyle) : $box.off(".wqdAnimate");
					// 如果还有动画递归执行
					indexArr.length && indexArr.shift();
					if(indexArr.length) {
						addAnimate(indexArr[0]);
					}
				});
				if(i != indexArr.length-1 || iterationCount[i] !="infinite"){
					$box.wqdAnimatEnd((duration[i]-0)*iterationCount[i]+(delay[i]-0));
				}
			};

			animate.length && indexArr.length && addAnimate(indexArr[0] || i);

			return $this;
		}
	});

	$(document).on("wqdAnimateEventOff",function (e) {
		$(this).off(".wqdAnimate");
		// wqdUnveil.init();
	});
	var wqdUnveil = {};
	wqdUnveil.init = function(){
		$("[elementandgroup='true']").off(".wqdAnimate");
		$("[data-animate]").each(function(i,_) {
			var	$this = $(this),
				thisId = $this.attr("id"),
				triggerType = $this.attr("triggertype") || "unveil.wqdAnimate";
				triggerType = triggerType.split(","),
				triggerElem = $this.attr("triggerElem") || "";
			// $this.off("unveil.wqdAnimate").off("click.wqdAnimate").off("mouseenter.wqdAnimate");

			var triggerElemNum = {};
			if(triggerElem) {
				$.each(triggerElem.split(","),function (i,val) {
					val = val || thisId;
					triggerElemNum[val] ? triggerElemNum[val].push(i) : triggerElemNum[val] = [i];
				});
			} else {//旧版的动画所有为当前元素
				triggerElemNum[thisId] = $.map(triggerType,function (_,i) {
					return i;
				});
			}

			var bindTrigger = function ($node,elemId,tList) {
				var triggerClick = [],
					triggerMouse = [],
					triggerunveil = [];
				for(var i=0; i < triggerType.length; i++){
					tList[i] = tList[i] || {};
					var ev = tList[i].ev || "";
					if(ev.indexOf("click") != -1){
						triggerClick.push(i);
					}else if(ev.indexOf("mouseenter") != -1){
						triggerMouse.push(i);
					}else if(ev.indexOf("unveil") != -1){
						triggerunveil.push(i);
					}
				}

				if(triggerClick.length){
					$node.on("click.wqdAnimate",function(e){
						$("#"+elemId).wqdAnimate(triggerClick);
					}).addClass('aniTriOther');
				}
				if(triggerMouse.length){
					$node.on("mouseenter.wqdAnimate",function(e){
						$("#"+elemId).wqdAnimate(triggerMouse);
					}).addClass('aniTriOther');
				}
				if(triggerunveil.length){
					$node.one("unveil.wqdAnimate",function(e){
						$("#"+elemId).wqdAnimate(triggerunveil);
					}).addClass('aniTriOther');
				}
			};

			$.each(triggerElemNum,function (i,val) {
				var triggerList = [];
				$.each(val,function (j,__) {
					triggerList[__] = {};
					triggerList[__].ev = triggerType[__];
				});
				bindTrigger($("#"+i),thisId,triggerList);
			})
		});

        $(document).on('slid.Wqdcarousel','.wqdCarousel',function () {
        	var elements =  $(this).find(".carousel-inner .item.active .bannerContainer").find("[data-animate]");
        	elements.each(function(){
        		var triggertypes = $(this).attr("triggertype") || "unveil.wqdAnimate";
        			triggertypes = triggertypes.split(",");
        		for(var k=0; k < triggertypes.length; k++){
        			if(triggertypes[k] == "unveil.wqdAnimate"){
        				$(this).wqdAnimate();
        				break;
        			}
        		}
        	});
        });
	};

	wqdUnveil.unveil = function(){
		var element = $("[data-animate],.aniunveil");
		if($("#HTMLDATA .wqdIphoneView").length){
			var inview = element.filter(function() {
	            var that = $(this),
	            	elemTop = that.offset().top,
	            	elemTh = elemTop + that.height(),
	            	boxTop = $("#wqdIphoneContainer").offset().top,
	            	boxHeight = $(window).height() > $("#wqdIphoneContainer").height()+boxTop ? $("#wqdIphoneContainer").height()+boxTop : $(window).height();
	            return elemTop >= boxTop && elemTh <= boxHeight;
	        });
	    }else{
	    	var inview = element.filter(function() {

	            var $e = $(this), $w = $(window), wt = $w.scrollTop(), wb = wt + $w.height(), et = $e.offset().top, eb = et + $e.height();

	            return et >= wt && eb <= wb;
	        });
	    }
        inview.trigger("unveil.wqdAnimate");
	};

	wqdUnveil.bindEvent = function(){
		if($("#HTMLDATA .wqdIphoneView").length){
			$("#wqdIphoneContainer .nano-content").scroll(function(){
				wqdUnveil.unveil();
			});
		}
		$(document).bind("scroll", function() {
            wqdUnveil.unveil();
        });
        $(document).on("domInit", function() {
        	// wqdUnveil.init();
            wqdUnveil.unveil();
        });
        wqdUnveil.unveil();
	};
	// wqdUnveil.init();
	wqdUnveil.bindEvent();

	return wqdUnveil;
});
