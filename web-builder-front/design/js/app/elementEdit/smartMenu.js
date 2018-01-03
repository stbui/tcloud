define(function(){
	var $docu = $(document).data("func", {}).data("contexthide", {});
	smartMenu = {};
	smartMenu.smartMenu = function(elm,data, options) {
		var $body = $("body"), defaults = {
			name: "",
			offsetX: 2,
			offsetY: 2,
			textLimit: 6,
			beforeShow: $.noop,
			afterShow: $.noop
		};
		var params = $.extend(defaults, options || {});

		var htmlCreateMenu = function(datum) {
			var dataMenu = datum || data, nameMenu = datum? Math.random().toString(): params.name, htmlMenu = "", htmlCorner = "", clKey = "smart_menu_";
			if ($.isArray(dataMenu) && dataMenu.length) {
				htmlMenu = '<div id="smartMenu_'+ nameMenu +'" class="'+ clKey +'box">' +
								'<div class="'+ clKey +'body">' +
									'<ul class="'+ clKey +'ul">';

				$.each(dataMenu, function(i, arr) {
					if (i) {
						htmlMenu = htmlMenu + '<li class="'+ clKey +'li_separate">&nbsp;</li>';
					}
					if ($.isArray(arr)) {
						$.each(arr, function(j, obj) {
							var text = obj.text, htmlMenuLi = "", strTitle = "", rand = Math.random().toString().replace(".", "");
							if (text) {
								/*if (text.length > params.textLimit) {
									text = text.slice(0, params.textLimit)	+ "…";
									strTitle = ' title="'+ obj.text +'"';
								}*/
								if ($.isArray(obj.data) && obj.data.length) {
									htmlMenuLi = '<li class="'+ clKey +'li" data-hover="true">' + htmlCreateMenu(obj.data) +
										'<a href="javascript:" class="'+ clKey +'a"'+ strTitle +' data-key="'+ rand +'"><i class="'+ clKey +'triangle"></i>'+ text +'</a>' +
									'</li>';
								} else {
									htmlMenuLi = '<li class="'+ clKey +'li">' +
										'<a href="javascript:" class="'+ clKey +'a"'+ strTitle +' data-key="'+ rand +'">'+ text +'</a>' +
									'</li>';
								}

								htmlMenu += htmlMenuLi;

								var objFunc = $docu.data("func"),
									objHide = $docu.data("contexthide");
								objFunc[rand] = obj.func;
								objHide[rand] = obj.nohide;
								$docu.data("func", objFunc);
								$docu.data("contexthide", objHide);
							}
						});
					}
				});

				htmlMenu = htmlMenu + '</ul>' +
									'</div>' +
								'</div>';
			}
			return htmlMenu;
		}, funSmartMenu = function() {
			var idKey = "#smartMenu_", clKey = "smart_menu_", jqueryMenu = $(idKey + params.name);
			if (!jqueryMenu.size()) {
				$("body").append(htmlCreateMenu());
				//事件
				$("body").off("click.context").on("click.context", idKey + params.name +" a" ,function(e) {
				// $(idKey + params.name +" a").bind("click", function() {
					var key = $(this).attr("data-key"),
						callback = $docu.data("func")[key];
					if ($.isFunction(callback)) {
						callback.call($docu.data("trigger"));
					}
					// 是否隐藏
					var isHide = $docu.data("contexthide");
					if(!isHide[key]) smartMenu.hide();
					e.stopPropagation();
					return;
				});
				$(idKey + params.name +" li").each(function() {
					var isHover = $(this).attr("data-hover"), clHover = clKey + "li_hover";

					$(this).hover(function() {
						var jqueryHover = $(this).siblings("." + clHover);
						jqueryHover.removeClass(clHover).children("."+ clKey +"box").hide();
						jqueryHover.children("."+ clKey +"a").removeClass(clKey +"a_hover");

						if (isHover) {
							$(this).addClass(clHover).children("."+ clKey +"box").show();
							$(this).children("."+ clKey +"a").addClass(clKey +"a_hover");
						}

					});

				});
				return $(idKey + params.name);
			}
			return jqueryMenu;
		};
		$(document).on("contextmenu.smartMenu",elm,function (e) {
			//右键点击时候通条最外层添加class
			$(e.target).parents(".yzmoveContent").addClass("yzmoveContentBor").siblings(".yzmoveContent").removeClass("yzmoveContentBor");
			//回调
			if ($.isFunction(params.beforeShow)) {
				var isReturn = params.beforeShow.call(e.target);
				// if(isReturn === false) return false;
			}
			e = e || window.event;
			//阻止冒泡
			e.cancelBubble = true;
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			//隐藏当前上下文菜单，确保页面上一次只有一个上下文菜单
			smartMenu.hide();
			var st = $docu.scrollTop();
			var jqueryMenu = funSmartMenu();
			if (jqueryMenu) {
				jqueryMenu.css({
					display: "block",
					left: e.clientX + params.offsetX,
					top: e.clientY + st + params.offsetY
				});
				$docu.data("target", jqueryMenu);
				$docu.data("trigger", e.target);
				//回调
				if ($.isFunction(params.afterShow)) {
					params.afterShow.call(e.target);
				}
				$(e.target).trigger("smartMenuAfterShow");
				return false;
			}
		})
		if (!$body.data("bind")) {
			$body.on("click.contextmenuHide", function (e) {
				if(!$(e.target).closest('.colorpicker').length) {
					smartMenu.hide();
				};
			}).data("bind", true);
		}
	};
	smartMenu.hide = function() {
		var target = $docu.data("target");
		if (target && target.css("display") === "block") {
			target.hide();
		}
	};
	smartMenu.remove = function() {
		var target = $docu.data("target");
		if (target) {
			target.remove();
		}
	}
	return smartMenu;
});
