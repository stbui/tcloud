define(function() {
	var pageRuler = {};
	pageRuler.init = function () {
		this.setRuler();
		$(document).on("initContainerRuler",function(e) {
			pageRuler.setRuler();
		});
		$(window).on("resize",function(e) {
			pageRuler.setRuler();
		})
	}
	pageRuler.setRuler = function(){
		if(!$('.wqdsetRuleros').length){
			$('body').append('<div class="wqdsetRuleros setRulerleft"></div>')
			.append('<div class="wqdsetRuleros setRulerright"></div>');
			// $('body').append('<div class="wqdsetRuleros setRulercenter"></div>')
		}
		this.adjustRuler();
		if($(".rg-overlay").length) {
			$("#wqdpHeaderD .icon-list .iconBtn5").addClass("on");
		}else {
			$("#wqdpHeaderD .icon-list .iconBtn5").removeClass("on");
		}
	}
	pageRuler.adjustRuler = function(){
		var uw = parseInt($('style#styleCss').attr('uw')),
			w = $(window).width() + 20;
		$('.setRulerleft').css({'left':w/2 - uw/2+15+'px'});
		$('.setRulerright').css({'left':w/2 + uw/2+15+'px'});
	}
	pageRuler.rulerInit = function(){
		this.rg = new RulersGuides(new Event(), new Dragdrop(new Event()),parseInt($('style#styleCss').attr('uw')));
		$('#HTMLDATA').css({'padding-top':'70px','padding-left':'50px'});

		$('.wqd-carouseOverlay-box').css('left', parseFloat($('.wqd-carouseOverlay-box').css('left')) + 10 );
		this.setRuler();
		$("#wqdpHeaderD .icon-list .iconBtn5").addClass("on");
	}
	pageRuler.removeRule = function(){
		this.rg = null;
		$('.rg-overlay,.menu-btn,.rg-menu,.snap-dialog,.open-dialog').remove();
		$('#HTMLDATA').css({'padding-top':'50px','padding-left':'0px'});
		// $('.wqdsetRuleros').remove();

		$('.wqd-carouseOverlay-box').css('left', parseFloat($('.wqd-carouseOverlay-box').css('left')) - 10 );
		$("#wqdpHeaderD .icon-list .iconBtn5").removeClass("on");
	}
	pageRuler.init();
	return pageRuler;
});
