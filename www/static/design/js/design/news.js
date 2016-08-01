(function(){
	//动态生成编辑器
	$.fn.editInit = function(boole) { 
		var boole = boole || false;
		var createEdit = {};
		//新闻列表编辑器
		$.extend(createEdit,{
			wqdarticleListEdit : {
				category : "newsList",
				init : function(){ 
					var colorVal = "'#ededed'",//拾色器边框颜色
					con_bg_color = this.eq(i).find(".editConbgcolor").attr("editconbgcolor") || "",
					con_tit_color = this.eq(i).find(".editContitcolor").attr("editcontitcolor") || "",
					con_tit_hover = this.eq(i).find(".editContitcheckcolor").attr("editcontitcheckcolor") || "",
					con_sum_color = this.eq(i).find(".editConsumcolor").attr("editconsumcolor") || "",
					con_fatext_color = this.eq(i).find(".editCondefatextcolor").attr("editcondefatextcolor") || "",
					con_btn_color = this.eq(i).find(".editConbtncolor").attr("editconbtncolor") || "",
					con_pagbtn_color = this.eq(i).find(".editConpagbtncolor").attr("editconpagbtncolor") || "",
					con_bord_color = this.eq(i).find(".editConbordcolor").attr("editconbordcolor") || "",
					con_icon_color = this.eq(i).find(".editConiconcolor").attr("editconiconcolor") || "",					
					con_check_color = this.eq(i).find(".editConcheckcolor").attr("editconcheckcolor") || "",
					cate_bg_color = this.eq(i).find(".editCatebgcolor").attr("editcatebgcolor") || "",
					cate_tit_color = this.eq(i).find(".editCatetitcolor").attr("editcatetitcolor") || "",
					cate_are_color = this.eq(i).find(".editCatearecolor").attr("editcatearecolor") || "",
					cate_name_color = this.eq(i).find(".editCatenamecolor").attr("editcatenamecolor") || "",
					cate_check_color = this.eq(i).find(".editCatecheckcolor").attr("editcatecheckcolor") || "",
					cate_bord_color = this.eq(i).find(".editCatebordcolor").attr("editcatebordcolor") || "",
					cate_icon_color = this.eq(i).find(".editCateiconcolor").attr("editcateiconcolor") || "",

					bnt_color  = this.eq(i).find(".container").attr("bnt_color") || "",
					bntBck_color = this.eq(i).find(".container").attr("bntBck_color") || "",
					bntBorcol_color = this.eq(i).find(".container").attr("bntBorcol_color") || "",

					zindex = this.eq(i).outerHeight()<320 ? "z-index:1000;" : "",

					html = '';
					//console.log("bntBorcol_color==="+bntBorcol_color+"bntBck_color==  "+bntBck_color)
//					html += '<div class="bg_editor article-detail" style="right: 303px;'+zindex+'">';
					html += '<div id="user-page-set" class="bg_editor user-page-set pagesetdown dropdown" style="right: 170px;'+zindex+'">';
					html += '<button type="button" class="btn wqdDragos clearfix add" id="dropdownMenu"><span class="pull-left">&nbsp;</span>页面设置</button>';
					html += '<ul class="dropdown-menu" role="menu">';
					html += '<li class="filter-style pagesetdown" role="presentation"><button type="button" class="btn showList">列表样式&nbsp;&nbsp;<i class="fa fa-caret-down"></i></button><ul id="modelStyle" class="list-style changeStyle"></ul></li>';
					html += '<li id="catePath" class="filter-style pagesetdown" role="presentation"><button type="button" class="btn">侧栏位置&nbsp;&nbsp;<i class="fa fa-caret-down"></i></button><ul class="list-style changeStyle"><li sty="left">左</li><li sty="right">右</li></ul></li>';
					html += '<li id="filter-style" class="filter-style pagesetdown" role="presentation"><button type="button" class="btn">字体样式&nbsp;&nbsp;<i class="fa fa-caret-down"></i></button><ul class="list-style changeStyle"><li sty="italic">斜体</li><li sty="yahei">微软雅黑</li><li sty="song">宋体</li><li sty="arial">Arial</li></ul></li>';
					html += '<li class="filter-style pagesetdown" role="presentation">';
					html += '<button type="button" class="btn">配色&nbsp;&nbsp;<i class="fa fa-caret-down"></i></button>';
					html += '<ul id="setColor" class="setColor"><li id="colorFilterTit" class="clearfix"><span id="contarea" class="active">内容区域</span><span id="catearea">分类区域</span></li>';
					html += '<ul class="contarea show">';
					if(this.eq(i).find(".editConbgcolor").length != 0){
						html += '<li color="conbgcol">内容背色<input type="text" value="'+con_bg_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					if(this.eq(i).find(".editContitcolor").length != 0){
						html += '<li color="contitcol">标题颜色<input id="contitHover" type="text" value="'+con_tit_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';

						//<li color="contitcol">标题颜色<input type="text" value="'+con_tit_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					if(this.eq(i).find(".editContitcheckcolor").length != 0){
						html += '<li color="contitHover">标题选中<input id="contitcol" type="text" value="'+con_tit_hover+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					if(this.eq(i).find(".editConsumcolor").length != 0){
						html += '<li color="consumcol">摘要颜色<input type="text" value="'+con_sum_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					if(this.eq(i).find(".editCondefatextcolor").length != 0){
						html += '<li color="condefcol">系统文字<input type="text" value="'+con_fatext_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					if(this.eq(i).find(".editConbtncolor").length != 0){
						html += '<li color="conallbtn">全文按钮<input type="text" value="'+con_btn_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					if(this.eq(i).find(".editConpagbtncolor").length != 0){
						html += '<li color="conpagbtn">分页按钮<input type="text" value="'+con_pagbtn_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					if(this.eq(i).find(".editConbordcolor").length != 0){
						html += '<li color="conborcol">边框颜色<input type="text" value="'+con_bord_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					if(this.eq(i).find(".editConiconcolor").length != 0){
						html += '<li color="coniconcol">图标颜色<input type="text" value="'+con_icon_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					if(this.eq(i).find(".editConcheckcolor").length != 0){
						html += '<li color="conchecol">内容选中<input id="conchecol" type="text" value="'+con_check_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					html += '</ul><ul class="catearea">';
					if(this.eq(i).find(".editCatebgcolor").length != 0){
						html += '<li color="catebgcol">总类背色<input type="text" value="'+cate_bg_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					if(this.eq(i).find(".editCatetitcolor").length != 0){
						html += '<li color="catefnamcol">总类名称<input type="text" value="'+cate_tit_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					if(this.eq(i).find(".editCatearecolor").length != 0){
						html += '<li color="catearebgcol">分类背色<input type="text" value="'+cate_are_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					if(this.eq(i).find(".editCatenamecolor").length != 0){
						html += '<li color="catecnamcol">分类名称<input id="catecnamcol" type="text" value="'+cate_name_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					if(this.eq(i).find(".editCatecheckcolor").length != 0){
						html += '<li color="catechecol">分类选中<input id="catechecol" type="text" value="'+cate_check_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					if(this.eq(i).find(".editCatebordcolor").length != 0){
						html += '<li color="cateborcol">边框颜色<input type="text" value="'+cate_bord_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					if(this.eq(i).find(".editCateiconcolor").length != 0){
						html += '<li color="cateicocol">图标颜色<input id="cateicocol" type="text" value="'+cate_icon_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					//分页按钮选中颜色
					if(this.eq(i).find(".pagination").length != 0){
						html += '<li color="bntColor">分页文字<input id="bntColor" type="text" value="'+bnt_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}

					if(this.eq(i).find(".pagination").length != 0){
						html += '<li color="bntBckColor">分页背景<input id="bntBckColor" type="text" value="'+bntBck_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}

					if(this.eq(i).find(".pagination").length != 0){
						html += '<li color="bntBorcol">分页边框<input id="bntBorcol" type="text" value="'+bntBorcol_color+'" class="self-input color {hash:true,caps:false,pickerFaceColor:'+colorVal+'}"></li>';
					}
					//</ul></ul></li>
					html += '</ul></ul></li></ul><em status="end"></em></div>';
//					html += '<em status="end"></em></div>';
					//alert("前");
					this.eq(i).append(html);
					//alert("后");
					/*新闻列表*/
//					var newList = '<ul class="jiangping FREEMARKER_TEMPLATE_DATA_WQD_START"><#if listNewsPage?exists><#list listNewsPage.data as news><li class="ulist-model">';
//						newList += '<h2 class="tit editContitcolor editConbordcolor" editContitcolor="#333" editConbordcolor="#dcdcdc"><#if link><a href="/news/p/${listPage.associateId?c}/${news.id?c}.html" target="_blank">${news.title}</a><#else><a href="javascript:void(0);" target="_blank">${news.title}</a></#if></h2>';
//						newList += '<div class="user-mess"><#if user.icon?exists><span class="puchil photo"><img src="${taglibContext.httpImgctx}/${user.icon}" alt="${news.title}"></span></#if><span class="puchil push-date editCondefatextcolor" editCondefatextcolor="#ccc"><#if user.nickName?exists><s class="nikeName editCondefatextcolor" editCondefatextcolor="#ccc">${user.nickName}</s>&nbsp;</#if><b class="bst dateTime">${news.createDate?string("yyyy-MM-dd")}</b>&nbsp;|&nbsp;&nbsp;<#if news.categoryName?exists><b class="bst cateType">${news.categoryName}</b></#if></span></div>';
//						newList += '<#if news.icon?exists><p class="img-box"><img src="${taglibContext.httpImgctx}/${news.icon}"></p><#else><img src="${taglibContext.httpWwwctx}/images/default.png" alt="${news.title}"></#if><p class="summary editConsumcolor" editConsumcolor="#333"><#if news.summary??>${news.summary}</#if></p>';
//						newList +='</li></#list></#if><li class="FREEMARKER_TEMPLATE_DATA_WQD_END"></li></ul>'; 
//					this.eq(i).find(".ajaxnewslist").append(newList);
//					alert(this.eq(i).find(".ajaxnewslist").length);
					/*新闻列表完*/
				},
				bindEvent : function(){ 
					$(document).on("click",".pagesetdown>button",function(){
						//console.log("click")
						$(this).next(".dropdown-menu").is(":hidden") ? $(".filter-style").removeClass("open") : false;
						$(this).parent().toggleClass("radius");
						$(this).next("ul").slideToggle(200);
						if($(this).parent().hasClass("radius")){//展开就调列表
							var $url = "",
							$articleType = $("section.un-panel");
							if($articleType.hasClass("articleDetail")){
								$url = "/sys/template/query/article";
								sendAjax($url);
							}
							if($articleType.hasClass("articleList")){
								//console.log(22222)
								$url = "/sys/template/query/listArticle";
								sendAjax($url);
							}
						}
					});
					//showList

					$(document).on("click",".showList",function(){
						//console.log(1111111)
						$(this).siblings(".modelStyle").toggleClass("uhide");
					});
					
					function sendAjax($url){
						//console.log(333333)
						$.ajax({
							type:"get" || "post",
							url:$url || "",
							dataType:"json",
							success:function(json){
								var $li = '';
								////console.log(json);
								if(json.data.length>0){
									for (var i=0; i<json.data.length; i++) {
										$li += '<li sectionId='+json.data[i].sectionId+' type='+json.data[i].type+'>'+json.data[i].name+'</li>';
									}
								}else{
									$li += '<li sty="'+i+'">无可选模板</li>';
								}
								$("#modelStyle").empty().append($li);
							},error:function(){
								alert("系统错误");
							}
						});
					}
					//先不切换
					// $(document).on("click","#modelStyle>li",function(){
					// 	var $obj = $(this),
					// 	    $sectionId = $obj.attr("sectionId"),
					// 	    $type = $obj.attr("type");
					// 	    //location.assign("/?renderId=" + $sectionId + "&pageId="+USERPAGEID);
					// 		location.href = location.pathname+"?renderId=" + $sectionId + "&pageId="+USERPAGEID;
					// 		$(document).trigger('appSetCatch');
					// });
					$(document).on("click","#catePath li",function(){
						var $unPanle =$(this).parents("section").find(".un-panel"),
							$unPage = $(this).parents("section").find(".un-page"),
							$unCategory = $(this).parents("section").find(".un-category"),
							//$("#HTMLDATAOTHER").find("section")
							$unPage1 = $("#HTMLDATAOTHER").find(".un-page"),
							$unCategory1 = $("#HTMLDATAOTHER").find(".un-category"),
							$cateDistance = $("#HTMLDATAOTHER").find(".container").outerWidth()-($unPage.outerWidth()+$unCategory.outerWidth()+30);
							//console.log($cateDistance);
						if($(this).attr("sty") == "left"){
							$unPage.insertAfter($unCategory);
							$unCategory.css({"margin-right":"30px","margin-left":"0"});

							$unPage1.insertAfter($unCategory1);
							$unCategory1.css({"margin-right":"30px","margin-left":"0"});
								//$cateDistance);
							//$unCategory.css("margin-left","0");
						}else{
							$unPage.insertBefore($unCategory);
							$unCategory.css({"margin-right":"0px","margin-left":"30px"});

							$unPage1.insertBefore($unCategory1);
							$unCategory1.css({"margin-right":"0px","margin-left":"30px"});
							//$unCategory.css("margin-left",$cateDistance);
							//$unCategory.css("margin-right","0");
						}
						$(document).trigger('appSetCatch');
//						$(this).attr("sty") == "left" ? $unPanle.removeClass("change-panel-style") : $unPanle.addClass("change-panel-style");
					})

					//字体设置
					$(document).on("click","#filter-style li",function(){
						//sty="italic">斜体 sty="yahei">微软雅黑< sty="song">宋体sty="arial">Arial
						var style=$(this).attr("sty");
						switch(style){
							case "italic" :
								$(this).parents("section").toggleClass('fontStyle1');
								$("#HTMLDATAOTHER").find("section").toggleClass('fontStyle1');
								break;
							case "yahei" :
								$(this).parents("section").removeClass("fontStyle3 fontStyle4").toggleClass('fontStyle2');
								$("#HTMLDATAOTHER").find("section").removeClass("fontStyle3 fontStyle4").toggleClass('fontStyle2');
								break;
							case "song" :
								$(this).parents("section").removeClass("fontStyle2 fontStyle4").toggleClass('fontStyle3');
								$("#HTMLDATAOTHER").find("section").removeClass("fontStyle2 fontStyle4").toggleClass('fontStyle3');
								
								break;	
							case "arial" :
								$(this).parents("section").removeClass("fontStyle2 fontStyle3").toggleClass('fontStyle4');
								$("#HTMLDATAOTHER").find("section").removeClass("fontStyle2 fontStyle3").toggleClass('fontStyle4');
								break;
						}
						$(document).trigger('appSetCatch');
					});
					$(document).on("mouseenter",".un-category-list li>a",function(){
						var $obj = $(this);
						var $wcol = $obj.parent().attr("editcatecheckcolor");
						$obj.css("color",$wcol);
						$obj.find("i").css("color",$wcol);
					});
					$(document).on("mouseleave",".un-category-list li>a",function(){
						var $obj = $(this);
						var $wcol = $obj.attr("editcateiconcolor");
						$obj.css("color",$obj.attr("editcatenamecolor"));
						$obj.find("i").css("color",$wcol);
					});
					$(document).on("mouseenter",".ulist-model a",function(){
						var $obj = $(this);
						var $wcol = $obj.parent().attr("editcontitcheckcolor");
						$obj.css("color",$wcol);
					});
					$(document).on("mouseleave",".ulist-model a",function(){
						var $obj = $(this);
						$obj.css("color",$obj.parent().attr("editcontitcolor"));
					});
					//颜色设置
					$(document).on("change","#setColor input",function(){
						var $obj = $(this);
						var $val = $obj.val();
						var $color = $obj.parent().attr("color");
						//console.log("字体颜色设置===="+$val);
						switch($color){
							case "conbgcol":
								$(".editConbgcolor").css("background-color",$val);
								$(".editConbgcolor").attr("editconbgcolor",$val);
								break;
							case "contitcol":
								$(".editContitcolor").each(function(){
									var $obj = $(this);
									$obj.find("a").length != 0 ? $obj.find("a").css("color",$val) : $obj.css("color",$val);
								});
								$(".editContitcolor").attr("editcontitcolor",$val);
								break;
							case "contitHover":
								$(".editContitcheckcolor a").hover(function(){
									$(this).css("color",$val);
								},function(){
									$(this).css("color",$("#contitHover").val());
								});
								$(".editContitcheckcolor").attr("editcontitcheckcolor",$val);
								break;
							case "consumcol":
								$(".editConsumcolor").each(function(){
									var $obj = $(this);
									$obj.find("a").length != 0 ? $obj.find("a").css("color",$val) : $obj.css("color",$val);
								});
								$(".editConsumcolor").attr("editconsumcolor",$val);
								break;
							case "condefcol":
								$(".editCondefatextcolor").each(function(){
									var $obj = $(this);
									$obj.find("a").length != 0 ? $obj.find("a").css("color",$val) : $obj.css("color",$val);
								})
								$(".editCondefatextcolor").attr("editcondefatextcolor",$val);
								break;
							case "conallbtn":
								$(".editConbtncolor").css("color",$val);
								$(".editConbtncolor").attr("editconbtncolor",$val);
								break;
							case "conpagbtn":
								$(".editConpagbtncolor li>a").css("color",$val).parent(".active").find("a").css({"background-color":$val});
								$(".editConpagbtncolor").attr("editconpagbtncolor",$val);
								break;
							case "conborcol":
								$(".editConbordcolor").css("border-color",$val);
								$(".editConbordcolor").attr("editconbordcolor",$val);
								break;

							//分页按钮文字颜色设置
							case "bntColor":
								$(".pagination>li.active>a").css('color',$val);
								$(".pagination>li").not(".active").find("a").css("background-color",$val);

								$(".container").attr("bnt_color",$val);
								break;
							//分页按钮背景颜色设置
							case "bntBckColor":
								$(".pagination>li.active>a").css({"border-color":$val,"background-color":$val});
								$(".pagination>li").not(".active").find("a").css("color",$val);
								$(".container").attr("bntBck_color",$val);
								$(".pagination>li").not(".active").find("a").hover(function(){
									$(this).css({"border-color":$val,"background-color":$val,"color":$("#bntColor").val()});
								},function(){
									$(this).css({"border-color":$("#bntBorcol").val(),"background-color":$("#bntColor").val(),"color":$val});
								});
								break;

							//分页按钮边框颜色设置
							case "bntBorcol":
								$(".pagination>li>a").css("border-color",$val);
								$(".container").attr("bntBorcol_color",$val);
								break;

							case "coniconcol":
								$(".editConiconcolor").each(function(){
									var $obj = $(this);
									$obj.find("i").length != 0 ? $obj.find("i").css("color",$val) : $obj.css("color",$val);
								});
								$(".editConiconcolor").attr("editconiconcolor",$val);
								break;
							case "conchecol":
								$(".editConcheckcolor>a").hover(function(){
									$(this).css("color",$val);
								},function(){
									$(this).css("color",$("#catecnamcol").val());
								});
								$(".editConcheckcolor strong").css("color",$val);
								$(".editConcheckcolor i").css("color",$val);
								$(".editConcheckcolor").attr("editconcheckcolor",$val);
								break;
							case "catebgcol":
								$(".editCatebgcolor").css("background-color",$val);
								$(".editCatebgcolor").attr("editcatebgcolor",$val);
								break;
							case "catefnamcol":
								$(".editCatetitcolor").css("color",$val);
								$(".editCatetitcolor").attr("editcatetitcolor",$val);
								break;
							case "catearebgcol":
								$(".editCatearecolor").css("background-color",$val);
								$(".editCatearecolor").attr("editcatearecolor",$val);
								break;
							case "catecnamcol":
								$(".editCatenamecolor").css("color",$val);
								$(".editCatenamecolor").attr("editcatenamecolor",$val);
								break;
							case "catechecol":
								$(".editCatecheckcolor a").hover(function(){
									$(this).css("color",$val);
									$(this).find("i").css("color",$val);
								},function(){
									$(this).css("color",$("#catecnamcol").val());
									$(this).find("i").css("color",$("#cateicocol").val());
								});
								$(".editCatecheckcolor strong").css("color",$val);
								$(".editCatecheckcolor").attr("editcatecheckcolor",$val);
								break;
							case "cateborcol":
								$(".editCatebordcolor").css("border-color",$val);
								$(".editCatebordcolor").attr("editcatebordcolor",$val);
								break;
							case "cateicocol":
								$(".editCateiconcolor i").css("color",$val);
								$(".editCateiconcolor").attr("editcateiconcolor",$val);
								break;
						}
						$(document).trigger('appSetCatch');
					});
					$(document).on("click","#colorFilterTit>span",function(){
						var $objId = $(this).attr("id");
						$(this).addClass("active").siblings().removeClass("active");
						$objId == "contarea" ? $(".contarea").addClass("show").next(".catearea").removeClass("show") : $(".catearea").addClass("show").prev(".contarea").removeClass("show");
					});
				},
				callback : function(){
					//绑定拾色器
					if(typeof jscolor!= "undefined") jscolor.bind();
				}
			}
		});
		
		//绑定事件
		if(boole){
			for(var n in createEdit){ 
				createEdit[n].bindEvent();
			}
		}
		
		//初始化
		for(var i=0; i<this.length; i++){
			if(this.eq(i).attr("wqdEditIdos")) continue;
			var wqdEditos = this.eq(i).attr("category") || "";
			for(var k in createEdit){ 
				if(wqdEditos.match(createEdit[k].category)){
					createEdit[k].init.call(this);
				}
			}
			this.eq(i).attr("wqdEditIdos","1");
		}
		
		//回调函数
		for(var m in createEdit){
			if(createEdit[m].callback != void 0) createEdit[m].callback.call(this);
		}
		return this;
	};
	
	$(".wqdBkEditos").editInit(true);
	
	//内部编辑器拖拽移动
	$(document).on("mousedown",".wqdDragos",function(event){
		event.stopPropagation();
		var that = $(this);
    	that.css("cursor","move");
    	var startPagex, intervalX, intervalY, startLeft, startTop, boole = false, maxLeft = that.parents(".wqdBkEditos").outerWidth()-that.parent().outerWidth(), maxTop = that.parents(".wqdBkEditos").outerHeight()-30;
        boole = true;
        startLeft = that.parent().position().left;
        startTop = that.parent().position().top;
        startPagex =  event.pageX;
        startPagey =  event.pageY;
       that.parents(".wqdBkEditos").on("mousemove",{obj:that},function(event){
            if(boole){
               	intervalX = event.pageX - startPagex + startLeft;
               	intervalY = event.pageY - startPagey + startTop;
               	if(intervalX > maxLeft){
               		intervalX = maxLeft;
               	}else if(intervalX < 0){
               		intervalX = 0;	
               	} 
               	if(intervalY > maxTop){
               		intervalY = maxTop;
               	}else if(intervalY < 0){
               		intervalY = 0;	
               	} 
              	event.data.obj.parent().css({"left":intervalX+"px","top":intervalY+"px"});
            }
        }).on("mouseup",{obj:that},function(event){
        	event.data.obj.css("cursor","pointer")
            boole = false;
        });
    });
})();