/*
* @Author: liumingren
* @Date:   2016-01-18 11:06:26
* @Last Modified by:   liumingren
* @Last Modified time: 2016-06-06 10:59:50
*/
define(['elementInfo','app/article/articleDetails','popupEdit','createColorStyle'],function(_ei, ad,_pe,_css) {
	var articleEditor = {};
	articleEditor.init = function () {
		this.bindEdit(".wqdelementEdit");
	};
	// 绑定编辑
	articleEditor.bindEdit = function (elm) {
		var self = this;
		$(document).on("elmenentEdit",function (e,data) {
			var $node = data.element;
			if($node.attr("data-elementtype") == "articleDetails") {
				ad.element = articleEditor.element = $node;
				setTimeout(function(){
					_ei.removeElementEditBtn();
					//获取编辑器内容并打开
					$.getJSON('../js/app/JSON/component/designArticleDetailsEditor.json', function(json, textStatus) {
						self.setColorBox(getTempalte(json.json[0]), $node);
					});
				},0);
			}
		})
	};

	articleEditor.setUI = function () {
		var $elem = this.element,
			$this = $(".articleDetailsEditor"),
			$tabCont = $this.find(".common_content");
		// 样式页 checkbox的选中状态
		$tabCont.eq(0).find(".edit_gcheckbox ul li").filter(function(index) {
			var type = $(this).attr("type");
			return !$elem.find("."+ad.mdList[type]).hasClass('artdetlHide');
		}).children("span").addClass("on");

		//回显样式
		var setBaseStyle = function (tabNum,$node) {
			var color = [$node.css("color")],
				fontFamily = $node.css("fontFamily")||"",
				fontSize = $node.css("fontSize")||"",
				$boxNode = $tabCont.eq(tabNum),
				colorSelector = ".art-color";

			if(tabNum == 4) {
				color = [$node.parents(".artDetlFollow").css("color")];
			}
        	if(tabNum == 7) {//分享按钮颜色
        		color[0] = $node.find("svg path").eq(0).attr("fill");
        		colorSelector = ".art-share-color";
        	}
        	if(tabNum == 2 || tabNum == 7) {
        		var elemType = {2:"data-timetype",7:"data-sharetype"}[tabNum],
        			classType = {2:".art-timeType",7:".art-shareStyle"}[tabNum],
        			textType;
        		var sIndex = $node.attr(elemType) || "1";
        		tabNum == 7 ? textType = "图标样式"+sIndex :
        			textType = sIndex != 4 ? ["yyyy","MM","dd"].join(["-","/","."][sIndex-1]) :
        						"yyyy" + "年" + "MM" + "月" + "dd" + "日";
        		$boxNode.find(classType+" ul li").eq(sIndex-1).addClass("on").siblings().removeClass("on")
        			.parents(".edit_select").find("p span").text(textType);
        	}
        	if(tabNum == 5) {//摘要
        		colorSelector += ",.art-background";
        		color[color.length] = $node.parents(".wqdelementEdit").eq(0).css("background-color");
        	}
			var hoverColor = $node.parents(".artDetlFollow,.artDetlShare").attr("data-hover-color");
			if(hoverColor) {
				colorSelector += $node.parents(".artDetlFollow").length ? ",.art-hover-color" : ",.art-share-hovercolor";
				color[color.length] = hoverColor;
			}

			// 设置颜色选择器
			$boxNode.find(colorSelector).each(function (i,_) {
				$(this).find(".art-input").val(color[i]).end()
					.find(".art-i").css('background', color[i]);
			});

			fontFamily = fontFamily.indexOf(",") != -1 ? fontFamily.split(",")[0] : fontFamily;
			$boxNode.find(".art-fontFamily > p > span").text(fontFamily.replace(/\"/g,"")).end()
				.find(".art-font-size").val( Math.round(parseFloat(fontSize)) );

			var isbold = $node.css("fontWeight") == "700" || $node.css("font-weight") == "bold" ? true : false;
            var isitalic = $node.css("fontStyle") == "italic" ? true : false;
			isbold && $boxNode.find(".art-font-weight").addClass("on");
        	isitalic && $boxNode.find(".art-font-style").addClass("on");
		};

		// 标题页 的默认值
		setBaseStyle(1,$elem.find(".artDetlTitle .wqdelementEditBox").children());
		// 时间
		setBaseStyle(2,$elem.find(".artDetlTime .wqdelementEditBox").children());
		// 来源
		// setBaseStyle(3,$elem.find(".artDetlSource .wqdelementEditBox").children());
		// 作者
		// setBaseStyle(4,$elem.find(".artDetlAuthor .wqdelementEditBox").children());
		// 查看量
		setBaseStyle(3,$elem.find(".artDetlViewcount .wqdelementEditBox").children("span"));
		// 点赞量
		setBaseStyle(4,$elem.find(".artDetlFollow .wqdelementEditBox").children("span"));
		// 摘要
		setBaseStyle(5,$elem.find(".artDetlSummary .wqdelementEditBox").children());
		// 内容
		setBaseStyle(6,$elem.find(".artDetlContent .wqdelementEditBox"));
		// 面包屑
		// setBaseStyle(7,$elem.find(".artDetlBreadcrumb .wqdelementEditBox").children());
		// 分享
		setBaseStyle(7,$elem.find(".artDetlShare .wqdelementEditBox").children());
	};

	articleEditor.setSelectValue = function ($this) {
		var dfd = $.Deferred();
		$this.addClass("on").siblings().removeClass("on").end()
		.parents(".edit_select").find(">p span").html($this.find("span").html()); //赋值给下拉显示
		var $selectBox = $this.parents(".edit_selectBox");
		if($selectBox.attr("data-fonttype") ) {
			changeFont($this,$selectBox.attr("data-fontType"));
			dfd.resolve();
		} else if($selectBox.attr("data-sharetype")) {
			dfd = changeShareStyle($this, +$this.index()+1, dfd);
		} else if($selectBox.attr("data-timetype")) {
			changeTimeType($this,+$this.index());
			dfd.resolve();
		}
		$this.parents("ul").eq(0).hide();
		$.when(dfd).done(function () {
			$(document).trigger("appSetCatch");
		});
	}
	articleEditor.bindEvent = function () {
		var self = this;
		$(".articleDetailsEditor").off(".artDetl")
		.on("click.artDetl", ".edit_search ul li", function() {//tab列表切换
			self.changeTab($(this));
		})
		.on("click.artDetl", ".edit_navBox ol.nav li", function() {//左侧列表切换
			$(this).addClass("on").siblings().removeClass("on").end()
			.parents(".edit_navBox").next("ul.editDetail").children("li").eq( $(this).index() ).addClass("on").siblings().removeClass("on");
		})
		.on("click.artDetl", ".edit_selectBox p", function() {//下拉选择
			$(this).toggleClass("on").next("ul").toggle();
		})
		.on("click.artDetl", ".edit_selectBox li", function() {
			self.setSelectValue($(this));
			$(this).parents(".edit_selectBox").find("p").removeClass("on");
		})
		.on("click.artDetl", ".edit_gcheckbox ul li:not(.title,.content) span", function() {//复选按钮
			ad.showNode({
				type:[$(this).toggleClass("on").parent("li").attr("type"),true]
			});
			$(document).trigger("appSetCatch");
		})
		.on("changeColor.artDetl", ".wqdColorPicker",function(e) {//更改颜色
			changeColor($(this));
			$(document).trigger("appSetCatch");
		})
		.on("keydown.artDetl",".edit_fontbox input",function(e){//修改字体大小
			var fontSize = $(this).val();
			if(e.keyCode == 38){
				$(this).val(++fontSize);
			}else if(e.keyCode == 40){
				$(this).val(--fontSize);
			} else if(e.keyCode == 13) {
				$(this).blur();
			}
		})
		.find(".edit_fontbox input").on("blur.artDetl",function(){
			var val = $(this).val().replace(/[^0-9]/g,"");
			if(val < 12) val = 12;
			$(this).val(val);
			changeFont($(this),"fontSize");
			$(document).trigger("appSetCatch");
		})
		.on("input.artDetl",function(e){
			var val = $(this).val().replace(/[^0-9]/g,"");
			$(this).val(val);
		}).end()
		.on("click.artDetl", ".edit_fontbox em", function() {//字体加粗 倾斜
			var self = $(this), value = "";
			if(self.hasClass("on")) {
				self.removeClass("on");
				value = "normal";
			} else {
				self.addClass("on");
				value = self.index() == 2 ? "700" : "italic";
			}
			changeFont($(this),self.index() == 2 ? "fontWeight" : "fontStyle",value);
			$(document).trigger("appSetCatch");
		})
		.find(".breadcrumbInp").on("blur.artDetl",function(){//修改面包屑
			ad.setBreadcrumb($(this).parents(".edit_inputBox").attr("data-dept"),$(this).val());
			$(document).trigger("appSetCatch");
		});
	};

	articleEditor.changeTab = function ($node) {
		$node.addClass("on").siblings().removeClass("on").end()
			.parents(".edit_search").next(".edit_content").children(".common_content").eq($node.index()).removeClass("hidden").siblings().addClass("hidden");
	};

	function changeColor ($colorInput) {
		var $cont = $colorInput.parents(".common_content").eq(0),
			color = $colorInput.val(),
			css   = {
				elemClass:ad.mdList[$cont.attr('data-artdeltype')]
			};
		$colorInput.parents(".art-hover-color").length ? css.hoverColor = color :
		$colorInput.parents(".art-share-color").length ? css.shareColor = color :
		$colorInput.parents(".art-background").length ? css.backgroundColor = color :
		$colorInput.parents(".art-share-hovercolor").length	? css.shareHoverColor = color : css.color = color;

		ad.setCss(css);
		$colorInput.prev("span").find("i").css({"background":color});
	}

	function changeFont ($node,type,value) {
		var $cont = $node.parents(".common_content").eq(0),
			data = {
				elemClass:ad.mdList[$cont.attr('data-artdeltype')]
			};
		switch(type) {
			case "fontFamily" :
				data[type] = $node.children("span").text();break;
			case "fontSize" :
				data[type] = $node.val()+"px";break;
			default :
				data[type] = value;break;
 		}
		ad.setCss(data);
	}

	function changeShareStyle ($node,num,dfd) {
		var data = {
				elemClass:ad.mdList["share"],
				type:"share"+num
			};
		return ad.toggleShareStyle(data,dfd);
	}

	function changeTimeType ($node,num) {
		var data = {
				elemClass:ad.mdList["time"],
				type:+num
			};
		return ad.setTimeType(data);
	}

	function getTempalte(json) {
		var html  = '<div class="wqdEditBox articleDetailsEditor articleSet">' +
				 	json.header +
				 	json.search +
				 	"<div class='edit_content edit_contentbox'>";
			for (var i = 0; i < json.content.length; i++) {
				html += json.content[i];
			}
			html += "</div></div>";
		return html;
	}

	articleEditor.setColorBox = function(html, $node) {
		var self = this;
		$.colorbox({
			transition:"none",
			opacity:0.5,
			html:html,
			fixed:true,
			closeButton:false,
			onOpen:function(){
				window.scroll_top = $(document).scrollTop();
			},
			onComplete:function(){
				self.setUI();
				self.bindEvent();
				_pe.commonInit();
			},
			onClosed:function(){
			}
		});
	};

	return articleEditor;

});

