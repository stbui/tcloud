define(["pageList", "pageSet", "pageSetCtrl", "pageRuler", "pageHeader", 'pageCatch'], function(_pl, _ps, _psc, _pr, _ph, _pc) {
	var pageListCtrl = {};
	pageListCtrl.init = function() {
			/* design--顶部网页列表按钮开关 */
			$("#wqdpHeaderD").on("click", "ul.func-list li.title", function() {
				/* 左侧栏关闭 */
				$("#wqdComponentD span.close").click();

				var _self = $(this),
					_page = $("#wqdpageContentD");

				/* 页面列表关闭 */
				_page.on("click", "span.close", function() {
					_self.removeClass("on");
					_page.hide();
					_page.off("click"); //将pageSet中init也off掉了
					/* 重新添加上 */
					_psc.init(); //这里写的不好，导致有依赖

					/* 同时关闭右侧模板页添加 */
					$("#wqdaddPageTemplateD").hide();
					$("#wqdaddcolD img.close").click();
					/* 页面设置页面关闭 */
					$("#wqdPageInfD .comHeader span.close").click();

				});

				/** 拆分后第一个版本 V3.0.1  每次修改版本往上加1
				 * 还没有优化，只是先跑通
				 * 删除页面
				 */
				_page.on("click", "ul.pagedeatllist li .pageShow b span.facBtn3", function() {
					var obj = $(this).parents("li.plist"),
						pageId = obj.attr("pageid"),
						name = obj.find('.pageShow em').text();

					$.ajax({
						type: 'GET',
						url: URLPATH + 'js/app/JSON/designSystem.json',
						data: {},
						async: false,
						dataType: "json",
						success: function(data) {
							$.colorbox({
								transition: "none",
								opacity: 0.5,
								html: data.system.removePage,
								fixed: true,
								closeButton: false,
								onOpen: function() {
									window.scroll_top = $(document).scrollTop();
								},
								onComplete: function() {
									$('.wqdsysremovePage .bd em').html(name);
									$('.wqdsysremovePage span.q,.wqdsysremovePage .wqdsysclose').click(function() {
										$.colorbox.close();
									});
									$('.wqdsysremovePage span.r').click(function() {
										_pl.deletePage(obj);
									});
									$("#cboxOverlay").addClass("cboxOverlayShow");
								},
								onClosed: function() {
									window.scrollTo(0, window.scroll_top);
									$("#cboxOverlay").removeClass("cboxOverlayShow");
								}
							});
						},
						error: function(data) {

						}
					});

				});
				/** 拆分后第一个版本 V3.0.1  每次修改版本往上加1
				 * 还没有优化，只是先跑通
				 * 复制页面
				 */
				_page.on("click", "ul.pagedeatllist li .pageShow b span.facBtn2", function() {
					var li = $(this).parents("li.plist");
					// _ph.save();
					// _pc.getCancel() && _ph.save();
					_pl.copyPage(li.attr("pageid"), function(data) {
						var clone = li.clone(true),
							text = "";
						li.after(clone);

						if (clone.find('.pageShow em').text().indexOf(':') >= 0) {
							text = clone.find('.pageShow em').text().substr(clone.find('.pageShow em').text().indexOf(':') + 1) + '副本';
						} else {
							text = clone.find('.pageShow em').text() + '副本';
						}
						clone.removeClass('on').attr({
							'pageid': data.id,
							'data-uri': data.domain
						}).find('.pageShow em').text(text);
						clone.find("span").removeClass('on');
						/* 新加内容 */
						clone.find(".pageShow").removeClass("on");
						clone.find(".pageShow .openIcon").addClass("on");
						clone.find(".sectionList").hide();

						if (clone.find('.pageShow i').hasClass('home')) {
							clone.find('.pageShow i').removeClass('home');
							clone.find('.pageShow b').append('<span class="facBtn3" title="删除"></span>');
						}
					});
				});

				/**
				 * 展开通条列表 2016.4.8 简单整理
				 */
				_page.on("click", ".pagedeatllist li.plist .openIcon", function() {
					var $this = $(this),
						$parent = $this.parents("li.plist"),
                        openListDfd = $.Deferred();

					// if(!window.noSave && !$(this).parents(".pageShow").hasClass("on")) {
					// 	return alert("当前页面未保存，请保存后再切换！")
					// }

					// $this.parents(".pageShow").hasClass("on") || _ph.setLoadingStyle(true);
					_pc.getCancel() && _ph.save();// 页面自动保存

					// 列表展开时，重载页面内容（原因：列表生成是根据页面内容生成的）
                    _pl.changePage($this.parents(".pageShow").find("em"),openListDfd);
					// $this.parents(".pageShow").find("em").trigger("click");
                    $.when(openListDfd).done(function () {
                        $this.toggleClass("on");

                        // 当前滑动打开，其他的全部关闭收起
                        $parent.find(".sectionList").slideToggle().end()
                            .siblings("li.plist").find("p.openIcon").addClass("on").end()
                            .find(".sectionList").slideUp();
                    });
				});

				// 添加页面
				$('#wqdpageContentD').on("click", ".wqdaddpagelist p", function() {
					/* 关闭通条模板添加页 */
					$("#wqdaddcolD img.close").click();

					/* 新页面添加---但是需要改添加样式 */
					// _pl.yxbindEvent(0, $(this));    ----老方法----内容删除后，此处可以删掉
					_pl.getPageTemplateTag(11);
					var type = "10078"; //先等于一个固定值，但是以后还需要更改
					$("#wqdaddPageTemplateD").off("click", "ul.category-list li");
					$("#wqdaddPageTemplateD").on("click", "ul.category-list li", function() {
						type = $(this).attr("type");
						$(this).addClass("active").siblings().removeClass("active");
						_pl.getPageTemplateList(1, type);
					});

					//底部分页事件绑定
					$("#wqdaddPageTemplateD").off("click", ".page-nation ul.page li");
					$("#wqdaddPageTemplateD").on("click", ".page-nation ul.page li", function() {
						_pl.getPageTemplateList($(this).children().html(), type);
					});

					//关闭新添加页面
					$("#wqdaddPageTemplateD").off("click", "img.close");
					$("#wqdaddPageTemplateD").on("click", "img.close", function() {
						$("#wqdaddPageTemplateD").hide();
					});

					//添加页面操作
					$("#wqdaddPageTemplateD").off("click", "ul.slide-list li div.po");
					$("#wqdaddPageTemplateD").on("click", "ul.slide-list li div.po", function() {
						var partid = $(this).parents('li').attr('partid');
						// if ($("#wqdaddPageTemplateD ul.category-list li[type=123456789]").hasClass("active")) {
						if($(this).attr("data-pagelisttype") == "article"){
							_pl.addPageTemplate(partid, "article");
						} else {
							_pl.addPageTemplate(partid, "normal");
						}
						$("#wqdaddPageTemplateD").hide();
					});
				})

				//修改通条名字
				$('#wqdpageContentD').on('dblclick', '.sectionList li[partid] em', function() {
						if ($(this).hasClass('edit')) {
							return false;
						}
						var name = $(this).addClass('edit').attr('title'),
							_this = $(this),
							sectionId = $(this).parents('li').attr('partid');
						if ($(this).find('input').length) {
							return false;
						}
						$(this).html('<input type="text" value="' + name + '" class="mod_t_name"/>');
						$('input.mod_t_name').focus().on('blur', function() {
							var newname = $.trim($(this).val()) || $(this).parent('em').attr('title');
							var newname2 = SetString(newname, 16);
							if (newname != name) {
								_pl.modifyvViewPart(sectionId, newname);
							}
							_this.removeClass('edit').html(newname2).attr('title', newname);
						});
					})
					/* 复制通条 */
				$('#wqdpageContentD').on('click', 'ul.usercontent li span.facBtn1', function() {
					_pl.copyPart($(this).parents("li"));
					$(".nano").nanoScroller({
						alwaysVisible: true
					});
				})

				//删除通条
				$('#wqdpageContentD').on('click', 'ul.userht li span.facBtn3,ul.usercontent li span.facBtn3', function() {
					_pl.removePart($(this));
					$(".nano").nanoScroller({
						alwaysVisible: true
					});
				})

				//页面通条添加按钮
				$('#wqdpageContentD').on("click", ".wqdaddpagebtn, ul.userht li a, ul.userht li span.facBtn2", function() {
					/* 关闭页面模板添加页 */
					$("#wqdaddPageTemplateD img.close").click();

					/* 对应当前点击位置 */
					var _self1 = $(this);

					/* 通过类型判别，点击的是header或footer或center */
					/*
					 * 修正 直接判断是什么类型
					 */
					var type = "00100"; //中间部分内容
					if ($(this).parents("ul").hasClass("header")) {
						type = 21; //头部
					} else if ($(this).parents("ul").hasClass("footer")) {
						type = 12; //尾部
					}
					_pl.getCategoryTList(type);

					$("#wqdaddcolD").off("click", "ul.category-list li");
					$("#wqdaddcolD").on("click", "ul.category-list li", function() {
						type = $(this).attr("type");
						$(this).addClass("active").siblings().removeClass("active");
						_pl.getAllTList(1, type);
					});

					//底部分页事件绑定
					$("#wqdaddcolD").off("click", ".page-nation ul.page li");
					$("#wqdaddcolD").on("click", ".page-nation ul.page li", function() {
						_pl.getAllTList($(this).children().html(), type);
					});

					//关闭新添加栏目
					$("#wqdaddcolD").off("click", "img.close");
					$("#wqdaddcolD").on("click", "img.close", function() {
						$("#wqdaddcolD").hide();
					});

					//添加通条操作
					$("#wqdaddcolD").off("click", "ul.slide-list li div.po");
					$("#wqdaddcolD").on("click", "ul.slide-list li div.po", function() {
						var partid = $(this).parents('li').attr('partid');

						/* 获取通条名字全局变量-----解决：字符串div中sectionname和列表中名称不一致问题，产生问题原因（运营）,全部一致后，可以删除 */
						window.getSectionNameV3 = $(this).parents('li').find("p.pic-describe").html();

						_pl.getDataTContent(partid, _self1);
					});
				});

				if (!_self.hasClass("on")) {
					_self.addClass("on");
					_page.show();
					_page.find('.nano').height($(window).height() - 200).nanoScroller({
						alwaysVisible: true
					});
				} else {
					_self.removeClass("on");
					_page.hide();
					_page.find("span.close").click();
				}
			});

			//点击页面上通条 显示选中效果
			$(document).on('click.yzmoveContent', 'div.yzmoveContent', function() {
				var children = $(this).children();
				$('div.yzmoveContent').removeClass('yzmoveContentBor');
				$(this).addClass('yzmoveContentBor');
				if ($(this).parents("#HTMLDATACENTER").length) {
					var _index = $(this).index() + 1;
					$("#wqdpageContentD ul.pagedeatllist li.plist.on").find("li").eq(_index).addClass("on").siblings("li").removeClass("on")
				}

				if (children.attr('partcategoryid') == '21') {
					$('.tool-list2').attr('partid', children.attr('partid')).attr('isHeader', 'true');
				} else {
					$('.tool-list2').attr('partid', children.attr('partid')).attr('isHeader', 'false');
				}
			});

			function SetString(str, len) {
				var strlen = 0;
				var s = "";
				for (var i = 0; i < str.length; i++) {
					if (str.charCodeAt(i) > 128) {
						strlen += 2;
					} else {
						strlen++;
					}
					s += str.charAt(i);
					if (strlen > len) {
						return s;
					}
				}
				return s;
			}

			/* 页面列表 */
			this.wqdDragDropList_css({
				'nodeSelector': '#wqdpageContentD ul.pagedeatllist li.plist:not([viewnews]) .pageShow i',
				'parentSelector': 'li.plist'
			});
			/* 通条列表 */
			this.wqdDragDropList_css({
				'nodeSelector': '#wqdpageContentD ul.pagedeatllist li.plist .sectionList ul.usercontent li.slist[data=cont] i',
				'parentSelector': 'li.slist[data=cont]'
			});

			/* 主区域宽度选择 */
			$("#wqdpHeaderSetStationD").on("click", "ul li.area .useBtn", function() {
				$(this).parents(".area").find(".useBtn").removeClass("on").html("选择");
				$(this).addClass("on").html("使用中");

				var userview = $('#HTMLDATAHEADER .wqdAreaView');
				var w = _pl.getMainArea();
				$('style#styleCss').remove();
				_pr.removeRule();
				if (userview.find('div.yzmoveContent').length) {
					userview.find('.yzmoveContent').before($('<style type="text/css" id="styleCss" uw="' + w + '">.wqdView,.wqdAreaView .wqdSectiondiv{min-width:' + w + 'px;} .wqdAreaView .wqdBkEditos,.hoverCon-section .wqdBkEditos{width:' + w + 'px;} .fullscreen .bannerContainer{margin:0 auto;width:' + w + 'px !important;}</style>'));
				} else {
					userview.append($('<style type="text/css" id="styleCss" uw="' + w + '">.wqdView,.wqdAreaView .wqdSectiondiv{min-width:' + w + 'px;} .wqdAreaView .wqdBkEditos,.hoverCon-section .wqdBkEditos{width:' + w + 'px;} .fullscreen .bannerContainer{margin:0 auto;width:' + w + 'px !important;}</style>'));
				}
				$(document).trigger("appSetCatch").trigger("initContainerRuler");
			});

			/* 如果上传过icon, 那么用新的icon */
			if (iconPath) $("#wqdpHeaderSetStationD .icon img.areaIcon").attr("src", CSSURLPATH + "/" + iconPath);
			/* 上传icon */
			$("#iconupload").fileupload({
				pasteZone: null,
				url: "/setting/favicon",
				acceptFileTypes: /(\.|\/)(ico)$/i,
				maxFileSize: 500000, // 0.5 MB
				dataType: 'text',
				sequentialUploads: true,
				formData: {
					siteId: USERSITEID
				}, //参数
				done: function(e, result) {
					if (result.result) {
						var data = JSON.parse(result.result);
						if (data && data.status == 200) {
							$("#wqdpHeaderSetStationD .icon img.areaIcon").attr("src", data.data.favicon);
							return;
						} else {
							alert("上传失败！");
						}
					}
				},
				messages: {
					acceptFileTypes: '图片格式不正确',
					maxFileSize: '图片大小不超过500Kb'
				}
			}).off("fileuploadprocessalways").on('fileuploadprocessalways', function(e, data) {
				var index = data.index,
					file = data.files[index];
				if (file.error) {
					alert(file.error);
				}
			});

		}
		/* 列表拖拽 */
	pageListCtrl.wqdDragDropList_css = function(options) {
		/* 不传参数，直接退出 */
		if (!options) {
			return;
		}
		/* 默认设置选项 */
		options = {
			nodeSelector: options.nodeSelector ? options.nodeSelector : "",
			/* 当前出发拖拽元素选择器字符串 */
			parentSelector: options.parentSelector ? options.parentSelector : "" /* 元素父级选择器字符串 */
		}

		/* 绑定需要拖拽元素 */
		$(document).on('mousedown.wqdDragDropList_css1', options.nodeSelector, function(e) {

			if ($(this).parents("slist").length) {
				var _parentObj = $(this).parents("ul.pagedeatllist").find("li.plist");
				/* 全部关闭 */
				_parentObj.find("p.openIcon").addClass("on");
				/* 全部收起 */
				_parentObj.find(".sectionList").slideUp();
			}

			/* 记载当前插入元素位置 */
			var startY = e.pageY,
				storageIndex = 0;
			/* 找到对应的元素父级--需要整体移动的节点 */
			var elem = $(this).parents(options.parentSelector);
			/* 直接获取滚动条内容，滚动高度*/
			var scrollY = $(this).parents(".nano").find(".nano-content").scrollTop();
			/* 元素所在位置相对顶部高度 */
			var elemY = scrollY ? (scrollY + elem.position().top) : elem.position().top;
			/* 用来判别鼠标的移动方向 */
			var tempY = startY;
			/* 全部兄弟节点 */
			var arrElem = elem.siblings();
			/* 元素所在，空元素对应节点 */
			var index = elem.index();
			/* 移动的当前元素序号 */
			var currIndex = elem.index();

			/* 拖拽过程 */
			$(document).on('mousemove.wqdDragDropList_css', function(e) {
				var moveY = e.pageY;
				// 拖动后，元素Top值
				var positionY = moveY - startY + elemY;
				// 判断移动方向 向下:1 向上:0
				var flag = 1;
				flag = tempY < moveY ? 1 : 0;
				tempY = moveY;
				/* 元素拖拽产生新的位置 */
				elem.css({
					'position': 'absolute',
					'top': positionY + 'px',
					'z-index': '9999',
					"background": "#fff"
				});
				// $('#space_list').length ? "" : elem.before($('<li id="space_list"></li>'));
				// 切换位置
				compareYY(elem, flag);
			});
			/* 比较Y值 */
			function compareYY($elem, flag) {
				var $domString = $('#space_list');
				if(!$domString.length) {
					$domString = $('<li id="space_list"></li>').insertBefore($elem);
				}
				if (flag == 0 && index - 1 >= 0) { // 向上
					var prevElem = arrElem.eq(index - 1);
					if (prevElem.position().top + $elem.outerHeight() / 2 > $elem.position().top) {
						$domString.remove();
						prevElem.before($domString);
						index--;
					}
				} else if (index < arrElem.length) { // 向下
					var nextElem = arrElem.eq(index);
					if (nextElem.position().top - $elem.outerHeight() * 3 / 2 < $elem.position().top) {
						$domString.remove();
						isLast = nextElem.is(":last-child")|| !nextElem.siblings().eq(index+1).length;
						isLast && $elem.position().top > nextElem.position().top + nextElem.height() / 2 && !nextElem.attr("viewnews") ?
							nextElem.after($domString) : nextElem.before($domString);
						isLast || index++;
					}
				}
			}

			/* 鼠标离开时，保存并取消所有的绑定事件 */
			$(document).on('mouseup.wqdDragDropList_css mouseleave.wqdDragDropList_css', moveOver);

			/* 移动结束，事件内容 */
			function moveOver() {
				var elemTop = elem.position().top;
				var elemHeight = elem.outerHeight();
				var cloneNode = elem.clone(true);
				$('#space_list').length ? elem.remove() : "";
				cloneNode.css({
					"position": "static"
				});
				cloneNode.removeAttr("style");
				$('#space_list').length ? $('#space_list').replaceWith(cloneNode) : "";
				/* 元素插入后的位置序号 */
				var insertIndex = cloneNode.index();

				var ul = cloneNode.parents('ul');

				/* 通条列表之间的移动保存 */
				if (ul.hasClass('usercontent')) {
					var tempHeight = elemTop - (ul.parents("li").outerHeight() + ul.parents("li").position().top);
					if (tempHeight > 0) {
						var ii = parseInt(tempHeight / (elemHeight + 10));
						var tempii = elemHeight + 10 - tempHeight % (elemHeight + 10);
						var $pagelist = $("#wqdpageContentD ul.pagedeatllist");
						if (tempii / (elemHeight) > 0.7 &&
							$pagelist.outerHeight() - $pagelist.parent().scrollTop() > elemTop && cloneNode.attr("section-type") != "artDetl") {
							/* 跨通条复制 */
							_pl.thoughPageCopy(ul.find("li.plist").eq(ul.parents("li").index() + ii + 1).attr("pageid"),cloneNode, currIndex);
							// cloneNode.remove();
						} else {
							_pl.partSort(currIndex, insertIndex);
						}
					} else if (elemTop + elemHeight < ul.parents("li").position().top) {
						var jj = parseInt((ul.parents("li").position().top - elemTop) / (elemHeight + 10));
						var tempjj = (ul.parents("li").position().top - elemTop) % (elemHeight + 10);
						if (tempjj / (elemHeight) > 0.7 && elemTop > 0 && cloneNode.attr("section-type") != "artDetl") {
							/* 跨通条复制 */
							_pl.thoughPageCopy(ul.find("li.plist").eq(ul.parents("li").index() - jj - 1).attr("pageid"),cloneNode,currIndex);
							// cloneNode.remove();
						} else if (tempjj / (elemHeight) < 0.4 && cloneNode.attr("section-type") != "artDetl") {
							/* 跨通条复制 */
							_pl.thoughPageCopy(ul.find("li.plist").eq(ul.parents("li").index() - jj).attr("pageid"),cloneNode,currIndex);
							// cloneNode.remove();
						} else {
							_pl.partSort(currIndex, insertIndex);
						}
					} else {
						_pl.partSort(currIndex, insertIndex);
					}
				}

				// node.removeAttr('style').removeAttr('active').replaceAll($('#_t'));

				/* 页面列表之间的移动保存 */
				if (ul.hasClass('pagedeatllist') && !ul.hasClass('usercontent')) {
					ul.find('li[data=cont]').each(function(i) {
						var icon = $(this).find('.pageShow i');
						if ($(this).hasClass('wqdnewsdetos') && i == 0) {
							icon.removeClass('navnewsicon').addClass('home');
						} else if (i == 0) {
							icon.addClass('home');
							$(this).find('.pageShow b').find("span.facBtn3").remove();
						}
						if (i > 0) {
							if (!icon.hasClass('navnewsicon')) {
								icon.removeClass('home');
								if (!$(this).find('.pageShow b').find("span.facBtn3").length) {
									$(this).find('.pageShow b').append('<span class="facBtn3" title="删除"></span>');
								}
							}
						}
					});
					$(document).trigger("wqdNavCallback", {
						category: 3,
						pageids: ul.find('li[data=cont]').eq(0).attr('pageid')
					});
					/* 页面排序保存 */
					var list = [];
					$('.pagedeatllist li:not(.end)').each(function(i) {
						if ($(this).attr('pageid')) {
							list.push($(this).attr('pageid'));
						}
					})
					$.ajax({
						type: 'POST',
						url: URLPATH + 'design/page/sort',
						data: {
							'siteId': USERSITEID,
							'pageIds': list.join(',')
						},
						async: true,
						dataType: 'json',
						success: function(data, that) {
							if (data.status != 200) {}
						}
					});
				}
				/* 移除所有事件绑定 */
				$(document).off('.wqdDragDropList_css');
			}



		});
	}
	return pageListCtrl;
})
