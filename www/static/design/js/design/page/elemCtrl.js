define(function() {
	var elemCtrl = {};
	/* 元素左侧列表控制初始化 */
    elemCtrl.init = function() {
        var _that = this;

    	/* design--左侧元素打开控制 */
        $("#wqdpageLeft").on("click", "ul li", function() {
            /* 页面关闭 */
            $("#wqdpageContentD span.close").click();
            /* 当前对象，当前对象index */
            var _self = $(this), _index = $(this).index();
            /* 右侧显示列表JQuery对象 */
            var _wqdComponentDObj = $("#wqdComponentD");

            /* 页面--标题文字修改 */
            $("#wqdComponentD").find(".comHeader p").html('<em></em>添加'+$(this).html());
            /* 页面--问号链接 */
            $("#wqdComponentD").find(".comHeader span.question a").attr('href', _that.getIndexUrl(_index));

            /* 列表切换状态 */
            if (!_self.hasClass("on")) {
                _wqdComponentDObj.show();
                _self.addClass("on").siblings().removeClass("on");
            } else {
                closeWqdComponentD();
                _self.removeClass("on");
            }
            /* 右侧显示列表中，遍历之前的共有多少个li */
            var count = 0, _ul = _wqdComponentDObj.find("ul");
            for(var i=0; i<_index; i++) {
                count += _ul.eq(i).find("li").length;
            }

            /* 切换列表显示  && 在特定容器编辑状态下 显示对应的列表*/
            _wqdComponentDObj.find(".left ul").eq(_index).show().siblings("ul").hide();
            var $_li=_wqdComponentDObj.find(".left ul").eq(_index).find("li");
            var _count;
            if($_li.eq(0).is(":visible")){
                $_li.eq(0).addClass("on").siblings().removeClass("on")
            }else{
                $_li.each(function (i,_) {
                    _count=count;
                    i==0&&$(this).removeClass("on");
                    if($(this).is(":visible")){
                        $(this).addClass("on").siblings().removeClass("on");
                        _count+=i;
                        return false;
                    }
                });
            }
            //_wqdComponentDObj.find(".left ul").eq(_index).find("li").eq(0).addClass("on").siblings().removeClass("on");
            $("#wqdpageSetD .wqdComponents").eq(_count||count).show().siblings().hide();
            //基础组件关闭
            _wqdComponentDObj.on("click", "span.close", closeWqdComponentD);

            //滚动条修改
                $("#wqdpageSetD .wqdComponents .nano").height($(window).height() - 151).nanoScroller();
            //右侧显示列表中控件切换
            _wqdComponentDObj.on("click", ".left ul li", function() {
                //计算顺序很重要
                $("#wqdpageSetD .wqdComponents").eq($(this).index()+count).show().siblings(".wqdComponents").hide();
                $(this).parent("ul").find("li").removeClass("on");
                $(this).addClass("on");
                //按钮滚动
                $("#wqdpageSetD .wqdComponents .nano").height($(window).height() - 151).nanoScroller();

            });
        });

		function closeWqdComponentD() {
			/* 完成关闭 */
			$("#wqdComponentD").hide();
			/* 移除所有的左侧元素列表选中状态 */
			$("#wqdpageLeft ul li").removeClass("on");
			/* 取消事件绑定 */
			$("#wqdComponentD").off("click");
		}
	}

    /* 列表链接 */
    elemCtrl.getIndexUrl = function(index) {
        var strUrl = "";
        switch(index) {
            case 0: strUrl = "http://bbs.wqdian.com/thread-46-1-1.html"; break;
            case 1: strUrl = "http://bbs.wqdian.com/thread-46-1-1.html"; break;
            case 2: strUrl = "http://bbs.wqdian.com/thread-46-1-1.html"; break;
            case 3: strUrl = "http://bbs.wqdian.com/thread-46-1-1.html"; break;
            case 4: strUrl = "http://bbs.wqdian.com/thread-46-1-1.html"; break;
            case 5: strUrl = "http://bbs.wqdian.com/thread-46-1-1.html"; break;
            case 6: strUrl = "http://bbs.wqdian.com/thread-46-1-1.html"; break;
            case 7: strUrl = "http://bbs.wqdian.com/thread-46-1-1.html"; break;
        }
        return strUrl;
    }

	return elemCtrl;
});