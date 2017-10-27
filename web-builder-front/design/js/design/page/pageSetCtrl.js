define(["pageSet"], function(_ps) {
	var pageSetCtrl = {};
	pageSetCtrl.init = function() {
		//重新定义pageid,并获取当前所在修改的页面pagid
		var USERPAGEID = 0;
		/* 页面设置开关 */
		$("#wqdpageContentD").off(".pagesetctrl").on("click.pagesetctrl", "ul.pagedeatllist li.plist .pageShow b span.facBtn1", function() {
			USERPAGEID = $(this).parents("li.plist").attr("pageid");

			/* 页面内容错误提示全部清空 */
                $('#wqdPageInfD ul.infoContent li').find(".error").html("");

                var _selfthis = $(this),
                    li = _selfthis.parents('li'),
                    pageid = li.attr('pageid'),
                    related = li.attr('related');
                _selfthis.toggleClass("on").parents("li").siblings().find("span.facBtn1").removeClass("on");
                if (_selfthis.hasClass("on")) {
                    var input = $("#wqdPageInfD").find('input');
                    input.eq(0).val(allviewSort[pageid].name);
                    input.eq(1).val(allviewSort[pageid].domain);


                    input.eq(2).val(allviewSort[pageid].seoTitle);
                    input.eq(3).val(allviewSort[pageid].seoKeyword);
                    $("#wqdPageInfD .error1").html("");
                    $("#wqdPageInfD").find('textarea').val(allviewSort[pageid].seoDescn).end().find('p.deletePageBtn').attr('pageid', pageid).end().show();
                    $("#wqdPageInfD").find('.nano').height($(window).height() - 100).nanoScroller();
                    (_selfthis.parents('li').attr('viewnews') == 'true') ? $("#wqdPageInfD").find('p.deletePageBtn').hide(): $("#wqdPageInfD").find('p.deletePageBtn').show();

                    if (!related) {
                        if (li.siblings().length - li.parent().find('i.navnewsicon').length <= 0) {
                            $("#wqdPageInfD").find('p.deletePageBtn').hide()
                        }
                    }
                } else {
                    $("#wqdPageInfD").hide();
                }
                $("#wqdpageSectionD,#wqdaddcolD").hide();
/**************************************** 以上代码未重写 **********************************************/

		});
		/* 页面设置页--Obj */
		var _piObj = $("#wqdPageInfD");
		$("#wqdPageInfD").off(".pagesetctrl");
		/* 页面设置切换 */
		$("#wqdPageInfD").on("click.pagesetctrl", "ul.tab li", function() {
			var _self = $(this), _index = _self.index();
			/* 列表切换 */
			_self.addClass("on").siblings("li").removeClass("on");
			/* 列表内容切换 */
			_piObj.find("ul.infoContent li").eq(_index).addClass("on").siblings("li").removeClass("on");
		});

		/* 页面设置关闭按钮 */
		$("#wqdPageInfD").on("click.pagesetctrl", ".comHeader span.close", function() {
			/* 页面设置页隐藏 */
			_piObj.hide();
			/* 事件取消 */
			// _piObj.off("click blur");
			/* 页面列表中设置状态消失 */
			$("#wqdpageContentD span.facBtn1").removeClass("on");
		});

		// $("#wqdpageContentD").on("click",".comHeader span.close",function() {
		// 	_piObj.off("click blur");
		// })


		/* 点击页面完成按钮 */
		$("#wqdPageInfD").on("click.pagesetctrl", ".overBtn", function() {
			$("#wqdPageInfD .comHeader span.close").click();
		});

		/* 页面内容输入框修改 */
		$("#wqdPageInfD").on("blur.pagesetctrl", "input, textarea", function() {

			/* 寻找内容li */
			var _li = $('#wqdPageInfD ul.infoContent li');
			var pageInfo = {
				"name"      : _li.eq(0).find('input').eq(0).val() || '',
				"domain"    : _li.eq(0).find('input').eq(1).val().replace(/\s/g, "") || '',
				"seoTitle"  : _li.eq(1).find('input').eq(0).val() || '',
				"seoKeyword": _li.eq(1).find('input').eq(1).val() || '',
				"seoDescn"  : _li.eq(1).find('textarea').val() || ''
			}

			var type = $(this).attr('name') || $(this).attr('category');
			/* 待修改---改成传一个值，并传一个类型的方式 */
			/* name在列表显示 */
			$('#wqdpageContentD ul.pagedeatllist li[pageid=' + USERPAGEID + ']').find('.pageShow em').text(pageInfo.name).attr("title",pageInfo.name);
			/* 修改内容的类型 */
			switch(type) {
				case "name"      :checkName();break;
				case "domain"    :checkDomain();break;
				case "seoTitle"  :checkSeoTitle();break;
				case "seoKeyword":checkSeoKeyword();break;
				case "seoDescn"  :checkSeoDescn();break;
			}
			function checkXss (value,n) {
				if(/eval/g.test(value)) {
					_li.find(".e"+n).html("您输入的内容存在非法字符");
					// return value.replace(/eval/g,"");
					return true;
				}
			};
			/* 检测name内容 */
			function checkName() {
				var xss = checkXss(pageInfo.name,"1");
				if(xss) {
					return false;
				}
				if(pageInfo.name == "") {
					_li.find(".e1").html("请输入网站名称");
				} else {
					_li.find(".e1").html("");
					_ps.modifyonlyPage(USERPAGEID, "", "", "", pageInfo.name, "");
				}
			}

			/* 检测seoTitle内容 */
			function checkSeoTitle() {
				var xss = checkXss(pageInfo.seoTitle,"3");
				if(xss) {
					return false;
				}
				if(pageInfo.seoTitle == "") {
					_li.find(".e3").html("请输入标题");
				} else {
					_li.find(".e3").html("");
					_ps.modifyonlyPage(USERPAGEID, pageInfo.seoTitle, "", "", "", "");
				}
			}
			/* 检测seoKeyword内容 */
			function checkSeoKeyword() {
				var xss = checkXss(pageInfo.seoKeyword,"4");
				if(xss) {
					return false;
				}
				if(pageInfo.seoKeyword == "") {
					_li.find(".e4").html("请输入关键字");
				} else {
					_li.find(".e4").html("");
					_ps.modifyonlyPage(USERPAGEID, "", pageInfo.seoKeyword, "", "", "");
				}
			}
			/* 检测seoDescn内容 */
			function checkSeoDescn() {
				var xss = checkXss(pageInfo.seoDescn,"5");
				if(xss) {
					return false;
				}
				if(pageInfo.seoDescn == "") {
					_li.find(".e5").html("请输入内容描述");
				} else {
					_li.find(".e5").html("");
					_ps.modifyonlyPage(USERPAGEID, "", "", pageInfo.seoDescn, "", "");
				}
			}
			/* 检测domain内容 */
			function checkDomain() {
				/* 待修改 */
				if (pageInfo.domain != '' && type == 'domain') {
					if(pageInfo.domain.match(/^\/.+?\.html$/g)) {
						if(pageInfo.domain.match(/^\/(\d*)?\.html$/g)) {
							$("#wqdPageInfD .e2").html("不能使用纯数字命名");
							return;
						}
						if(/\/[^\/]*\//g.test(pageInfo.domain)) {
							$("#wqdPageInfD .e2").html("不能设置二级路径");
							return;
						}
						var j = 0;
						for(var i in allviewSort) {
							if(allviewSort[i].domain == pageInfo.domain && allviewSort[i].id!=USERPAGEID) {
								j = 1;
								$("#wqdPageInfD .e2").html("链接与其他页面重复");
								break;
							}
							//没有修改
							if(allviewSort[i].domain == pageInfo.domain && allviewSort[i].id==USERPAGEID) {
								j = 2;
								$("#wqdPageInfD .e2").html("");
							}
						}
						if(j == 1) return;
						if(j == 2) return;
						$("#wqdPageInfD .e2").html("");
						_ps.modifyonlyPage(USERPAGEID, "", "", "", "", pageInfo.domain);
						//遍历并进行更改url
						$("#wqdpageContentD ul.pagedeatllist li .facBtn1").each(function() {
							if ($(this).hasClass("on")) {
								$(this).parents("li").attr("data-uri", pageInfo.domain);
							}
						});
						//修改并调用页面上方法，更改导航内值-----有导航时起作用
						$(document).trigger("wqdNavCallback",{category:2, pageids:USERPAGEID, parameter:pageInfo.domain});
					} else {
						$("#wqdPageInfD .e2").html("链接格式有误");
					}
				}
			}
		});
	}
	return pageSetCtrl;
})
