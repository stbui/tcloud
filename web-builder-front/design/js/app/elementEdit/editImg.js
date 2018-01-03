// liumingren 2015.10.31

define(['elementInfo','popupImgEdit'],function(_ei,popupImgEdit) {
	var imgEditor = {};
	imgEditor.init = function () {
		this.bindEdit(".wqdelementEdit");
	}
	// 绑定编辑
//	imgEditor.bindEdit = function (elm) {
//		var self = this;
//		$(document).on("elmenentEdit",function (e,data) {
//			var $node = data.element || $(".wqdelementEdit.onEditing");
//			if($node.attr("data-elementtype") == "img") {
//				setTimeout(function(){
//					_ei.removeElementEditBtn();
//					window.edit = $node;
//					window.editPath = 1;	//图库入口1
//					$.colorbox({
//						transition:"none",
//						href:"/user/gallery/browse.html",
//						fixed:true,
//						closeButton:false,
//						onOpen:function(){
//							window.scroll_top = $(document).scrollTop();
//						},
//						onClosed:function(){
//							window.scrollTo(0, window.scroll_top);
//							$(document).trigger("appSetCatch");
//						}
//					});
//				},0);
//			}
//		})
//	};
	imgEditor.bindEdit = function (elm) {
		var self = this;
		$(document).on("elmenentEdit",function (e,data) {
			var $node = data.element || $(".wqdelementEdit.onEditing");
			if($node.attr("data-elementtype") == "img") {
				setTimeout(function(){
					_ei.removeElementEditBtn();
					window.edit = $node;
					//window.editPath = 1;
					$.ajax({
				        url: '../js/app/JSON/designComponentEdit.json',
				        type: "GET",
				        dataType: "json",
				        success: function(json) {
				        	$.colorbox({
								transition:"none",
								opacity:0.5,
								html:json.edit.editImg,
								fixed:true,
								closeButton:false,

								onOpen:function(){
									window.scroll_top = $(document).scrollTop();
								},
								onComplete:function(){
									popupImgEdit.editImgInit();
								},
								onClosed:function(){
									window.scrollTo(0, window.scroll_top);
									$(document).trigger("appSetCatch");
									$(".tool-list2").removeClass("on");
								}
							});
				        }
			    	});
				},0);
			}
		})
	};
	return imgEditor;
});

