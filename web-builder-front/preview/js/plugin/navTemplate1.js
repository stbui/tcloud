$(function() {
	var navTemplate = {};

	navTemplate.init = function(){
		$.fn.movebg=function(options){
			var defaults={
				width:120,/*移动块的大小*/
				extra:40,/*反弹的距离*/
				speed:300,/*块移动的速度*/
				rebound_speed:200/*块反弹的速度*/
			};
			var defaultser=$.extend(defaults,options);
			return this.each(function(){
				var _this=$(this);
				var _item=_this.children("ul").children("li");/*找到触发滑块滑动的元素	*/
				var origin=_this.children("ul").children("li.active").index();/*获得当前导航的索引*/
				var _mover=_this.find(".template1_mask");/*找到滑块*/
				//var hidden;/*设置一个变量当html中没有规定cur时在鼠标移出导航后消失*/
				if (origin==-1){origin=0;_mover.hide()} else{_mover.show()};/*如果没有定义cur,则默认从第一个滑动出来*/
				var cur=prev=origin;/*初始化当前的索引值等于上一个及初始值;*/
				var originItem = _this.children("ul").children("li").eq(origin);
				var nowLeft = originItem.position().left;
				var extra=defaultser.extra;/*声明一个变量表示额外滑动的距离*/
				_mover.css({left:nowLeft,width:originItem.outerWidth()});/*设置滑块当前显示的位置*/
				
				//设置鼠标经过事件
				_item.each(function(index,it){
					$(it).off("mouseenter.navTemplate1").on("mouseenter.navTemplate1",function(){
						_mover.css("width",$(this).outerWidth());
						nowLeft = $(this).position().left;
						cur=index;/*对当前滑块值进行赋值*/
						move();
						prev=cur;/*滑动完成对上个滑块值进行赋值*/
					});
				});
				_this.off("mouseleave.navTemplate1").on("mouseleave.navTemplate1",function(){
					originItem = _this.children("ul").children("li.active").length ? _this.children("ul").children("li.active") : _this.children("ul").children("li:first-child");
					_mover.css("width",originItem.outerWidth());
					nowLeft = originItem.position().left;
					cur=origin;/*鼠标离开导航时当前滑动值等于最初滑块值*/
					move();
					!_this.children("ul").children("li.active").length && _mover.stop().fadeOut();/*当html中没有规定cur时在鼠标移出导航后消失*/
				});
				
				//滑动方法
				function move(){
					_mover.clearQueue();
					if(cur<prev){extra=-Math.abs(defaultser.extra);} /*当当前值小于上个滑块值时，额外滑动值为负数*/
					else{extra=Math.abs(defaultser.extra)};/*当当前值大于上个滑块值时，滑动值为正数*/
					_mover.queue(
						function(){
							$(this).show().stop(true,true).animate({left:nowLeft+extra},defaultser.speed),
							function(){$(this).dequeue()}
						}
					);
					_mover.queue(
						function(){
							$(this).stop(true,true).animate({left:nowLeft},defaultser.rebound_speed),
							function(){$(this).dequeue()}
						}
					);
				};
			})
		}
		$(".navTemplateWrap1").movebg();
	};

	navTemplate.init();

});	
