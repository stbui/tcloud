/*
* @Author: liumingren
* @Date:   2015-11-24 19:27:32
* @Last Modified by:   liumingren
*/

define(['utility','popupCommon','smartMenu',"elementInfo","elementAlign","elementDistribute"],function(utility,popupCommon,smartMenu,_ei,_ea,_ed) {

	var elementToolbar = {
		init:function () {
			var self = this;
			this.initContext("[data-elemandgroup='true']");
			$(document).on("toolbar.show",function (e,data) {

				// setTimeout(function() {
					self.showToolbar($(e.target),data.event);
				// },0);
			});
		},
		showToolbar:function ($elm,event) {
			var self = this,isGroup = $elm.hasClass("wqdGroup"),
				unused = $elm.attr("data-unused") || "",
				toolbarConfig = {
					element:$elm,
					toolbarBtn:[]
				};
			if(isGroup) {
				toolbarConfig.toolbarBtn = [{
					identClass:"removegroup",
					btnCss:{},
					text:"解散",
					desc:"解散当前分组",
					onclick:function (e,$elm,$btn) {
						$(document).trigger("disjoin",{node:$elm});
					}
				},{
					identClass:"align",
					btnCss:{},
					text:"对齐",
					desc:"当前分组内元素对齐方式",
					context:{
						list:[{
							identClass:"alignCenter",
							text:"水平对齐",
							autohide: true,
							onclick:function (e,$elm) {
								//选择对齐方式
								_ea.selectAlign($elm,"alignCenter");
							}
						},{
							identClass:"alignMiddle",
							text:"垂直对齐",
							autohide: true,
							onclick:function (e,$elm) {
								//选择对齐方式
								_ea.selectAlign($elm,"alignMiddle");
							}
						},{
							identClass:"alignTop",
							text:"上对齐",
							autohide: true,
							onclick:function (e,$elm) {
								//选择对齐方式
								_ea.selectAlign($elm,"alignTop");
							}
						},{
							identClass:"alignLeft",
							text:"左对齐",
							autohide: true,
							onclick:function (e,$elm) {
								//选择对齐方式
								_ea.selectAlign($elm,"alignLeft");
							}
						},{
							identClass:"alignBottom",
							text:"下对齐",
							autohide: true,
							onclick:function (e,$elm) {
								//选择对齐方式
								_ea.selectAlign($elm,"alignBottom");
							}
						},{
							identClass:"alignRight",
							text:"右对齐",
							autohide: true,
							onclick:function (e,$elm) {
								//选择对齐方式
								_ea.selectAlign($elm,"alignRight");
							}
						}]
					}
				},{
					identClass:"distribute",
					btnCss:{},
					text:"分布",
					desc:"当前分组内元素分布方式",
					context:{
						list:[{
							identClass:"distributeHorizontally",
							text:"水平分布",
							autohide: true,
							onclick:function (e,$elm) {
								//选择分布方式
								_ed.selectDistribute($elm,"distributeHorizontally");
							}
						},{
							identClass:"distributeVertically",
							text:"垂直分布",
							autohide: true,
							onclick:function (e,$elm) {
								//选择分布方式
								_ed.selectDistribute($elm,"distributeVertically");
							}
						}]
					}
				}];
			} else if(unused.indexOf("set") == -1 && $elm.attr("data-elementtype")!="article"){
				toolbarConfig.toolbarBtn = [{
					identClass:"setting",
					btnCss:{},
					text:"设置",
					desc:"设置当前元素",
					onclick:function (e,$elm,$btn) {
						$elm.trigger("elmenentEdit",{element:$elm});
						$(".elenentToolbarContext").remove();
					}
				}];
			} else {
				toolbarConfig.toolbarBtn = [];
			}

			if($elm.attr("data-elementtype") == "carouse" && unused.indexOf("edit") == -1) {
				toolbarConfig.toolbarBtn.push({
					identClass:"carouseAddElement",
					text:"修改",
					desc:"向轮播中添加元素、修改元素位置",
					onclick:function (e,$elm,$btn) {
						utility.overlay($elm,$elm.parents(".sectionV2"));
						$(".elenentToolbarContext").remove();
					}
				})
			}
			if($.inArray($elm.attr("data-elementtype"),["container","secondNav","artListContainer","groupContainer","form","hoverContainer"]) != -1 && unused.indexOf("edit") == -1) {
				toolbarConfig.toolbarBtn.push({
					identClass:"carouseAddElement",
					text:"修改",
					desc:"向容器中添加元素、修改元素位置",
					onclick:function (e,$elm,$btn) {
						if($elm.attr("data-elementtype") == "article") {
							$elm = $elm.find("[data-elementtype='artListContainer'][data-articleCommon='true']").eq(0);
						}
						utility.overlay($elm,$elm.parents(".sectionV2"));
						if($elm.hasClass("groupContainerTwo")){
							var thisMark = $elm.attr("wqdmark") || "wqdNomark",
								menuObj = $elm.siblings(".wqdelementEdit"+"[wqdmark="+thisMark+"]").clone();
							menuObj.appendTo($(".wqd-carouseOverlay-box"));
						}
						$elm.trigger("element.change");
					}
				})
			}

			// if($elm.attr("data-elementtype") == "form" && unused.indexOf("edit") == -1) {
			// 	toolbarConfig.toolbarBtn.push({
			// 		identClass:"carouseAddElement",
			// 		text:"修改",
			// 		desc:"向表单中添加元素、修改元素位置",
			// 		onclick:function (e,$elm,$btn) {
			// 			utility.overlay($elm,$elm.parents(".sectionV2"));
			// 		}
			// 	})
			// }

			if($elm.attr("data-elementtype") == "picture" && unused.indexOf("edit") == -1) {
				toolbarConfig.toolbarBtn.push({
					identClass:"carouseAddElement",
					text:"编辑",
					desc:"编辑图片",
					onclick:function (e,$elm,$btn) {
						$elm.trigger("pictureEdit",{element:$elm,btn:$btn});
					}
				})
			}

			if($elm.attr("data-elementtype") == "groupContainer" && !$elm.hasClass("freeContainerTwo")) {
				toolbarConfig.toolbarBtn.push({
					identClass:"addFreeContainer",
					text:"添加",
					desc:"添加衍生关联容器",
					onclick:function (e,$elm) {
						$elm.trigger("addFreeContainer",{element:$elm});
					}
				})
			}

			// if($elm.attr("data-elementtype") == "article") {
			// 	toolbarConfig.toolbarBtn.push({
			// 		identClass:"article",
			// 		text:"内容",
			// 		desc:"文章内容",
			// 		onclick:function (e,$elm) {
			// 			$(document).trigger("articleListEdit",{element:$elm});
			// 		}
			// 	})
			// }

			var setElemZindex = function (e,$elm,type) {
				var $parent = $elm.parents(".wqdCarousel").size() ? $elm.parents(".wqdCarousel").find(".item.active .bannerContainer") : undefined;
				// $(e.target).hasClass("etbcli up") && _ei.getElemZindex($elm,"up",$parent);
                var $articleList = $elm.parents(".wqdelementEdit.articleLists");
                var $$articleListCont = $articleList.find(".artListContainer .wqdelementEditBox");
                if($$articleListCont.length) {
                    var elemType = $elm.attr("data-elementtype");
                    $articleList.find("[data-elementtype="+elemType+"]").each(function (i,_) {
                        _ei.getElemZindex($(_),type,void 0,void 0,void 0,true);
                    });
                    $articleList.trigger("artLists:pushTemplate");
                }else {
                    _ei.getElemZindex($elm,type,$parent);
                }
			}
			if(unused.indexOf("zindex") == -1) {
				toolbarConfig.toolbarBtn.push({
					identClass:"zindex",
					btnCss:{},
					text:"层级",
					desc:"修改当前元素层级",
					context:{
						list:[{
							identClass:"up",
							text:"向上一层",
							onclick:function (e,$elm) {
								setElemZindex(e,$elm,"up");
							}
						},{
							identClass:"down",
							text:"向下一层",
							onclick:function (e,$elm) {
								setElemZindex(e,$elm,"down");
							}
						},{
							identClass:"top",
							text:"顶层",
							onclick:function (e,$elm) {
								setElemZindex(e,$elm,"top");
							}
						},{
							identClass:"bottom",
							text:"底层",
							onclick:function (e,$elm) {
								setElemZindex(e,$elm,"bottom");
							}
						}]
					}
				});
			}

			if(unused.indexOf("del") == -1) {
				toolbarConfig.toolbarBtn.push({
					identClass:"delete",
					btnCss:{},
					text:"删除",
					desc:"删除元素",
					onclick:function (e,$elm) {
						_ei.deleteElement($elm);
						_ei.removeElementEditBtn({toolbar:true});
					}
				})
			}
			if(!$elm.hasClass("elementsContainer") && unused.indexOf("animate") == -1 && !$elm.parents(".wqdSecondNavbox").length && !$elm.parents(".containerWarp").length) {
				toolbarConfig.toolbarBtn.push({
					identClass:"animate",
					btnCss:{},
					text:"动画",
					desc:"设置动画",
					onclick:function (e,$elm) {
						$(document).trigger("animateinit",{element:$elm});
					}
				});
			}
			if($elm.parents(".wqdCarousel").size() < 1 && unused.indexOf("copy") == -1 && $elm.attr('data-elementtype')!='groupContainer') {
				toolbarConfig.toolbarBtn.push({
					identClass:"copy",
					btnCss:{},
					text:"复制",
					desc:"复制当前元素到剪切板",
					onclick:function (e,$elm) {
						$(document).trigger("copyEG",$elm);
					}
				});
			}
			if(unused.indexOf("help") == -1) {
				toolbarConfig.toolbarBtn.push({
					identClass:"help",
					btnCss:{},
					text:"帮助",
					onclick:function (e,$elm) {
						var type = $elm.attr("data-elementtype");
						var url = "";
						switch(type) {
							case "text":url = "http://127.0.0.1";break;
							case "button":url = "http://127.0.0.1";break;
							case "icon":url = "http://127.0.0.1";break;
							case "img":url = "http://127.0.0.1";break;
							case "svg":url = "http://127.0.0.1";break;
							case "freeRect":url = "http://127.0.0.1";break;
							case "line":url = "http://127.0.0.1";break;
							case "firstNav":
							case "extendNav":
							case "navTemplate1":
							case "navTemplate2":
							case "navTemplate3":url = "http://127.0.0.1";break;
							case "carouse":url = "http://127.0.0.1";break;
							case "map":url = "http://127.0.0.1";break;
							case "form":url = "http://127.0.0.1";break;
							case "share":url = "http://127.0.0.1";break;
							case "follow":url = "http://127.0.0.1";break;
							case "video":url = "http://127.0.0.1";break;
							case "picture":url = "http://127.0.0.1";break;
							case "articleDetails":url = "http://127.0.0.1";break;
							case "article":url = "http://127.0.0.1";break;
							case "groupContainer":url = "http://127.0.0.1";break;
							case "articleLists":url = "http://127.0.0.1";break;
							case "numberprogress":url = "http://127.0.0.1";break;
							case "progressBar":url = "http://127.0.0.1";break;
							case "progressCircle":url = "http://127.0.0.1";break;
							default:url = "http://127.0.0.1";break;
						}
						window.open(url);
					}
				});
			}
			toolbarConfig.event = event;
			utility.elementtToolBar(toolbarConfig);
		},
		initContext:function (elm) {
			var self = this,zindex;
			var $elm,$parent;
			var getNode = function ($this,indexType) {
				var $group = $this.closest(".wqdGroup"),$container = $this.parents(".elementsContainer"),
					$elm,$parent;
			    $elm = $this.closest(".wqdelementEdit").eq(0);
			    if($group.length) {
			    	if($group.attr("data-groupstatus") != "on") $elm = $group;
			    } else if($container.size() > 1) {
			    	$elm = $container.eq(0);
			    }
			    $parent = $elm.parents(".wqdCarousel").size() ? $elm.parents(".wqdCarousel").find(".item.active .bannerContainer") : undefined;
			    return {
			    	elm:$elm,
			    	parent:$parent
			    }
			};
			var cMenuPosition = [
				{
			    	text: "向上一层",
			    	func: function() {
			    		var node = getNode($(this));
			    		_ei.getElemZindex($elm.length ? $elm : node.elm,"up",node.parent);
			    	}
				},{
			    	text: "向下一层",
			    	func: function() {
			    		var node = getNode($(this));
			    		_ei.getElemZindex($elm.length ? $elm : node.elm,"down",node.parent);
			    	}
				},{
			    	text: "顶层",
			    	func: function() {
			    		var node = getNode($(this));
			    		_ei.getElemZindex($elm.length ? $elm : node.elm,"top",node.parent);
			    	}
				},{
			    	text: "底层",
			    	func: function() {
			    		var node = getNode($(this));
			    		_ei.getElemZindex($elm.length ? $elm : node.elm,"bottom",node.parent);
			    	}
				}
			],
			cMenuCopy = {
		    	text: "复制",
		    	func: function() {
		    		var node = $elm.length ? $elm : getNode($(this)).elm;
					$(document).trigger("copyEG",{element:node});
		    	}
			},
			cMenuPast = {
		    	text: "粘贴",
		    	func: function() {
		    		var node = $(this);
		    		if($("body").attr("data-carouseEditing") == "true"){
		    			node = $(this).closest(".wqdelementEdit")[0];
		    		}else {
		    			var elemeContainer = $(this).closest(".elementsContainer");
		    			node = elemeContainer.size() && !elemeContainer.hasClass("sectionV2") ? elemeContainer[0] : $(this).closest(".wqdelementEdit")[0];
		    		}
					$(document).trigger("pasteEG",{element:node});
		    	}
			},
			//表格
			cMenuTable =[
				{
					text : "<span></span><input type='text' class='wqdColorPicker' colorType='backC' /><span></span>",
					nohide:true
				},{
					text : "<span></span><input type='text' class='wqdColorPicker' colorType='fontC' /><span></span>",
					nohide:true
				},{
					text : "<span></span><i>行高</i><input type='number' operateT='lineH' />px",
					nohide:true,
					func : function(){
						$(document).trigger("tableChangeColorLine",{element:$(this)});
					}
				},{
					text : "<span></span><i>列宽</i><input type='number' operateT='width' />px",
					nohide:true,
					func : function(){
						$(document).trigger("tableChangeColorLine",{element:$(this)});
					}
				},{
					text : "<span></span>上方插入行",
					func : function(){
						$(document).trigger("optColletInit",{"fnnum":5,"target":$(this)});
					}
				},{
					text : "<span></span>左侧插入列",
					func : function(){
						$(document).trigger("optColletInit",{"fnnum":6,"target":$(this)});
					}
				},{
					text : "<span></span>删除行",
					func : function(){
						$(document).trigger("optColletInit",{"fnnum":7,"target":$(this)});
					}
				},{
					text : "<span></span>删除列",
					func : function(){
						$(document).trigger("optColletInit",{"fnnum":8,"target":$(this)});
					}
				}
			];
			var contextMenuData = [cMenuPosition];
			smartMenu.smartMenu(elm,contextMenuData,{
				name:"element",
		    	beforeShow:function () {
		    		smartMenu.remove();
		    		$elm = getNode($(this)).elm;
		    		var isEditingCont = $("body").attr("data-carouseediting") == "true";

		    		contextMenuData[0] = isEditingCont ? [] : $.merge([], cMenuPosition);
		    		if(!$elm.attr("data-unused") || $elm.attr("data-unused").indexOf("copy") == -1) {
		    			contextMenuData[0].push(cMenuCopy);
		    		}
		    		contextMenuData[0].push(cMenuPast);
		    		if($elm.attr("data-elementtype")=="wqdTable"){
		    			contextMenuData[0] = $.merge(contextMenuData[0], cMenuTable);
		    		}
		    	}
			});
			//表格
			smartMenu.smartMenu('[data-elementtype="wqdTable"]',contextMenuData,{
				name:"wqdtablecss",
				beforeShow:function () {
					smartMenu.remove();
					$elm = getNode($(this)).elm;
					contextMenuData[0] = $.merge([], cMenuTable);
					contextMenuData[0] = $.merge(contextMenuData[0], cMenuPosition);
					contextMenuData[0].push(cMenuCopy,cMenuPast);
					// contextMenuData[0] = $.merge([], cMenuPosition);
					// contextMenuData[0].push(cMenuCopy,cMenuPast);
					// contextMenuData[0] = $.merge(contextMenuData[0], cMenuTable);
				}
			});
			// 为通条添加粘贴
			smartMenu.smartMenu(".yzmoveContent",[[cMenuPast]],{
				name:"section",
		    	beforeShow:function () {
		    		smartMenu.remove();
		    	}
			});
		},
	}

	return elementToolbar;

});

