(function($) {
	var wqdMapInit = {};
	wqdMapInit.createBDlink = function(){
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "http://api.map.baidu.com/api?v=2.0&ak=XWDHBDMhL29b8kTlXNWdFtvf&callback=wqdGlobalMapInit";
		document.body.appendChild(script);
	};
	wqdMapInit.bindEvent = function(){
		$(document).on("domInit",function(){
			if(typeof BMap !="undefined") wqdGlobalMapInit();
		});
		$(document).on("wqdMapInit",function(e,obj){
			wqdGlobalMapInit(obj);
		});
	};
	wqdMapInit.createMap = function(domObj){
		var map_edit = null,
		map_type = domObj.attr("wqdMaptypeos") || "map",
		map_keyword = domObj.attr("wqdMapKeywordos") || "天安门",
		map_style =  domObj.attr("wqdMapStyleos") || "normal";
		if(map_type=="map"){
			map_edit = new BMap.Map(domObj.get(0));
		}else{
			map_edit = new BMap.Map(domObj.get(0),{mapType: BMAP_HYBRID_MAP});
		}
		map_edit.setMapStyle({style:map_style});
		var point = new BMap.Point(116.404, 39.915);
		map_edit.centerAndZoom(point, 15);
		var mapType1 = new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]});
		if(!$("#HTMLDATA").length){
			map_edit.addControl(new BMap.NavigationControl());
			map_edit.addControl(mapType1);
		}else{
			map_edit.disableScrollWheelZoom();
		}
		var local = new BMap.LocalSearch(map_edit, {renderOptions:{map: map_edit}});
		local.search(map_keyword);
	};
	wqdGlobalMapInit = function(obj){
		if(obj){
			wqdMapInit.createMap($(obj));
		}else{
			$(".wqdMapGroup").each(function(){
				wqdMapInit.createMap($(this).find(".wqdMapbox"));
			});
			$(".wqdMapos.wqdBkEditos").each(function(){
				wqdMapInit.createMap($(this).find(".mapbox"));
			});
		}
		
	};
	wqdMapInit.createBDlink();
	wqdMapInit.bindEvent();
	return wqdMapInit;
})(jQuery);

