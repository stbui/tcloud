define(function(){
	var wqdCreateColor = {};
	wqdCreateColor.styleInit = function(elemenid,select,style){
		if(!elemenid) return;
		var elemen_id = elemenid || "",
			selects = select || "",
			styles = style || "";
		$("style."+elemen_id).length && styles && this.changeStyle(elemen_id,selects,styles);
		$("style."+elemen_id).length || !styles || this.createStyle(elemen_id,selects,styles);
	};
	//生成样式
	wqdCreateColor.createStyle = function(elemenid,selecter,strings){
        var $elm = $("#"+elemenid);
		var pendobj = $elm.hasClass("wqdSectiondiv") ? $elm : $elm.closest(".hc-fixed").length ? $(".hoverCon-section") : $elm.parents(".wqdSectiondiv");
        pendobj = pendobj.length ? pendobj : $("#"+$(".icon-list li.tool-list2").attr("partid"));
		var objStr = "";
		var spacing = selecter.charAt(0) == ":" ? "" : " ";
		for(var i in strings){
			objStr += i + ":" + strings[i] +";";
		}
		var styleString = "#" + elemenid + spacing + selecter + "{" + objStr +"}";
		pendobj.prepend('<style type="text/css" class="'+elemenid+'"></style>');
		$("style."+elemenid).html(styleString);
	};
	//修改样式
	wqdCreateColor.changeStyle = function(elemenid,selecter,strings){
		var reg = /:|;/,
			isNewElementStyle = true,	//是否为新的子元素样式
			objString = '{',
			newObj = {},
			newStyles = '',
			spacing = selecter.charAt(0) == ":" ? "" : " ",
			selectArray = $("style."+elemenid).html().split("#"+elemenid);	//拆分成数组
			selectArray.shift();
		for(var i=0; i<selectArray.length; i++){
			if(selectArray[i].substring(0,selectArray[i].indexOf("{")).replace(/\s+/g,"") == selecter.replace(/\s+/g,"")){
				isNewElementStyle = false;
				var styleArray = selectArray[i].substring(selectArray[i].indexOf("{")+1,selectArray[i].indexOf("}")).split(reg);
				styleArray.pop();
				for(var k=0; k<styleArray.length; k++){
					if(k % 2 == 0){
						objString += '"' + styleArray[k] + '":';
					}else{
						if(k == styleArray.length-1){
							objString += '"' + styleArray[k] + '"';
						}else{
							objString += '"' + styleArray[k] + '",';
						}
					}
				}
				objString = JSON.parse(objString+'}');
				//样式拆分成数组再转化为对象再合并对象
				$.extend(newObj,objString,strings);
				for(var m in newObj){
					newStyles += m + ":" + newObj[m] +";";
				}
				selectArray[i] = selectArray[i].substring(0,selectArray[i].indexOf("{")) + "{" + newStyles + "}";
				//最后样式转成字符串
				newStyles = "#" + elemenid + selectArray.join("#"+elemenid);
				$("style."+elemenid).html(newStyles);
				break;
			}
		}
		if(isNewElementStyle){
			var newHtmlStyle = "";
			for(var n in strings){
				newHtmlStyle += n + ":" + strings[n] +";";
			}
			var newHtml = $("style."+elemenid).html() + "#" + elemenid + spacing + selecter + "{" + newHtmlStyle +"}";
			$("style."+elemenid).html(newHtml);
		}
	};
	//删除部分样式
	wqdCreateColor.deleteStyle = function(elemenid,selecter,strings){
		if(!$("style."+elemenid).length) {
			return false;
		}
		var	newStyles = '',
			selectArray = $("style."+elemenid).html().split("#"+elemenid);	//拆分成数组
			selectArray.shift();
		if(typeof(strings) == 'object') {
			var css = [];
			$.each(strings,function (i,v) {
				css.push(i + ":" + v + ";");
			});
			strings = css.join("")
		}
		for(var i=0; i<selectArray.length; i++){
			if(selectArray[i].substring(0,selectArray[i].indexOf("{")).replace(/\s+/g,"") == selecter.replace(/\s+/g,"")){
				selectArray[i] = selectArray[i].replace(strings,"");
				//最后样式转成字符串
				newStyles = "#" + elemenid + selectArray.join("#"+elemenid);
				$("style."+elemenid).html(newStyles);
				break;
			}
		}
	};
	return wqdCreateColor;
});