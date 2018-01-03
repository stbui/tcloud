define(['elementInfo'],function(_ei) {
	var EBSEditor = {};
	EBSEditor.init = function () {
		this.bindEdit(".wqdelementEdit");
	}
	// 绑定编辑
	EBSEditor.bindEdit = function (elm) {
		var self = this;
		$(document).on("elmenentEdit",function (e,data) {
			var $node = data.element || $(".wqdelementEdit.onEditing");
			if($node.attr("data-elementtype") == "EBS") {
				setTimeout(function(){
					_ei.removeElementEditBtn();
				},0);
			}
		})
	};
	
	return EBSEditor;

});

