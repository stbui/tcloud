// liumingren 2015.10.31

define(['elementInfo','popupEdit'],function(_ei,popupEdit) {
	var SvgEditor = {};
	SvgEditor.init = function () {
		this.bindEdit(".wqdelementEdit");
	}
	// 绑定编辑
	SvgEditor.bindEdit = function (elm) {
		var self = this;
		$(document).on("elmenentEdit",function (e,data) {
			var $node = data.element || $(".wqdelementEdit.onEditing");
			if($node.attr("data-elementtype") == "svg"||$node.attr("data-elementtype") =="line"||$node.attr("data-elementtype") =="freeRect") {
				setTimeout(function(){
					_ei.removeElementEditBtn();
					window.edit = $node;
					$.ajax({
				        url: '../js/app/JSON/designComponentEdit.json',
				        type: "GET",
				        dataType: "json",
				        success: function(json) {
				        	$.colorbox({
								transition:"none",
								opacity:0.5,
								html:json.edit.svg,
								fixed:true,
								closeButton:false,
								onOpen:function(){
									window.scroll_top = $(document).scrollTop();
								},
								onComplete:function(){
									popupEdit.svgInit();
								},
								onClosed:function(){
									window.scrollTo(0, window.scroll_top);
								}
							});
				        },
				        error:function(){
				        	alert("系统错误");
				        }
			    	});

				},0);
			} /*else if($node.attr("data-elementtype") == "line") {
				setTimeout(function(){
					_ei.removeElementEditBtn();
					window.edit = $node;
					$.ajax({
				        url: '../js/app/componentJSON/designComponentEdit.json',
				        type: "GET",
				        dataType: "json",
				        success: function(json) {
				        	$.colorbox({
								transition:"none",
								opacity:0.5,
								html:json.edit.svg,
								fixed:true,
								closeButton:false,
								onOpen:function(){
									window.scroll_top = $(document).scrollTop();
								},
								onComplete:function(){
									popupEdit.svgInit();
								},
								onClosed:function(){
									window.scrollTo(0, window.scroll_top);
								}
							});
				        }
			    	});

				},0);
			}*/
		})
	};

	return SvgEditor;

});

