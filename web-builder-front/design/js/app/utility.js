define(["elementRotate"],function(_er) {
	var utility = {};

	utility.creatID = function(msg){
		return msg ? msg + new Date().getTime() : new Date().getTime();
	}

	/**
	 * newID 元素的新ID
	 * oldID,  元素的旧ID
	 **/
	utility.changeStyle = function(oldID, newID){
		var styleElm = $('style.'+oldID) ,cloneStyle = styleElm.clone();
		if(cloneStyle.length){
			cloneStyle.removeClass().addClass(newID);
			cloneStyle.html(cloneStyle.html().replace(new RegExp(oldID,'gi'),newID));
			styleElm.after(cloneStyle);
		}
	}

	/*
	 * ajax
	 */
	utility.ajax = function(type,url,data,async,dataType,callback,arg){
		$.ajax({
			type: type || "POST",
			url: url,
			data : data,
			async: async || true,
			dataType: dataType || "json",
			success:function(data){
				callback(data,arg);
			},
			error : function(data){
				callback(data,arg);
			}
		});
	}

	/*
	 * 删除元素的ID
	 */
	utility.removeElmStyle = function(newID){
		$('style.'+newID).remove();
	}

	/**
	 * [简单模板方法，用来组装字符串 liumingren]
	 * 仅替换，可用来替换变量生成字符串。未加入常见的each等操作，后续可使用流行的模板引擎
	 * @param {[string]} 模板 格式为{{key}} , {{key|方法名 参数}}
	 * @param {[object|array]} 替换的对象数据 格式为 (模板:值),多个放在数组里，多个可做each使用,{{INDEX}}为下标
	 * @return {[string]} [替换后的htmlString]
	 */
	utility.format = function(){
		var args = [].slice.call(arguments),str = String(args.shift() || ""), ar = [], first = args[0];
		args = $.isArray(first) ? first : typeof(first) == 'object' ? args : [args];
		var formatMethod = {
			to : function (value) {
				return value;
			}
		};
		$.each(args, function(i, o){
			ar.push(str.replace(/\{\{([\d\w\.\-\*\|\s]+)\}\}/g, function(m, n){
				var reg = /\*\d+(\.\d+)?/g,v;
				n.replace(/([^|]*)\|([^\s]+)\s?([^\s]+)\s?([^\s]+)?/g,function(p,q,r,s,t){
					if(r === "to") {
  						if(o[q]) v = formatMethod[r](s);
					}
				});
				// if(!o[n]) n = n.replace(/\-hover|\-active/g,"");
				if(!v) v = n === 'INDEX' ? i : reg.test(n) ? o[n.replace(reg,"")]*n.match(reg)[0].replace(/\*/g,"") : o[n];
				return v === undefined ? m : ($.isFunction(v) ? v.call(o, n) : v)
			}));
		});
		return ar.join('');
	};
	/**
	 * [创建元素编辑工具栏 liumingren]
	 * @param {[object]} config
	 * @param {[object]} config.element [jquery对象,当前编辑的元素节点],
	 * @param {[function]} config.onload [加载完成后回调函数]
	 * @param {[array]}  config.toolbarBtn [按钮集]
	 * @param {[string]} config.toolbarBtn[0].identClass [当前按钮的标识class]
	 * @param {[object]} config.toolbarBtn[0].btnCss [当前图标样式对象,同jquery.Css]
	 * @param {[string]} config.toolbarBtn[0].text [当前按钮文本]
	 * @param {[function]} config.toolbarBtn[0].init [加载时回调函数,参数($elm,$btn),元素jquery对象,按钮jquery对象]
	 * @param {[function]} config.toolbarBtn[0].onclick [点击回调函数,参数(e,$elm,$btn),元素jquery对象,按钮jquery对象]
	 */
	utility.elementtToolBar = function (config) {

		$("body").find(".elementToolbar").remove();//移除工具条
		var $toolbar = $("<div class='elementToolbar'></div>"),$elm =config.element,
			toolbarBtn = config.toolbarBtn,offset;
		// 遍历每个按钮
		for (var i = 0; i < toolbarBtn.length; i++) {
			var data = toolbarBtn[i],
				$btn = $("<div class='elemBtnBox "+data.identClass+"' title="+(data.desc || "")+" ></div>");
			$btn.append("<span class='elemBtn'></span><span class='elemText'>"+data.text+"</span>").unbind("click");
			data.btnCss && $btn.css(data.btnCss);//设置样式
			//绑定init
			if(data.init && typeof(data.init) === "function") {
				data.init($elm,$btn);
			}
			//上下文菜单
			if(data.context) {
				var $context = $("<ul class='elenentToolbarContext'></ul>").appendTo($btn),
					contextList = data.context.list;
				for(var j = 0; j < contextList.length;j++){
					var $this = $("<li class='etbcli "+contextList[j].identClass+"'>"+contextList[j].text+"</li>").appendTo($context);
					//绑定点击事件
					if(contextList[j].onclick && typeof(contextList[j].onclick) === "function") {
						(function ($this,$elm,thisLi) {
							$this.bind("click",function (e) {
								e.stopPropagation();
								thisLi.onclick(e,$elm);
								if(thisLi.autohide) {
									$context.hide();
								}
							})
						})($this,$elm,contextList[j]);
					}
				}
				data.onclick = function (e,$elm) {
					var $handle = $(e.target),
						$context = $handle.siblings(".elenentToolbarContext"),
						$elemBtnBox = $handle.parents(".elemBtnBox");
					$(".elenentToolbarContext").not($context[0]).hide();
					$context.toggle();
					$elemBtnBox.toggleClass("on").siblings().removeClass("on");
				}
			}
			//绑定点击事件
			if(data.onclick && typeof(data.onclick) === "function") {
				(function ($elm,$btn,callback) {
					$btn.bind("click",function (e) {
						e.stopPropagation();
						callback(e,$elm);
					})
				})($elm,$btn,data.onclick)
			}

			$toolbar.append($btn);
		}

		var elmHeight = $elm.innerHeight();
		// 如果元素旋转重置高度
		// if($elm.attr("data-rotate")) {
		// 	var rotateDate = _er.getOffset($elm);
		// 	elmHeight = rotateDate.bottom - rotateDate.top;
		// }

		// 如果旋转角度则工具栏在下面
		// var rotate = $elm.attr("data-rotate"),top;
		// if(rotate < 156) {
		// 	top = $elm.offset().top + elmHeight;
		// }
		if(config.event) {
			$toolbar.appendTo("body").css({
				"top": config.event.clientY+$(window).scrollTop()-54,
				"left":config.event.clientX
			});
		}else {
			$toolbar.appendTo("body").css({
				"top": $elm.offset().top + elmHeight,
				"left":$elm.offset().left
			});
		}

		//绑定onload
		if(data.onload && typeof(data.onload) === "function") {
			data.onload($elm);
		}
	};

	/**
	 * 修改模式遮罩 lmr
	 * @param  {object} $node
	 * @param  {object} $parent
	 */
	utility.overlay = function ($node,$parent) {
		var $overlay = $("<div class='wqd-carouseOverlay'><div class='wqd-carouseOverlay-box moveMainArea'></div></div>").appendTo("body"),
			$overlayBox = $overlay.find(".wqd-carouseOverlay-box"),$nodeClone;

		$nodeClone = $node.clone(true);
		$nodeClone.find(".wqdCarousel").data("Wqdcarousel","");
		$overlayBox.css({
			width:$parent.width(),
			height:$parent.height(),
			left:$parent.offset().left,
			top:$parent.offset().top - document.documentElement.scrollTop - document.body.scrollTop,
			position:"absolute"
		});
		$("body").attr("data-carouseEditing",true).css("overflow","hidden");
		$overlayBox.append($nodeClone);
		$node.trigger("wqdComponentD:overlay");
		if($node.parents(".fullscreen").length) {
			$overlayBox.addClass("fullscreen");
		}
        $node.attr("id","").find("[data-elemandgroup]").attr("id","");
		//临时兼容，隐藏左侧列表
		// $("#wqdpageContentD").hide();
		if($("#wqdpageContentD").is(":visible")) $("#wqdpHeaderD").find("ul.func-list li.title").trigger("click");
		// 点击黑暗处切换回去
		$overlay.bind("click",function (e) {
			if($(e.target).parents("[data-elementtype]").size() == 0) {
				if($("#summerEditor").size()) {
					return;
				}
				$nodeClone.attr("data-elemandgroup",true);
				$node.replaceWith($nodeClone);
				$overlay.remove();
				$("body").attr("data-carouseEditing",false).css("overflow","visible");
				setTimeout(function () {
					$(document).trigger("wqdComponentD:overlay")
						.trigger("appSetCatch");
					$("#"+$node.attr("id")).trigger("element.change").trigger("element.changed");
				},0);
			}
		})
	};

	/*liuruihu
	 html固定结构
	 <div>
	 <span>按钮半径</span>
	 <div class="scale">
	 <span class="moment"></span>
	 <div class="slider"></div>
	 </div>
	 <input type="text" class="r_val" placeholder="0"> px
	 </div>

	 json.maxval	文本框可显示的最大值
	 json.slider	拖拽对象（小点）
	 json.effective	可拖拽的有效范围
	 json.callback	回调函数
	 */
	utility.range = function(json) {

		var json = json || {},
			minval = json.minval||0, //最小值是0
			maxval = json.maxval,
			moveMaxval = json.moveMaxVal||json.maxval,
			_this = json.slider,
			effective = json.effective || $(document),
			spaceNumber=json.spaceNumber||1,//步长数据
			maxwidth = _this.parent().width(),
			type=json.type,
			_obj=json.obj,
			decimal=function(){
				if(_this.parent().siblings("input").hasClass("variate")){
					return 1;
				}else if(spaceNumber){
					if(spaceNumber.toString().indexOf(".")!=-1){
						return spaceNumber.toString().split(".")[1].length;
					}else{
						return 0;
					};
				};
			}();

		var ratio; //比例
		var ImmediateChange=function($slder,$input,val,$click){
			var key_val = Number(Number(val).toFixed(decimal)) || 0,rangeNumber,rangeVal,ratio;
			if(!$click.hasClass("slider")&&!$click.hasClass("r_val")){
				if (Math.round(key_val*maxval/maxwidth) > maxval) {
					rangeNumber=maxval;
				} else if (Math.round(key_val*maxval/maxwidth) < minval) {
					rangeNumber=maxwidth*(minval/maxval);
					ratio=minval/maxval;
				}else{
					rangeNumber=key_val;//直接取值
					ratio=rangeNumber/maxwidth;
				};
				rangeVal=Math.round(key_val*maxval/maxwidth)<minval?minval:Math.round(key_val*maxval/maxwidth);//只有小于的时候
			}else{
				if (key_val > maxval&&!json.unMax) {
					key_val=maxval;
				} else if (key_val < minval) {
					key_val = minval;
				};
				ratio = key_val / moveMaxval
				rangeNumber=(ratio * maxwidth);
				rangeVal=key_val;
			};
			$input.val(rangeVal);
			json.callback && json.callback(ratio,type,maxval,rangeVal,$slder);
			key_val > moveMaxval ? $slder.css({ "left": maxwidth }).prev().css({ "width": maxwidth }) :
				$slder.css({ "left": rangeNumber }).prev().css({ "width": rangeNumber });
			$(document).trigger("appSetCatch");
		};
		//拖拽
		_this.off("mousedown.sliderRange");
		//_this.mousedown(function(e) {
		_this.on("mousedown.sliderRange",function(e) {
			e.preventDefault();
			var posL = parseFloat($(this).position().left);//
			var offL = parseFloat($(this).offset().left);//
			var $this = $(this);
			// var dx = e.clientX;
			function move(e) {
				// var len = offl + e.clientX - dx;
				var len = e.clientX -offL+posL;//消除点击在小圆内部的误差(尤其是初始值不是0的时候)
				if (len >= 0 && len <= maxwidth) {
					if(len<=maxwidth*(minval/moveMaxval)){
						len=maxwidth*(minval/moveMaxval)
					};
					$this.css("left", len);
					$this.prev().css("width", len);
					ratio = len / maxwidth;
					if(ratio>0.99 && moveMaxval >1000) ratio = 1;
					var rangeVal = Math.round(ratio * moveMaxval);
					if(rangeVal<3 && moveMaxval >1000) rangeVal = 0;
					$this.parent().siblings("input").val(rangeVal);
					json.callback && json.callback(ratio,type,moveMaxval,rangeVal,$this);
				}
				e.stopPropagation();
			};
			function up() {
				$(document).trigger("appSetCatch");
				$("body").off("mousemove.drop.range")
					.off("mouseup.drop.range");
			};

			$("body").off("mousemove.drop.range",move)
			$("body").on("mousemove.drop.range",move)
				.on("mouseup.drop.range", up);
			e.stopPropagation();
		});
		//输入框
		var intval;

		_this.parent().siblings("input").off(".inputRange").on("keydown.inputRange", function(e) {
			e.stopPropagation();
			// this.value = this.value.replace(/[^\d\.]/g, '');
			var intval = Number(this.value) || 0,
				keyval = e.keyCode,
				variate = $(this).hasClass("variate") ? 0.1 : spaceNumber;
			if (e.keyCode == 38) {
				intval = parseInt(Math.round((intval + variate) * 10)) / 10; // 去除存在小数时js的精度误差
				ImmediateChange(_this,$(this),intval,$(e.target));
			} else if (e.keyCode == 40) {
				intval = parseInt(Math.round((intval - variate) * 10)) / 10;
				ImmediateChange(_this,$(this),intval,$(e.target));
			}else if(e.keyCode == 13){
				ImmediateChange(_this,$(this),intval,$(e.target));
			};
			//_this.css({"left":intval*maxwidth/maxval}).siblings(".moment").css({"width":intval*maxwidth/maxval});
		}).on("input.inputRange",function(){
			this.value = this.value.replace(/[^\d\.]/g, '');
		}).on("blur.inputRange",function(e){
			var intval = Number(this.value) || 0,
				keyval = e.keyCode,
				variate = $(this).hasClass("variate") ? 0.1 : spaceNumber;
			ImmediateChange($(this).siblings(".scale").find(".slider").eq(0),$(this),intval,$(e.target));
		});
		//点击取值
		_this.parent().css({"cursor":"pointer"}).off("click").on("click",function(e){
			if($(e.target).hasClass("slider")) return;
			var ele=$(this);
			var offsetX=ele.offset().left;
			var clickPos=Math.round(e.pageX-offsetX);
			var $input=$(this).siblings("input");
			var $slider=$(this).find(".slider");
			ImmediateChange($slider,$input,clickPos,$(e.target));
			e.stopPropagation();
		});
	};
	/* 返回动画结束事件名称 */
	utility.transitionEndName = function(){
		var el = document.createElement('wqdtransitionEnd');
		var transEndEventNames = {
			WebkitTransition : 'webkitTransitionEnd',
			MozTransition    : 'transitionend',
			OTransition      : 'oTransitionEnd otransitionend',
			transition       : 'transitionend'
		};
		for (var name in transEndEventNames) {
			if (el.style[name] !== undefined) {
				return { end: transEndEventNames[name] };
			}
		}
		return false;
	};
	utility.animatEndName = function(){
		var el = document.createElement('wqdAnimatEnd');
		var transEndEventNames = {
			WebkitTransition : 'webkitAnimationEnd animationend',
			MozTransition    : 'mozAnimationEnd',
			OTransition      : 'oanimationend',
			transition       : 'MSAnimationEnd animationend'
		};
		for (var name in transEndEventNames) {
			if (el.style[name] !== undefined) {
				return { end: transEndEventNames[name] };
			}
		}
		return false;
	};
	$.fn.wqdTransiEnd = function (duration) {
		var called = false;
		var $el = this;
		$(this).one("wqdTransitionEnd", function () { called = true });
		var callback = function () { if (!called) $($el).trigger($.support.wqdTransition.end) };
		setTimeout(callback, duration*1000);
		return this;
	};
	$.fn.wqdAnimatEnd = function (duration) {
		var called = false;
		var $el = this;
		$(this).one("wqdAnimationEnd", function () { called = true });
		var callback = function () { if (!called) $($el).trigger($.support.Animation.end) };
		setTimeout(callback, duration*1000);
		return this;
	};
	$.support.wqdTransition = utility.transitionEndName();
	$.support.Animation = utility.animatEndName();
	if (!$.support.wqdTransition) return;

	$.event.special.wqdTransitionEnd = {
		bindType: $.support.wqdTransition.end,
		delegateType: $.support.wqdTransition.end,
		handle: function (e) {
			if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
		}
	};
	$.event.special.wqdAnimationEnd = {
		bindType: $.support.Animation.end,
		delegateType: $.support.Animation.end,
		handle: function (e) {
			if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
		}
	};
	/**
	 * [两级列表拖拽 黄剑剑]
	 * @param {[object]} options
	 * @param {[object]} options.navDom [正在编辑的jq对象]
	 * @param {[object]} options.obj [绑定拖拽事件的代理对象，默认为document]
	 * @param {[string]} options.eventNode [拖拽节点的jq选择器]
	 * @param {[string]}  options.parent [拖拽节点的父元素结构]
	 * @param {[string]} options.tempLi [拖拽过程中生成的占位结构，默认为li]
	 * @param {[function]} options.dragBefore [拖拽之前的处理函数]
	 * @param {[function]} options.dragAfter [拖拽之后的处理函数]
	 * options.dragAfter回调实参
	 	parameter1 {[number]} [1为一级交换，2为二级交换，3为二级拖到一级]
	 	parameter2 {[number or Array]} [拖动元素的位置，parameter1为2、3时是一个数组，下标0为一级index，下标1为二级index]
	 	parameter3 {[string]} [插入节点时候的方向，parameter1为3时是空值]
	 	parameter4 {[number]} [插入位置]
	 */
	utility.wqdListDrag= function(options){
		if(!options) return;
		var navDom = options.navDom || $(document),
			obj = options.obj || $(document),
			parent = options.parent || "li",
			tempLi = options.tempLi || "<li></li>",
			target = options.eventNode || "i.dragMark";
		obj = typeof obj == "object" ? obj : $(obj);
		var eventNode = $(target);
		obj.off('mousedown.dragDrop').on('mousedown.dragDrop',target,function(event){
			var action = null,
				x1 = event.pageX,
				y1 = event.pageY,
				isshow = false,
				node = $(this).closest(parent),
				nodeIndex = tempIndex = dragType = null,
				nodeY = nodeX = nodeW = nodeH = 0 ,
				isFirst = moveTarget = pagetarget = near = null;
			nodeIndex = node.index();
			if(node.hasClass('open')) isshow = true;
			typeof options.dragBefore == "function" && options.dragBefore.call(this);
			if(node.parent('ul').hasClass('subNavlist')){
				isFirst = false;
				moveTarget = $(this).parents(".subNavlist").children("li");
				//node.parents(".subNavlist").parent().siblings("li").removeClass("open").find(".subNavlist, .addSubmenu").hide();
			}else if(node.parent('ul').hasClass('topNavlist')){
				dragType = 1;
				isFirst = true;
				moveTarget = $(this).parents(".topNavlist").children("li");
				//node.parents(".topNavlist").children("li").removeClass("open").find(".subNavlist, .addSubmenu").hide();
			}else{
				return;
			}
			node.attr('active','ing');
			nodeY = node.position().top;
			nodeX = node.position().left;
			nodeH = node.outerHeight();
			nodeW = node.outerWidth();
			$(document).bind('mousemove.dragDrop',function(event){
				var x2 = event.pageX,
					y2 = event.pageY,
					moveX = x2 - x1 + nodeX,
					moveY = y2 - y1 + nodeY;
				action = (y1 - y2 > 0) ? 'before' : 'after';
				!$('#dragTempLi').length && node.before($(tempLi).attr("id","dragTempLi").css({"height":nodeH}));
				node.css({'position':'absolute','z-index':'9999','width':nodeW,'top':moveY+'px'});
				isFirst ? $('#dragTempLi').addClass('drag-first') : $('#dragTempLi').addClass('drag-second');

				var minDis = 99999;
				moveTarget.each(function(){
					var that = $(this);
					if(that.attr('active')!='ing'){
						if(collide(node,that)){
							var dis = getDis(node,that);
							if(dis<minDis){
								minDis = dis;
								near = that;
								pagetarget = null;
							}
						}
					}
				});

				if(near && ((near.outerHeight()/2)>minDis)){
					$('#dragTempLi').remove();
					near[action]($(tempLi).attr("id","dragTempLi").css({"height":nodeH}));
				}else if(!isFirst){
					dragType = 2;
					node.parents('.topNavlist').children('li').each(function(){
						if(collide(node,$(this))){
							var dis = getDis(node,$(this));
							if(dis<minDis){
								minDis = dis;
								pagetarget = !$(this).hasClass('open') ? $(this).data('minDis',minDis) : null;
							}
						}
					});
				}
			});

			function moveRes(){
				var ul = node.parent(), newlocat = null,parameArr = [];
				if(!ul.find('#dragTempLi').length){
					node.removeAttr('active');
					$(document).off('mousemove.dragDrop');
					$(document).off('mouseup.dragDrop');
					return;
				}
				tempIndex = ul.find('#dragTempLi').index();
				if(isFirst){
					if(tempIndex != nodeIndex && tempIndex != nodeIndex+1){
						parameArr.push(dragType);
						parameArr.push(nodeIndex);
						if(tempIndex > nodeIndex){
							parameArr.push("after");
							parameArr.push(tempIndex-1);
						}else{
							parameArr.push("before");
							parameArr.push(tempIndex);
						}

					}
				}else{
					if(pagetarget!=null  && (pagetarget.outerHeight()/2 >pagetarget.data('minDis')/2)){
						dragType = 3;
						var tempArr = [];
						tempArr.push(node.parents(".subNavlist").parent("li").index());
						tempArr.push(nodeIndex);
						parameArr.push(dragType);
						parameArr.push(tempArr);
						parameArr.push("");
						parameArr.push(pagetarget.index());
						var editMenu = node.removeAttr('style').removeAttr('active').clone(true);
						pagetarget.find(".subNavlist").append(editMenu);
						node.remove();
						ul.find('#dragTempLi').remove();
					}else{
						if(tempIndex != nodeIndex && tempIndex != nodeIndex+1){
							var tempArr = [];
							tempArr.push(node.parents(".subNavlist").parent("li").index());
							tempArr.push(nodeIndex);
							parameArr.push(dragType);
							parameArr.push(tempArr);
							if(tempIndex > nodeIndex){
								parameArr.push("after");
								parameArr.push(tempIndex-1);
							}else{
								parameArr.push("before");
								parameArr.push(tempIndex);
							}
						}
					}
				}
				if(parameArr.length){
					typeof options.dragAfter == "function" && options.dragAfter.apply(navDom,parameArr);
					$(document).trigger("appSetCatch");
				}
				(isFirst || pagetarget==null || pagetarget.outerHeight()/2 <pagetarget.data('minDis')/2) && node.removeAttr('style').removeAttr('active').replaceAll($('#dragTempLi'));

				$(document).off('mousemove.dragDrop');
				$(document).off('mouseup.dragDrop');
			}
			$(document).on('mouseup.dragDrop',moveRes);
		});

		function getDis(obj1,obj2){
			var a = obj1.offset().left - obj2.offset().left;
			var b = obj1.offset().top - obj2.offset().top;
			return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
		}

		function collide(obj1,obj2){
			var t1 = obj1.offset().top;
			var r1 = obj1.outerWidth() + obj1.offset().left;
			var b1 = obj1.outerHeight() + obj1.offset().top;
			var l1 = obj1.offset().left;

			var t2 = obj2.offset().top;
			var r2 = obj2.outerWidth() + obj2.offset().left;
			var b2 = obj2.outerHeight() + obj2.offset().top;
			var l2 = obj2.offset().left;

			if(t1>b2||r1<l2||b1<t2||l1>r2){
				return false;
			}else{
				return true;
			}
		}
	};

	return utility;
});

