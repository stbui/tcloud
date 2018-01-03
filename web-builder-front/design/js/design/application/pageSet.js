define(["pageCommon", "pageHeader"], function(_pCommon, _ph) {
	var pageSet = {};
	//修改页面信息的功能---待修改
	pageSet.modifyonlyPage = function(pageid,seoTitle,seoKeyword,seoDescn,name,domain,ishome){
		var msg = [seoTitle,seoKeyword,seoDescn,domain,name] ,pageId = pageid;
		_pCommon.ajax('POST',URLPATH+'page/seo',{"pageId":pageId,"home":ishome,"name":name,"domain":domain,"title":seoTitle,"keywords":seoKeyword,"description":seoDescn,"random":Math.random()},false,'json',function(data,that,msg){
			if(data.status==200){
				that.yxpageInfoCatch(pageId, function() {
					if(pageId==USERPAGEID){
						$('.zleft2').html(_pCommon.setString(name,16));
					}
					if(msg[0]!=''){ allviewSort[pageId].seoTitle = msg[0];}
					if(msg[1]!=''){ allviewSort[pageId].seoKeyword = msg[1]; }
					if(msg[2]!=''){ allviewSort[pageId].seoDescn = msg[2]; }
					if(msg[3]!=''){ allviewSort[pageId].domain = msg[3]; }
					if(msg[4]!=''){
						allviewSort[pageId].name = msg[4];
					}
					if(ishome){
						that.homePage = true;
					}else{
						that.homePage = false;
					}
					_ph.sharegetInf();
					if($('.pagedeatllist').find('li[pageid='+pageId+']').hasClass('on') && name) $('.func-list li.title').find('label').html(name);
				});

			}
			if(data.status==400){
				if(data.responseText=='设置页面信息错误.必须存在一个主页.'){
					$('.pageset').find('input[type=checkbox]').next().html(data.responseText).show();
				}else if(data.responseText=='域名已经存在，请更换.'){
					$('.pageset').find('input[name=pagehref]').parent().next().next().html(data.responseText).show();
				}
			}
		},this,msg);
	}


	/*
	 * 将某页面信息存缓存----有点乱，可以跟上面的方法合并
	 * param -- 传pageid值
	 * callback -- 回调
	 */
	pageSet.yxpageInfoCatch = function(pageId, callback) {
		if(allviewSort[pageId] == {} || allviewSort[pageId] == void 0) {
			_pCommon.ajax('GET',URLPATH+'design/page/read/'+pageId+"?random="+Math.random(),{},false,'json',function(data,that){
				if(data != null){
					if(allviewSort[pageId]==void 0){
						allviewSort[pageId] = {};
					}
					allviewSort[pageId] = data;
					//返回回调
					callback();
				}
			},this);
		} else {
			//返回回调
			callback();
		}
	}
	return pageSet;
});
