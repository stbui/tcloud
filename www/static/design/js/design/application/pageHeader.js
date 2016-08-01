define(['pageCatch', 'pageCommon', 'buildList'], function(_pc, _pCommon, _bl) {

    //2016.4.7 只整理了部分不规范变量命名，增加部分注释，部分方法删除冗余代码调整结构，时间充裕时候此文件需重构拆分
	var pageHeader = {};
	pageHeader.init = function() {
		var self = this;
		$(document).on('appSetCatch',function(){
			self.setCatch('beforeunload');
		});
		$(document).on('appSave',function(){
			self.save();
		});

		//新pagecommon中替代saveStatus
        $(document).on("pageSaved",function (e,data) {
            self.saveStatus(data);
        });
        $("body").append("<div class='page-nowloading'><div class='loading-box'><div class='loading-img'>加载中…</div></div></div>")
	};

    /**
     * 添加页面载入效果
     */
    var loadTimeout;
    pageHeader.setLoadingStyle = function (type,text,delay) {
        var $nowLoading = $(".page-nowloading"),
            $loadText = $nowLoading.find(".loading-img");

        clearTimeout(loadTimeout);
        text = text || "";
        delay = delay || 0;
        if(type) {//加载样式
            $loadText.text("加载中…");
            $nowLoading.addClass("show");
            loadTimeout = setTimeout(function () {
                $loadText.text("您的网络过慢，请耐心等待！如果时间过长，请确认网络是否畅通！");
            },5000);
        }else {//移除样式
            delay && $loadText.text(text);
            setTimeout(function () {
                $nowLoading.removeClass("show");
            },delay);
        }
    }
    /**
     * 保存当前缓存中的页面
     * 简单整理，统一整理时需单独提取为保存模块并松耦合,精简掉无用的参数
     * @param saveSite
     * @param saveErro
     * @param other
     * @param dfd
     * @param isnoAsync
     */
	pageHeader.save = function(saveSite,saveErro,other,dfd,isnoAsync,isLoading) {
		var self = this,
            catchStrings;
		this.closeEditor();//关闭文本编辑器
		if(!window.noSave){//需要保存
			catchStrings = _pc.getCancel();
			if(!catchStrings) return;
			var htmlHeader = this.replacesome(catchStrings.htmlHeader),
                htmlFooter = this.replacesome(catchStrings.htmlFooter),
                htmlCenter = this.replacesome(this.getArticleTemplate(catchStrings.htmlCenter)),
                viewWidth = parseInt($('style#styleCss').attr('uw') || 1200,10),// 获取对应屏幕主区域宽度
                pageId = USERPAGEID;

            isLoading && self.setLoadingStyle(true,"加载中…");//切换页面会先保存，此时也需要出现加载样式
            $.ajax({
                type:"post",
                url:URLPATH+'api/save',
                data:{
                    "viewWidth":viewWidth,
                    "pageId":pageId,
                    "data":htmlCenter,
                    "header":htmlHeader,
                    "footer":htmlFooter,
                    "random":Math.random()
                },
                async:!isnoAsync,
                dataType:"json"
            }).done(function(data) {
                if(data.status==200){
                    allviewSort[pageId].data = htmlCenter;
                    window.noSave = true;//丢失页面临时
                    $(window).unbind('beforeunload');

                    $('#savesite').removeClass('on');
                    //self.releaseStatus(1);

                    self.saveStatus('成功');
                    if(typeof saveSite=='function'){
                        saveSite();
                    }
                    // isLoading && self.setLoadingStyle(false,"加载中…");//
                }else{
                    self.saveStatus('失败');
                    if(typeof saveErro=='function'){
                        saveErro();
                    }
                }
            })
            .fail(function (data) {
                self.setLoadingStyle(false,"加载中…");
            })
            .always(function (data) {
                dfd && dfd.resolve();
            })
		}else {
			dfd && dfd.resolve();
		}
		// return dfd;
	}

    /**
     * 替换文章详情为模版格式 lmr
     * @param html
     * @returns {string}
     */
    pageHeader.getArticleTemplate = function (html) {
        html = html.replace('<div class="sectionDragCtrl"></div>',"");
        var $html = $(html);
        $html.find("[data-jspTemp]").each(function (i,_) {
            var $this = $(_),
                temp = "${"+$this.attr("data-jspTemp")+"}";
            $this.hasClass("wqd-art-img") ? $this.attr("src",temp) :
                $this.hasClass("articleDetails") ? $this.attr("data-articledetailsid",temp) :
                    $this.hasClass("artDetlImg") ? $this.attr("class",$this.attr("class")+" <#if news.icon??><#else>artDetlHide</#if>") :
                        $this.html(temp);
        });
        return $html.map(function(index, elem) {
            return elem.outerHTML;
        }).get().join("");
    };

    /**
     * 过滤无用的html标签
     * @param htmlData
     * @returns {XML|string}
     */
	pageHeader.replacesome = function(htmlData) {
		return htmlData
			.replace(/(-|\w|\s|)*animation(-|:)+(-|\w|\s|:)*;/g,"")
			.replace(/<div class="guide h draggable" id="guide-.+<\/div>?/g,"")
			.replace(/<div class="rotationdiv".+<div class="rotationdivend"><\/div><\/div>/g,"")
			.replace(/<div class="bg_editor.+<em status="end"><\/em><\/div>/g,'')
			.replace(/<div class="banner_editor.+<em status="end"><\/em><\/div>/g,'')
			.replace(/<div class="table_editos.+<em status="end"><\/em><\/div>/g,'')
			.replace(/wqdEditidos="1"/gi,'')
			.replace(/wqdtableeditwordos/g,'wqdeditos')
			.replace(/data-interval="false"/g,'data-ride="carousel"')
			.replace(/©/g,'&copy;')
			.replace(/onAniTriggerElem/ig,'')
			.replace(/onAniTriggerElemSelect/ig,'')
			.replace(/•/g,'&bull;')
			// .replace(/&nbsp;/g,' ')
			.replace(/<ul class="edit-convention-ul.+<div class="edit-convention-ul-end"><\/div><\/ul>/g,'')
			.replace(/<ul data-id="[0-9]+" class="edit-convention-ul.+<div class="edit-convention-ul-end"><\/div><\/ul>/g,'')
			.replace(/draggable="true"/gi,'')
			.replace(/contenteditable="true"/gi,'')
			.replace(/wqdGroupmove/gi,' ')
			.replace(/yzmoveContentBor/gi,' ')
			.replace(/<a class="wqdGroupAdd".+<em status="wqdgroupend"><\/em><\/a>/g,'')
			.replace(/<div class="wqdformlistos".+<li class="end"><\/li><\/ul><\/div>/g,'')
			.replace(/<div class="wqdtableWidthsetos">.+<b class="wqdtableWidthsetendos"><\/b><\/div>/g,'')
			.replace(/<div class="wqdGroupMenu">.+<em status="wqdmenuend"><\/em><\/div>/g,'')
			.replace(/<span class="wqdFromDesignDroplistRemoveos">X<\/span>/g,'')
			.replace(/<div class="yxsetHeightBox".+<div class="yxsetHeightBoxend"><\/div><\/div>/g,'')
			.replace(/<div class="wqdyxRespBox".+<div class="wqdyxRespBoxend"><\/div><\/div>/g,'')
			.replace(/wqdyxborderDashed/g,'').replace(/wqdLockedEdit/g,'')
			.replace(/^<div id=\"wqdcircleSelectos\".*>[\S|\n]*?<\/div>/g, "")
			.replace(/<script .*>[\S|\s]*?<\/script>/ig, "")
			.replace(/<div class="sectionDragCtrl"[^\>]*><\/div>/g,"")
			.replace(/fullMode-show/ig,"")
			.replace(/<div class="resize(L|R|T|B|LT|TR|BR|LB)">[\s|\S]*?<\/div>/g,'')
			.replace(/nav-show/ig,"");
	};

    //有缓存的话撤销按钮状态
	function setCancelBtn(canCancel) {
        //16.4.7
        // $("#wqdpHeaderD").find(".li-rev").addClass("on", !!(_pc.userActionCatchCancel.length > 1 || canCancel) ).end()
        $("#wqdpHeaderD").find(".li-rev").toggleClass("on", !!(_pc.userActionCatchCancel.length > 1 || canCancel) ).end()
            .find(".li-back").toggleClass("on",!!_pc.userActionCatchBack.length);
    }
	/* 调用用户缓存 */
	pageHeader.setCatch = function(beforeunload){
		this.closeEditor();
		if(beforeunload == 'beforeunload'){
			this.releaseStatus(2);
			$(window).bind('beforeunload',function(){
				return "您的操作未保存,是否离开此页面？";
			});
			window.noSave = false;//丢失页面临时
			setCancelBtn(true);
		} else {//页面刚加载不需要保存
			window.noSave = true;
		}
		if(!$('#wqdIphonePage').length) _pCommon.getSectionWidth();
		_pc.catchPush();
	}
	pageHeader.clearCatch = function(){
		$('a#savesite').removeClass('on');
		_pc.clear();

		setCancelBtn();
	}
	/* 撤销恢复功能 */
	pageHeader.cancel = function(){
		var catchData = _pc.Cancel() ,uw = null;

		setCancelBtn();
		if(catchData && catchData[0]){
			htmlHeader.html(catchData[0].htmlHeader);
			htmlCenter.html(catchData[0].htmlCenter);
			htmlFooter.html(catchData[0].htmlFooter);

			$('.elemResizeInfo').hide();

			var $areaGroup = $("#wqdpHeaderSetStationD").find("ul li.area .areaGroup");
			if(uw){
				$areaGroup.find(".useBtn").removeClass("on").html("选择");
				switch(parseInt($('style#styleCss').attr('uw'))) {
					case 1400:$areaGroup.eq(0).find(".useBtn").addClass("on").html("使用中");break;
					case 1200:$areaGroup.eq(1).find(".useBtn").addClass("on").html("使用中");break;
					case 960:$areaGroup.eq(2).find(".useBtn").addClass("on").html("使用中");break;
				}
			}else{
				$areaGroup.eq(1).find(".useBtn").addClass("on").html("使用中");
			}

			this.releaseStatus(2);
			// this.noSave = false;
			window.noSave = false;//丢失页面临时
			_bl.basicapp();		//需要依赖pageList

			$.fn.colorSetting(false);
			$('#wqdcircleSelectos').remove();
			$(document).trigger("arlLists:reload");
			// if(catchData[1]==1){
			// 	this.releaseStatus(1);
			// }
		}

	}
	pageHeader.back = function(){
		var catchData = _pc.Back() ,uw = null;
		setCancelBtn();
		if(catchData){
			htmlHeader.html(catchData.htmlHeader);
			htmlCenter.html(catchData.htmlCenter);
			htmlFooter.html(catchData.htmlFooter);

			$('.elemResizeInfo').hide();


			var _areaGroup = $("#wqdpHeaderSetStationD ul li.area").find(".areaGroup");
			var uw = $('style#styleCss').attr('uw') || "";
			if(uw.length){
				_areaGroup.find(".useBtn").removeClass("on").html("选择");
				switch(parseInt($('style#styleCss').attr('uw'))) {
					case 1400:_areaGroup.eq(0).find(".useBtn").addClass("on").html("使用中");break;
					case 1200:_areaGroup.eq(1).find(".useBtn").addClass("on").html("使用中");break;
					case 960:_areaGroup.eq(2).find(".useBtn").addClass("on").html("使用中");break;
				}
			}else{
				_areaGroup.eq(1).find(".useBtn").addClass("on").html("使用中");
			}

			this.releaseStatus(2);
			// this.noSave = false;
			window.noSave = false;//丢失页面临时
			_bl.basicapp();		//需要依赖pageList
			$('#wqdcircleSelectos').remove();
			$.fn.colorSetting(false);
		}
	}
	/* 保存状态 以及发布 */
	pageHeader.saveStatus = function(msg){
		var btn = $('#savesite');
		btn.html(msg+'<em></em>');
		setTimeout(function(){ btn.html('保存<em></em>'); },1000);
	}
	pageHeader.releaseStatus = function(status){
		if(status == 1){
			$('#savesite').removeClass('on');
		}else if(status == 2){
			$('#savesite').addClass('on');
		}
	};
	/* 发布没用用上，只在openV2中release.jsp中使用 */
	pageHeader.issue = function(name,callback){
		_pCommon.ajax('POST',URLPATH+'api/publish',{'siteId':USERSITEID,'name':name,"random":Math.random()},true,'json',function(issueData,that){
			if(issueData.status==200){
				window.yxWebSite.webSiteName = name;	//暂定全局，以后再改
				that.WebRelease = true;
				$('.tool-list li').eq(0).removeClass('on');
				if(typeof callback=='function'){
					callback();
				}
			}
		},this);
	}
	/* 关闭文本编辑器 */
	pageHeader.closeEditor = function(){
		$(document).trigger('texteditor:close');
	}

	/* 设计器 分享功能 */
	pageHeader.sharegetInf = function(){
		var bdhtml = '<div class="bdsharebuttonbox" data-tag="share_1" style="position:absolute;bottom:0;right:0;display:none;"><a class="bds_sqq" data-cmd="sqq"></a><a class="bds_weixin" data-cmd="weixin" href="#"></a><a class="bds_tsina" data-cmd="tsina"></a><a class="bds_baidu" data-cmd="baidu"></a><a class="bds_renren" data-cmd="renren"></a><a class="bds_qzone" data-cmd="qzone"></a><a class="bds_tqq" data-cmd="tqq"></a><a class="bds_tieba" data-cmd="tieba"></a><a class="bds_count" data-cmd="count"></a></div>';

		$(".bdsharebuttonbox").length || $('body').append(bdhtml);
		var title = allviewSort[USERPAGEID].seoTitle || ' ' ,description = allviewSort[USERPAGEID].seoDescn || ' ' ,url = window.yxWebSite.webSitedomain || ' ' ,_this = this;;

		window._bd_share_config = {
			common : {
				bdText : title,
				bdDesc : description,
				bdUrl : url,
				bdPic : '',
				onBeforeClick : function(cmd,config){
					config.bdText = allviewSort[USERPAGEID].seoTitle || ' ';
					config.bdDesc = allviewSort[USERPAGEID].seoDescn || ' ';
					config.bdUrl = window.yxWebSite.webSitedomain || ' ';
					return config;
				}
			},
			share : [{
				"bdSize" : 16
			}]
		};
		with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion='+~(-new Date()/36e5)];
	}
	pageHeader.designShare = function(index){
		switch(index){
			case 1:
				$('a.bds_tsina')[0].click();
				break;
			case 2:
				$('a.bds_weixin')[0].click();
				break;
			case 3:
				$('a.bds_sqq')[0].click();
				break;
		}
	}
	return pageHeader;
});
