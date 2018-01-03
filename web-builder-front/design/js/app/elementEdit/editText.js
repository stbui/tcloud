/*
* @Author:
* @Date:   2015-11-06 13:45:30
* @Last Modified by:   liumingren
* @Last Modified time: 2016-06-12 19:16:20
*/
define(['elementInfo'],function(_ei) {
	var textEditor = {};
	textEditor.init = function () {
		this.bindEdit(".wqdelementEdit");
		// this.eventCloseEditor();
	}
	// 绑定编辑
	textEditor.bindEdit = function (elm) {
		var self = this;
		$(document).on("click texteditor:close",function (e) {
			if($(e.target).closest(".cke_top,.cke_dialog").size()==0 && e.target!=$(".cke_dialog_background_cover")[0] ){
				self.closesummerEditor();
			}

		})
		$(document).on("elmenentEdit",function (e,data) {
			var $node = data.element;
			if($node.attr("data-elementtype") == "text") {
				setTimeout(function(){
					_ei.removeElementEditBtn({toolbar:true});
					self.openEditor($node.find(".wqdelementEditBox"));
				},0);
			}else if($node.attr("wqdEditos") == 0) {
				self.openEditor($node);
			}
		})
	};
	// textEditor.eventCloseEditor = function () {
	// 	var self = this;
	// 	$(document).on("texteditor:close",function (e) {
	// 		self.closesummerEditor();
	// 	})
	// };
	textEditor.getTemplate = function (tempAttr,key) {
		var emptyTextTemplate = {
			"title1":"<h1 class='wqd-text-title1 wqdCkEmptyTextos'>标题文字1</h1>",
			"title2":"<h2 class='wqd-text-title2 wqdCkEmptyTextos'>标题文字2</h2>",
			"title3":"<h3 class='wqd-text-title3 wqdCkEmptyTextos'>标题文字3</h3>",
			"title4":"<h4 class='wqd-text-title4 wqdCkEmptyTextos'>标题文字4</h4>",
			"article1":"<p class='wqd-text-article1 wqdCkEmptyTextos'>正文文本1</p>",
			"article2":"<p class='wqd-text-article2 wqdCkEmptyTextos'>正文文本2</p>",
			"article3":"<p class='wqd-text-article3 wqdCkEmptyTextos'>正文文本3</p>"
		};
		var tempAttr = tempAttr || "";
		if(tempAttr.indexOf("title1") != -1) return key ? "title1" : emptyTextTemplate["title1"];
		if(tempAttr.indexOf("title2") != -1) return key ? "title2" : emptyTextTemplate["title2"];
		if(tempAttr.indexOf("title3") != -1) return key ? "title3" : emptyTextTemplate["title3"];
		if(tempAttr.indexOf("title4") != -1) return key ? "title4" : emptyTextTemplate["title4"];
		if(tempAttr.indexOf("article1") != -1) return key ? "article1" : emptyTextTemplate["article1"];
		if(tempAttr.indexOf("article2") != -1) return key ? "article2" : emptyTextTemplate["article2"];
		if(tempAttr.indexOf("article3") != -1) return key ? "article3" : emptyTextTemplate["article3"];
	};
	// 关闭编辑器
	textEditor.closesummerEditor = function(){
		if(this.ckeditor != null && this.EditingNode!=null){
			if(!CKEDITOR.instances.editoring.getData()){
				var tempAttr = this.EditingNode.attr("data-emptyTextTemplate") || "",
					template = this.getTemplate(tempAttr);
				this.EditingNode.attr('wqdckemptytextos','wqdCkEmptyTextos').css({'visibility':'visible',"height":this.EditingNode[0].style.height})
				  .html(template);
			}else{
				var newnode = CKEDITOR.instances.editoring.getData().replace(/<div/g,'<i').replace(/<\/div/g,'</i');
				this.EditingNode.html(newnode);
				this.EditingNode.find('i').css({'display':'block','font-style':'normal'}).end().css({'visibility':'visible'})
					.find(".wqdCkEmptyTextos").removeClass("wqdCkEmptyTextos");
			}

			this.ckeditor.destroy();
			this.EditingNode = null;
			this.ckeditor = null;
			this.EditingText_align = null;
			$('#summerEditor').remove();
			$(document).trigger("appSetCatch");
		}
	};
	// 加载编辑器
	textEditor.openEditor = function(node){
		this.editBox = {
			top : node.offset().top,
			left: node.offset().left
		}
		var style = "line-height:normal;";

		if(this.EditingNode && this.EditingNode.length){
			this.closesummerEditor();
		}

		this.EditingNode = node;
		var tempAttr = node.attr("data-emptyTextTemplate") || "",template;
		var nodeDefault = tempAttr ? this.getTemplate(tempAttr,true) : this.getTemplate(node.html(),true);//默认文本
		node.removeAttr('wqdCkEmptyTextos').attr("data-emptyTextTemplate",nodeDefault)
			.find('.wqdCkEmptyTextos').text("").removeClass("wqdCkEmptyTextos");

		$("body").append($('<div id="summerEditor"><div id="editoring"></div></div>'));
		$('#summerEditor').css('visibility','hidden');
		if(node.find('i').length){
			$('#editoring').html(node.html().replace(/<i/g,'<div').replace(/<\/i/g,'</div'));
		}else{
			$('#editoring').html(node.html());
		}

		this.ckeditor = CKEDITOR.replace('editoring', {
			fullpage : true,
			allowedContent: true,
			extraPlugins: 'autogrow',
			autoGrow_minHeight: 0,
			autoGrow_maxHeight: 1800,
			// removePlugins: 'resize',
			extraPlugins: 'lineheight',
			height : node.height(),
			toolbar : [
				{ name: 'basicstyles', groups: ['basicstyles'], items: [ 'Bold', 'Italic','Underline' ] },
				{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ], items: [ 'Outdent', 'Indent', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
				{ name: 'links', items: ['Link','Unlink']},
				{ name: 'styles', items: ['Font','Styles','FontSize']},
				{ name: 'colors', items: ['TextColor','BGColor']},
				{ name: 'insert', items: [ 'FontAwesome'] }
			],
			uiColor : '#f6f6f6',
			stylesSet:[
			    { name: '标题1',element: 'h1', attributes: { 'class': 'wqd-text-title1' } },
			    { name: '标题2',element: 'h2', attributes: { 'class': 'wqd-text-title2' } },
			    { name: '标题3',element: 'h3', attributes: { 'class': 'wqd-text-title3' } },
			    { name: '标题4',element: 'h4', attributes: { 'class': 'wqd-text-title4' } },
			    { name: '正文1',element: 'p', attributes: { 'class': 'wqd-text-article1' } },
			    { name: '正文2',element: 'p', attributes: { 'class': 'wqd-text-article2' } },
			    { name: '正文3',element: 'p', attributes: { 'class': 'wqd-text-article3' } },
			]
			// on:{
	  //           wqdApplyStyle: function (evt) {
	  //               console.log(evt)
	  //           }
	  //       }
		});

		var editBox = this.editBox ,cke_left = $(window).width() - this.editBox.left;
		if( cke_left < 690 ){
			cke_left = this.editBox.left - (690 - cke_left);
		}else{
			cke_left = this.editBox.left;
		}

		this.ckeditor.on('instanceReady', function(e){
			var $iframeBody = $('.cke_contents iframe').contents().find("body");
			if($iframeBody.height() <= 100 && node.height() < 98) {
				$iframeBody.css("height",node.height());
			}
			var contentsHeight = node.height() > $iframeBody.outerHeight() ? node.height() : $iframeBody.outerHeight();
			//编辑框样式
			$('.cke_contents').css({
				'position':'absolute',
				'width':node.width(),
				'top':editBox.top,
				'left':editBox.left,
				'z-index':'1001',
				'height': contentsHeight,
				'background':"rgba(255, 255, 255, 0)"
			});
			// 编辑器工具栏样式
			$('.cke_top').css({
				'position':'absolute',
				'top':editBox.top-41,
				'left':cke_left,
				'border':"none",
				'box-shadow': '0 2px 6px 0 rgba(22, 45, 61, 0.55)',
				'z-index':'1002'
			});
			var ckeTopHeight = $('.cke_top').height();
			if(ckeTopHeight > 42) {
				$('.cke_top').css({'top':(editBox.top+ckeTopHeight-42)});
			}
			if ($("#wqdIphonePage").size()) {$iframeBody.addClass("wqdIphoneText")};
			$iframeBody.attr('style',style)
				.css({
					"min-height":contentsHeight-2
				});
			$("#wqdEditBoxos").remove();
			node.css('visibility','hidden');
			$('#summerEditor').css('visibility','visible');

			setTimeout(function(){
				$('.cke_contents').height($('.cke_contents iframe').contents().find("body").height()+2);
			},0);
		});

		this.ckeditor.on('change',function(){
			var h = $('.cke_contents iframe').contents().find("body").height()+5;
			$('.cke_contents').css({'height':(h+1)+'px'});
		});
	}

	return textEditor;

});

