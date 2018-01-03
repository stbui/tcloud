define(['utility','elementInfo','pageList'],function(_ut, _el,_pl) {
	var creatBaseElement = {
		'flagDown':false, 												//判别鼠标是否按下
		'Coop': {
			'isCooperation':false,										//判断是否为合作方
			'className':""												//合作方对应的Class类名
		},
		'BodyMoveElement':"wqdCompcanMoveD", 							//加载到body上的拖动元素
		'element': {  													//元素对象---目的：移动的元素（内涵元素结构）
			width:"",
			height:""
		},
		'pointer':{ 													//对象位置点变量---目的：鼠标移动
			left:"",
			top:""
		},
		'area':{														//元素所在区域内---目的：超出区域，区域隐藏
			width:"",
			left:"",
			obj:"",														//存储区域对应对象
			display:false, 												//是否显示
			RegStr: "wqdComponents" 									//要匹配区域对应的共有class
		},
		'specialEl':{													//特殊元素---拖拽后在内部放大, 放大判断className  wqdSpecialEl
			outSideIDName:"wqdCompOutMoveD",
			width:"",													//在内部区域的模拟宽度
			height:"",													//在内部区域的模拟高度
			isExist: false												//特殊元素是否存在
		},
		'RelativeContainer':{											//关联容器
			arr:[],														//遍历所有关联元素--并给对应所有的值
			parentClass:"",
			enable: false,												//是否开启
			spClass:"wqdRelConD"										//关联容器特殊指定类
		}
	};
	//清空所有初始化内容
	creatBaseElement.clearInitObj = function() {
		this.element  			= {width:"",height:""};
		this.pointer 			= {left:"",top:""};
		// this.area 				= {width:"",left:"",obj:"",display:false,RegStr: "wqdComponents"};
		this.specialEl 			= {outSideIDName:"wqdCompOutMoveD",width:"",height:"",isExist: false};
		this.RelativeContainer 	= {arr:[],parentClass:"",enable: false,spClass:"wqdRelConD"};
	};

    function insertNewSection(section) {
        var partId = "wqd" + new Date().getTime() + "serial",
            sectionStyle,
            $elem = section.element || $(elementString),
            elementString = $elem.map(function(index, elem) {
                sectionStyle = $(this).attr("data-section-sytle");
                return $(this)[0].outerHTML;
            }).get().join("");
        sectionStyle = sectionStyle || "height: 700px;margin:0 auto;position: relative;";
        var sectionString = '<section class="wqd1445504393013css wqdBkEditos sectionV2 fullscreen moveMainArea elementsContainer" style="'+sectionStyle+'" wqdimgurlos="http" wqdbgcoloros="#eee" data-maxzindex="0" sectionwidth="1200">'+elementString+'</section>';
        return _pl.addPart(partId, sectionString, "", "全屏轮播", "2", "10542", $(""),void 0,void 0,section.parent,section.sectionStyle);
    }

	// 代码太脏太乱！重复&不知所云太多，需重写
	creatBaseElement.init = function () {
		var _self = this;

		$(document).on("mouseup", function(e) {
			if(_self.flagDown) {
				var appSetCatch = false;
                var canInsertFullCarouse;
				//获取要插入的整个对象数据
				var section = _self.getwqdSectiondiv(e),sectionX,sectionY,target;
                // if(!section.parent.length && /fullMode/g.test(section.elementString)) {
                //     canInsertFullCarouse = true;
                // }
                // if(!_self.area.display && (!(section.parent.hasClass("fullscreen") && section.parent.find(".wqdelementEdit.fullMode").length && !/fullMode/g.test(section.elementString))||canInsertFullCarouse)) {
				if(!_self.area.display) {
					if(section != "" &&
						(!_self.RelativeContainer.enable)&&
                        ((/fullMode/g.test(section.elementString)||section.parent.hasClass("sectionV2")) || $("body").attr("data-carouseediting") == "true"||canInsertFullCarouse)) {
						var secStr = section.elementString;
						var upTemp = function () {
							var newId,
								newStr = section.elementString,
								$elementS;
							//调用elementInfo方法，换算坐标并插入通条
							$elementS = $(newStr);
							if(/<style/g.test(newStr)) {
								$elementS.filter("style").each(function(index, el) {
									newId ? newId++ : newId = new Date().getTime();
									newStr = newStr.replace(new RegExp($(this).attr("class"),"g"),"elementId" + newId);
								});
								section.notStyle = true;
							}
							section.element = $(newStr);
						};
						if(section.parent.hasClass("wqdCommonNav") && secStr.match(/data-elementtype=\"firstNav\"/g)) {
							//如果导航并且拖拽导航元素
							//调用elementInfo方法，换算坐标并插入通条
							upTemp();
							section.element.appendTo(section.parent);
							if(_el != null) _el.setNewPosition(section);
							$(document).trigger("wqdAddNavigate",section.notStyle);
							appSetCatch = true;
						} else if(secStr.match(/data-elementtype=\"firstNav\"/g) && !section.parent.hasClass("wqdCommonNav")) {

						}else if(secStr.match(/data-elementtype=\"navTemplate/g) && !section.parent.hasClass("wqdTopNavWrap")){
							//示例导航不添加
						} else if(secStr.match(/data-elementtype=\"wqdTable\"/g)){
							//调用elementInfo方法，换算坐标并插入通条
							section.element = $(secStr);
							section.element.appendTo(section.parent);
							if(_el != null) _el.setNewPosition(section);

							appSetCatch = true;
							//$(document).trigger("wqdTableEdit",{element:$(this)});
						} else if(secStr.match(/data-elementtype=\"articleLists\"/g) && !/header|footer/ig.test(section.parent.prop("tagName")) ) {
							//动态新闻列表控件
							var artlTagList = $.extend({},section),
								$elementNode = $(secStr).attr("data-artllistid","artlist"+new Date().getTime());
							section.element = $elementNode.filter(".articleLists");
							artlTagList.element = $elementNode.filter(".articleListsTag");
							artlTagList.left = section.left - 205;
							delete artlTagList.width;
							delete artlTagList.height;
							section.width = "auto";
							section.height = "auto";
							section.element.appendTo(section.parent);
							artlTagList.element.appendTo(section.parent);
							if(_el != null) {
								_el.setNewPosition(section);
								_el.setNewPosition(artlTagList);
							}

							appSetCatch = true;
						} else if(secStr.match(/data-elementtype=\"newArticleList\"/g) && !/header|footer/ig.test(section.parent.prop("tagName")) ) {
							//动态新闻列表控件
							section.element = $(secStr);
							section.width = section.element.css("width");
							section.height = section.element.css("height");
							section.element.appendTo(section.parent);
							if(_el != null) {
								_el.setNewPosition(section);
							}

							appSetCatch = true;
						}
						else if(secStr.match(/data-elementtype=\"form[A-Za-z]+?\"/g) && !$('.wqd-carouseOverlay').length){
							sectionX = e.pageX - section.parent.offset().left;
							sectionY = e.pageY - section.parent.offset().top;
							target = _self.ElmRange(section.parent ,'form' ,sectionX ,sectionY);
							section.element = $(secStr);
							if(target && target.length){
								target.find('form.wqdControlForm').append(section.element);
								section.top -= parseFloat(target.css("top"));
								section.left -= parseFloat(target.css("left"));
								section.parent = target.find('form.wqdControlForm');
								if(_el != null) _el.setNewPosition(section);
							appSetCatch = true;
							}
						// } else if( $('.wqd-carouseOverlay').length || !section.parent.hasClass("fullscreen") || /fullMode/g.test(section.elementString)) {
                        } else {
							upTemp();
							if( /header|footer/ig.test(section.parent.prop("tagName")) &&
								/(articleLists)|(carouse)|(map)|("form)|(video)|(groupContainer)/ig.test(section.elementString) &&
								 !/fullMode/ig.test(section.elementString)){
								return;
							}
							if(section.element.hasClass("fullMode")) {
                                section.element.filter(".fullMode").width(section.parent.parents(".wqdSectiondiv").width()).addClass("fullMode-show");
                                var $moveContent = insertNewSection(section);
                                $moveContent.find(".fullMode").width($moveContent.width())
							}else {
								section.element.appendTo(section.parent);
							}

							if(_el != null) _el.setNewPosition(section);
							//判断轮播图是否不受限制
							if(section.parent.hasClass("fullscreen")){
								$(document).trigger("carouse.fullscreen",{'parent':section.parent});
							}
							//判断表单提交按钮只有一个
							if(secStr.match(/data-elementtype=\"formButton\"/g)){
								if ($('.wqd-carouseOverlay').find('[data-elementtype=formButton]').length > 1){
									section.element.remove();
									alert("表单提交按钮只能添加一个！");
								}
							}else if(secStr.match(/data-elementtype=\"(formRadio|formCheckbox)\"/g)){
								//单选和多选禁止复制
								section.element.attr("data-unused","copy");
							}

							if(secStr.match(/data-elementtype=\"picture\"/g)){
								$(document).trigger("wqdBaseElementCallBack", section);
							}else {
								appSetCatch = true;
							}
						}
						//触发一个添加事件，传递data-elementtype出去-----黄剑剑
						$(document).trigger("addElement:end",$(secStr).attr("data-elementtype"));
					} else if(_self.RelativeContainer.enable && section.parent.hasClass("sectionV2")) {
						//页头页脚不允许添加容器文章等
						if( (section.parent.parents('#HTMLDATAHEADER').length || section.parent.parents('#HTMLDATAFOOTER').length) &&
							/(articleLists)|(carouse)|(map)|(form)|(video)/ig.test(section.elementString)){
							return;
						}
						//循环遍历往里加
						_self.relativeContainerAddInSection();
					}
					if(/groupContainer/g.test(section.elementString)){
						appSetCatch = true;
					}

					if(/articleLists/g.test(secStr)){//新闻触发生成列表项
						appSetCatch = false;
						section.element.trigger("artlLists:load");
					}

					if(section && section.element && section.element.hasClass("fullMode")) {
                        section.element.css({"left":0,"top":0}).addClass("fullMode-show")
							.parents(".sectionV2").addClass("fullscreen").end()
							// .siblings("[data-elemandgroup='true']").remove();
						appSetCatch = true;
					}

					appSetCatch && $(document).trigger("appSetCatch");
				}
				//清空所有初始化对象
				_self.clearInitObj();

			}
			//解绑mousemove事件
			$(document).off("mousemove.creatBaseElm");
		}).on("mousedown", function(e) {
			_self.mouseCanDownComp(e);

			$(document).on("mousemove.creatBaseElm", function(e) {
				if(_self.flagDown) {
					_self.moveComponent(e);
				}
			});
		})

		$(document).on("click","#wqdCompcanMoveD a",function(e) {
			$(this).closest(".carousel-control").size() || e.preventDefault();
		}).on("dragstart","#wqdCompcanMoveD a",function(e) {
			$(this).closest(".carousel-control").size() || e.preventDefault();
		})
	}

	//计算坐标
	creatBaseElement.ElmRange = function(section ,Elmtype ,x ,y){
		var form = null;
		section.children('div[data-elementtype='+Elmtype+']').each(function(){
			var left = parseFloat($(this).css('left')) ,top = parseFloat($(this).css('top')) ,maxLeft = left + $(this).width() ,maxHeight = top + $(this).height();
			if(left <= x && maxLeft >= x && top<=y && maxHeight >= y){
				if(!form){
					form = $(this);
				}else{
					form = form.attr('data-zindex') < $(this).attr('data-zindex') ? $(this) : form;
				}
			}
		});
		return form;
	}

	/*所有指定元素控件可以拖动*/
	creatBaseElement.mouseCanDownComp = function(e) {
		var objArr = [
			"wqdDragTextD",		//文本
			"wqdDragImgD",		//图片
			"wqdDragIconD",		//icon
			"wqdDragDrawingD",		//svg
			// "wqdDragBtnD",		//btn
			"wqdDragButtonD",		//btn
			"wqdDragCarouselD",	//轮播图
			"wqdDragCarouselFull",	//轮播图
			"wqdDragMapD",		//地图

			"wqdDragNavigateD",	//导航
			"wqdDragFormD",		//表单
			"wqdDragShareD",	//分享
			"wqdDragFollowD",	//关注
			"wqdDragRelativeD",	//关联容器
			"wqdDragVideoD",	//视频

			"wqdDragTabD",      //表格
			"wqdDragPictureD",  //图册
			"wqdDragEBSD",		//EBS合作
			"wqdDragArticleD",	//文章
			"wqdProgressbarD",  //进度条
			"wqdProgressCircalD",  //进度圆
			"wqdPronumberbarD",   //数字
			"wqdDragHoverContainerD"   //悬浮容器
		];

		for(var i=0; i<objArr.length; i++) {
			var obj = $(e.target).parents("."+objArr[i]);
			if(obj.length) {
				//对应正确位置已经按下
				this.flagDown = true;
				this.getResHtml(e, obj[0]);
				//获取元素所在大区域范围
				this.getArea(e);
				//判断是否为关联容器元素
				if(obj.hasClass(this.RelativeContainer.spClass)) {
					this.RelativeContainer.enable = true;
				} else {
					this.RelativeContainer.enable = false;
				}

				var sectionStyle = obj.attr("section-style");
				if(sectionStyle) {
					this.sectionStyle = sectionStyle;
				} else {
					this.sectionStyle = void 0;
				}
			}
		}
		// this.ToJSON();
		// this.ToJSON1(7);
	}

	//获取对应的sectionId和对应元素位置和宽高值
	creatBaseElement.getwqdSectiondiv = function(e) {
		var str = this.getContentStr();		//获取内容字符串

		var a = [];
		$('div[data-type=wqdSectiondiv]').each(function(){
			a.push($(this).outerHeight());
		})
		var elmTop = e.pageY-parseInt($("#HTMLDATA").css("padding-top"));//元素到顶端高度---//50是#HTMLDATA上padding-top:50的值

		//通过高度计算拖拽元素在哪个通条里---iphone
		if($("#wqdIphoneContainer").length) {
			elmTop = e.clientY - $("#wqdIphoneContainer").offset().top + $("#wqdIphoneContainer .nano-content").scrollTop();
		}

		//通过高度计算拖拽元素在哪个通条里---pc
		var sum = 0;
		for(var i=0; i<a.length; i++) {
			if(i == a.length-1) {
				break;
			}
			if(elmTop >= sum && elmTop <= sum+a[i]) {
				break;
			}
			sum += a[i];
		}

		//有一个最小宽度---具左边的距离是整个通条宽度没有100%
		var offW = $('div[data-type=wqdSectiondiv]').eq(i).children(".sectionV2").length ? $('div[data-type=wqdSectiondiv]').eq(i).children(".sectionV2").offset().left : 0;
		//通过高度计算拖拽元素在哪个通条里---iphone
		if($("#wqdIphoneContainer").length) {
			offW = $("#wqdIphoneContainer #HTMLDATACENTER").offset().left;
		}

		var section = {
			"parent":$('div[data-type=wqdSectiondiv]').eq(i).children(".sectionV2"),
			"width":this.element.width,
			"height":this.element.height,
			"left":this.pointer.left-offW,
			"top":elmTop-sum-this.element.height/2,
			'elementString':str,//结构字符串
			'isAdd':true
		};
		if(this.sectionStyle) section.sectionStyle = this.sectionStyle;
		//对应的要拖拽到侧边导航上---配合剑剑
		if($(".wqdSideNavWrap").length && this.pointer.left < $(".wqdSideNavWrap").width() && !$(".wqdSideNavWrap").is(":hidden")) {
			section.parent = $(".wqdSideNavWrap");
			section.left = this.pointer.left;
		}


		//特殊元素
		var secTemp = this.getSpecialObj($('body'));
		if(typeof secTemp.left != "string" && typeof secTemp.top != "string") {
			if(section.left+offW+this.element.width > secTemp.left && section.left+offW < secTemp.left+secTemp.width) {
				 if(e.pageY+this.element.height/2 > secTemp.top  && e.pageY-this.element.height/2 < secTemp.top+secTemp.height) {
					section.parent = secTemp.parent.length ? secTemp.parent : section.parent;
                     //如果带有整个通条的宽度不受限制---情况
                     var $carouseFull = $(".wqd-carouseOverlay .fullMode");
                     if($carouseFull.length) {
                         secTemp.left = $carouseFull.find(".item.active .bannerContainer").offset().left;
                     }
                     section.left = this.pointer.left - secTemp.left;
					 section.top = e.pageY - secTemp.top - this.element.height/2;
				} else {
					 section = "";
				}
			}
		}

		//特殊放大元素
		if(this.specialEl.isExist) {
			section.width = this.specialEl.width;
			section.height = this.specialEl.height;
			section.top += this.element.height/2-this.specialEl.height/2;
			section.left += this.element.width/2-this.specialEl.width/2;
		}

		//如果是关联容器---执行特定方法---配合明仁
		if(this.RelativeContainer.enable) {
			this.setRelConArr(section);
		}

		//移除拖动时的元素
		$("#wqdCompcanMoveD").remove();
		//移除外部拖拽元素
		$("#wqdCompOutMoveD").remove();
		return section;
	}

	/**
	 * 对应的容器内部进行每个值获取并存入数组
	 * 传入当前的section值
	 */
	creatBaseElement.setRelConArr = function(obj) {
		var _obj = $("#"+this.BodyMoveElement), _relContainer = this.RelativeContainer,
			arrObj = _obj.children("div").children(),
			arrStr = obj.elementString.split("###");
			//生成关联标记
			var mark = "mark" + new Date().getTime();
			for(var j=arrStr.length-2; j>=0; j--) {
				if(arrStr[j].match(/data-elementtype="groupContainer"/g)) {
					arrStr[j] = arrStr[j].replace(/data-elementtype="groupContainer"/g, 'data-elementtype="groupContainer" wqdmark="'+mark+'"');
				}
			}
			for(var i=0; i<arrStr.length-1; i++) {
				var tempObj = {
					width: 					arrObj.eq(i).width(),
					height: 				arrObj.eq(i).height(),
					top: 					obj.top + arrObj.eq(i).position().top,
					left: 					obj.left + arrObj.eq(i).position().left,
					elementString: 			arrStr[i],
					isAdd: 					true,
					parent: 				obj.parent
				}
				_relContainer.arr.push(tempObj);
			}

	}
	/**
	 * 把所有的关联元素添加进section里
	 */
	creatBaseElement.relativeContainerAddInSection = function() {
		var _relContainer = this.RelativeContainer;
		for(var i=0; i<_relContainer.arr.length; i++) {
			_relContainer.arr[i].element = $(_relContainer.arr[i].elementString);
			_relContainer.arr[i].element.appendTo(_relContainer.arr[i].parent);
			//调用elementInfo方法，换算坐标并插入通条
			if(_el != null) _el.setNewPosition(_relContainer.arr[i]);
		}
		_relContainer.arr = [];
	}

	/**
	 * 对应如果有特殊元素，单独对特殊元素进行加入操作，那么对应计算元素位置,例如：轮播图
	 * @param obj - 传入对应的section对象
	 */
	creatBaseElement.getSpecialObj = function(obj) {
		var left = "", top = "", width = "", height = "", _obj = obj.find(".wqd-carouseOverlay"), _objself;

		//拖进入的类型类
		var arr = [
			"div[data-elementtype='carouse']",				//轮播
			"div[data-elementtype='form']",					//表单
			"div[data-elementtype='groupContainer']",		//关联容器
			"div[data-elementtype='secondNav']",			//导航
			"div[data-elementtype='artListContainer']",	//文章简版列表
            "div[data-elementtype='hoverContainer']"	//文章简版列表
		]
		for(var i=0; i<arr.length; i++) {
			if(_obj.find(arr[i]).length) {
				_objself = _obj.find(arr[i]);
				break;
			}
		}
		if(_obj.length) {
			left = _objself.offset().left;
			top = _objself.offset().top;
			width = _objself.outerWidth();
			height = _objself.outerHeight();
		}


		var _parent =
			_obj.length ?
				_obj.find("div[data-elementtype='carouse']").length ? _obj.find(".item.active").find(".bannerContainer") :
				_obj.find("div[data-elementtype='secondNav']").length ? _obj.find("div[data-elementtype='secondNav']").find(".wqdSecondNav") :
				_obj.find("div[data-elementtype='groupContainer']").length ? _obj.find("div[data-elementtype='groupContainer']").eq(0).find(".containerWarp") :
				_obj.find("div[data-elementtype='artListContainer']").length ? _obj.find("div[data-elementtype='artListContainer']").children(".wqdelementEditBox") :
				_obj.find("div[data-elementtype='hoverContainer']").length ? _obj.find("div[data-elementtype='hoverContainer']").children(".wqdelementEditBox") :
				(_obj.find("form").length ? _obj.find("form") : _obj.find(".correlationBox").children(".wqdelementEditBox"))
			: ""

		var section = {
			"parent": _parent,
			"left":left != "" ? parseFloat(left) : "",
			"top": top != "" ? parseFloat(top) : "",
			"width": width != "" ? parseFloat(width) : "",
			"height": height != "" ? parseFloat(height) : ""
		};
		return section;
	}


	/**
	 * 计算元素宽高----目前以li标签包含的整个内容为准，即计算li宽高
	 * @param e - event事件对象
	 */
	creatBaseElement.setElementWH = function(e) {
		var _element = this.element, tempStr = "";
		e = e.target;
		while(1) {
			//对于有SVG这种特殊标签情况
			if(typeof e.className != "string") {
				tempStr = e.className.baseVal;
			} else {
				tempStr = e.className;
			}
			//单独对文本、图标、svg、轮播图计算宽高-----e.tagName == "LI" ||
			if(tempStr.match(/(wqd-button)|(wqd-line)|(wqdDHoverContainer)|(wqd-freeRect)|(wqdDImg)|(wqd-svg)|(wqdDtext)|(wqdDIcon)|(wqdDCarouse)|(wqdDMap)|(wqdDEBS)|(wqdDFormEl)|(wqdDShare)|(wqdDFollow)|(wqdDRelative)|(wqdDVideo)|(wqdDNavigate)|(wqdDTab)|(wqdDArticle)|(wqdDAtlas)|(wqdDPro)/g)) {
				//合作方
				if(tempStr.match(/(wqdDEBS)/g)) {
					this.Coop.isCooperation = true;
					this.Coop.className = "wqdDEBS";
				}
				break;
			} else {
				e = e.parentNode;
			}
		}
		//单独对icon图标进行判断
		if(e.className == "wqdDIcon") {
			e = e.children[0];
		}
		//计算元素宽高值--需要对firfox做兼容
		_element.width = e.offsetWidth || $(e).width();
		_element.height = e.offsetHeight || $(e).height();
	}
	/**
	 * 整个结构进行拖动
	 * @param e - event事件对象
	 */
	creatBaseElement.moveComponent = function(e) {
		//计算当前位置坐标
		this.setCurPos(e);
		//本元素拖拽
		var _obj = document.getElementById(this.BodyMoveElement),
			_specialEl = this.specialEl,				//特殊元素
			_element = this.element,					//元素
			_pointer = this.pointer;					//位置
		//赋值定位
		_obj.style.left = _pointer.left+"px";
		_obj.style.top = _pointer.top+"px";

		//特殊元素拖拽---外层会有一个大的区域标识
		if(this.specialEl.isExist) {
			_obj = document.getElementById(this.specialEl.outSideIDName);
			//赋值定位
			_obj.style.left = (_pointer.left+_element.width/2-_specialEl.width/2)+"px";
			_obj.style.top = (_pointer.top+_element.height/2-_specialEl.height/2)+"px";
		}

		//元素区域检测
		this.areaTest();
	}
	/**
	 * 点击脱离结构，得到可以进行滑动的结构组
	 * @param e, obj
	 */
	creatBaseElement.getResHtml = function(e, obj) {
		var html = document.createElement("div"),
			_pointer = this.pointer;					//位置

		//判断是否为特殊元素
		this.checkSpecialEl(obj);

		//计算元素宽高
		this.setElementWH(e);
		//计算当前位置坐标
		this.setCurPos(e);
		//在整个页面上拖动时的html代码结构
		html.id = this.BodyMoveElement;
		html.style.position = "fixed";
		html.style.cursor = "move";
		html.style.zIndex = "9999";
		html.style.top = _pointer.top+"px";
		html.style.left = _pointer.left+"px";
		html.innerHTML = this.getHtmlStr(obj);

		//添加进body
		document.getElementsByTagName("body")[0].appendChild(html);
	}
	/**
	 * 判断是否为特殊元素
	 * @param 对应检测对象
	 */
	creatBaseElement.checkSpecialEl = function(obj) {
		var _specialEl = this.specialEl;
		if(obj.className.match(/(wqdSpecialEl)/g)) {	//特殊元素检测标识

			//判断是否为特殊元素-----特殊元素直接放大
			var _obj = obj.children[1].children[0];
			_specialEl.width = _obj.getAttribute("data-width");
			_specialEl.height = _obj.getAttribute("data-height");
			_specialEl.isExist = true;

			if(_specialEl.isExist) {
				//外层大模型块
				var html = document.createElement("div"),
				_pointer = this.pointer,					//位置
				_element = this.element;					//元素
				//在整个页面上拖动时的html代码结构
				html.id = _specialEl.outSideIDName;
				html.style.position = "fixed";
				html.style.border = "1px dashed #1ec1fd";
				html.style.width = _specialEl.width+"px";
				html.style.height = _specialEl.height+"px";
				html.style.cursor = "move";
				html.style.zIndex = "9998";
				html.style.top = (_pointer.top+_element.height/2-_specialEl.height/2)+"px";
				html.style.left = (_pointer.left+_element.width/2-_specialEl.width/2)+"px";

				//添加进body
				document.getElementsByTagName("body")[0].appendChild(html);
			}
		} else {
			_specialEl.isExist = false;
		}
	}
	/**
	 * 拖拽元素在区域中的检测
	 */
	creatBaseElement.areaTest = function() {
		var _area = this.area,							//区域
			_pointer = this.pointer,					//位置
			_element = this.element,					//元素
			_mouseX = _pointer.left+_element.width/2; 	//鼠标所在位置
		//在区域内--横向检测
		if(_mouseX >= _area.left && _mouseX-_element.width/2 <= (parseFloat(_area.left)+parseFloat(_area.width))) {
		} else {
			_area.display = false;
		}
		//隐藏--元素超出区域--区域隐藏---目前暂时不需要
		if(!_area.display) {
			/*_area.obj.style.display = "none";
			$("#wqdComponentD ul.tabbd li").removeClass("on");*/

			$("#wqdComponentD span.close").click();
		}
	}
	/**
	 * 得到点击拖拽元素所在的整个大区域对象，并计算区域的宽和距离左侧距离
	 * @param e - event事件对象
	 */
	creatBaseElement.getArea = function(e) {
		var tempStr = "",								//中间字符串变量
			_area = this.area,							//区域
			Reg = new RegExp(_area.RegStr, "g");		//区域匹配正则
		e = e.target;
		//匹配字符串
		while(1) {
			tempStr = typeof e.className != "string" ? e.className.baseVal : e.className;
			if(tempStr.match(Reg) || e.tagName == "BODY") {
				break;
			} else {
				e = e.parentNode;
			}
		}
		//对应区域对象
		_area.obj = e;
		_area.left = e.offsetLeft || $(e).offset().left;
		_area.width = e.offsetWidth || $(e).width();
		_area.display = true;
	}
	/**
	 * 计算当前位置---计算位置为鼠标在整个元素的中心位置
	 * @param e - event事件对象
	 */
	creatBaseElement.setCurPos = function(e) {
		var _pointer = this.pointer,							//位置
			_element = this.element;							//元素
		//移动坐标换算
		_pointer.left = e.clientX - _element.width/2;
		_pointer.top = e.clientY - _element.height/2;


		//配合导航---将基础组件缩回去----配合剑剑
		if(_pointer.left+_element.width/2 < $("#wqdComponentD").width()+$("#wqdComponentD").offset().left) {
			var span = $("#wqdpHeaderD ul.func-list .funcBtn1");
			if(span.hasClass("on")) {
				span.click();
			}
		}
	}
	/**
	 * 获取li标签里面的所有内容
	 * @param obj - DOM节点对象
	 */
	creatBaseElement.getHtmlStr = function(obj) {
		return obj.innerHTML;
	}
	/**
	 * 拖拽结束---返回内容字符串
	 */
	creatBaseElement.getContentStr = function() {
		//获取要传入的整个结构字符串
		var _obj = document.getElementById(this.BodyMoveElement);
			str = this.getInsideHtmlStr(_obj);			//内容字符串

		//鼠标对应元素已经抬起
		this.flagDown = false;

		//是合作方验证---
		if(this.Coop.isCooperation) {
			str = str.replace(/###[\s|\S]*###/g, _obj.children[1].innerHTML);

			//EBS验证
			if(this.Coop.className == "wqdDEBS") {
				str = this.setEBS(str);
			}
		}

		return str;
	}
	/**
	 * 获取li标签里面的script标签中的所有结构代码
	 * @param obj - DOM节点对象
	 */
	creatBaseElement.getInsideHtmlStr = function(obj) {
		return $(obj).children("script").html();
	}

	/**
	 * 对应的EBS注标处理
	 * @param str - 传入的字符串
	 */
	creatBaseElement.setEBS = function(str) {
		return str.replace(/<a/g, "<a class=\"wqd-ebs\"")
				  .replace(/width=\"[\d]*\"?/g, "")
				  .replace(/height=\"[\d]*\"?/g, "")
				  .replace(/<script id=\"ebsgovicon\"[\s|\S]*?<\/script>/i, "");
	}


/****************** 文件转换  start    结构固定式 *******************/
	//读取文件
	creatBaseElement.readText = function(i, temp, dfd) {
		$.ajax({
			type: "POST",
			url: "../js/app/JSON/icon/10currency/货币"+i+".svg",
			data : {},
			async: true,
			dataType: "string",
			success:function(data){
				var text = data.responseText.match(/<path d=\".+?\"/g)[0]+" fill=\"#999\" /></svg>";
				var textModel = "<svg class=\"wqd-svgicon\" viewBox=\"0 0 2000 2000\" xmlns=\"http://www.w3.org/2000/svg\">"+text;
				var textHtml = "<svg style=\"display:inline-block;vertical-align: middle;margin:0 auto;width:40px;height:40px;\" viewBox=\"0 0 2000 2000\" xmlns=\"http://www.w3.org/2000/svg\">"+text;
				temp.model = textModel.replace(/[\r|\n]*/g,"");
				temp.html = textHtml.replace(/[\r|\n]*/g,"");
				window._data += JSON.stringify(temp)+",";
				dfd.resolve();
			},
			error : function(data){
				var text = data.responseText.match(/<path d=\".+?\"/g)[0]+" fill=\"#999\" /></svg>";
				var textModel = "<svg class=\"wqd-svgicon\" viewBox=\"0 0 2000 2000\" xmlns=\"http://www.w3.org/2000/svg\">"+text;
				var textHtml = "<svg style=\"display:inline-block;vertical-align: middle;margin:0 auto;width:40px;height:40px;\" viewBox=\"0 0 2000 2000\" xmlns=\"http://www.w3.org/2000/svg\">"+text;
				temp.model = textModel.replace(/[\r|\n]*/g,"");
				temp.html = textHtml.replace(/[\r|\n]*/g,"");
				window._data += JSON.stringify(temp)+",";
				dfd.resolve();
			}
		});
		return dfd.promise();
	}
	//文件处理转成JSON----count--传入遍历个数
	creatBaseElement.ToJSON = function(count) {
		window._data = "{\"json\":[";
		var temp = {"model":"", "html":"", "type":"10", "title":"货币"}, _self = this, arr = [];
		//520个文件
		for(var i=1; i<count;i++) {
			var dfd = $.Deferred();
			arr.push(_self.readText(i, temp, dfd));
		}
		$.when.apply(null, arr).done(function() {
            window._data += "]}";
            console.log("finish");
            console.log(window._data);
        });
	}
/****************** 文件转换  end    结构固定式 *******************/


/****************** 文件转换1  start    文件全读式---适合分享和关注 *******************/
	//读取文件
	creatBaseElement.readText1 = function(i, dfd) {
		$.ajax({
			type: "POST",
			url: "../js/app/JSON/component/icon/11 ("+i+").svg",
			data : {},
			async: true,
			dataType: "string",
			success:function(data){
				window.temp.model += data.responseText.replace(/[\r|\n]*/g,"") + "\n";
				window.temp.html += data.responseText.replace(/[\r|\n]*/g,"") + "\n";
				dfd.resolve();
			},
			error : function(data){
				window.temp.model += data.responseText.replace(/[\r|\n]*/g,"") + "\n";
				window.temp.html += data.responseText.replace(/[\r|\n]*/g,"") + "\n";
				dfd.resolve();
			}
		});
		return dfd.promise();
	}
	//文件处理转成JSON----count--传入遍历个数
	creatBaseElement.ToJSON1 = function(count) {
		window.temp = {"model":"", "html":""}, _self = this, arr = [];
		//520个文件
		for(var i=1; i<count;i++) {
			var dfd = $.Deferred();
			arr.push(_self.readText1(i, dfd));
		}
		$.when.apply(null, arr).done(function() {
            console.log("finish");
            console.log(JSON.stringify(window.temp));
        });
	}
/****************** 文件转换1  start    文件全读式---适合分享和关注 *******************/


	return creatBaseElement;
});
