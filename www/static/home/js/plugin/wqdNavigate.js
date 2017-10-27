$(function() {
	var wqdNavigate = {};
	//侧边导航浮动模式的展开/收起
	wqdNavigate.commonInit = function(){
		$(document).on("click",function(event){
			var that = $(".wqdSideNavWrap.floatStatus"),
				target = $(event.target);
			if(!that.length || !that.is(":visible")) return;
	    	if(target.closest(".sectionV2").not(".wqdSideNavWrap").length || target.hasClass("wqdSectiondiv")){
	    		var thatWidth = that.width()+"px";
	    		that.css({"overflow":"hidden"});
				that.animate({"width":0},200,"",function(){
					that.css({"width":thatWidth,"display":"none"}).attr("style",that.attr("style").replace(/overflow:(\d|\w|\s|)+;/g,""));
					that.siblings(".wqdSideNavButton").show();
				});
	    	}
	    });
	    $(document).on("click",".wqdSideNavButton",function(){
	    	$(this).hide();
	    	$(".wqdSecondNavbox").hide();
	    	var that = $(".wqdSideNavWrap.floatStatus"),
	    		thatWidth = that.width();
	    	if(that.is(":visible")) return;
    		that.css({"width":0,"overflow":"hidden"});
			that.show().animate({"width":thatWidth},200,"",function(){
				that.attr("style",that.attr("style").replace(/overflow:(\d|\w|\s|)+;/g,""));
			});
	    });
	    $(".wqdSideNavButton").trigger("click");
	    //手机导航的展开/收起
	    $(document).on("click",".wqdPhoneNavBtn",function(){
	    	$(".wqdSecondNavbox").hide();
	    	var that = $(this).parents(".wqdPhoneNav").find(".wqdTopNavbox"),
	    		thatWidth = that.height();
	    	that.is(":visible") ? that.slideUp() : that.slideDown();
	    });
	    if($(".wqdPhoneNav .wqdTopNavbox:visible").length) $(".wqdPhoneNavBtn").trigger("click");
	};
	wqdNavigate.init = function(){
		$("#HTMLDATA").length ? this.insideEvent() : this.outsideEvent();
		this.commonInit();
	};
	//编辑器内的事件绑定
	wqdNavigate.insideEvent = function(){
		$(".wqdSecondNavbox").hide();    //隐藏二级导航
		$(document).on("mouseenter.wqdNavigate",".wqdNavWrap .wqdNavLi",wqdNavigate.createAddBtn)
		.on("mouseleave.wqdNavigate",".wqdNavWrap .wqdNavLi",function(e){
			if(!$(this).parents(".sectionV2").hasClass("wqdPhoneNav")) $(".wqdAddsecondnav").hide();
			$(".wqdNavMenuWrap").hide();
		}).on("click.wqdNavigate",".wqdNavWrap .wqdNavLi",wqdNavigate.topNavShow);
		//一级导航拖动，二级导航跟随
		$(document).on("element.change",".wqdTopNavbox",function(e){
			if($(this).parents(".wqdPhoneNav").length) $(this).css("top","100%");
			wqdNavigate.changePosition($(this));
		});
		//二级导航拖动记录原来的差值
		$(document).on("element.change",".wqdSecondNavbox",function(e){
			var that = $(this),
				isSideNav = that.parents(".sectionV2").hasClass("wqdSideNavWrap") || that.parents(".sectionV2").hasClass("wqdPhoneNav"),
				thisMark = that.attr("wqdNavmark") || "wqdNomark",
				menuObj = $(".wqdNavList li"+"[wqdnavmark="+thisMark+"]"),
				difference = menuObj.parents(".wqdelementEdit").position().left + menuObj.position().left;
				difference = that.position().left - difference;
				difference = isSideNav ? that.position().top - menuObj.parents(".wqdelementEdit").position().top - menuObj.position().top : difference;
			that.attr("difference",difference);
		});
		//侧边导航按钮编辑
		$(document).on("mouseenter",".wqdSideNavButton",function(){
			var that = $(this),
				NavMenuset = $('<div class="wqdNavMenuWrap"><ul><li class="wqdNavMenuSet" title="按钮设置"><span class="navMenuBtn navBtn1"></span><span class="navMenuText">设置</span></li></ul></div>'),
				thisTop = that.offset().top + $(this).outerHeight(),
				thisLeft =that.offset().left;
			NavMenuset.css({"top":thisTop,"left":thisLeft}).appendTo("body");
			NavMenuset.on("mouseenter",function(){$(this).show();}).on("mouseleave",function(){$(this).remove();});
			NavMenuset.find(".wqdNavMenuSet").on("click",function(){
				that.trigger("sideNavButtonSet");
			});
		}).on("mouseleave",".wqdSideNavButton",function(){
			$(".wqdNavMenuWrap").hide();
		});
		//监听导航添加事件
		$(document).on("wqdAddNavigate",function(){
			var that = $(".sectionV2.wqdCommonNav"),
				thisNav = that.find(".wqdTopNavbox:last-child");
			if(that.length){
				if(that.hasClass("wqdTopNavWrap")){
					thisNav.css({"width":"700px","height":"60px"});
				}else if(that.hasClass("wqdSideNavWrap")){
					thisNav.css({"width":"100%","height":"300px"});
				}else if(that.hasClass("wqdPhoneNav")){
					thisNav.addClass("freeMove").css({"top":"100%","left":"0","width":"100%","height":"200px"}).attr("data-unused","set,move,copy,zindex");
				}
			}

		});
		//监听导航删除事件
		$(document).on("element.remove",".wqdTopNavbox",wqdNavigate.deleteNav);
		//页面地址更改、页面通条删除回调
		$(document).on("wqdNavCallback",wqdNavigate.navChangeCallback);
		//编辑器内导航自动选中
		$(document).on("domInit",wqdNavigate.navAutoInside);
		this.navAutoInside();
	};
	//发布后的事件绑定
	wqdNavigate.outsideEvent = function(){
		$(".wqdPublisHidden").hide().removeClass("wqdPublisHidden");  //隐藏二级导航
		//发布后的导航自动选中
		wqdNavigate.navAutoOutside();
		$(document).on("mouseenter",".wqdNavWrap .wqdNavLi",function(){
			var that = $(this),
				isSideNav = that.parents(".sectionV2").hasClass("wqdSideNavWrap"),
				thisMark = that.attr("wqdNavmark") || "wqdNomark",
				secondObj = $(".wqdSecondNavbox"+"[wqdnavmark="+thisMark+"]");
			if(secondObj.length && !secondObj.is(":visible")){
				$(".wqdSecondNavbox").not(secondObj).stop().hide();
				var thatVal = isSideNav ? secondObj.outerWidth() : secondObj.outerHeight(),
					thatVal = parseInt(secondObj.attr("temp-val")) || thatVal,
					animaObj = isSideNav ? {"width":thatVal} :{"height":thatVal},
					attrName = isSideNav ? "width" : "height";
				secondObj.attr("temp-val",thatVal).css(attrName,0).css("overflow","hidden");
				secondObj.show().animate(animaObj,300,"",function(){
					secondObj.removeAttr("temp-val").attr("style",secondObj.attr("style").replace(/overflow:(\d|\w|\s|)+;/g,""));
				});
			}
		});

		$(document).on("mouseleave",".wqdNavWrap .wqdNavLi",function(){
			$(".wqdSecondNavbox").hide();
		});
		$(".wqdSecondNavbox").on("mouseenter",function(){
			$(this).show();
		}).on("mouseleave",function(event){
			var navmark = $(this).attr("wqdnavmark") || "",
				liObj = $(".wqdNavWrap .wqdNavLi[wqdnavmark="+navmark+"]"),
				liLeft = liObj.offset().left,
				liRight = liObj.offset().left + liObj.outerWidth(),
				liTop = liObj.offset().top,
				liBottom = liObj.offset().top + liObj.outerHeight();
			if(!((event.pageX >= liLeft && event.pageX <= liRight) && (event.pageY >= liTop && event.pageY <= liBottom))) $(this).hide();
		});
		//导航跟随
		var navObj = $(".sectionV2.wqdCommonNav");
		if(navObj.attr("wqdNavStickyed")){
			$(window).scroll(wqdNavigate.scrollNav);
		}
		this.scrollNav();
	};
	wqdNavigate.scrollNav = function () {
		var navObj = $(".sectionV2.wqdCommonNav");
        if($(this).scrollTop()>navObj.height()){
            if($(document).height()-$(window).height() <  navObj.height()*2+50) return;
            if(navObj.hasClass("wqdSticky")) return;
            navObj.parent(".wqdSectiondiv").addClass("wqdSticky");
        }else{
            navObj.parent(".wqdSectiondiv").removeClass("wqdSticky");
        }
	};
	//创建添加二级导航容器的菜单
	wqdNavigate.createAddBtn = function(){
		$(".wqdAddsecondnav").remove();
		$(".wqdNavMenuWrap").remove();
		var that = $(this),
			isSideNav = that.parents(".sectionV2").hasClass("wqdSideNavWrap") || that.parents(".sectionV2").hasClass("wqdPhoneNav"),
			thisMark = that.attr("wqdNavmark") || "wqdNomark";
		//创建导航设置菜单
		var NavMenuset = $('<div class="wqdNavMenuWrap"><ul><li class="wqdNavMenuSet" title="导航菜单设置"><span class="navMenuBtn navBtn1"></span><span class="navMenuText">设置</span></li><li class="wqdNavMenuAdd" title="添加新菜单"><span class="navMenuBtn navBtn2"></span><span class="navMenuText">添加</span></li><li class="wqdNavMenudelete" title="删除菜单"><span class="navMenuBtn navBtn3"></span><span class="navMenuText">删除</span></li></ul></div>'),
			thisTop = that.offset().top-30,
			thisLeft =that.offset().left;
		NavMenuset.css({"top":thisTop,"left":thisLeft}).appendTo("body");
		NavMenuset.on("mouseenter",function(){$(this).show();}).on("mouseleave",function(){$(this).remove();});
		NavMenuset.find(".wqdNavMenuSet").on("click",function(){
			$(document).trigger("wqdNavMenuSet",that);
			$(".wqdNavMenuWrap").remove();
		});
		NavMenuset.find(".wqdNavMenuAdd").on("click",{obj:that},wqdNavigate.addNewNavmenu);
		NavMenuset.find(".wqdNavMenudelete").on("click",{obj:that},wqdNavigate.deleteNewNavmenu);

		if($(".wqdSecondNavbox"+"[wqdnavmark="+thisMark+"]").length) return;
		//创建添加二级容器的按钮
		var addbtn = $('<a class="wqdAddsecondnav" href="javascript:void(0);">+</a>'),
			elmToP = isSideNav ? that.offset().top : (that.outerHeight() > that.parents(".wqdTopNavbox").height() ? that.offset().top+that.parents(".wqdTopNavbox").height()-1 : that.offset().top + that.outerHeight()-1),
			elmLeft = isSideNav ? that.offset().left + that.outerWidth()-1 : that.offset().left,
			elmWidth = that.outerWidth(),
			elmHeight = that.outerHeight()+"px",
			cssObj = isSideNav ? {"width":"40px","line-height":elmHeight,"left":elmLeft,"top":elmToP} : {"width":elmWidth,"line-height":"40px;","left":elmLeft,"top":elmToP};
		addbtn.css(cssObj);
		addbtn.appendTo("body");
		addbtn.data("wqdThisObj",that);
		addbtn.on("mouseenter",function(){
			$(this).show();
		}).on("mouseleave",function(){
			$(this).remove();
		}).on("click",{obj:that},wqdNavigate.addSecondNav);

	};
	//创建二级导航容器
	wqdNavigate.addSecondNav = function(event){
		$(".wqdSecondNavbox").hide();
		var that = event.data.obj,
			withObj = $(this).data("wqdThisObj"),
			isSideNav = that.parents(".sectionV2").hasClass("wqdSideNavWrap") || that.parents(".sectionV2").hasClass("wqdPhoneNav"),
			mark = "mark" + new Date().getTime(),
			secondContainer = $('<div class="wqdelementEdit freeMove elementsContainer wqdPublisHidden wqdSecondNavbox" data-unUsed="move,copy,zindex" data-elementtype="secondNav" data-elemandgroup="true" style="width:100px; height: 300px; z-index: 30;"><div class="wqdelementEditBox"><div class="wqdSecondNav elemContBox"></div></div></div>'),
			nowLeft = (withObj.parents(".wqdelementEdit").position().left + withObj.position().left),
			nowTop = (withObj.parents(".wqdelementEdit").position().top + withObj.position().top + withObj.outerHeight());
		nowLeft = isSideNav ? (withObj.parents(".wqdelementEdit").position().left + withObj.parents(".wqdelementEdit").width()) : nowLeft;
		nowTop = isSideNav ? (withObj.parents(".wqdelementEdit").position().top + withObj.position().top) : nowTop;
		isSideNav && secondContainer.css({"width":"120px","height":"300px"});
		secondContainer.css({"left":nowLeft,"top":nowTop}).attr("wqdNavmark",mark);
		withObj.attr("wqdNavmark",mark);
		//手机二级容器可移动
		if(that.parents(".sectionV2").hasClass("wqdPhoneNav")) {
			secondContainer.attr("data-unUsed","copy,zindex").css("left","50%");
		}
		secondContainer.appendTo(withObj.parents(".sectionV2"));
		$(this).remove();
		$(document).trigger("appSetCatch");

	};
	//一级导航的点击动效
	wqdNavigate.topNavShow = function(e){
		if(!$(this).parents(".wqdPhoneNav").length) e.stopPropagation();
		var that = $(this),
			isSideNav = that.parents(".sectionV2").hasClass("wqdSideNavWrap") || that.parents(".sectionV2").hasClass("wqdPhoneNav"),
			thisMark = that.attr("wqdNavmark") || "wqdNomark",
			secondObj = $(".wqdSecondNavbox"+"[wqdnavmark="+thisMark+"]");
		if(secondObj.length && !secondObj.is(":visible")){
			$(".wqdSecondNavbox").not(secondObj).hide();
			if(isSideNav){
				var thatWidth = secondObj.outerWidth();
					secondObj.css({"width":0,"overflow":"hidden"});
					secondObj.show().animate({"width":thatWidth},300,"",function(){
						secondObj.attr("style",secondObj.attr("style").replace(/overflow:(\d|\w|\s|)+;/g,""));
					});
			}else{
				secondObj.slideDown();
			}
		}else{
			secondObj.hide();
		}
	};
	//一级导航拖动改变二级导航位置
	wqdNavigate.changePosition = function(that){
		$(".wqdNavMenuWrap").remove();
		$(".wqdAddsecondnav").hide();
		if(that.parents(".sectionV2").hasClass("wqdPhoneNav")) return;
		var	parentLeft = that.position().left,
			parentTop = that.position().top,
			isSideNav = that.parents(".sectionV2").hasClass("wqdSideNavWrap") || that.parents(".sectionV2").hasClass("wqdPhoneNav");
		that.find(".wqdNavList li").each(function(){
			var thisMark = $(this).attr("wqdNavmark") || "wqdNomark",
			secondObj = $(".wqdSecondNavbox"+"[wqdnavmark="+thisMark+"]");
			if(secondObj.length){
				var difference = secondObj.attr("difference") || 0,
					nowLeft = (difference-0+$(this).parents(".wqdelementEdit").position().left+$(this).position().left),
					nowTop = ($(this).parents(".wqdelementEdit").position().top + $(this).position().top + $(this).outerHeight());
					//容器高度小于导航高度
					nowTop = $(this).parents(".wqdTopNavbox").height() < $(this).outerHeight() ? $(this).parents(".wqdTopNavbox").position().top + $(this).parents(".wqdTopNavbox").height() : nowTop;
					nowTop = isSideNav ? (difference-0+$(this).parents(".wqdelementEdit").position().top+$(this).position().top) : nowTop;
					nowLeft = isSideNav ? ($(this).parents(".wqdelementEdit").position().left + $(this).position().left + $(this).outerWidth()) : nowLeft;
				secondObj.css({"left":nowLeft,"top":nowTop});
			}
		});
	};
	//导航删除回调
	wqdNavigate.deleteNav = function(){
		var that = $(this);
		that.find(".wqdNavList li").each(function(){
			var thisMark = $(this).attr("wqdNavmark") || "wqdNomark",
			secondObj = $(".wqdSecondNavbox"+"[wqdnavmark="+thisMark+"]");
			if(secondObj.length) secondObj.remove();
		});
	};
	//导航添加新菜单
	wqdNavigate.addNewNavmenu = function(event){
		var obj = event.data.obj.parents(".wqdNavList"),
		newMenu = obj.find("li:last").clone(true).removeAttr("wqdnavmark");
		newMenu.find("a").text("新菜单").removeAttr("href").removeAttr("partid").removeAttr("pageid").removeAttr("homepage").removeAttr("categorylink");
		newMenu.appendTo(obj);
		$(document).trigger("appSetCatch");
	};
	//删除导航菜单
	wqdNavigate.deleteNewNavmenu = function(event){
		if(event.data.obj.siblings("li").length < 1) return;
		var obj = event.data.obj,
			thisMark = obj.attr("wqdNavmark") || "wqdNomark";
		obj.remove();
		$(".wqdSecondNavbox"+"[wqdnavmark="+thisMark+"]").remove();
		$(".wqdNavMenuWrap").remove();
		$(document).trigger("appSetCatch");
	};
	//页面地址更改、页面通条删除回调
	wqdNavigate.navChangeCallback = function(e,obj){
		var change = false,
			category = obj.category,
			pageid = obj.pageids || null,
			parame = obj.parameter || "";
		//删除页面
		if(category==1){
			if(parame) $(".wqdTopNavbox .wqdNavList li a").removeAttr("homepage");
			$(".wqdTopNavbox .wqdNavList li a").each(function(){
				if($(this).attr("pageid")==pageid || ($(this).attr("categorylink")=="1" && $(this).attr("pagepath")==pageid)){
					$(this).removeAttr("href").removeAttr("pageid").removeAttr("categorylink").removeAttr("partid").removeAttr("homepage").removeAttr("pagepath").parent().removeClass("active");
					change = true;
				}
				if(parame){
					if($(this).attr("pageid")==parame){
						$(this).attr("homepage","true");
						change = true;
					}
				}
			});
		}else if(category==2){	//重命名页面地址
			$(".wqdTopNavbox .wqdNavList li a").each(function(){
				if($(this).attr("categorylink")=="2" && $(this).attr("pageid")==pageid){
					$(this).attr("href",parame);
					change = true;
				}else if($(this).attr("categorylink")=="1" && $(this).attr("pagepath")==pageid){
					var href = $(this).attr("href") || "";
					$(this).attr("href",parame+href.substring(href.indexOf("#")));
					change = true;
				}
			});
		}else if(category==3){	//排序
			$(".wqdTopNavbox .wqdNavList li a").each(function(){
				if($(this).attr("pageid")==pageid){
					$(".wqdTopNavbox .wqdNavList li a").removeAttr("homepage");
					$(this).attr("homepage","true");
					change = true;
					return false;
				}
			});
		}else if(category==4){	//删除通条
			$(".wqdTopNavbox .wqdNavList li a").each(function(){
				if($(this).attr("partid")==pageid){
					$(this).removeAttr("href").removeAttr("pageid").removeAttr("categorylink").removeAttr("partid").removeAttr("homepage").removeAttr("pagepath");
					change = true;
				}
			});
		}
		if(change){
			$(document).trigger("appSetCatch");
			$(document).trigger("appSave");
		}
	};
	//导航自动选择（编辑器内）
	wqdNavigate.navAutoInside = function(){
		var pageid = $(".pagedeatllist").find("li.on").attr("pageid"),
			navSelect = false; //是否在导航中设置了本页链接
		$(".wqdTopNavbox .wqdNavList li a").each(function(){
			if($(this).attr("pageid") == pageid){
				navSelect = true;
				$(this).parent().addClass("active");
				$(".wqdTopNavbox .wqdNavList li").not($(this).parent()).removeClass("active");
			}
		});
		if(!navSelect && $(".wqdTopNavbox .wqdNavList li.active").length) $(".wqdTopNavbox .wqdNavList li.active").removeClass("active");

	};
	//导航自动选择（发布后）
	wqdNavigate.navAutoOutside = function(){
		var pathName = location.pathname.replace("\/",""),
			elmenDom = null;
		$(".wqdTopNavbox .wqdNavList li a").each(function(){
			if(!$(this).attr("href")) $(this).attr("href","javascript:void(0);");
			var hrefurl = $(this).attr("href") ? $(this).attr("href").replace("\/","") : "";
			if(($(this).attr("homepage")=="true" && !pathName) || (hrefurl==pathName && pathName)){
				elmenDom = $(this);
				return false;
			}
		});
		if(elmenDom){
			elmenDom.parent().addClass("active");
			$(".wqdTopNavbox .wqdNavList li").not(elmenDom.parent()).removeClass("active");
		}else{
			$(".wqdTopNavbox .wqdNavList li.active").removeClass("active");
		}
	};

	wqdNavigate.init();
});
