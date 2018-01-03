define(['elementInfo','popupFormEdit'],function(_ei,popupFormEdit) {
	var formEditor = {};
	formEditor.init = function () {
		this.bindEdit(".wqdelementEdit");
	}
	// 绑定编辑
	formEditor.bindEdit = function (elm) {
		var self = this;
		$(document).on("elmenentEdit",function (e,data) {
			var $node = data.element || $(".wqdelementEdit.onEditing");
			if(!$node.attr("data-elementtype"))  return;
			if($node.attr("data-elementtype").indexOf("form") != -1 ) {
				setTimeout(function(){
					_ei.removeElementEditBtn();
					if($node.attr("data-elementtype")=="formDate"||$node.attr("data-elementtype")=="formSelect"||$node.attr("data-elementtype")=="formButton"||$node.attr("data-elementtype")=="formCheckbox"||$node.attr("data-elementtype")=="formRadio"||$node.attr("data-elementtype")=="formInput"||$node.attr("data-elementtype")=="formTextarea"){
						window.edit = $node;
					}
					if($node.attr("data-elementtype") == "formInput"||$node.attr("data-elementtype") == "formTextarea") {//输入框
						$.ajax({
							url: '../js/app/JSON/designComponentEdit.json',
							type: "GET",
							dataType: "json",
							success: function(json) {
								$.colorbox({
									transition:"none",
									opacity:0.5,
									html:json.edit.formInputEdit,
									fixed:true,
									closeButton:false,
									onOpen:function(){
										window.scroll_top = $(document).scrollTop();
									},
									onComplete:function(){
										popupFormEdit.formInputInit();
									},
									onClosed:function(){
										window.scrollTo(0, window.scroll_top);
									}
								});

							},
							error:function(ele){
							}
						});
					}else if($node.attr("data-elementtype") == "formCheckbox"||$node.attr("data-elementtype") == "formRadio"){//选择项
						$.ajax({
							url: '../js/app/JSON/designComponentEdit.json',
							type: "GET",
							dataType: "json",
							success: function(json) {
								$.colorbox({
									transition:"none",
									opacity:0.5,
									html:json.edit.formCheckboxEdit,
									fixed:true,
									closeButton:false,
									onOpen:function(){
										window.scroll_top = $(document).scrollTop();
									},
									onComplete:function(){
										popupFormEdit.formCheckboxInit(data);
									},
									onClosed:function(){
										window.scrollTo(0, window.scroll_top);
									}
								});

							}
						});
					}else if($node.attr("data-elementtype") == "formButton"){//按钮
						$.ajax({
							url: '../js/app/JSON/designComponentEdit.json',
							type: "GET",
							dataType: "json",
							success: function(json) {
								$.colorbox({
									transition:"none",
									opacity:0.5,
									html:json.edit.formButtonEdit,
									fixed:true,
									closeButton:false,
									onOpen:function(){
										window.scroll_top = $(document).scrollTop();
									},
									onComplete:function(){
										popupFormEdit.formButtonInit();
									},
									onClosed:function(){
										window.scrollTo(0, window.scroll_top);
									}
								});

							}
						});
					}else if($node.attr("data-elementtype") == "formSelect"){//下拉框
						$.ajax({
							url: '../js/app/JSON/designComponentEdit.json',
							type: "GET",
							dataType: "json",
							success: function(json) {
								$.colorbox({
									transition:"none",
									opacity:0.5,
									html:json.edit.formSelectEdit,
									fixed:true,
									closeButton:false,
									onOpen:function(){
										window.scroll_top = $(document).scrollTop();
									},
									onComplete:function(){
										popupFormEdit.formSelectInit();
									},
									onClosed:function(){
										window.scrollTo(0, window.scroll_top);
									}
								});

							}
						});
					}else if($node.attr("data-elementtype") == "formDate"){//日历
						type="formDateEdit";
						$.ajax({
							url: '../js/app/JSON/designComponentEdit.json',
							type: "GET",
							dataType: "json",
							success: function(json) {
								$.colorbox({
									transition:"none",
									opacity:0.5,
									html:json.edit.formDateEdit,
									fixed:true,
									closeButton:false,
									onOpen:function(){
										window.scroll_top = $(document).scrollTop();
									},
									onComplete:function(){
										popupFormEdit.formDateInit();
									},
									onClosed:function(){
										window.scrollTo(0, window.scroll_top);
									}
								});

							}
						});
					}

					//ajax结束
				},0);
			}
		})
	};

	return formEditor;

});

