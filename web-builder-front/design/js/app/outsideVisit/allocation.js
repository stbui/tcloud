$(function(){
	//色系编辑器boole:true为编辑器内调用，false为生成页面调用，
	$.fn.colorSetting = function(boole,element,category) {
		if(boole){
			switch(category){
				case '1':
					var bg_color = element.attr("wqdBgColoros") || "";
					if(bg_color && element.hasClass("wqdElBgcoloros")){
						element.css("background-color",bg_color);
						element.css("background-image","none");
					}
					break;
				case '2':
					var fore_color = element.attr("wqdForeColoros") || "";
					if(fore_color){
						element.find(".wqdForeColoros").css("background-color",fore_color);
						element.find(".wqdForeColoros").css("background-image","none");
						element.find(".wqdForeColoros").each(function(){
							if($(this).attr("wqdBeforeBgcoloros")) $(this).attr("wqdBeforeBgcoloros",fore_color);
							if($(this).attr("wqdChildBgcoloros")) $(this).attr("wqdChildBgcoloros",fore_color);
						});
					}
					break;

				case '3':
					var icon_color = element.attr("wqdIconColoros") || "";
					if(icon_color){
						element.find(".wqdIconColoros").css("color",icon_color);
						element.find(".wqdIconColoros").each(function(){
							if($(this).attr("wqdBeforeColoros")) $(this).attr("wqdBeforeColoros",icon_color);
							if($(this).attr("wqdChildColoros")) $(this).attr("wqdChildColoros",icon_color);
						});
					}
					break;
				case '4':
					var icon_bgcolor = element.attr("wqdIconBgcoloros") || "";
					if(icon_bgcolor){
						element.find(".wqdIconBgcoloros").css("background-color",icon_bgcolor);
						element.find(".wqdIconBgcoloros").each(function(){
							if($(this).attr("wqdBeforeBgcoloros")) $(this).attr("wqdBeforeBgcoloros",icon_bgcolor);
							if($(this).attr("wqdChildBgcoloros")) $(this).attr("wqdChildBgcoloros",icon_bgcolor);
						});
					}
					break;
				case '5':
					var btn_color = element.attr("wqdBtnColoros") || "";
					if(btn_color){
						element.find(".wqdBtnColoros").css("background-color",btn_color);
						element.find(".wqdBtnColoros").each(function(){
							if($(this).attr("wqdBeforeBgcoloros")) $(this).attr("wqdBeforeBgcoloros",btn_color);
							if($(this).attr("wqdChildBgcoloros")) $(this).attr("wqdChildBgcoloros",btn_color);
						});
					}
					break;
				case '6':
					var border_color = element.attr("wqdBorderColoros") || "";
					if(border_color){
						element.find(".wqdBorderColoros").css("border-color",border_color);
					}
					break;
				case '8':
					var area_color = element.attr("wqdAreaColoros") || "";
					if(area_color){
						element.find(".wqdAreaColoros").css("background-color",area_color);
						element.find(".wqdAreaColoros").css("background-image","none");
						/*element.find(".wqdAreaColoros").each(function(){
							if($(this).attr("wqdBeforeBgcoloros")) $(this).attr("wqdBeforeBgcoloros",fore_color);
							if($(this).attr("wqdChildBgcoloros")) $(this).attr("wqdChildBgcoloros",fore_color);
						});*/
					}
					break;
				default:
					break;
			}
			var hover_color = element.attr("wqdHoverColoros") || "",
				HoverTextcoloros =  element.attr("wqdhovertextcoloros") || "";
			if(hover_color || HoverTextcoloros){
				if(element.find(".wqdChangeBgcoloros, .wqdChangeColoros, .wqdChangeTextcoloros").parent(".active").length){
					if(hover_color){
						element.find(".active>.wqdChangeBgcoloros").css("background-color",hover_color);
						element.find(".active>.wqdChangeColoros").css("color",hover_color);
					}
					if(HoverTextcoloros){
						element.find(".active>.wqdChangeTextcoloros").css("color",HoverTextcoloros);
					}

				}
				if(element.find(".active.wqdChangeBgcoloros, .active.wqdChangeColoros, .active.wqdChangeTextcoloros").length){
					if(hover_color){
						element.find(".active.wqdChangeBgcoloros").css("background-color",hover_color);
						element.find(".active.wqdChangeColoros").css("color",hover_color);
					}
					if(HoverTextcoloros){
						element.find(".active.wqdChangeTextcoloros").css("color",HoverTextcoloros);
					}
				}
				element.find(".wqdElHoveros").off("mouseenter").off("mouseleave");
				element.find(".wqdElHoveros").on("mouseenter",function(){
					var that = $(this);
					if(hover_color){
						if(that.hasClass("wqdChangeBgcoloros")) that.css("background-color",hover_color);
						if(that.hasClass("wqdChangeColoros")) that.css("color",hover_color);
						if(that.find(".wqdChildBgcoloros").length!=0) that.find(".wqdChildBgcoloros").css("background-color",hover_color);
						if(that.find(".wqdChildColoros").length!=0) that.find(".wqdChildColoros").css("color",hover_color);
					}
					if(HoverTextcoloros){
						if(that.hasClass("wqdChangeTextcoloros")) that.css("color",HoverTextcoloros);
					}
				}).on("mouseleave",function(){
					var that = $(this);
					if(hover_color){
						if(that.hasClass("wqdChangeBgcoloros")) that.css("background-color",that.attr("wqdBeforeBgcoloros"));
						if(that.hasClass("wqdChangeColoros")) that.css("color",that.attr("wqdBeforeColoros"));
						if(that.find(".wqdChildBgcoloros").length!=0) that.find(".wqdChildBgcoloros").css("background-color",that.find(".wqdChildBgcoloros").attr("wqdChildBgcoloros"));
						if(that.find(".wqdChildColoros").length!=0) that.find(".wqdChildColoros").css("color",that.find(".wqdChildColoros").attr("wqdChildColoros"));
					}
					if(HoverTextcoloros){
						if(that.hasClass("wqdChangeTextcoloros")) that.css("color",that.attr("wqdBeforeTextcoloros"));
					}

				});
			}
		}else{
			$(".wqdBkEditos").each(function(){
				var hover_color = $(this).attr("wqdHoverColoros") || "",
					HoverTextcoloros =  $(this).attr("wqdhovertextcoloros") || "";
				if(hover_color || HoverTextcoloros){
					$(this).find(".wqdElHoveros").off("mouseenter").off("mouseleave");
					$(this).find(".wqdElHoveros").on("mouseenter",function(){
						var that = $(this);
						if(hover_color){
							if(that.hasClass("wqdChangeBgcoloros")) that.css("background-color",hover_color);
							if(that.hasClass("wqdChangeColoros")) that.css("color",hover_color);
							if(that.find(".wqdChildBgcoloros").length!=0) that.find(".wqdChildBgcoloros").css("background-color",hover_color);
							if(that.find(".wqdChildColoros").length!=0) that.find(".wqdChildColoros").css("color",hover_color);
						}
						if(HoverTextcoloros){
							if(that.hasClass("wqdChangeTextcoloros")) that.css("color",HoverTextcoloros);
						}

					}).on("mouseleave",function(){
						var that = $(this);
						if(hover_color){
							if(that.hasClass("wqdChangeBgcoloros")) that.css("background-color",that.attr("wqdBeforeBgcoloros"));
							if(that.hasClass("wqdChangeColoros")) that.css("color",that.attr("wqdBeforeColoros"));
							if(that.find(".wqdChildBgcoloros").length!=0) that.find(".wqdChildBgcoloros").css("background-color",that.find(".wqdChildBgcoloros").attr("wqdChildBgcoloros"));
							if(that.find(".wqdChildColoros").length!=0) that.find(".wqdChildColoros").css("color",that.find(".wqdChildColoros").attr("wqdChildColoros"));
						}
						if(HoverTextcoloros){
							if(that.hasClass("wqdChangeTextcoloros")) that.css("color",that.attr("wqdBeforeTextcoloros"));
						}

					});
				}
			});
		}
		return this;
	};
	$(document).on("domInit",function(){
		$.fn.colorSetting(false);
	});
	$.fn.colorSetting(false);
	//定义出现在可是区域的函数
	$.fn.unveil = function(callback1,callback2) {
        var $w = $(window), elements = this;
        elements.one("unveil", function(e,boole) {
            if (typeof callback1 === "function") {
                callback1.call(this);
            }
            /*
            else if(typeof callback2 === "function" && $(this).attr("status")=="on" && !boole){
            	callback2.call(this);
            }*/
        });
        function unveil() {
            var inview = elements.filter(function() {
                var $e = $(this), wt = $w.scrollTop(), wb = wt + $w.height(), et = $e.offset().top, eb = et + $e.height();
                return eb >= wt && et <= wb
            });
            inview.trigger("unveil",true);
            //var outview = elements.not(inview);
        	//outview.trigger("unveil",false);
        }
        $w.bind("scroll", function() {
            unveil();
        });
        $w.bind("resize", function() {
            unveil();
        });
        $(document).ready(function(){
        	 unveil();
        });
        return this;
    };
});

$(function(){

	//设置cookie
	function setCookie(keyOfCookie, value, expireDays){
		var date=new Date();
		if (!expireDays) {
			//expireDays = 24*60*60*1000;
			expireDays = 5*60*1000;
			//expireDays = 5*1000;
		}
		date.setTime(date.getTime()+expireDays);
		document.cookie = keyOfCookie + "=" + escape(value)+";expires="+date.toGMTString()+";path=/";
	}

	//获取cookie
	function getCookie(name){
		var strCookie=document.cookie;
		var arrCookie=strCookie.split("; ");
		for(var i=0;i<arrCookie.length;i++){
			var arr=arrCookie[i].split("=");
			if(arr[0]==name) {
				return arr[1];
			}
		}
		return "";
	}



	if( !$('HTMLDATA').length ){

		//预览发布以后 表单内的 select切换
		$('.wqdDropDownMenuos li').click(function(){
			var node = $(this).parents('div.dropdown').find('button').find('span').eq(0);
			var beforevalue = node.text();
			node.attr('beforevalue',beforevalue).text( $(this).find('a').text() );
		});


		// 非编辑模式下的表单提交
		$('.wqdFromSubmitos').click(function(){
			var that = $(this);
			if( window.location.host.match(/p.wqdian/gi) ){
				return false;
			}
			if($(this).find('span').text()=='提交成功'){
				return false;
			}

			$(this).parents('.yzmoveContent').find('.checkbox_radio[from_submited]').removeAttr('from_submited');

			$(this).parent().find('div.wqdfromnullos').remove();

			var obj = $(this).parents('div.yzmoveContent').find('.wqdFormAreaos');
			var name =  $(this).parents('div.yzmoveContent').find('.wqdFromTitleos').text().substr(0,32) || '表单';
			var sectionId = $(this).parents('div.yzmoveContent').find('div').eq(0).attr('partid');

			var a = name.split('') ,b=0;
			for(var i=0;i<a.length;i++){
			  (a[i].charCodeAt() > 255) ? (b = b+2) : ++b;
			}


		var bigMap = {} ,notnull = [];

			obj.find('.wqdAppFromos').each(function(index){
				var map = {};
				if($(this).get(0).tagName.toLowerCase()=='input' || $(this).get(0).tagName.toLowerCase()=='textarea'){
					var key =  $(this).attr('placeholder').replace(/\*\s+/g,'');
					var val = $(this).val() || '';

					if(val=='' && $(this).attr('fsubmit')=='need'){
						notnull.push($(this));
					}

						map[key] = val.replace(/\n/g,'<br/>');
						bigMap['form'+index] = map;
				}

				if( $(this).attr('type')=='select' ){
					var selectnode = $(this).find('button.dropdown-toggle').find('span:not(.caret)');
					var key = selectnode.attr('beforevalue') || selectnode.text();
					var val = selectnode.text() || '';
					key = key.replace(/\*\s+/g,'');

					if($(this).attr('fsubmit')=='need'){
						if(key == val.replace(/\*\s+/g,'') ){
							notnull.push($(this));
						}
					}

					if(key==val){
						val = '';
					}
					map[key] = val.replace(/\n/g,'<br/>');
					bigMap['form'+index] = map;
				}


				if( $(this).find('div.checkbox').length || $(this).find('div.radio').length ){
					var cr = $(this).parents('.checkbox_radio');

					if( cr.attr('from_submited')== void 0 ){
						cr.attr('from_submited','from_submited');
						var key = cr.find('div.wqdCheckboxRadioDetailos').text();
						var val = [];
						cr.find('input:checked').each(function(){
							val.push( ($(this).next('span').text() || '').replace(/\n/g,'<br/>') );
						});

						if(!val.length && $(this).parents('.checkbox_radio').attr('fsubmit')=='need'){
							notnull.push($(this));
						}

						map[key] = val;
						bigMap['form'+index] = map;
					}
				}

			})

			var parames =  JSON.stringify(bigMap);

			if(notnull.length){
				$(this).after($('<div class="wqdfromnullos">请确认填写完整后提交</div>'));
				return false;
			}

			if(getCookie(sectionId) == 'yes'){
				$(this).after($('<div class="wqdfromnullos">您的操作太频繁了，请5分钟之后再提交</div>'));
				return false;
			}

			$('.checkbox_radio').removeAttr('from_submited');

			$.ajax({
				url: '/fixed/form/submitForm',
				dateType:'json',
				type:'post',
				data : {'name':name,'sectionId':sectionId,'value':parames},
				success:function(data, status) {
					if(data.status==200){
						var text = that.text();
						that.text('提交成功');
						setCookie(sectionId,'yes');
						setTimeout(function(){   that.text(text)  },1000);
					}
					bigMap = {};
				},
				error : function(){
					bigMap = {};
				}
			});
		})
	}
});

$(function(){
	if(!$('#HTMLDATA').length){
		$('.wqdtableTouchos').each(function(){
			$(this).width($(window).width());
		});
	}

	//导航编辑手机适配
	var devicesWidth = $(".wqdIphoneView").length ? true : false;
	if(devicesWidth){
		if($('#HTMLDATA').length){
			$(document).on("domInit",function(){
				navAutoFit();
			});
		}else{
			navAutoFit();
		}
	}
	function navAutoFit(){
		$(".wqdLogoBoxos").each(function(){
			var obj = $(this).parents(".wqdBkEditos");
			if(obj.find(".wqdLogoLeftos").length) return true;
			obj.find(".navbar").removeClass("wqdNavCenteros wqdNavBottomos").addClass("wqdNavRightos").parent().prepend('<div class="wqdLogoLeftos"></div>');
			obj.find(".wqdLogoLeftos").append($(this).clone());
			obj.find(".navbar-nav li.wqdLogoCenteros").addClass("hide").html("");
			obj.find(".wqdLogoTopos").remove();
		});
	}
	//屏幕选择刷新
	$(window).on("orientationchange",function() {
		location.reload();
	});
});

//在线客服代码 begin
$(function(){
	var url="";
	var isEditPage = $('#HTMLDATA').length>0;/* 判断是否为编辑环境  */
	// console.log("init-----")
	if(isEditPage){
		url = URLPATH+'api/read?siteId='+USERSITEID;
	}else{
		url="api/read";
	}
	// debug
	url = 'http://127.0.0.1:3000/site/read';
	$.ajax({ //读取客服代码。 get/post 无参数
		type: "GET",
		url: url,
		dataType: "json",
		success:function(data){
					// console.log("生产环境下----"+JSON.stringify(data));
			// console.log("读取 收到的数据3333333====="+JSON.stringify(data));
			if(data.activeStatus == "on"){//使用客服
				if(isEditPage){//生产环境下
					// console.log(data);
					dataShow(data,true);//展现数据
					//在手机端
					if($("#wqdIphoneContainer").length) {
						changeQQPos();
					}
				}
				if(!isEditPage){//发布后
					serverChange(data);
				}
			}
			if(data.activeStatus == "off" && isEditPage){
				dataShow(data,false);//展现数据
			}
		},
		error:function(e) {
			// console.log(JSON.stringify(e)+"sssssssssssss");
		}
	});
	function dataShow(data,boole){
		//生产环境下 1.改变颜色，2.选中，3.展示代码
		var colorArr=[];
		var code1= data.code.split(";");
		var conten1=data.remark.replace(/<br>/g,'\n');
		colorArr.push(data.defaultBg);
		colorArr.push(data.defaultIcon);
		colorArr.push(data.openBg);
		colorArr.push(data.openIcon);
		colorArr.push(data.openTitle);
		colorArr.push(data.openContent);
		colorChange(data);
		//记录上次改变的颜色值
		colorSetChange(data);
		if(boole){
			$("#wqdpServerD .ser-select span").addClass('on');
			$('#wqdpServerD textarea').attr("disabled",false).css({"background":"#fff"});//可编辑
			$('#wqdpServerD input.promptTitle').attr("disabled",false).css({"background":"#fff"});//可编辑
			// $("#wqdShowQQD .serQQ").animate({'right':"0px"},350);
			$("#wqdpServerD .ul-select").removeClass("close");//颜色编辑可用
			$("#wqdpServerD .select-box").removeClass("bee");//为了上下小箭头，可优化
		}else{
		}
		if (data.code.match(/uin=[\d]*/g) != null) {
			$("#wqdpServerD textarea.edit[name='code']").val(data.code.match(/uin=[\d]*/g).join(";").replace(/uin=/g, ""));
			$("#wqdpServerD input[name='qqTitle']").val(data.code.match(/alt="[^"]*/)[0].substr(5));
		};

		$("#wqdpServerD textarea.edit[name='detail']").val(conten1);
		$("#wqdpServerD .ul-select input").each(function(index){
			$(this).attr("value", colorArr[index]);
		})
		$("#serverNumber").empty();
		for(i in code1){
			var str='';
			var str='<li>'+code1[i]+'</li>';
			$("#serverNumber").append(str);
		}
		$("#wqdShowQQD .shuoming").html(data.remark);
	}
	function serverChange(data){//渲染页面

		var html = "";
		var code1= data.code.split(";");
		var str='';
		var conten=data.remark.replace(/\\\\n/g,"<br>");
		for(i in code1){
			str +='<li>'+code1[i]+'</li>';
		}
		//判别生成环境，测试环境，发布环境
		var yxdd = getURLStr("model");
		//console.log($('body #server')+"------"+yxdd);
		var sss = "right:0px;";
		if(yxdd == "pad") {
			sss = "right:97px";
		} else if(yxdd == "phone") {
			sss = "right:27px";
		}
		html += '<div id="wqdShowQQD"><div class="serQQ color1" style="'+sss+'" name="defBg">';
		html += '<div class="fa fa-phone color1" name="defIcon"></div>';
		html += '</div>';
		html += '<div class="serShow color1" name="openBg">';
		html += '<div class="header">';
		html += '<div class="fa fa-phone color1" name="openIcon"></div>';
		html += '<span class="color1" name="openTitle">客户服务</span>';
		html += '</div>';
		html += '<div class="down">';
		html += '<ul id="serverNumber">';
		html += str;
		html += '</ul>';
		html += '<div class="shuoming color1" name="openContent">';
		html += conten;
		html += '</div>';
		html += '</div>';
		html += '</div></div>';
		$('body').prepend(html);
		colorChange(data);
		$("#wqdShowQQD .serQQ").hover(function(){
			$("#wqdShowQQD .serShow").removeClass('noshow').addClass('ifshow');
			if($(window).width() < 991) {
				$("body").addClass("wqdzzServer");
				//点击任何地方--都要收起客服(ipad和iPhone)
				$(".wqdzzServer").on("click", function() {
					if($(this).hasClass("on")) {
						$("#wqdShowQQD .serShow").removeClass('ifshow').addClass('noshow');
						$(".wqdzzServer").off("click");
						$("body").removeClass("wqdzzServer on");
					} else {
						$(this).addClass("on");
					}
				});
			}
		}, function(){
		})
		$("#wqdShowQQD .serShow").hover(function(){
		}, function(){
			$("#wqdShowQQD .serShow").removeClass('ifshow').addClass('noshow');
		})
	}
	function colorChange(data){
		$("#wqdShowQQD .color1[name=defBg]").css("background-color",data.defaultBg);
		$("#wqdShowQQD .color1[name=defIcon]").css("color",data.defaultIcon);
		$("#wqdShowQQD .color1[name=openBg]").css("background-color",data.openBg);
		$("#wqdShowQQD .color1[name=openIcon]").css("color",data.openIcon);
		$("#wqdShowQQD .color1[name=openTitle]").css("color",data.openTitle);
		$("#wqdShowQQD .color1[name=openContent]").css("color",data.openContent);
	}
	function colorSetChange(data) {
		$("#wqdpServerD input[name=defBg]").css("background",data.defaultBg);
		$("#wqdpServerD input[name=defIcon]").css("background",data.defaultIcon);
		$("#wqdpServerD input[name=openBg]").css("background",data.openBg);
		$("#wqdpServerD input[name=openIcon]").css("background",data.openIcon);
		$("#wqdpServerD input[name=openTitle]").css("background",data.openTitle);
		$("#wqdpServerD input[name=openContent]").css("background",data.openContent);
	}
	//编辑状态下，qq客服放到手机模型里面
	function changeQQPos() {
		var obj = $("#wqdpServerD").find("#wqdShowQQD");
		var str = obj.html();
		$("#wqdIphoneContainer").append('<div id="wqdShowQQD" style="background: transparent;z-index: 98;position: absolute;width: 1px;right: 0px;top: 0;bottom: 0;">'+str+'</div>');
		obj.remove();
	}
	//获取url中参数方法
	function getURLStr(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i");
		var r = window.parent.location.search || window.location.search;//.substr(1).match(reg);
		if (r.substr(1).match(reg)!=null) {
			return r.substr(1).match(reg)[2];
		} else {
			return null;
		}
	}
})
//在线客服代码 end

//导航自动选中
$(function(){
	if($("#HTMLDATA").length){
		$(document).on("domInit",function(){
			var pageid = $(".pagedeatllist").find(">li.on").attr("pageid"),
				navSelect = false; //是否在导航中设置了本页链接
			$(".wqdMoreNavos>.nav-li>a").each(function(){
				if($(this).attr("pageid") == pageid){
					navSelect = true;
					if(!$(this).parents("li").hasClass("active")){
						if($(this).parents('.wqdBkEditos').find('.wqdElHoveros').length){
							var hovercolor = $(this).parents('.wqdBkEditos').attr('wqdHoverColoros') || 'transparent';
							$(this).css({'background-color':hovercolor,'color':$(this).parents('.wqdBkEditos').attr('wqdhovertextcoloros')}).removeAttr('wqdBeforeBgcoloros').removeAttr('wqdbeforetextcoloros').parent('li').addClass('active').siblings('li.active').removeClass('active').find('a').eq(0).attr('wqdBeforeBgcoloros','transparent').attr('wqdbeforetextcoloros',$(this).parents('.wqdBkEditos').attr('wqdtextcoloros')).css({'background-color':'transparent','color':$(this).parents('.wqdBkEditos').attr('wqdtextcoloros')});
						}else{
							$(this).parent('li').addClass('active').siblings().removeClass('active');
						}
					}
				}
			});
			if(!navSelect && $(".wqdMoreNavos>.nav-li.active").length){
				var selectNav = $(".wqdMoreNavos>.nav-li.active").find("a");
				if(selectNav.parents('.wqdBkEditos').find('.wqdElHoveros').length){
					selectNav.attr('wqdBeforeBgcoloros','transparent').attr('wqdbeforetextcoloros',selectNav.parents('.wqdBkEditos').attr('wqdtextcoloros')).css({'background-color':'transparent','color':selectNav.parents('.wqdBkEditos').attr('wqdtextcoloros')}).parent('li').removeClass('active');
				}else{
					selectNav.parent('li').removeClass('active');
				}
			}
		});
	}else{
		var pathName = location.pathname.replace("\/",""),
			elmenDom = null;
		if(!pathName){		//首页
			$(".wqdMoreNavos>.nav-li>a").each(function(){
				if($(this).attr("homepage")=="true"){
					elmenDom = $(this);
					return false
				}
			});
		}else{
			$(".wqdMoreNavos>.nav-li>a").each(function(){
				var hrefurl = $(this).attr("href") ? $(this).attr("href").replace("\/","") : "";
				if(hrefurl == pathName){
					elmenDom = $(this);
					return false
				}
			});
		}
		if(elmenDom){
			if(elmenDom.parents('.wqdBkEditos').find('.wqdElHoveros').length){
				var hovercolor = elmenDom.parents('.wqdBkEditos').attr('wqdHoverColoros') || 'transparent';
				elmenDom.css({'background-color':hovercolor,'color':elmenDom.parents('.wqdBkEditos').attr('wqdhovertextcoloros')}).removeAttr('wqdBeforeBgcoloros').removeAttr('wqdbeforetextcoloros').parent('li').addClass('active').siblings('li.active').removeClass('active').find('a').eq(0).attr('wqdBeforeBgcoloros','transparent').attr('wqdbeforetextcoloros',elmenDom.parents('.wqdBkEditos').attr('wqdtextcoloros')).css({'background-color':'transparent','color':elmenDom.parents('.wqdBkEditos').attr('wqdtextcoloros')});
			}else{
				elmenDom.parent('li').addClass('active').siblings().removeClass('active');
			}
		}else{
			var deleDom = $(".wqdMoreNavos>.nav-li.active");
			if(deleDom.length){
				deleDom.removeClass('active').find('a').eq(0).attr('wqdBeforeBgcoloros','transparent').attr('wqdbeforetextcoloros',deleDom.parents('.wqdBkEditos').attr('wqdtextcoloros')).css({'background-color':'transparent','color':deleDom.parents('.wqdBkEditos').attr('wqdtextcoloros')});
			}
		}
		$(".wqdMoreNavos .nav-li a").each(function(){
			if($(this).attr("href")=="") $(this).attr("href","javascript:void(0);");
		});
	}
});

//添加拖拽排序js
(function($){
	var dragging, placeholders = $();
	$.fn.sortable = function(options) {
		options = options || {};
		return this.each(function() {

			var index, items = $(this).children(), connectWith = false;
			var placeholder = $('<' + items[0].tagName + ' class="sortable-placeholder">');

			placeholders = placeholders.add(placeholder);

			items.attr('draggable', 'true')
			$(this).off();
			$(this).on('dragstart.h5s','li', function(e) {
				var dt = e.originalEvent.dataTransfer;
				dt.effectAllowed = 'move';
				dt.setData('Text', 'dummy');
				dragging = $(this).addClass('sortable-dragging');
				index = dragging.index();
			}).on('dragend.h5s','li', function() {
				if(dragging){
					dragging.removeClass('sortable-dragging').fadeIn();
					placeholders.detach();
					if (index != dragging.index()) {
						window.before_sort_index = index;
						window.after_sort_index = dragging.index();
						items.parent().trigger('sortupdate');
					}
					dragging = null;
				}

			}).on('selectstart.h5s','li', function() {
				this.dragDrop && this.dragDrop();
				return false;
			})

			items.add([this, placeholder]);
			$(this).on('dragover.h5s dragenter.h5s drop.h5s', 'li',function(e) {
				if (!items.is(dragging) && connectWith !== $(dragging).parent().data('connectWith')) {
					return true;
				}
				if (e.type == 'drop') {
					e.stopPropagation();
					placeholders.filter(':visible').after(dragging);
					return false;
				}
				e.preventDefault();
				e.originalEvent.dataTransfer.dropEffect = 'move';
				if (items.is(this)) {
					dragging.hide();
					$(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
					placeholders.not(placeholder).detach();
				}
				return false;
			});
		});
	};
})(jQuery)

//图文介绍26选项卡
$(function(){
	$("body").on("click",".wqdTabBar .wqdTabBarOption",function(){
		if($(this).hasClass("active")) return false;
		$(this).addClass("active").siblings(".wqdTabBarOption.active").removeClass("active").parents(".wqdBkEditos").find(".wqdTabBox > .wqdTabBox_list").eq($(this).index()).addClass("active").siblings().removeClass("active");
	});
});


/*//图片压缩 胡奎问题
$(function(){
	var size = $('.wqdSectiondiv').outerHeight() / $('.wqdSectiondiv').outerWidth();
	$('.wqdSectiondiv').children().height(size*$(document).width());

	$(window).resize(function(){
		$('.wqdSectiondiv').children().height(size*$(document).width());
	})
})*/
