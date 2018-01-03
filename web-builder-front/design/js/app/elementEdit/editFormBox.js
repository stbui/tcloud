define(['elementInfo','popupFormBoxEdit'],function(_ei,popupFormBoxEdit) {
	var formBoxEdit = {};
	formBoxEdit.init = function () {
		this.bindEdit(".wqdelementEdit");
	}

	// 绑定编辑
	formBoxEdit.bindEdit = function (elm) {
		var self = this;
		$(document).on("elmenentEdit",function (e,data) {
			var $node = data.element || $(".wqdelementEdit.onEditing");
			if(!$node.attr("data-elementtype"))  return;
			if($node.attr("data-elementtype").indexOf("form") != -1 ) {
				setTimeout(function(){
					_ei.removeElementEditBtn();
					if($node.attr("data-elementtype") == "form") {//表单容器
						$.ajax({
							url: '../js/app/JSON/designComponentEdit.json',
							type: "GET",
							dataType: "json",
							success: function(json) {
								$.colorbox({
									transition:"none",
									opacity:0.5,
									html:json.edit.formBoxEdit,
									fixed:true,
									closeButton:false,
									onOpen:function(){
										window.scroll_top = $(document).scrollTop();
									},
									onComplete:function(){
										popupFormBoxEdit.formboxInit($node);
									},
									onClosed:function(){
										window.scrollTo(0, window.scroll_top);
									}
								});
							},
							error:function(ele){
							}
						});
					}
					//ajax结束
				},0);
			}
		})
	};
	return formBoxEdit;
});

