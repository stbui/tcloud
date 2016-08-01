define(function() {
	var pageCommon = {};
	pageCommon.ajax = function(type,url,data,async,dataType,callback,that,msg) {
		$.ajax({
			type: type || "POST",
			url: url,
			data : data,
			async: async || true,
			dataType: dataType || "json",
			success:function(data){
				callback(data,that,msg);
			},
			error : function(data){
				callback(data,that);
			}
		});
	}
	pageCommon.CheckRadioAdd = function(event) {
		var clone = $(this).prev().clone(true);
		$(this).before(clone);
		clone.find('span').html('请输入选项内容');
		event.data.obj.setCatch('beforeunload');
	}
	pageCommon.setString = function(str,len) {
		var strlen = 0;
		var s = '';

		if(!str){
			return s;
		}
		for(var i = 0;i < str.length;i++){
			if(str.charCodeAt(i) > 128){
				strlen += 2;
			}else{
				strlen++;
			}
			s += str.charAt(i);
			if(strlen > len){
				return s;
			}
		}
		return s;
	}
	pageCommon.removeTarget = function(array,n) {
		if(n==0){
			return array.splice(1,array.length);
		}else if(n==array.length-1){
			return array.splice(0,array.length-1);
		}else{
			var a = array.splice(n+1,array.length);
			var b = array.splice(0,n);
			return b.concat(a);
		}
	}
	pageCommon.getSectionWidth = function() {
		var w = $('.viewwidth input').val();
		$('.wqdSectiondiv').each(function(){
			$(this).children('.sectionV2').attr('sectionWidth',w);
		})
	}
	return pageCommon;
});
