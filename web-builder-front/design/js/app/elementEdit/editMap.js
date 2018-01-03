define(['elementInfo'],function(_ei) {
	var mapEditor = {};
	mapEditor.init = function () {
		this.bindEdit(".wqdelementEdit");
	}
	mapEditor.bindEdit = function (elm) {
		var self = this;
		$(document).on("elmenentEdit",function (e,data) {
			var $node = data.element || $(".wqdelementEdit.onEditing");
			if($node.attr("data-elementtype") == "map") {
				setTimeout(function(){
					_ei.removeElementEditBtn();
					window.edit = $node.find(".wqdMapbox");
		        	$.colorbox({
						transition:"none",
						opacity:0.5,
						href:"/design/open/map.html",
						fixed:true,
						closeButton:false,
						onOpen:function(){
							window.scroll_top = $(document).scrollTop();
						},
						onComplete: function() {
							$("#cboxOverlay").addClass("cboxOverlayShow");
						},
						onClosed:function(){
							$("#cboxOverlay").removeClass("cboxOverlayShow");
							$(document).trigger("appSetCatch");
							window.scrollTo(0, window.scroll_top);
						}
					});

				},0);
			}
		})
	};

	return mapEditor;

});

