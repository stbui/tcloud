define(['utility'], function(_util) {
	var articleListEditorStatic = {
		"addArtElm" : function(template ,$element ,$editor ,obj){
			var pageId = $element.attr("data-pageid");
			var text = _util.format(template ,{
								"title": obj.title ,
								"summary" : obj.summary ,
								"image" : obj.imgsrc ,
								"time" : obj.publishTime ,
								"pv" : obj.pv ,
								"favourable" : obj.favourable,
								"negative" : obj.negative,
								"top" : obj.top,
								"url" : pageId ? "page_" + pageId + "_" + value.id + ".html" : ""
								}),
				categoryName = obj.categoryName.split(','),
				tag = '';
				
			for(i=0;i<categoryName.length;i++){
				tag += '<span>'+categoryName[i]+'</span>';
			}
			
			text = _util.format(text,{"tag":tag});
			!$element.find('ol.artlist li[id]').length && $element.find('ol.artlist').html('');
			$element.find('ol.artlist').append( $(text).attr('categoryid',obj.categoryId).attr('id',obj.id) );
			$editor.find('div.selectlist ul').append( $('<li categoryid="'+obj.categoryId+'" id="'+obj.id+'"><span>'+obj.title+'</span><i></i></li>') );
			$editor.find('div.selectlist').nanoScroller();
			$(document).trigger('appSetCatch');
		},
		"removeArtElm" : function(node ,id){
			var editor = node.$editor.find('div.selectlist') ,elm = node.$element.find('ol.artlist');
			editor.find('li[id='+id+']').remove();
			node.$editor.find('div.con p[id='+id+']').removeClass('on');
			elm.find('li[id='+id+']').remove();
			$(document).trigger('appSetCatch');
		}
	}
	
	return articleListEditorStatic;
});

