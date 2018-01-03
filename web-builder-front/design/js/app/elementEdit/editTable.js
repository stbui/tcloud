define(['elementInfo','popupEdit','popupCommon','utility','createColorStyle'],function(_ei,popupEdit,popupCommon,utility,createColorStyle) {
	var tableEdit = {};
	tableEdit.init = function () {
		this.bindEdit(".wqdelementEdit");
	}
	//表格四种基本操作
	$(document).on("optColletInit",function(e,obj){
		optCollet(obj.fnnum,obj.target);
	});
	$(document).on("click",".wqd_table td",function(){
		$(".wqd_table td").blur(function(){
			$(document).trigger('appSetCatch');
		})
	})
	// 右键 初始化高宽以及颜色值
	$(document).off("smartMenuAfterShow").on("smartMenuAfterShow",".wqd_table td",function(){
		var $target = $(this);
		var lineH = $(this).css("height");
		var width = $(this).css("width");
		//初始化行高
		$("#smartMenu_wqdtablecss li input[type='number']").first().click();
		$("#smartMenu_wqdtablecss .wqdColorPicker").first().closest('a').attr({"title":"背景色","ondragstart":"return false;"});
		$("#smartMenu_wqdtablecss .wqdColorPicker").last().closest('a').attr({"title":"边框颜色","ondragstart":"return false;"});
		$("#smartMenu_wqdtablecss .wqdColorPicker").first().val($target.attr("backC") || "#ffffff");
		$("#smartMenu_wqdtablecss .wqdColorPicker").last().val($target.attr("fontC") || "#dcdcdc");
		$("#smartMenu_wqdtablecss .wqdColorPicker").first().next("span").css("background-color",$target.attr("backC") || "#ffffff");
		$("#smartMenu_wqdtablecss .wqdColorPicker").last().next("span").css("background-color",$target.attr("fontC") || "#dcdcdc");
		$("#smartMenu_wqdtablecss li input[type='number']").closest('a').attr("ondragstart","return false;");
		$("#smartMenu_wqdtablecss li input[operatet='lineH']").val(Number(lineH.substr(0,lineH.length-2)));
		$("#smartMenu_wqdtablecss li input[operatet='width']").val(Number(width.substr(0,width.length-2)));
		var colorpic = $("#smartMenu_wqdtablecss .wqdColorPicker").colorpicker({
            format: false,
            colorSelectors: {
                '#777777': '#777777',
                '#337ab7': '#337ab7',
                '#5cb85c': '#5cb85c',
                '#5bc0de': '#5bc0de',
                '#f0ad4e': '#f0ad4e',
                '#d9534f': '#d9534f'
            }
        });
        $(".wqdColorPicker").off("changeColor").on("changeColor", function(e) {
			//var $target = data.element;
			if($(this).attr("colorType") == 'backC'){
				$(this).next("span").css("background-color", $(this).val());
				$target.css("background-color",$(this).val());
				$target.attr("backC",$(this).val())
			}else if($(this).attr("colorType") == 'fontC'){//边框颜色值
				$(this).next("span").css("background-color", $(this).val());
				$target.css("border","1px solid "+$(this).val());
				tableEdit.setBorderC($target);
				$target.attr("fontC",$(this).val())
			}
			$(document).trigger('appSetCatch');
        });
	});

	// 设置行高列宽
	$(document).on("tableChangeColorLine",function(e,data){
		var $target = data.element;
		$("#smartMenu_wqdtablecss li input[type='number']").off("input propertychange keydown").on("input propertychange keydown",function(e){
   			e.stopPropagation() || (e.cancelBubble = true);
        	$("#smartMenu_wqdtablecss li input[type='number']").blur(function(){
        		if($(this).val() < 21){
	        		$(this).val(21);
	        		if($(this).attr("operateT") == "lineH"){//行高
				    	var trSeq = $target.parents(".wqd_table").find("tr").index($target.parent());
					    $target.parents(".wqd_table").find("tr").eq(trSeq).find("td").css("height",$(this).val());

					}else if($(this).attr("operateT") == "width"){//列宽
						var tdSeq = $target.parent().find("td").index($target);
					    var l = $target.parents(".wqd_table").find("tr").length;
					    for (var i = 0; i < l; i++) {//设置列宽并标记为已设置列宽
					        $target.parents(".wqd_table").find("tr").eq(i).find("td").eq(tdSeq).css("width",$(this).val());
					    }

					}
	        	}
        	})

        	//添加上下键
        	var key_val = Number($(this).val());
            var keyval = e.keyCode;
            if (keyval == 38 || keyval == 40) {
                switch (keyval) {
                    case 38:
                        key_val++;
                        break;
                    case 40:
                        key_val--;
                        if (key_val < 1) key_val = 1;
                        break;
                    default:
                        break;
                };
				$(this).val(key_val);
			}

		    if($(this).attr("operateT") == "lineH"){//行高
		    	var nowHeight = $target.css("height");//保存当前值
		    	var parentHeight = $target.closest(".wqdselected").css("height");//保存当前值
		    	var trSeq = $target.parents(".wqd_table").find("tr").index($target.parent());
			    $target.parents(".wqd_table").find("tr").eq(trSeq).find("td").css("height",$(this).val()).attr("height_edit","1");//设置行高并标记为已设置行高
			    //循环查找一遍看是否每行都设置了行高 若是则移除高度拖拽
			    var flag = 1;
			    $target.parents(".wqd_table").find("tr").each(function(){
			    	if($(this).find("td").eq(0).attr("height_edit")!="1"){
			    		flag = 0;
			    	}
			    })
			    // flag == 1 ? $target.parents(".wqd_table").css("height","auto") : "";
			   // flag == 1 ? $target.parents(".wqd_table").css("height","auto") : "";

			}else if($(this).attr("operateT") == "width"){//列宽
				var tdSeq = $target.parent().find("td").index($target);
				var nowWidth = $target.css("width");//保存当前值
		    	var parentWidth = $target.parents(".wqd_table").parent().parent().css("width");//保存当前值

			    var l = $target.parents(".wqd_table").find("tr").length;
			    for (var i = 0; i < l; i++) {
			        $target.parents(".wqd_table").find("tr").eq(i).find("td").eq(tdSeq).css("width",$(this).val()).attr("width_edit","1");
			    }
			     //循环查找一遍看是否每行都设置了行高 若是则移除高度拖拽
			    var boolean = 1;
			    $target.parents(".wqd_table").find("tr").eq(0).find("td").each(function(){
			    	if($(this).attr("width_edit")!="1"){
			    		boolean = 0;
			    	}
			    })
			    console.log("nowWidth=="+nowWidth+"  parentWidth== "+parentWidth);
			    var thisWidth = $(this).val();
			    var chazhi = Number(thisWidth)-Number(nowWidth.substr(0,nowWidth.length-2));
			    var thisPwidth = Number(parentWidth.substr(0,parentWidth.length-2));
			    // boolean == 1 ? $target.parents(".wqd_table").css("width","auto") : "";
			    console.log("zuihoudezhi="+(thisPwidth+chazhi+"px"));
			    boolean == 1 ? $target.parents(".wqd_table").parent().parent().css("width",thisPwidth+chazhi+"px") : "";
			}
		})
		$(document).trigger('appSetCatch');
	});
	//设置边框颜色值
	tableEdit.setBorderC = function(that){
		//console.log("borderC")
		var trSeq = that.parents(".wqd_table").find("tr").index(that.parent());//行号
		var tdSeq = that.parent().find("td").index(that);//列号
		var trLen = that.parents(".wqd_table").find("tr").length;//行数
		var tdLen = that.parent().find("td").length;//列数
		(trSeq - 1) >= 0 ? that.parents(".wqd_table").find("tr").eq(trSeq-1).find("td").eq(tdSeq).css("border-bottom","0") : "";
		(trSeq + 1) < trLen ? that.parents(".wqd_table").find("tr").eq(trSeq+1).find("td").eq(tdSeq).css("border-top","0") : "";
		(tdLen - 1) >= 0 ? that.parents(".wqd_table").find("tr").eq(trSeq).find("td").eq(tdSeq-1).css("border-right","0") : "";
		(trSeq + 1) < tdLen ? that.parents(".wqd_table").find("tr").eq(trSeq).find("td").eq(tdSeq+1).css("border-left","0") : "";
	}
	tableEdit.getTable = function(row,col,type){ //表格行列设置
		////console.log("tableEditInit---")
		var obj = window.edit;
		var oldRow = obj.find(".wqd_table").find("tr").length;//改变前的行数
		var oldCol = obj.find(".wqd_table").find("tr:first").find("td").length;//改变前的列数
		row = row < 0 ? 0 : row;
		col = col < 0 ? 0 : col;
		if((oldRow == 0 || oldCol == 0) && (row > 0 && col > 0)){
			var html = '<tbody>';
			for( var i = 0; i< row ;i++){
				html += '<tr>';
				for(var j = 0;j < col;j++){
					html += '<td contenteditable="true"></td>';
				}
				html += '</tr>';
			}
			html += '</tbody>';
			obj.find(".wqd_table").empty().append(html);
			return;
		}
		if(type == 1){//行
			if(row!=oldRow){
				if(row > oldRow){//添加行
					////console.log("添加行")
					for(var j = oldRow; j< row; j++){
						var html = '<tr>';
						for (var i = oldCol - 1; i >= 0; i--) {
							html += '<td contenteditable="true"></td>';
						};
						html +='</tr>';
						////console.log("添加到尾部：==");
					    obj.find(".wqd_table").find("tr").last().after(html);//添加到尾部
					}
				}else{//删除行
					////console.log("删除行")
					for (var i = row; i < oldRow; i++) {
						obj.find(".wqd_table").find("tr").last().remove();//每次删除最后一行
					};
				}
			}
		}else{//列
			if(col!=oldCol){
				var html = '<tr>';
				if(col > oldCol){//添加列
					////console.log("添加列")
					for(var j = oldCol; j< col; j++){
						for (var i = 0; i < oldRow; i++) {
					        obj.find(".wqd_table").find("tr").eq(i).find("td").last().after('<td contenteditable="true"></td>');
					    }
					}
				}else{//删除列
					////console.log("删除列")
					for(var j = col; j< oldCol; j++){
						for (var i = 0; i < oldRow; i++) {
					       obj.find(".wqd_table").find("tr").eq(i).find("td").last().remove();
					    }
					}
				}
			}
		}
	}
	//表格四种基本操作
	function optCollet(category,that){
		switch(category){
			case 5 : tableEdit.addrow(that);break;//add row
			case 6 : tableEdit.addcol(that);break;//add col
			case 7 : tableEdit.delrow(that);break;//delete row
			case 8 : tableEdit.delcol(that);break;//delete col
			default :break;
		}
		$(document).trigger('appSetCatch');
	}
	//删除行
	tableEdit.delrow = function(that) {
		var nowRow = that.parents("div[data-elementtype='wqdTable']").attr("row")||"3";
		var trSeq = that.parents(".wqd_table").find("tr").index(that.parent());
		////console.log("删除第几行：=="+trSeq);
	    that.parents("div[data-elementtype='wqdTable']").attr("row",Number(nowRow)-1);
	    that.parents(".wqd_table").find("tr").eq(trSeq).remove();
	    //删除行之后判断剩下的是否都为已设置行高 是的话则移动高度拖拽
	    var flag = 1;
	    that.parents(".wqd_table").find("tr").each(function(){
	    	if($(this).find("td").eq(0).attr("height_edit")!="1"){
	    		flag = 0;
	    	}
	    })
	    // flag == 1 ? that.parents(".wqd_table").css("height","auto") : "";
	}
	//删除列
	tableEdit.delcol = function(that) {
		var $target = that.parents(".wqd_table");
		var nowCol = that.parents("div[data-elementtype='wqdTable']").attr("col")||"3";
		var tdSeq = that.parent().find("td").index(that);
	    var l = that.parents(".wqd_table").find("tr").length;
	    ////console.log("删除第几列：=="+tdSeq+"  长度"+l);
	    that.parents("div[data-elementtype='wqdTable']").attr("col",Number(nowCol)-1);
	    for (var i = 0; i < l; i++) {
	        $target.find("tr").eq(i).find("td").eq(tdSeq).remove();
	    }
	    //删除列之后判断剩下的是否都为已设置列宽 是的话则移动宽度拖拽
	    var boolean = 1;
	    $target.find("tr").eq(0).find("td").each(function(){
	    	if($(this).attr("width_edit")!="1"){
	    		boolean = 0;
	    	}
	    })
	    // boolean == 1 ? $target.css("width","auto") : "";

	}
	//添加行
	tableEdit.addrow = function(that) {
		var nowRow = that.parents("div[data-elementtype='wqdTable']").attr("row")||"3";
		var trSeq = that.parents(".wqd_table").find("tr").index(that.parent());
		var l = that.parent().find("td").length;
		var html = '<tr>';
		for (var i = l - 1; i >= 0; i--) {
			html += '<td contenteditable="true"></td>';
		};
		html +='</tr>';
		////console.log("添加到第几行：=="+trSeq);
	    that.parents(".wqd_table").find("tr").eq(trSeq).before(html);
	    // that.parents(".wqd_table").css({"width":"100%","height":"100%"});///设置为可拖拽
	    that.parents("div[data-elementtype='wqdTable']").attr("row",Number(nowRow)+1);
	}
	//添加列
	tableEdit.addcol = function(that) {
		var nowCol = that.parents("div[data-elementtype='wqdTable']").attr("col")||"3";
		var tdSeq = that.parent().find("td").index(that);
	    var l = that.parents(".wqd_table").find("tr").length;
	    ////console.log("添加到第几列：=="+tdSeq+"  长度"+l);
	    for (var i = 0; i < l; i++) {
	        that.parents(".wqd_table").find("tr").eq(i).find("td").eq(tdSeq).before('<td contenteditable="true"></td>');
	    }
	    // that.parents(".wqd_table").css({"width":"100%","height":"100%"});//设置为可拖拽
	    that.parents("div[data-elementtype='wqdTable']").attr("col",Number(nowCol)+1);
	}
	// 绑定编辑
	tableEdit.bindEdit = function (elm) {
		var self = this;
		$(document).on("elmenentEdit",function (e,data) {
			var $node = data.element;
			if($node.attr("data-elementtype") == "wqdTable") {
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
								html:json.edit.tableEdit,
								fixed:true,
								closeButton:false,
								onOpen:function(){
									window.scroll_top = $(document).scrollTop();
								},
								onComplete:function(){
									popupCommon.commonInit();
									self.tableEditInit();
								},
								onClosed:function(){
									window.scrollTo(0, window.scroll_top);
								}
							});
				        }
			    	});
				},0);
			}
		})
	};
	 //表格设置
    tableEdit.tableEditInit = function() {
    	    //console.log(10)
            var obj = window.edit;
            var row = obj.attr("row") || "3" , col = obj.attr("col") || "3" , backC = '#fff' , borderC = '#dcdcdc';
            //初始化弹窗的值
	        $(".tableEdit .edit_contentbox input.setRowCol[tableType='row']").val(obj.attr("row") ||"3");
	        $(".tableEdit .edit_contentbox input.setRowCol[tableType='col']").val(obj.attr("col") || "3");
	        $(".tableEdit .edit_contentbox input.wqdColorPicker[change='back']").val(obj.attr("back") || "#ffffff");
	        $(".tableEdit .edit_contentbox input.wqdColorPicker[change='border']").val(obj.attr("border") || "#dcdcdc");
	        $(".tableEdit .edit_contentbox input.wqdColorPicker[change='back']").siblings(".colordeviceBg").find(".colordevice").css("background-color", obj.attr("back")|| "#ffffff");
	        $(".tableEdit .edit_contentbox input.wqdColorPicker[change='border']").siblings(".colordeviceBg").find(".colordevice").css("background-color", obj.attr("border")|| "#dcdcdc");
	        // 设置行列
	        $(document).off("blur").on("blur", ".tableEdit .edit_contentbox input.setRowCol", function(e) {
				var reg = /[0-9]*/g;
				if(!($(this).val().replace(reg,"")=="")){
				    $(this).val("1")
				}
				if($(this).attr("tableType") == "row"){
            		row = $.trim($(this).val());
                	obj.attr("row",row);//保存行数
                	tableEdit.getTable(Number(row),Number(col),1);
                }else{
                	col = $.trim($(this).val());
                	obj.attr("col",col);//保存列数
                	tableEdit.getTable(Number(row),Number(col),2);
                }
               $(document).trigger('appSetCatch');
            });
		// 设置行列
	        $(document).off("keydown").on("keydown", ".tableEdit .edit_contentbox input.setRowCol", function(e) {
				//绑定上下键
				var key_val = Number($(this).val());
	            var keyval = e.keyCode;
	            if (keyval == 38 || keyval == 40) {
	                switch (keyval) {
	                    case 38:
	                        key_val++;
	                        break;
	                    case 40:
	                        key_val--;
	                        if (key_val < 1) key_val = 1;
	                        break;
	                    default:
	                        return;
	                };
					$(this).val(key_val);
				}
            });
            //设置悬浮颜色 change='back'
            $(".wqdColorPicker").on("changeColor", function() {
                if($(this).attr("change") == "back"){//悬浮背景色
                	backC = $.trim($(this).val());
            		$(this).siblings(".colordeviceBg").find(".colordevice").css("background-color", backC);
                	createColorStyle.styleInit(obj.attr("id")," tr:hover td",{"background-color":backC+" !important"});//设置样式
                	obj.attr("back",backC);//保存
                }else{//悬浮边框色
                	borderC = $.trim($(this).val());
                	$(this).siblings(".colordeviceBg").find(".colordevice").css("background-color", borderC);//显示该选择颜色
                	createColorStyle.styleInit(obj.attr("id")," tr:hover td",{"border":"1px solid "+borderC+" !important"});//设置样式
                	obj.attr("border",borderC);//保存
                }
                $(document).trigger('appSetCatch');
            });
        }
        //表格设置 end
	return tableEdit;
});

