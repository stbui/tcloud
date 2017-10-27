// zhangyang 2015.04

;(function(root,fn){
	 root.yizhan = fn;
})(this,function(){
	$.base64.utf8encode = true;

	var
		htmlHeader = $('#HTMLDATAHEADER .wqdView'),
		htmlCenter = $('#HTMLDATACENTER .wqdView'),
		htmlFooter = $('#HTMLDATAFOOTER .wqdView'),
		cssUrlPath = CSSURLPATH,
		wwctx = WWWCTX,
		siteId = USERSITEID;
	function application(){
		return new application.fn.init();
	}

	application.fn = application.prototype;

	$.extend(application.fn,{
		"init" : function() {

		}
	});

	application.fn.init.prototype = application.fn;

	return application();
});

//拖拽移动元素
$.fn.wqdDragDrop = function(options){
	var options = options ,listTarget = $(options.eventNode).parents(options.parents).children() ,event_e = $(options.eventNode);


	if(listTarget.length < 2){
		return;
	}

	listTarget.attr('draggable','true');

	event_e.attr('draggable','true');

	for(i=0;i<event_e.length;i++){
		event_e[i].addEventListener('dragstart', dragstart, false);
		event_e[i].addEventListener('dragend', dragend, false);
	}

	for(j=0;j<listTarget.length;j++){
		listTarget[j].addEventListener('dragover', dragover, false);
		listTarget[j].addEventListener('drop', drop, false);
	}

	function dragstart(event){
		$(event.target).parents(options.moveNode).css('opacity','0.2');
		dragnow = $(event.target).parents(options.moveNode).children().attr('moveing','1');
		event.dataTransfer.setData("text",$(event.target).parents(options.moveNode).children()[0].outerHTML);
	}


	function dragover(event){
		event.preventDefault();
		event.dataTransfer.dropEffect = 'move';
	}

	function drop(event){
		var data = event.dataTransfer.getData("text");
		event.preventDefault();
		event.stopPropagation();

		try{
			if($(dragnow).attr('moveing') == $(event.target).attr('moveing')){
				$(dragnow).removeAttr('moveing');
				$(event.target).parent().css('opacity','1');
				return;
			}else{
				var node = null ,draggable = $(event.target).attr('draggable');
				if(draggable=='true'){
					if($(event.target).hasClass(options.eventNode.split('.')[1])){
						node = $(event.target).parents(options.moveNode).children();
					}else{
						node = $(event.target).children();
					}
				}else{
					node = $(event.target).parents(options.moveNode).children();
				}
				node.replaceWith($(data));
				dragnow.removeAttr('moveing').replaceWith(node);
			}
		}catch(e){
			return false;
		}
	}

	function dragend(event){
		event.preventDefault();
		listTarget.css('opacity','1').children().removeAttr('moveing');
		event_e.removeAttr('draggable');

		if(typeof callback=='function'){
			options.callback(dragnow);
		}

		dragnow = null;
		for(i=0;i<event_e.length;i++){
			event_e[i].removeEventListener('dragstart', dragstart, false);
			event_e[i].removeEventListener('dragend', dragend, false);
		}
		for(j=0;j<listTarget.length;j++){
			listTarget[j].removeEventListener('dragover', dragover, false);
			listTarget[j].removeEventListener('drop', drop, false);
		}

		yizhan().setCatch('beforeunload');
		return false;
	}

};

$.fn.wqdDragDropList_css = function(options){

};
$.fn.wqdDragDropList_css();
