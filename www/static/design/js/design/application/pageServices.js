define(function() {
	var pageServices = {
		'QQarrObj':{
			'code':"",
			'conten':"",
			"openIcon" : "#fff",
			"openTitle" : "#fff",
			"openBg" : "#504f55",
			"defaultBg" : "#676669",
			"openContent" : "#999",
			"defaultIcon" : "#fff"
		},
		userId:USERSITEID,
		//开启客服功能
		'wqdServerBegin' : function(arr) {
			var self = this,
				node="";
			$.ajax({
				url: URLPATH+'design/cs/enable',
				type: 'POST',
				dataType: 'json',
				data: {'siteId':this.userId},
				async:false
			})
			.done(function(data) {
				self.QQarrObj = arr;
				self.yxServiceModuleOpen(arr);
			});
		},
		isOpenQQ:function () {
			var self = this;
			$.ajax({
				url:URLPATH+'design/cs/read',
				type: 'POST',
				dataType: 'json',
				data: {'siteId':this.userId},
				async:false
			})
			.done(function(data) {
				if(data.activeStatus == "on") {
					$(".QQserverCheck").attr("checked","checked");
					self.QQarrObj = data;
					self.yxServiceModuleOpen(self.QQarrObj);
					self.loadStyle();
					var arr = self.QQarrObj;
					arr.conten = self.QQarrObj.remark;
					self.loadCode(arr);
	                $("#wqdShowQQD .serQQ").animate({
	                    'right': "0px"
	                }, 350);
				};
			})
		},
		loadStyle:function () {
			$("#wqdShowQQD").find(".color1[name=openBg]").css("background-color",this.QQarrObj.openBg).end()
			.find(".color1[name=openContent]").css("color",this.QQarrObj.openContent).end()
			.find(".color1[name=openIcon]").css("color",this.QQarrObj.openIcon).end()
			.find(".color1[name=openTitle]").css("color",this.QQarrObj.openTitle).end();
		},
		//关闭客服功能
		'wqdServerClose' : function() {
			var self = this;
			var node="";
			$.ajax({
				url: URLPATH+'design/cs/disable',
				type: 'POST',
				dataType: 'json',
				data: {'siteId':this.userId},
				async:false
			})
			.done(function(data) {
				self.yxServiceModuleClose();
			});
		},
		//服务编辑接口调用
		//arr 对象
		'wqdServerEdit' : function(arr, str) {
			var self = this;
			$.ajax({
				url: URLPATH+'design/cs/edit',
				type: 'POST',
				dataType: 'json',
				data: {
					'siteId':this.userId,
					"code" : arr.code,
					"openIcon" : arr.openIcon,
					"openTitle" : arr.openTitle,
					"remark" : arr.conten,
					"openBg" : arr.openBg,
					"defaultBg" : arr.defaultBg,
					"openContent" : arr.openContent,
					"defaultIcon" : arr.defaultIcon
				},
				async:false
			})
			.done(function() {
				if(str == 10051) {
					//开启客服功能
					ajaxService("POST", "enable", {}, function(data) {
						if(data.status==200){

						}
					});
				}
			});
		},
		loadCode:function(arr) {
			var code1 = arr.code.split(";");
			var conten1= arr.conten.replace(/\n/g,"<br>");
			$("#serverNumber").empty();
			for(i in code1){
				var str='<li>'+code1[i]+'</li>';
				$("#serverNumber").append(str);
			}
			$("#wqdShowQQD .shuoming").html(conten1);
		},
		'yxupdataServer' : function(arr, str) {
			arr = arr || this.QQarrObj;
			//判别是否输入非法字符
			var code = $.trim($(".serset-box .yxtfirst").val());
			if(this.yxcheckQQStr(code)) {return;}
			arr.code = this.yxgetPromptCodeStr(code, "");
			arr.conten = $.trim($(".serset-box textarea.edit[name='detail']").val());

			this.loadCode(arr);
			// var code1 = arr.code.split(";");
			// var conten1= arr.conten.replace(/\n/g,"<br>");
			// $("#serverNumber").empty();
			// for(i in code1){
			// 	var str='<li>'+code1[i]+'</li>';
			// 	$("#serverNumber").append(str);
			// }
			// $("#wqdShowQQD .shuoming").html(conten1);
			arr.conten = arr.conten.replace(/\n/g,"<br>");
			this.wqdServerEdit(arr, str);
			this.QQarrObj = arr;
		},
		/*
		 * 判别是否输入非qq号和";"
		 * param - str表示传入要检测的字符串
		 * auth: yx
		 */
		'yxcheckQQStr' : function(str) {
			if(/[^(\d|;)]/g.test(str)) {
				$('.serset-box').find('p.ts').html('客服QQ号只能由数字及英文";"组成');
				return true;
			} else {
				$('.serset-box').find('p.ts').html('');
				return false;
			}
		},
		/*
		 * 获取推广QQ号和对应的提示语
		 * param - qqCode表示QQ对应的以";"分隔的字符串，qqTitle表示推广提示语
		 * return - 返回对应的推广代码，并以";"分隔
		 * auth: yx
		 */
		'yxgetPromptCodeStr' : function(qqCode, qqTitle) {
			//默认提示语
			var promptTitle = qqTitle || "点击这里给我发消息";
			//默认推广字符串
			var spreadStr = '<a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=;;;&site=qq&menu=yes"><img border="0" src="http://img.wqdian.com/group1/M00/F0/79/yq0KXVYFEkqAC7eWAAASKQ7VabQ251.png" alt=";;;;" title=";;;;"/></a>';
			//qq号数组
			var qqArr = qqCode.split(";");
			//规则还需要修改，如果以';'结尾，可以去掉，但如果中间有两个';'等，就会有问题
			if(qqArr[qqArr.length-1] == "") {
				qqArr.pop();
			}
			//最后生成推广字符串
			var resultStr = "";

			//替换提示语
			spreadStr = spreadStr.replace(/;;;;/g, promptTitle);
			for (var i=0; i<qqArr.length; i++) {
				//替换qq号
				resultStr += spreadStr.replace(/;;;/g, qqArr[i]);
				if(i != qqArr.length-1) {
					resultStr += ";";
				}
			};
			return resultStr;
		},
		/*
		 * 服务功能可编辑开启
		 * auth:yx
		 */
		'yxServiceModuleOpen' : function() {
			$('.serset-box textarea').attr("disabled",false).css({"background":"#fff"});//可编辑
			$('.serset-box input').attr("disabled",false).css({"background":"#fff"});//可编辑
			$(".serset-box .ul-select").removeClass("close");//颜色编辑可用
			$(".serset-box .select-box").removeClass("bee");//为了上下小箭头，可优化
		},
		/*
		 * 服务功能可编辑关闭
		 * auth:yx
		 */
		'yxServiceModuleClose' : function() {
			$('.serset-box textarea').attr("disabled",true).css({"background":"#eee"});//不可编辑
			$('.serset-box input:not(:checkbox)').attr("disabled",true).css({"background":"#eee"});//不可编辑
			$(".serset-box .ul-select").addClass("close");//颜色编辑不可用
			$(".serset-box .select-box").addClass("bee");//为了上下小箭头，可优化
		}
	};

	return pageServices;
});
