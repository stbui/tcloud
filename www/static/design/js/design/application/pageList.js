define(['pageHeader', 'pageCommon', 'buildList', 'pageSet','utility','pageCatch'], function(_ph, _pCommon, _bl, _ps,_ut,_pc) {
	var pageList = {};

	pageList.init = function() {
		window.allview = window.allviewSort = {};
		window.htmlHeader = $('#HTMLDATAHEADER .wqdView');
		window.htmlCenter = $('#HTMLDATACENTER .wqdView');
		window.htmlFooter = $('#HTMLDATAFOOTER .wqdView');
		window.partListArr = [];
		_pCommon.ajax('GET',URLPATH+'api/all',{"random":Math.random(),"siteId":USERSITEID},false,'json',function(data,that){
			that.pagehf = [];
			// that.noSave = true;
			window.noSave = true;//丢失页面临时 noSave为true时不可保存
			that.rg = null;
			that.partSortId = 0; 
			if(USERPAGEID){
				allview = data;
				for(j=0;j<data.length;j++){
					allviewSort[data[j].id] = data[j];
				}
				that.editBox = {};
				that.allpageload();
			}else{
				that.addPage();
			}
			that.bindPageList();				//需要提取到pageListCtrl中去
			//that.autoSaveTime = null;
			that.loadhf('changepage'); // 现在调用是为了 获得网站webSiteName   systemDomain
			that.loadPart('changepage'); //页面刚加再进来 不需要保存提示

			/* 页面SEO名称 */
			$("#wqdpHeaderSetStationD .icon div.iconTitle").text(allviewSort[USERPAGEID].seoTitle || "微企点，一站式");
		},this);

		var _self = this;
		$(document).on('convertPcToPhoneCallBack',function(){
			_self.changePageSynchroStatus();
		})
        .on('isPcToPhone',function(){
			_self.convertPcToPhone();
		})
        .on("addArticleDetailPage",function (e,data) {
            _self.addPageTemplate("10531", "article",data.dfd);
        });
	}


	pageList.buildPart = function(id ,htmlData ,name ,categoryId ,sectionid){
		var node = '' ,p = $(htmlData) ,style = $('<style type="text/css" class="'+id+'" >#'+id+':before{content:" ";position:absolute;top:0;left:0;width:100%;height:100%;background-color:#fff;}</style>');

		++this.partSortId;
		if($('#wqdIphonePage').length) p.attr('data-coverPhone','true');

		node = $('<div class="wqdSectiondiv" data-type="wqdSectiondiv" sortId="'+this.partSortId+'" partId="'+id+'" commonpartid="'+sectionid+'" id="'+id+'" sectionName="'+name+'" partcategoryId="'+categoryId+'"></div>').append(p);

		node = $('<div class="yzmoveContent yzmoveContentBor"></div>').append(node);

		return node;
	}
	pageList.searchJs = function(id){
		var js = htmlFooter.find('script[src]') ,reg = new RegExp(id,'ig') ,src = '';
		js.each(function(){
			if($(this).attr('partid').match(reg)){
				src = $(this).attr('src');
			}
		});
		return src;
	}
	pageList.buildJs = function(id,js){
		if(js!=''){
			js = js.split(';');
			for(i=0;i<js.length;i++){
				var scriptJS = htmlFooter.find('script[src="'+js[i]+'"]');
				if(scriptJS.length){
					scriptJS.attr('partId',scriptJS.attr('partId')+','+id);
					var initFn = $('div[partid='+id+']').find('section[wqdinitsectionos]').attr('wqdinitsectionos');
					if(initFn){
						initFn = initFn.split(',');
						for(k=0;k<initFn.length;k++){
							if(typeof window[initFn[k]]=='function'){
								window[initFn[k]]();
							}
						}
					}
				}else{
					htmlFooter.append($('<script type="text/javascript" partId="'+id+'" src="'+js[i]+'"></script>'));
				}
			}
		}
	};

	/* 通条的排序  删除通条  通条修改名字 */
	/** 通条排序
	 * @param {[number]} currIndex 当前序号
	 * @param {[number]} insertIndex 插入到位置上的序号
	 */
	pageList.partSort = function(currIndex, insertIndex) {
		// console.log(currIndex, insertIndex);
		var currSection = htmlCenter.find('div.yzmoveContent').eq(currIndex), clone = currSection.clone(true);
		if(currIndex < insertIndex) {
			htmlCenter.find('div.yzmoveContent').eq(insertIndex).after(clone);
		} else {
			htmlCenter.find('div.yzmoveContent').eq(insertIndex).before(clone);
		}
		currSection.remove();

		_ph.setCatch('beforeunload');
		// this.noSave = false;
		window.noSave = false;//丢失页面临时

	}
	pageList.removePart = function(node){
		var li = node.parents('li[partid]') ,partid = li.attr('partid') ,index = null ,jsarr =[] ,jsobj=null ,categoryid = li.attr('sectioncategoryid');

		htmlFooter.find('script[partid]').each(function(){
			jsarr = $(this).attr('partid').split(',');

			for(i=0;i<jsarr.length;i++){
				if(partid==jsarr[i]){
					index = i;
					jsobj = $(this);
					return false;
				}
			}
		});

		$('style.'+partid).remove();

		if(jsobj!=null){
			var res = _pCommon.removeTarget(jsarr,index);
			res.length ? jsobj.attr('partid',res.join(',')) : jsobj.remove();
		}

		$('div[partid='+partid+']').parent('.yzmoveContent').remove();

		if(partid == $('.tool-list2').attr('partid')){
			$('.tool-list2').removeAttr('partid').removeAttr('isheader');
		}

		if(node.parents("ul").hasClass("header")){
			li.siblings().length ? li.remove() : li.parent().html('<li><i class="wqdmovedrop"></i><a href="javascript:;">添加导航</a><b><span class="facBtn2"></span></b></li>');
			this.pagehf[0] = '';
			htmlCenter.find('.wqdAreaView').removeAttr('style');
			htmlFooter.find('.wqdAreaView').removeAttr('style');
		}else if(node.parents("ul").hasClass("footer")){
			li.siblings().length ? li.remove() : li.parent().html('<li><i class="wqdmovedrop"></i><a href="javascript:;">添加页脚</a><b><span class="facBtn2"></span></b></li>');
			this.pagehf[1] = '';
		}else{
			li.remove();
		}

		//页面上的导航也要有这个操作，导航回调
		$(document).trigger("wqdNavCallback",{category:4, pageids:partid});
		//this.rulerInit();
		_ph.setCatch('beforeunload');

	}
	pageList.modifyvViewPart = function(sectionId ,name){
		$('div[partid='+sectionId+']').attr('sectionname',name);

		_ph.setCatch('beforeunload');
	}
	/* 页面加载时候 或者 取消恢复的时候  需要重新绑定一些事件 */
	pageList.loadPart = function(msg){
		var that = this;

		var _areaGroup = $("#wqdpHeaderSetStationD ul li.area").find(".areaGroup");
		if($('style#styleCss').length){
			var uw = $('style#styleCss').attr('uw');
			if(uw) {
				_areaGroup.find(".useBtn").removeClass("on").html("选择");
				switch(parseInt(uw)) {
					case 1400:_areaGroup.eq(0).find(".useBtn").addClass("on").html("使用中");break;
					case 1200:_areaGroup.eq(1).find(".useBtn").addClass("on").html("使用中");break;
					case 960:_areaGroup.eq(2).find(".useBtn").addClass("on").html("使用中");break;
				}
			} else {
				_areaGroup.eq(1).find(".useBtn").addClass("on").html("使用中");
			}
		}else{
			_areaGroup.eq(1).find(".useBtn").addClass("on").html("使用中");
		}

		$('div.yzmoveContent').each(function(){
			++that.partSortId;
		});

		$('div[data-elementtype=wqdTable]').find('table td').attr('contenteditable',true);

		$('*[wqdckemptytextos=wqdCkEmptyTextos]').each(function(){
			if(!$(this).parents('.sectionV2').length)  $(this).html('<div class="wqdCkEmptyTextos">在此处添加文本</div>');
		});

		if(!$('#wqdIphonePage').length) _pCommon.getSectionWidth();
		this.commonset(msg);//切换页面时候 不需要  bindPageList 方法提供的msg
		// this.noSave = true;
		// window.noSave = false;//丢失页面临时
	}
	pageList.commonset = function(msg){
		var that = this;

		_bl.basicapp();         //为啥老是重复调用？
		if(msg=='changepage'){//页面第一次加载时候设置缓存且不提示用户
			_ph.setCatch();
		}else{
			_ph.setCatch('beforeunload');
		}

		$(".nano").nanoScroller();
	}
	/* 页面排序保存 */
	pageList.pagesort = function(){
		var list = [];
		$('.pagedeatllist>li:not(.end)').each(function(i){
			if($(this).attr('pageid')){
				list.push($(this).attr('pageid'));
			}
		})
		_pCommon.ajax('POST',URLPATH+'design/page/sort',{'siteId':USERSITEID,'pageIds':list.join(','),"random":Math.random()},true,'json',function(data,that){
			if(data.status!=200){
				//that.pagesort();
			}
		},this);
	}

	/** 将点击内容取出来，并传入左侧通条栏
     * @param  {[string]} $id [partid号]
     * @param  {[object]} $obj [对应的点击元素的jQuery对象]
     */
	pageList.getDataTContent = function($id, $obj) {
		var newid = "wqd" + new Date().getTime() + "serial";

		for(var i=0; i< partListArr.length; i++) {
			if(partListArr[i].id == $id) {
				var data = partListArr[i];
				this.addPart(newid, data.data, data.js ,data.name ,data.categoryId , data.id, $obj, data.type);
				$('#wqdaddcolD').hide();
				$("#wqdpageSectionD").hide();
				break;
			}
		}
	}
/* 通条所有分类 页面展示 */
	//获取对应的通条类型列表
	pageList.getCategoryTList = function(type) {
		var node = "";
		//AJAX 获取通条类型列表
		var typeUrl = '';

		typeUrl = !$('#wqdIphonePage').length ? URLPATH+'api/section' : URLPATH+'api/phone';

		_pCommon.ajax('GET',typeUrl,{"random":Math.random()},false,'json',function(data,that,msg){
			//类型列表
			var html = '';
			if(data != null) {
				for(i=0;i<data.length;i++){
					html += '<li type="'+data[i].id+'"><a href="javascript:;">'+data[i].value+'</a></li>';	//接口更改name 改为value
				}
				$('#wqdaddcolD ul.category-list').html(html);
				$('#wqdaddcolD').show();
				var li = $("#wqdaddcolD ul.category-list li");
				if(li.attr("type") != 21 || li.attr("type") != 12) {
					li.eq(0).before('<li type="21"><a href="javascript:;">头部导航</a></li>');
					li.eq(li.length-1).after('<li type="12"><a href="javascript:;">底部页脚</a></li>');
				}
				li = $("#wqdaddcolD ul.category-list li");
 				if(type == "00100") {//去头尾
					li.eq(li.length-1).hide();
					li.eq(1).addClass("active");
					li.eq(0).hide();
				}
				if(type == 21) {//头
					li.hide();
					li.eq(0).addClass("active").show();
				}
				if(type == 12) {//尾
					li.hide();
					li.eq(li.length-1).addClass("active").show();
				}
				that.getAllTList(1, type);
			}
		},this,node);
	}
	//获取对应的类型下所有的通条
	pageList.getAllTList = function(nowpage, typeId) {
		partListArr = [];
		var node = "" ,typeUrl = '';

		/* 如果typeId 为"00100" 那么就是打开默认，如果是默认那么选择列表中的第一个 */
		if(typeId == "00100") {
			typeId = $("#wqdaddcolD ul.category-list li").eq(1).attr("type");
		}
		typeUrl = URLPATH+'api/section1?cateid='+typeId+'&pageSize=12&random='+Math.random();
		if(typeId == 12) {//尾--PC
			typeUrl = URLPATH+'api/footer?pageSize=12&random='+Math.random();
		}
		if(typeId == 21) {//头--PC
			typeUrl = URLPATH+'api/header/?pageSize=12&random='+Math.random()
		}
		//AJAX 获取通条所有数据列表
		_pCommon.ajax('GET',typeUrl,{"random":Math.random()},false,'json',function(data,that,msg){
			//所有通条数据显示
			var html = '';
			if(data != null) {
				for(i=0;i<data.data.length;i++){
					//存入数据
					partListArr.push({"id":data.data[i].id, "data": data.data[i].data, "js":data.data[i].js, "name":data.data[i].name, "categoryId":data.data[i].categoryId, "type":data.data[i].type});

					html += '<li partId="'+data.data[i].id+'" ><div class="po"><div class="pic-box"><img src="'+data.data[i].icon+'"></div><p class="pic-describe">'+data.data[i].name+'</p><div class="tier text-center"><a class="use" href="javascript:;"><i class="fa fa-plus"></i></a></div></div></li>';
				}
			} else {
				data.totalCount = 0;
				html = "<li>敬请期待!</li>";
			}
			$('#wqdaddcolD ul.slide-list').html(html);
			//滚动条
			$("#wqdaddcolD .nano").height($("#wqdaddcolD .nano").height());
			$("#wqdaddcolD .nano").nanoScroller();
			//分页显示
			that.showNavgTList(nowpage, data.totalCount);
		},this,node);
	}
	//计算分页的个数，并显示出来
	pageList.showNavgTList = function(nowpage, totalCount) { //分页
		var html = '';
		if(totalCount>0) {
			if(totalCount > 12) {
				var page = Math.ceil(totalCount / 12);
				for(k=1;k<=page;k++){
					if(k==nowpage){
						html += '<li class="on"><a href="javascript:;">'+k+'</a></li>';
					}else{
						html += '<li><a href="javascript:;">'+k+'</a></li>';
					}
				}
			}else{
				html = '<li class="on"><a href="javascript:;">1</a></li>';
			}
		}
		$('#wqdaddcolD .page-nation ul').html(html);
	}
	function copySectionAnimate(animateMap) {
        $node.find()
	}
	/*
	 * 复制通条，存储对应的要复制的html代码，并提交
	 * 4.29 发现完全没用到这个方法，确定后可删除掉
	 * auth: yx
	 */
	pageList.yxsavePartHTML = function(li){
		var node = htmlCenter.find('div[partid='+li.attr('partid')+']').clone(true),
			partid = "wqd"+new Date().getTime()+"serial", //这个值传,作为识别ID
			oldpartid = li.attr('partid');

        node.find('.wqdelementEdit').each(function(index){
            var elemid = "elementId"+new Date().getTime() + index;
            var oldelemid = $(this).attr('id');
            $(this).attr('id',elemid).attr('elementid',elemid);
            if($(this).attr('triggerelem')){
                $(this).attr('triggerelem', $(this).attr('triggerelem').replace(new RegExp(oldelemid,'ig'),elemid) );
            }

            var styleobj = node.find('style.'+oldelemid);
            if(styleobj.length){
                var stylehtml = styleobj.removeClass().addClass('elemid').html().replace(new RegExp(oldelemid,'ig'),elemid);
                styleobj.html(stylehtml);
            }
        });
        node.attr('partid',partid).attr('id',partid);
        node.attr("sectionname",'（复制）' + node.attr("sectionname"));
        //编码字符串数组
        arrStr = [
            this.replacesome(node[0].outerHTML), //先过滤htmlData中的一些代码，代表 htmlData
            this.searchJs(li.attr('partid')), //代表 js
            node.attr("sectionname"), //代表 name
            node.attr("partcategoryid"), //代表 categoryId
            node.attr("commonpartid") //代表 sectionid
        ];
		//要编码字符串
		var strHTML = $.base64.btoa(arrStr.join(";;"));
		var sameFlag = false;
		//AJAX 传输值
		_pCommon.ajax('POST',URLPATH+'design/section/addSection',{siteId:USERSITEID, key:partid, value:strHTML,"random":Math.random()},false,'json',function(data,that,msg){
			if(data.status==200){
				//调用AJAX，如果成功，则在下方的剪切板上加入可复制的通条
				that.yxupdateCutBox(arrStr[2], partid, arrStr[3]);
			}
		},this,node);
	}
	pageList.yxupdateCutBox = function(name, partid, categoryid) {
		var htmlStr = '<li partid="'+partid+'" categoryid="'+categoryid+'"><em title="'+name+'">'+name+'</em><b><span class="facBtn3" title="删除"></span><span class="facBtn8" title="粘贴"></span></b></li>'
		$("#wqdUpdateCutBox ul").append(htmlStr);
		//yxshowCutBox();//重新刷新剪切板
	}

/* 页面级操作  页面功能 */
	pageList.yxTime = null;//计时器，记录单击和双击事件的顺序
    /**
     * 切换页面方法
     * @param $this
     * @returns {JQueryDeferred<T>}
     */
	pageList.changePage = function ($this,changePageDfd) {
        var self = this,
            $li = $this.parents('li'),
            related = $li.attr('related');
        if($li.hasClass('on')) return changePageDfd && changePageDfd.resolve();

        var changePageCallback = function(){
            USERPAGEID = $li.attr('pageid');//时间充裕时需重构，此处应移到请求页面成功后。目前直接移过去会有问题，故先保留，增加载入失败移回来。
            var $pageSection = $('#wqdpageSectionD');
            $pageSection.find('.wqdaddpagebtn').show();//页面栏目 > 添加通栏，似乎是已废弃的样式

            if(!$li.hasClass('on')){
                self.readPage(function(){
                    //此段相当混乱，class及代码均需整理
                    $('.func-list .title label').html(allviewSort[$li.attr('pageid')].name);

                    $(".nano").nanoScroller();
                    _ph.clearCatch();
                    self.loadPart('changepage');

                    $('.wqdBkEditos').editInit(false);//新闻

                    if($('.pagedeatllist li.on').find('i.navnewsicon').length){
                        $('#wqdUpdateCutBox').hide();
                        return;
                    }

                    // 添加选中状态
                    $this.parents(".pageShow").addClass("on")
                        .parents("li").siblings("li").find(".pageShow").removeClass("on").end()
                                                    .find("p.openIcon").addClass("on").end()
                                                    .find(".sectionList").slideUp();

                    $li.addClass('on').siblings().removeClass('on');
					$(document).trigger("arlLists:reload");
                    changePageDfd && changePageDfd.resolve();
                });
            }
            $("#wqdPageInfD").hide();
            $pageSection.find("span.facBtn1").removeClass("on");//移除设置按钮的选中效果

            // 关闭通条模板添加页
            $("#wqdaddcolD img.close").click();
        };

        if(window.noSave) {
            changePageCallback();
        } else {
            _ph.save(changePageCallback,void 0,void 0,void 0,void 0,true);
        }
	};
	pageList.bindPageList = function(){
		var self = this;
		//单击输入框切换页面--版本2
		$(".pagedeatllist").on("click", "li .pageShow em", function(e){
            self.changePage($(this));
		});
		//输入框更改--版本2
		$(".pagedeatllist").on("dblclick",'li .pageShow em', function() {
			clearTimeout(self.yxTime);//清除单击事件
			if(!$(this).parent().hasClass("end")) {
				self.yxbindEvent(2, $(this));
				event.stopPropagation();
			}
		});


	}
	//绑定事件
	pageList.yxbindEvent = function(c, _self) {
		var that = this;
		switch(c) {
			case 0: that.addPage(_self);break;//添加功能
			case 2: that.updataInput(_self);break;//输入框操作功能
			case 6: that.addnewspage(_self);break;
			default:break;
		}
	}
	/*
	 * 新闻页面添加
	 */
	pageList.addPage = function(_self){
		var that = this ,node = null  ,url = '' ,isNews = '' ,newsnode = '' ,
		li = $('#wqdpageContentD .pagedeatllist li[data=cont]:last') || $('#wqdpageContentD .pagedeatllist li[listarticle=true]') ,nopage=true;

		if(!_self){
			li = $('#wqdpageContentD .pagedeatllist');
			isNews = 0;
		}else{
			isNews = !_self.index() ? 0 : 1
			nopage = false;
		}

		url = !isNews ? URLPATH+'design/page/create' : URLPATH+'design/news/addNews';
		related = new Date().getTime();
		g = !isNews ? 'POST' : 'GET';

		//新页面条内容--版本2
		_pCommon.ajax(g,url,{"siteId":USERSITEID,"random":Math.random()},false,'json',function(data,that){
			if(data){
				if(!isNews){
					if(!nopage){
						var $pageLi = $('<li data="cont" pageid="'+data.id+'" data-uri="'+data.domain+'"><i class="wqdmovedrop"></i><em>'+data.name+'</em><b><span class="facBtn2" title="复制"></span><span class="facBtn1" title="设置"></span></b></li>');
						// if(li.attr("viewnews")) {
						// 	var viewnewsIndex = li.parent().children("[viewnews]:first");
						// 	li.before($pageLi);
						// } else {
							li.after($pageLi);
						// }

					}else{
						li.append($('<li data="cont" pageid="'+data.id+'" data-uri="'+data.domain+'"><i class="home wqdmovedrop"></i><em>首页</em><b><span class="facBtn2" title="复制"></span><span class="facBtn1" title="设置"></span></b></li>'));
					}
					allviewSort[data.id] = data;
					$('.func-list .title label').html(data.name);
				}else{
					for(i=0;i<data.data.length;i++){
						newsnode += '<li related="'+data.data[i].associateId+'" viewnews="true" pageid="'+data.data[i].id+'" data-uri="'+data.data[i].domain+'"><i class="navnewsicon"></i><em>'+data.data[i].name+'</em><b><span class="facBtn1" title="设置"></span></b></li>';
						allviewSort[data.data[i].id] = data.data[i];
					}
					node = $(newsnode);
					li.after(node);

					node.find("em").on("dblclick", function() {
						clearTimeout(that.yxTime);//清除单击事件
						that.yxbindEvent(2, $(this));
						event.stopPropagation();
					});
				}
				//重新绑定新添加的输入框功能
				// $.fn.wqdDragDropList_css({'nodeSelector' : '#wqdpageContentD ul.pagedeatllist li.plist .pageShow i' ,'parentSelector' : 'li.plist' });
				$("#wqdpageContentD .nano").nanoScroller();
			}
		},this);
	}



	/*
	 * 输入框聚焦修改或失去焦距保存
	 * param--传当前em标签对象
	 */
	pageList.updataInput = function(_self) {
		var that = this ,partid = _self.parents('li').attr('pageid') ,setname = _self.attr('title') || _self.html();
		if(_self.find('input').length){
			return false;
		}
		_self.addClass("edit").html('<input type="text" maxlength="16" value="'+setname+'">');
		_self.off("dblclick").children().focus();


		function preserved(){
			var str = $.trim($(this).val()) || $(this).attr('placeholder');
			var str2 = _pCommon.setString(str,16);
			$(this).off("blur").parent().html(str2).attr('title',str).removeClass("edit").on("dblclick", function() {
				clearTimeout(that.yxTime);//清除单击事件
				that.yxbindEvent(2, $(this));
				event.stopPropagation();
			});

			//AJAX提交--名字更改
			_ps.modifyonlyPage(partid,'','','',str,'','');

			//缓存姓名更改
			if(allview[partid] != {} && allview[partid] != void 0) {
				allview[partid].name = str;
			}
		}
		//修改栏目名称或页面名称时，回车生效
		_self.children().on("blur",preserved).on("keyup", function (e){
			if(e.keyCode==13){
				preserved.call(this)
			}
		});
	};

/**************************************** 产生页面选项  待修改 start **********************************************/
	/*
	 * 添加模板页面
	 */
	pageList.addPageTemplate = function(templateId, pageType,dfd){
		var node = null, url = '', htmlStr = "",
		li = $('#wqdpageContentD .pagedeatllist li.plist[data=cont]:last');

		url = URLPATH + 'design/newPage/' + templateId;
		url = URLPATH + 'api/page/add?id=' + templateId;

		//新页面条内容--版本2---通过pageType判断是否是新闻页
		_pCommon.ajax('GET',url,{"siteId":USERSITEID,"pageType":pageType,"random":Math.random()},false,'json',function(data,that){
			if(data){
				allviewSort[data.data.id] = data.data;

				htmlStr += '<li class="plist" data="cont" pageid="'+data.data.id+'" data-uri="'+data.data.domain+'"'+(data.data.pageType == 'article' ? 'viewnews="true"' : '')+'>'
				htmlStr += 	'<div class="pageShow ">';
				htmlStr += 		'<i class="wqdmovedrop'+(data.data.pageType == 'article' ? ' article' : '')+'"></i><em>'+data.data.name+'</em><b><span class="facBtn1" title="设置"></span><span class="facBtn2" title="复制"></span><span class="facBtn3" title="删除"></span></b><p class="openIcon on"></p>';
				htmlStr += 	'</div>';
				htmlStr += 	'<div class="sectionList" style="display:none;">';
				htmlStr += 		'<ul class="userht header">';
				htmlStr += 			'<li><i class="wqdmovedrop"></i><a href="javascript:;">添加导航</a><b><span class="facBtn2"></span><span class="facBtn3"></span></b></li>';
				htmlStr += 		'</ul>';
				htmlStr += 		'<ul class="usercontent">';
				htmlStr += 			'<li class="slist" data="cont" sectioncategoryid="2" partid="wqd1453120378474serial">';
				htmlStr += 				'<i class="wqdmovedrop"></i><em title="1">1</em><b><span class="facBtn1" title="复制"></span><span class="facBtn3" title="删除"></span></b>';
				htmlStr += 			'</li>';
				htmlStr += 		'</ul>';
				htmlStr += 		'<div class="wqdaddpagebtn">';
				htmlStr += 			'<span></span>添加通栏';
				htmlStr += 		'</div>';
				htmlStr += 		'<ul class="userht footer">';
				htmlStr += 			'<li><i class="wqdmovedrop"></i><a href="javascript:;">添加页脚</a><b><span class="facBtn2"></span><span class="facBtn3"></span></b></li>';
				htmlStr += 		'</ul>';
				htmlStr += 	'</div>';
				htmlStr += '</li>';

				if(li.attr("viewnews")) {
					li.before(htmlStr);
				} else {
					li.after(htmlStr);
				}
                dfd && dfd.resolve();
				$("#wqdpageContentD .nano").nanoScroller();
			}
		},this);
	}
	//获取对应的通条类型列表
	pageList.getPageTemplateTag = function(type) {
		var node = "";
		//AJAX 获取通条类型列表
		var typeUrl = URLPATH+'api/page';

		_pCommon.ajax('GET',typeUrl,{"random":Math.random()},false,'json',function(data,that,msg){
			//类型列表
			var html = '';
			if(data != null) {
				for(i=0;i<data.length;i++){
					html += '<li type="'+data[i].id+'"><a href="javascript:;">'+data[i].value+'</a></li>';	//接口更改name 改为value
				}
				/* 手动添加文章模板页列表 */
				html += '<li type="123456789"><a href="javascript:;">文章详情</a></li>';
				$('#wqdaddPageTemplateD ul.category-list').html(html);
				$('#wqdaddPageTemplateD').show();

				that.getPageTemplateList(1, data[0].id);
			}
		},this,node);
	}
	//获取对应的类型下所有的通条
	pageList.getPageTemplateList = function(nowpage, typeId) {
		partListArr = [];
		var node = "" ,typeUrl = '';

		typeUrl = URLPATH+'api/page/?cateid='+typeId+'&pageSize=12&random='+Math.random();

		/* 如果是文章模板页类型 */
		if(typeId == "123456789") {
			typeUrl = URLPATH+'sys/template/query/article/'+nowpage+'?pageSize=12&random='+Math.random();
		}

		//AJAX 获取通条所有数据列表
		_pCommon.ajax('GET',typeUrl,{},false,'json',function(data,that,msg){
			//所有通条数据显示
			var html = '';
			if(data != null) {
				for(i=0;i<data.data.length;i++){
					//存入数据
					partListArr.push({"id":data.data[i].id, "data": data.data[i].data, "js":data.data[i].js, "name":data.data[i].name, "categoryId":data.data[i].categoryId});

					html += '<li partId="'+data.data[i].id+'" ><div class="po" data-pagelisttype="'+ (typeId == "123456789" ? "article":"") +'"><div class="pic-box"><img src="'+data.data[i].icon+'"></div><p class="pic-describe">'+data.data[i].name+'</p><div class="tier text-center"><a class="use" href="javascript:;"><i class="fa fa-plus"></i></a></div></div></li>';
				}
			} else {
				data.totalCount = 0;
				html = "<li>敬请期待!</li>";
			}
			$('#wqdaddPageTemplateD ul.slide-list').html(html);
			//滚动条
			$("#wqdaddPageTemplateD .nano").height($(window).height()-50-60-50-40-$("#wqdaddPageTemplateD .category-list").height());
			$("#wqdaddPageTemplateD .nano").nanoScroller();
			//分页显示
			that.showPageTList(nowpage, data.totalCount);
		},this,node);
	}
	//计算分页的个数，并显示出来
	pageList.showPageTList = function(nowpage, totalCount) { //分页
		var html = '';
		if(totalCount>0) {
			if(totalCount > 12) {
				var page = Math.ceil(totalCount / 12);
				for(k=1;k<=page;k++){
					if(k==nowpage){
						html += '<li class="on"><a href="javascript:;">'+k+'</a></li>';
					}else{
						html += '<li><a href="javascript:;">'+k+'</a></li>';
					}
				}
			}else{
				html = '<li class="on"><a href="javascript:;">1</a></li>';
			}
		}
		$('#wqdaddPageTemplateD .page-nation ul').html(html);
	}

/**************************************** 产生页面选项  待修改 end **********************************************/




//初始化页面加载函数

	pageList.changePageSynchroStatus = function(){
		_pCommon.ajax('POST',URLPATH+'design/page/updateIsSynchro',{"pageId":USERPAGEID,"random":Math.random()},false,'json',function(data,that){
			if(data.status==200) allviewSort[USERPAGEID].synchro = false;
		},this);
	}
	pageList.allpageload = function(){
		/* 寻找存放列表父级, html字符串变量 */
		var plist = $("#wqdpageContentD .pagedeatllist"), htmlStr = "";
		/* 循环遍历大数组 */
		for(var i=0; i<allview.length; i++) {
			/* 新闻页暂时和普通的一样 */
			// if(allview[i].pageType != 'normal') continue;
			htmlStr += '<li class="plist '+ (i==0 ? "on" : "") +'" data="cont" pageid="'+allview[i].id+'" data-uri="'+allview[i].domain+'"'+(allview[i].pageType == 'article' ? 'viewnews="true"' : '')+'>';
			htmlStr += 	'<div class="pageShow '+ (i==0 ? "on" : "") +'">';
			htmlStr += 		'<i class="'+ (!allview[i].sortId ? "home" : (allview[i].pageType == 'article' ? 'article' : '')) +' wqdmovedrop"></i><em>'+allview[i].name+'</em><b><span class="facBtn1" title="设置"></span><span class="facBtn2" title="复制"></span>'+(!allview[i].sortId ? "" : '<span class="facBtn3" title="删除"></span>')+'</b><p class="openIcon on"></p>';
			htmlStr += 	'</div>';
			htmlStr += 	'<div class="sectionList" style="display:none;">';
			htmlStr += 		'<ul class="userht header">';
			htmlStr += 			'<li><i class="wqdmovedrop"></i><a href="javascript:;">添加导航</a><b><span class="facBtn2"></span><span class="facBtn3"></span></b></li>';
			htmlStr += 		'</ul>';
			htmlStr += 		'<ul class="usercontent">';
			htmlStr += 			'<li class="slist" data="cont" sectioncategoryid="2" partid="wqd1453120378474serial">';
			htmlStr += 				'<i class="wqdmovedrop"></i><em title="1">1</em><b><span class="facBtn1" title="复制"></span><span class="facBtn3" title="删除"></span></b>';
			htmlStr += 			'</li>';
			htmlStr += 		'</ul>';
			htmlStr += 		'<div class="wqdaddpagebtn">';
			htmlStr += 			'<span></span>添加通栏';
			htmlStr += 		'</div>';
			htmlStr += 		'<ul class="userht footer">';
			htmlStr += 			'<li><i class="wqdmovedrop"></i><a href="javascript:;">添加页脚</a><b><span class="facBtn2"></span><span class="facBtn3"></span></b></li>';
			htmlStr += 		'</ul>';
			htmlStr += 	'</div>';
			htmlStr += '</li>';

		}
		/* 页面顶部当前页面名称 */
		$("#wqdpHeaderD ul.func-list li.title label").html(allviewSort[USERPAGEID].name);
		/* 加载进DOM结构 */
		plist.html(htmlStr);
	}


	/** 拆分后第一个版本 V3.0.1  每次修改版本往上加1
	 * 优化一部分
	 * 复制通条
	 * @param  {[object]} li [传入对应点击代表的li列表对象]
	 */
	pageList.copyPart = function(li){
		var node = htmlCenter.find('div[partid='+li.attr('partid')+']').clone(true),
			partid = "wqd"+new Date().getTime()+"serial", //这个值传,作为识别ID
			oldpartid = li.attr('partid');

        var $newPart = this.addPart(partid, node.html(), "", "副本："+node.attr("sectionname"), node.attr("partcategoryId"), node.attr("commonpartid"), li.parents(".plist").find(".wqdaddpagebtn"),"",{css:node.attr("style"),id:node.attr("id")});
        // $(document).trigger("sectionResize");
        var $articleList = $newPart.find(".articleLists[data-artllistid]");
        if($articleList.length) {
            $articleList.each(function(index, el) {
                var artllistid = $(el).attr("data-artllistid");
                $newPart.find("[data-artllistid="+artllistid+"]").attr("data-artllistid","artlist"+new Date().getTime());
            });
        }
	}

    /**
     * 替换旧id liumingren，addPart中旧有逻辑并未完全删除
     * @param node
     * @returns {*}
     */
	pageList.setNewElemId = function(node){

        var sectionHtml = node.html();
        node.find('.wqdelementEdit[id]').each(function(i,_){
            var newId = "elementId" + (new Date().getTime() + i);
            sectionHtml = sectionHtml.replace(new RegExp($(this).attr('id'),"gi"),newId);

			// var nid = 'elementId' + new Date().getTime() + index, oldid = $(this).attr('id') ,css = node.find('style.'+oldid);
			// $(this).attr('elementid',nid).attr('id',nid);
			// if(css.length){
			// 	css.removeClass().addClass(nid);
			// 	css.html(css.html().replace(new RegExp(oldid,'gi'),nid));
			// }
		});
		return node.html(sectionHtml);
	};

    /**
     * 添加通条 待重构
     * @param  {[string]} id [新产生的一个id值，模型："wqd" + new Date().getTime() + "serial"]
     * @param  {[string]} htmlData [对应的要添加到页面中的字符串]
     * @param  {[string]} js [对应通条js字符串]
     * @param name
     * @param categoryId
     * @param sectionid
     * @param  {[object]} $obj [对应的点击元素的jQuery对象]
     * @param  {[string]} type [对应判别是导航还是页脚还是中间部分]
     * @param isCopy
     * @param parent
     * @param sectionStyle
     */
	pageList.addPart = function(id ,htmlData, js ,name ,categoryId ,sectionid, $obj, type,isCopy,parent,sectionStyle){
		// this.noSave = false;//丢页面临时
		/* V2版本----页面结构改变增加一层div.wqdAreaView */
		var $htmlCenterV2 = null, $htmlHeaderV2 = null, $htmlFooterV2 = null;

		/* 主区域显示宽度获取 */
		var viewWidth = this.getMainArea(),
			$section = $(htmlData),
			$styleObj = null,
			oldId = "",
			newId = "wqd" + new Date().getTime() + "serial";
		/* 更改通条中的名称，保证一致，还有一个地方和此处有联系pageListCtrl.js文件中，共两处 */
		$section.attr("sectionname",window.getSectionNameV3);

		/* 对应的添加进页面body中的整个节点对象 */
		var $node = null;

		if($section.hasClass('wqdSectiondiv')) {
			/* 获取老的Id, style对象 */
			oldId = $section.attr('id');
			$styleObj = $section.find('style.'+oldId);
			/* sytle内存在样式的话, 直接字符串替换和修改成新Id */
			if($styleObj.length) {
				$styleObj.removeClass(oldId).addClass(newId);
				$styleObj.html($styleObj.html().replace(new RegExp(oldId,'ig'),newId));
			}
			/* 修改htmlData转化成对象的id值 */
			$section.attr('partid', newId).attr('id', newId);
			/* 组成节点 */
			$node = $('<div class="yzmoveContent yzmoveContentBor'+($section.find("section").length ? ' sectionCenter' :$section.find("header").length ? ' sectionHeader' : $section.find("footer").length ? ' sectionFooter' : '') +'"></div>').append($section);
		}else{
			$node = this.buildPart(id, htmlData, name, categoryId, sectionid);
		}
		/* 移除对应的头部根上的style#styleCss，移除当前选中状态class为yzmoveContentBor */
		htmlHeader.find('style#styleCss').remove();
		$('.yzmoveContent').removeClass('yzmoveContentBor');
		/* V2版本对低版本没有特定div.wqdAreaView这层，兼容加上 */
		if(!htmlCenter.find('div.wqdAreaView').length){
			htmlCenter.append($('<div class="wqdAreaView"></div>'));
		}
		if(!htmlFooter.find('div.wqdAreaView').length){
			htmlFooter.append($('<div class="wqdAreaView"></div>'));
		}
		if(!htmlHeader.find('div.wqdAreaView').length){
			htmlHeader.append($('<div class="wqdAreaView"></div>'));
		}

		$node = pageList.setNewElemId($node);//替换旧id

		/* V2版本重新查找对应的新div外壳 */
		$htmlCenterV2 = htmlCenter.find('div.wqdAreaView');
		$htmlFooterV2 = htmlFooter.find('div.wqdAreaView');
		$htmlHeaderV2 = htmlHeader.find('div.wqdAreaView');

		/* 将对应的主区域css添加一下---------结构 */
		var viewCss = "";
			viewCss += '<style type="text/css" id="styleCss" uw="'+viewWidth+'">';
			viewCss += 		'.wqdView,.wqdAreaView .wqdSectiondiv{min-width:'+viewWidth+'px;}';
			viewCss += 		'.wqdAreaView .wqdBkEditos,.hoverCon-section .wqdBkEditos{width:'+viewWidth+'px;}';
			viewCss += 		'.fullscreen .bannerContainer{margin:0 auto;width:'+viewWidth+'px!important;}';
			viewCss += '</style>';
		$htmlHeaderV2.before(viewCss);


		/* 这一部分可以重新优化 */
		if(categoryId==21 || categoryId==10037 || categoryId==10021 || type == "headerPC"){//header
			if(htmlHeader.find('div[data-type]').length){
				/* 移除当前存在通条 */
				this.removePart($obj.parents("ul.userht").find('span.facBtn2'));
			}
			$htmlHeaderV2.html($node);
			this.pagehf[0] = $node[0].outerHTML;

			$htmlCenterV2.removeAttr('style');
			$htmlFooterV2.removeAttr('style');
			/* 顶部栏目设置加上通条id，貌似是点开通条所用*/
			$('.tool-list2').attr('partid',id).attr('isheader','true');
		}else if(categoryId==12 || categoryId==10034  || categoryId==10012 || type == "footerPC"){//footer
			if($htmlFooterV2.find('div[data-type]').length){
				/* 移除当前存在通条 */
				this.removePart($obj.parents("ul.userht").find('span.facBtn2'));
			}
			$htmlFooterV2.children('div.yzmoveContent').remove();
			$htmlFooterV2.find('script').length ? $htmlFooterV2.find('script').eq(0).before($node) : $htmlFooterV2.append($node);
			this.pagehf[1] = $node[0].outerHTML;
            /* 顶部栏目设置加上通条id，貌似是点开通条所用*/
			$('.tool-list2').attr('partid',id).attr('isheader','false');
		}else{//center
			if(isCopy && typeof isCopy == "object") {//复制通条替换旧id
				$node.find(".wqdSectiondiv").attr("style",isCopy.css);
				var nodeId = $node.find(".wqdSectiondiv").attr("id"),
					$style = $node.find('style.'+isCopy.id);
				$style.length && $style.removeClass(isCopy.id).addClass(nodeId)
					.html($style.html().replace(new RegExp(isCopy.id,'ig'),nodeId));
			};
			$htmlCenterV2.append($node);
			//需要判断节点插入的位置-->center
			if(parent && parent.parents("#HTMLDATACENTER").length) {
				parent.parents(".yzmoveContent").before($node);
			}
			if(sectionStyle) {
				$node.find(".sectionV2").attr("style",sectionStyle);
			}
			/* 栏目设置上加属性------这句话含义待定 */
			$('.tool-list2').attr('partid',id).attr('isheader','false');
		}



		/* 滚动到当前新加通条位置 */
		$('html,body').animate({scrollTop:$node.offset().top-40+'px'}, 500);

		this.buildJs(id,js);
		this.commonset();
		$(document).trigger("sectionResize").trigger("initContainerRuler");
		return $node;
	}

	/** 拆分后第一个版本 V3.0.1  每次修改版本往上加1
	 * 还没有优化，只是先跑通
	 * 读取页面信息，如webSiteName等
	 *
	 */
	pageList.loadhf = function(msg) {
		_pCommon.ajax('GET',URLPATH+'common/site/read?random='+Math.random(),{"siteId":USERSITEID},false,'json',function(data,that){
			if(data.status==200){
				var header = data.data.header.replace(/>.wqdAreaView\s.wqdSectiondiv/g,">.wqdAreaView\s.wqdSectiondiv");
				that.pagehf[0] = header;
				that.pagehf[1] = data.data.footer;


				/* 发布时要用，目前暂定义成全局以后修改 */
				window.yxWebSite = {
					webSiteName : data.data.name || "",
					webSitedomain : data.data.domain || "",
					systemDomain : data.data.systemDomain || ""
				}

				if(msg!='changepage'){
					htmlHeader.html(header);
					htmlFooter.html(data.data.footer);
				}
				// else {
				// 	// 移除之前通条的页面样式
				// 	var $header = $("#HTMLDATAHEADER");
				// 	$header.html($header.html().replace(/>#HTMLDATA,/g,">"))
				// }
				_ph.sharegetInf();
				_bl.basicapp();   //为啥重新载入页面列表？
				$(document).trigger('domInit');
			}
		},this);

	}
	/** 拆分后第一个版本 V3.0.1  每次修改版本往上加1
	 * 还没有优化，只是先跑通
	 * 将pc内容转换成phone内容
	 *
	 */
	pageList.convertPcToPhone = function() {
		var changeTime = null;
		if(!$('#wqdIphonePage').length){
			return;
		}else{
			if(!allviewSort){
				changeTime = setInterval(function(){
					if(allviewSort && allviewSort[USERPAGEID].synchro){
						//$(document).trigger("convertPcToPhone");
						clearInterval(changeTime);
						changeTime = null;
					}
				},100);
			}else{
				//if(allviewSort[USERPAGEID].synchro) $(document).trigger("convertPcToPhone");
			}
		}
	}
	/** 拆分后第一个版本 V3.0.1  每次修改版本往上加1
	 * 还没有优化，只是先跑通
	 * 读取页面内容
	 *
	 */
	pageList.readPage = function(fn,viewId,dfd){
		var self = this;
		_ph.setLoadingStyle(true,"加载中…");
		$.ajax({
			type:"GET",
			url:URLPATH+"design/page/read",
			dataType:"json",
			data:{
				"random":Math.random(),
				"pageId":viewId || USERPAGEID
			}
		}).done(function(data){
			allviewSort[data.id] = data;
            if(!viewId) {
                /* 重新切换页面具体内容 */
                if(/wqdView/g.test(data.data)) {
                    data.data = $(data.data).html();
                }
                htmlCenter.html('').html(data.data);
                if(typeof fn=='function'){
                    fn();
                }
                self.loadhf();
                self.convertPcToPhone();
                updateSectionV3(htmlCenter);
                // if(dfd) dfd.resolve();
                $(document).trigger("sectionResize");
                // _ph.setLoadingStyle(false,"加载中…");
                $(document).trigger("showCarouse");
            }
            if(dfd) dfd.resolve();
			_ph.setLoadingStyle(false,"加载中…");
		})
		.fail(function() {
			_ph.setLoadingStyle(false,"读取页面失败！",2000);
			if(!viewId) USERPAGEID = $(".pagedeatllist .plist.on").attr('pageid');
		});
        if(dfd) return dfd;
	}

	function updateSectionV3($htmlcenter) {
		$htmlcenter = $htmlcenter || $("#HTMLDATA");
		$htmlcenter.find(".yzmoveContent").each(function(index, el) {
			var $this = $(this);
			$this.find("section").length ? $this.addClass("sectionCenter") :
				$this.find("header").length ? $this.addClass("sectionHeader") :
				$this.find("footer").length ? $this.addClass("sectionFooter") : void 0;
		});
	}
	/** 拆分后第一个版本 V3.0.1  每次修改版本往上加1
	 * 还没有优化，只是先跑通
	 * 复制页面功能
	 * 拷贝的pageid
	 */
	pageList.copyPage = function(copypageid ,callback){
		var w = $('div.viewwidth input').val() ,htmldata = newid = oldpartid = style ='', that = this;
		var copy = function(){
			htmldata = $(allviewSort[copypageid].data);
			if(!htmldata.length) return;
			htmldata.find('div.yzmoveContent .wqdSectiondiv').each(function(index){
				newid = "wqd" + new Date().getTime() + index + "serial";
				oldpartid = $(this).attr('id');
				$(this).attr('id',newid).attr('partid',newid);
				if($(this).attr('triggerelem')){
					$(this).attr('triggerelem', $(this).attr('triggerelem').replace(new RegExp(oldpartid,'gi'),newid));
				}
				style = $(this).find('style.'+oldpartid).removeClass().addClass(newid);
				style.each(function(){
					$(this).html($(this).html().replace(new RegExp(oldpartid,'gi'),newid));
				});
			})
			htmldata = htmldata[0].outerHTML;
			_pCommon.ajax('POST',URLPATH+'design/page/copy',{"data":htmldata,'viewWidth':w,"pageId":copypageid,"random":Math.random()},false,'json',function(data,that){
				if(data.status==200){
					if(typeof callback=='function'){
						allviewSort[data.data.id] = data.data;
						callback(data.data);
						that.pagesort();	//页面列表重新排序
					}
				}
			},that);
		};
		// if(!this.noSave){
		window.noSave ? copy() : _ph.save(copy);
		// if(window.noSave){
		// 	copy();
		// }else{
		// 	alert("当前页面未保存，请保存后再复制");
		// }
	}
	/** 拆分后第一个版本 V3.0.1  每次修改版本往上加1
	 * 还没有优化，只是先跑通
	 * 删除页面功能
	 * param--传当前li标签对象
	 */
	pageList.deletePage = function(_self) {
		var _this = this;
		var related = _self.attr('related') || null;

		//新页面条移除--版本2
		var pageId = _self.attr('pageid');
		_pCommon.ajax('POST',URLPATH+'design/page/delete',{"pageId":pageId},false,'json',function(data,that,_self){
			if(data.status==200){
				//判断删除的是否为首页，首页为特殊操作
				if(_self.find("i").hasClass("home")) {
					$(document).trigger("wqdNavCallback",{category:1, pageids:pageId, parameter:_self.next().attr("pageid")});
				} else {
					$(document).trigger("wqdNavCallback",{category:1, pageids:pageId});
				}
				if(_self.hasClass('on')){
					if(related!=null){
						if(_self.next().attr('related') && _self.nextAll('li[listarticle]').length){
							USERPAGEID = _self.nextAll('li[listarticle]').eq(0).attr('pageid');
							$('.pagedeatllist').find('li[pageid='+USERPAGEID+']').addClass('on');
						}else{
							USERPAGEID = _self.parents('ul').find('li').eq(0).attr('pageid');
							$('.pagedeatllist').find('li[pageid='+USERPAGEID+']').addClass('on').find('i').addClass('home');
							// that.noSave = true;
							window.noSave = true;//丢失页面临时
							_ph.clearCatch();
						}
						_self.parent().find('li[related='+related+']').remove();
					}else{
						if(_self.next().length){
							USERPAGEID = _self.next().attr('pageid');
							$('.pagedeatllist').find('li[pageid='+USERPAGEID+']').addClass('on').find('i');
							$('.pagedeatllist').find('li[pageid='+USERPAGEID+']').find(".pageShow").addClass("on");
							$("#wqdpHeaderD ul.func-list li.title.on label").html($('.pagedeatllist').find('li[pageid='+USERPAGEID+']').find(".pageShow em").html());
						}else{
							USERPAGEID = _self.parents('ul').find('li').eq(0).attr('pageid');
							$('.pagedeatllist').find('li[pageid='+USERPAGEID+']').addClass('on').find('i').addClass('home');
							$('.pagedeatllist').find('li[pageid='+USERPAGEID+']').find(".pageShow").addClass("on");
							$("#wqdpHeaderD ul.func-list li.title.on label").html($('.pagedeatllist').find('li[pageid='+USERPAGEID+']').find(".pageShow em").html());
						}
					}
					window.noSave = true;//丢失页面临时
					_ph.clearCatch();
					_self.remove();
					that.readPage(function(){
						htmlHeader.html(that.pagehf[0]);
						htmlFooter.html(that.pagehf[1]);
					});
				}else{
					if(related!=null){
						_self.parent().find('li[related='+related+']').remove();
					}
					_self.remove();
				}
				$("#wqdPageInfD").hide();
				delete allviewSort[pageId];
				$.colorbox.close();
				that.pagesort();
			}
		},this,_self);
	}

	/* 得到主区域选择的是那种 */
	pageList.getMainArea = function() {
		var _index = $("#wqdpHeaderSetStationD ul li.area .useBtn.on").parents(".areaGroup").index();
		switch(_index) {
			case 0: return 1400;break;
			case 1: return 1200;break;
			case 2: return 960; break;
		}
	}

	/* 跨页面通条复制---直接调AJAX走保存就行 */
	pageList.thoughPageCopy = function(viewId, $node, currIndex) {
        var tempData =  $('div[partid="' + $node.attr("partid") + '"]').parent(".yzmoveContent").html();
        // self.changePage($(this));
		var tempWindow = $('<div id="tempWindow"></div>');
        var pagePromise = $.Deferred();
        if(allviewSort[viewId].data) {
            pagePromise.resolve();
        } else {
            this.readPage(void 0,viewId,pagePromise);
        }
        var self = this;
        $.when(pagePromise).done(function () {
            tempWindow.html(allviewSort[viewId].data);
            if(tempWindow.find(".yzmoveContent:last").length) {
                tempWindow.find(".yzmoveContent:last").after('<div class="yzmoveContent">'+tempData+'</div>');
            } else {
                var $wqdAreaView = tempWindow.find(".wqdAreaView");
                $wqdAreaView.length ? $wqdAreaView.append('<div class="yzmoveContent">'+tempData+'</div>')
                    : $wqdAreaView.append('<div class="wqdAreaView"><div class="yzmoveContent">'+tempData+'</div></div>');
            }


            var htmlData = _ph.replacesome(tempWindow.html());
            /* 获取对应屏幕主区域宽度 */
            var _viewWidth = self.getMainArea();
            /* 传入NotUpdateData，则后台对应字段不更新 */
            $.post(URLPATH+'design/page/save',{
                "viewWidth":_viewWidth,
                "pageId":viewId,
                "data":$.base64.btoa(htmlData),
                "header":$.base64.btoa("NotUpdateData"),
                "footer":$.base64.btoa("NotUpdateData"),
                "random":Math.random()
            },'json').done(function (data) {
                if(data.status==200){
                    allviewSort[viewId].data = htmlData;
                    $node.remove();
                    htmlCenter.find('div.yzmoveContent').eq(currIndex).remove();
                    $(document).trigger("appSetCatch");
                }
                /* 清空 */
                tempWindow.remove();
                tempWindow = "";
            })
            // _pCommon.ajax('POST',URLPATH+'design/page/save',{"viewWidth":_viewWidth,"pageId":viewId,"data":$.base64.btoa(htmlData),"header":$.base64.btoa("NotUpdateData"),"footer":$.base64.btoa("NotUpdateData"),"random":Math.random()},false,'json',function(data,that){
            //     if(data.status==200){
            //         allviewSort[viewId].data = htmlData;
            //         $(document).trigger("appSetCatch");
            //     }else{
            //
            //     }
            //     /* 清空 */
            //     tempWindow.remove();
            //     tempWindow = "";
            // },self);
        })

	}

	return pageList;
})
