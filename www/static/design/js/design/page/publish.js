define(["pageHeader"],function(_ph) {
    return {
        init:function () {
            var self = this;
            self.bindEvent();
            $(document).on("publishInit",function(argument) {
                self.setPublish();
            })
        },
        setPublish:function(argument) {
            //发布模块
            $(".fabubdbox input.form-control").val(yxWebSite.webSiteName);
            $(".fabubdbox span.yx-input").text(yxWebSite.webSitedomain).attr("title",yxWebSite.webSitedomain);
            $(".fabubdbox .changeDomin a").attr("href", $("#wqdpHeaderD span.logo").parent("a").attr("href") +"/setting/center.html?siteId="+USERSITEID);
            $(".fabubdbox .hd .closePush").on("click",function(){$.fn.colorbox.close();});
        },
        bindEvent:function() {
            $(document).on("click",".fabubdbox .reload",function(){
                //刷新域名
                var that = $(this);
                $.ajax({
                    type: "GET",
                    url: URLPATH+'site/domain',
                    data : {'siteId':USERSITEID,'random':Math.random()},
                    async: false,
                    dataType: "json",
                    success:function(data){
                        window.yxWebSite.webSitedomain = data.data;    //暂定全局，以后再改
                        if(data.status ==200){
                            that.siblings(".yx-input").text(data.data).attr("title",data.data);
                        }else{
                            alert(data.msg);
                        }
                    },
                    error : function(data){
                        // callback(data,that);
                    }
                });

            })
            .on('click','a.designshareweibo, a.designshareqq',function(){
                //分享
                var indexObj = {"0":1,"1":3};
                switch(indexObj[$(this).index()]) {
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
            })
            .on('click',".fabubdbox .margBtm30 .ffb",function(){
                //发布
                var sitename = $(".fabubdbox input.form-control").val();
                if(sitename == "") $("#sys .nameHint").html("网站名称不能为空！").css({"visibility":"visible"});
                else $("#sys .nameHint").css({"visibility":"hidden"});
                if(!sitename) return;
                var dfd = $.Deferred();
                _ph.save(void 0,void 0,void 0,dfd);
                // $(document).trigger('appSave');
                // application.siteStatus.issue(sitename,pageEdit.replease.succeed);
                $.when(dfd).done(function () {
                    $.ajax({
                        type: "POST",
                        url: URLPATH+'common/site/publish',
                        data : {'siteId':USERSITEID,'name':sitename},
                        // async: true,
                        dataType: "json",
                        success:function(issueData){
                            if(issueData.status==200){
                                window.yxWebSite.webSiteName = sitename;    //暂定全局，以后再改
                                window.yxWebSite.WebRelease = true;
                                $('.tool-list li').eq(0).removeClass('on');

                                var domain = yxWebSite.webSitedomain;
                                $('.fabubdbox .bd').hide();
                                $('.fabubdbox .hd h1').text("发布成功");
                                $('.fabubdbox .bd2-text a').attr('href',domain).html(domain);
                                $(".fabubdbox .bd2 .shareImg").empty().qrcode({
                                    render: "canvas", //table方式
                                    width: 110, //宽度
                                    height:110, //高度
                                    text: domain //任意内容
                                });
                                $('.fabubdbox .bd2').show();
                            }
                        },
                        error : function(data){
                            // callback(data,that);
                        }
                    });
                });

            });
        }
    }
})
