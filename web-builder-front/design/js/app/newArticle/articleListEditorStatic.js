define(['utility','app/newArticle/newArticleListStatic','createColorStyle'], function(_util ,_artStatic,createColorStyle) {				 
	var articleListEditorStatic = {
		"init" : function(self){
			var that = this ,exitli ='';
			
			this.obj = self;
			this.data = {};
			this.exit = [];
			var model = this.obj.$element.attr('data-style').match(/model[0-9]/gi) || [];
			this.obj.$element.attr('data-style') && model.length && this.obj.$editor.find('div.geshi ul li[class='+model[0]+']').addClass('on');
			
			this.obj.$element.find('.artlist').children('li[id]').each(function(){
				exitli += '<li categoryid="'+$(this).attr('categoryid')+'" id="'+$(this).attr('id')+'"><span>'+$(this).find('h3 a').text()+'</span><i></i></li>';
				that.exit.push($(this).attr('id'));
			});
			this.obj.$editor.find('.selectlist ul').html(exitli);
			
			
			that.obj.$editor.on('click','.selectlist ul li i',function(){ 
				for(i=0;i<that.exit.length;i++){
					if(that.exit[i]==$(this).parent().attr('id')){
						that.exit[i] = '';
					}
				}
				_artStatic.removeArtElm(that.obj ,$(this).parent().attr('id'));
			});
			
			this.obj.$editor.find('p.nrbtn').click(function(){
				var list = $(that.obj.$editor.get()[1]) ,firstId;
				
				list.on('click','.edit_close_2',function(){
					$(this).parents('.selectContent').hide();
				});
				
				list.on('click','.pageart a',function(){
					that.showDataDetail(list.find('ul.selectnr li.on').attr('id') ,$(this).attr('data-index'));
				});
				
				list.on('click','div.con p',function(){
					var obj = that.data[$(this).attr('categoryid')][$(this).attr('id')];
					obj.imgsrc = obj.icon!='' ? CSSURLPATH + obj.icon : obj.otherIcons!='' ? CSSURLPATH + obj.otherIcons.split(',')[0] : 'http://img.wqdian.com/group4/M00/7E/18/yq0KYVdhQ5mABvPGAAB1StSglTI587.png';
					$(this).hasClass('on') ? $(this).removeClass('on') && _artStatic.removeArtElm(that.obj ,$(this).attr('id')) : $(this).addClass('on') && _artStatic.addArtElm(that.obj.$element.find(".artlitemp").text() || that.obj.template ,that.obj.$element , that.obj.$editor ,obj );
				});
				
				$.get("/article/tags",function (data){
					var html = '';
					$.each(data.data,function(i,v){
						if(i==0){
							firstId = v.id;
							html += '<li class="on" id='+v.id+'>'+v.name+'</li>';
						}else{
							html += '<li id='+v.id+'>'+v.name+'</li>';
						}
						that.data[v.id] = {};
					});
					list.find('.selectnr').html(html).on('click','li',that.showDataDetail);   
					that.showDataDetail(firstId);
					list.show();
				});
			});
			//
			// this.obj.$editor.find('div.geshi li').click(function(){
			// 	var model = {
			// 		"model1" : 156,
			// 		"model2" : 181,
			// 		"model3" : 205,
			// 		"model4" : 175,
			// 		"model5" : 205,
			// 		"model6" : 186,
			// 	}, h;
			// 	$(this).addClass('on').siblings().removeClass('on');
			// 	that.obj.$element.find('.artlist').removeClass().addClass('artlist '+$(this).attr('class'));
			// 	that.obj._popupBase.setAttr('model',$(this).attr('class'));
			// 	h = $(this).attr('class').match(/model[0-9]/ig).length ? model[$(this).attr('class').match(/model[0-9]/ig)[0]] : model.model1;
			// 	createColorStyle.styleInit(that.obj.$element.attr('id') ,'.artlist .newArticleListDetail' ,{"height": h +'px!important'});
			// 	$(document).trigger('appSetCatch');
			// });
		},
		"showDataDetail" : function(id ,page){
			var ajaxdata = {} ,that = articleListEditorStatic;
			
			ajaxdata.tagIds = isFinite(id) ? id : $(this).addClass('on').siblings().removeClass('on') && $(this).attr('id');
			ajaxdata.pageNo = page || 0;
			ajaxdata.pageSize = 10;
			ajaxdata.orderBy = "PUBLISH_TIME"; 
			ajaxdata.isPublish = true;
			
			if(!that.data[ajaxdata.tagIds]){
				that.data[ajaxdata.tagIds] = {};
			}
			
			$.get("/article/page",ajaxdata,function (data) {
				var html = '';
				if(data.data.data.length){
					$.each(data.data.data,function(i,v){
						if(!that.data[ajaxdata.tagIds][v.id]){
							that.data[ajaxdata.tagIds][v.id] = {};
						}
						that.data[ajaxdata.tagIds][v.id] = v;
						if(articleListEditorStatic.exit.length){
							for(i=0;i<articleListEditorStatic.exit.length;i++){
								if(v.id==articleListEditorStatic.exit[i]){
									html += '<p class="on" categoryId="'+ajaxdata.tagIds+'" id="'+v.id+'"><i></i>'+v.title+'</p>';
								}else{
									html += '<p categoryId="'+ajaxdata.tagIds+'" id="'+v.id+'"><i></i>'+v.title+'</p>';
								}
							}
						}else{
							html += '<p categoryId="'+ajaxdata.tagIds+'" id="'+v.id+'"><i></i>'+v.title+'</p>';
						};
					});
					articleListEditorStatic.showPaging(data.data);
				}else{
					html += '<p>无数据</p>';
					that.obj.$editor.find('.pageart').html('');
				}
				articleListEditorStatic.obj.$editor.find('div.con').html(html);	
            });
		},
		"showPaging" :function (data) {
            var start    = data.pageNo / 5 < 0.75 ? 1 : data.totalPages - data.pageNo > 2 ? data.pageNo - 2 : data.totalPages > 4 ? data.totalPages - 4 : 1,
                end = start > data.totalPages - 4 ? data.totalPages : start + 4,
                temp = '<a data-index="{{index}}" class="{{class}}">{{text}}</a>',
                $artlPaging = this.obj.$editor.find('.pageart'),
                pagingModel = [];

            end = end > data.totalPages ? data.totalPages : end;
            if(end == 1) {
                return $artlPaging.html("");
            }
            for(var i = start ;i <= end ;i++){
                var isEnd = i == end;
                pagingModel.push({
                    index:i,
                    class:i == data.pageNo ? "on" : "",
                    text:i
                });
                if(i == start) {
                    pagingModel.unshift({
                        index:1,
                        class:"first",
                        text:"首页"
                    },{
                        index:data.pageNo-1,
                        class:"prev",
                        text:"上一页"
                    });
                }
                if(isEnd) {
                    pagingModel.push({
                        index:data.pageNo + 1,
                        class:"next",
                        text:"下一页"
                    },{
                        index:data.totalPages,
                        class:"last",
                        text:"末页"
                    });
                }
            }
            $artlPaging.html(_util.format(temp,pagingModel));
        }
	}
    return articleListEditorStatic;
});

