define(['pageCommon'], function(_pCommon) {
	var buildList = {};
	buildList.init = function () {
		var self = this;
		$(document).on("sectionList:reload",function (e) {
			self.basicapp();
		})
	}

	/**
	 * 重新载入左侧当前页面下的通条列表。复制于原basicapp方法，未整理4.18
	 * @return {[type]} [description]
	 */
	buildList.reloadSectionList = function () {
		var _Obj = $('#wqdpageContentD ul.pagedeatllist li.plist.on');

		/* 导航、页脚、中间section对象  保证导航和页脚唯一 */
		var _sectionHObj = htmlHeader.find('div.yzmoveContent .wqdSectiondiv');
		var _sectionFObj = htmlFooter.find('div.yzmoveContent .wqdSectiondiv');
		var _sectionCObj = $('#HTMLDATACENTER div.yzmoveContent');

		/* 导航列表和页脚列表、中间section列表字符串 */
		var _Hhtml = "", _Fhtml = "", _Chtml = "";
		/* 通条列表导航项---这种形式还是不够直观，需要继续优化 */
		_Hhtml += _sectionHObj.length ? '<li sectioncategoryid="'+_sectionHObj.attr('partcategoryid')+'" partid="'+_sectionHObj.attr('partid')+'">' : '<li>';
		_Hhtml += 	'<i class="wqdmovedrop"></i>';
		_Hhtml += 	_sectionHObj.length ? '<em title="'+_sectionHObj.attr('sectionname')+'">'+_pCommon.setString(_sectionHObj.attr('sectionname'),19)+'</em>' : '<a href="javascript:;">添加导航</a>';
		_Hhtml += 	'<b><span class="facBtn2"></span>'+ (_sectionHObj.length ? '<span class="facBtn3"></span>' : '') +'</b>';
		_Hhtml += '</li>';
		_Obj.find('ul.userht').eq(0).html(_Hhtml);

		/* 通条列表页脚项---这种形式还是不够直观，需要继续优化 */
		_Fhtml += _sectionFObj.length ? '<li sectioncategoryid="'+_sectionFObj.attr('partcategoryid')+'" partid="'+_sectionFObj.attr('partid')+'">' : '<li>';
		_Fhtml += 	'<i class="wqdmovedrop"></i>';
		_Fhtml += 	_sectionFObj.length ? '<em title="'+_sectionFObj.attr('sectionname')+'">'+_pCommon.setString(_sectionFObj.attr('sectionname'),19)+'</em>' : '<a href="javascript:;">添加页脚</a>';
		_Fhtml += 	'<b><span class="facBtn2"></span>'+ (_sectionFObj.length ? '<span class="facBtn3"></span>' : '') +'</b>';
		_Fhtml += '</li>';
		_Obj.find('ul.userht').eq(1).html(_Fhtml);


		/* 中间列表项 */
		if(_sectionCObj.length){
			_Obj.find('li[data=cont]').remove();
			/* 循环页面上的通条，产生列表---这种形式还是不够直观，需要继续优化 */

			_sectionCObj.each(function() {
				var parent = $(this).children('.wqdSectiondiv'),
					isArticle = $(this).find(".artDetlSection").length ? true : false;
				_Chtml += '<li class="slist" data="cont" sectioncategoryid="'+parent.attr('partcategoryid')+'" '+ (isArticle ? 'section-type="artDetl" ':'') +' partid="'+parent.attr('partid')+'">';
				_Chtml += '<i class="wqdmovedrop"></i><em title="'+parent.attr('sectionname')+'">'+_pCommon.setString(parent.attr('sectionname'),11)+'</em>';
					_Chtml += '<b><span class="facBtn1" title="复制"></span><span class="facBtn3" title="删除"></span></b></li>';


			});
			_Obj.find('ul.usercontent').html(_Chtml);
			//删除文章详情的复制,删除按钮
			$('li[section-type="artDetl"]').children("b").remove()
		}else{
			_Obj.find('ul.usercontent').html("");
		}
		/* 这是干啥的？ */
		$('div.yzmoveContent').each(function(i){
			$('.wqdfreeLayoutos:not(.clearfix)').each(function(){
				if(!$(this).children().children().find('div.wqdlayoutRemoveos').length){
					$(this).addClass('wqdlayoutpositionos');
					$(this).children().children().append( $('<div class="wqdlayoutRemoveos"><span class="wqddeleteeleos"></span><span class="wqdmoveeleos"></span><em class="wqdlayoutRemoveosend"></em></div>') );
				}
			});
		});

		// $.fn.wqdDragDropList_css({'nodeSelector' : '#wqdpageContentD ul.pagedeatllist li.plist .pageShow i' ,'parentSelector' : 'li.plist' });
	};
	/**
	 * 加载页面列表中对应的某一个页面上的通条列表
	 */
	buildList.basicapp = function(){
		var self = this;
		setTimeout(function (argument) {
			self.reloadSectionList();
		},0);
	}

	buildList.init();

	return buildList;
});
