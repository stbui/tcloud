$(function() {
    if (!$('#HTMLDATA').length) {
        //处理结构
        var share_ele = ['sqq', 'weixin', 'tsina', 'qzone', 'tieba']
        var followtop = $(window).height() * 0.5;
        $(".wqd-share ").each(function() {
            $(this).addClass("share-list").attr({
                'data-url': window.location.href,
                "data-text": $(this).closest("[sharetext]").attr("sharetext"),
                "data-desc": $(this).closest("[sharetext]").attr("sharetext"),
                'data-pic': $(this).closest("[qqerweima]").attr("qqerweima"),
                'data-summary': $(this).closest("[sharetext]").attr("sharetext")
            });
            $(this).children().each(function() {
                $(this).addClass("btn-share").attr({
                    "data-type": share_ele[$(this).index()]
                })
            })
        });
        $("body").append($('<div id="J_qr_code_share" style="top:' + followtop + 'px!important;box-shadow: 1px 1px 39px 1px;box-shadow: 1px 1px 39px 1px;padding-top:35px;display:none;z-index:999;position:fixed;margin-top:-130px;margin-left:-130px;text-align:center;background:#FFF;border-radius:8px"></div>'));
        $("body").click(function() {
            $("#J_qr_code_share").hide(200);
        })
        $("head").prepend('<meta itemprop="image" content="' + $("[erweima]").attr("erweima") + '" /><meta property="qc:admins" content="1755101013252671411666547" />');
        $('<script src = "http://qzonestyle.gtimg.cn/qzone/app/qzlike/qzopensl.js#jsdate=20111201" charset = "utf-8" > </script> <script src="http://connect.qq.com/widget/shareqq/loader/loader.js" widget="IFRAME_SHARE_QQ" charset="utf-8"></script>').appendTo("body");

        //关注设置
        // $('.wqd-follow li').on('click', function() {
        //     window.open($(this).attr("url"))
        // });

        $("body").append("<div style='width:240px;height:270px;position:fixed;display:none;top:" + followtop + "px;left:50%;box-shadow: 1px 1px 21px 2px;z-index:99;border-radius: 8px;' class='follow_box'><span class='follow_txt' style='float:left;margin: 10px 0 0 10px'></span><span class='follow_close' style='float:right;margin:10px 10px 0 0'><i class='fa fa-remove' style='font-size: 22px;cursor:pointer'></i></span><p style='width:100%;height:200px;margin-top: 39px;width: 90%;margin: 39px auto 0;background-size: 100% 100%;'></p></div>")
        $(".follow_box").css({
            "margin-top": -135 + "px",
            "margin-left": -120 + "px"
        });
        $('.wqd-follow li').each(function() {
            var index = $(this).index();
            var that = $(this);
            $(this).click(function() {
                if (index > 1) {
                    window.open($(this).attr("url"));
                }
                if (index <= 1) {
                    if (index == 0 && $("[qqerweima]")) {
                        var qqbgurl = "url(" + that.parents(".wqdelementEdit").attr("qqerweima") + ")";
                        $(".follow_box").show(200).css({
                            background: "#fff"
                        }).find("p").css({
                            "background-image": qqbgurl
                        }).end().find(".follow_txt").text("关注QQ帐号");
                    }
                    if (index == 1 && $("[wxerweima]")) {
                        var wxbgurl = "url(" + that.parents(".wqdelementEdit").attr("wxerweima") + ")";
                        $(".follow_box").show(200).css({
                            background: "#fff"
                        }).find("p").css({
                            "background-image": wxbgurl
                        }).end().find(".follow_txt").text("关注微信帐号");
                    }
                }

            })

        })
        $(".follow_close").click(function() {
            $(".follow_box").hide(200);
        });

    }
})


//分享组件
;
(function($) {
    $(function() {
        var uid = +new Date;
        Share(uid);
    });

    function Share(uid, options) {

        /**
         * 初始化分享
         * @param  {String} uid  用户的百度分享AK
         * @return this;
         *
         */

        if (!(this instanceof Share)) {
            return new Share();
        }


        this.uid = uid;
        this.url = 'http://s.share.baidu.com/';
        this.title = document.title;
        this.size = 'height=500,width=700,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no';
        this.render = 'table';
        this.options = $.extend({}, {
            render: this.render,
            width: 120,
            height: 120,
            background: "#fff",
            foreground: "#000",
            text: ''
        }, options);
        this.isLoad = false;

        this.init();
    }

    Share.prototype = {
        constructor: 'Share',
        init: function() {
            var that = this;

            $('body').css("position", "relative").off('click.share', '.btn-share').on('click.share', '.btn-share', function(event) {
                var _self = $(this),
                    type = _self.data('type'),
                    data = _self.parent('.share-list').data();
                if ($(this).attr("data-type") == "weixin") {
                    $("#J_qr_code_share").css({
                        top: $(window).width() > 1200 ? ($(window).height() * 0.5) : ("280px!important"),
                        left: $(window).width() * 0.5
                    }).show();
                }
                that.fire(type, data, _self);
                event.stopPropagation();
            })
        },
        setwin: function(w, d) {
            var iWidth = w; //弹出窗口的宽度;
            var iHeight = d; //弹出窗口的高度;
            var iTop = (window.screen.availHeight - 30 - iHeight) / 2; //获得窗口的垂直位置;
            var iLeft = (window.screen.availWidth - 10 - iWidth) / 2; //获得窗口的水平位置;
            return {
                iTop: iTop,
                iLeft: iLeft
            }
        },
        fire: function(t, d, self) {
            var that = this,
                query = that.set(t, d);
            this.load(query);

            if (t === 'weixin') {
                if (!that.isLoad) {
                    var qrcode = document.createElement('script');
                    qrcode.src = 'javascripts/jquery.qrcode.min.js';
                    document.head.appendChild(qrcode);
                    that.isLoad = true;
                    qrcode.onload = function() {
                        that.renderQrCode(self);
                    };
                }

                that.renderQrCode(self);
                return;
            } else if (t === "qzone") {
                (function() {
                    var p = {
                        url: location.href,
                        showcount: '1',
                        desc: d.desc,
                        summary: d.summary,
                        title: document.title,
                        site: '',
                        pics: d.pic,
                        style: '203',
                        width: 98,
                        height: 22
                    };
                    var s = [];
                    for (var i in p) {
                        s.push(i + '=' + encodeURIComponent(p[i] || ''));
                    }
                    window.open("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + s.join('&'), "newwindow", "width=601,height=590, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no" + ",top=" + that.setwin(601, 590).iTop + ",left=" + that.setwin(601, 590).iLeft)
                })();
                return;
            } else if (t === "sqq") {
                var p = {
                    url: d.url,
                    desc: d.desc,
                    title: document.title,
                    summary: d.summary,
                    pics: d.pic,
                    flash: '',
                    site: '微企点',
                    style: '201',
                    width: 32,
                    height: 32
                };
                var s = [];
                for (var i in p) {
                    s.push(i + '=' + encodeURIComponent(p[i] || ''));
                }

                window.open("http://connect.qq.com/widget/shareqq/index.html?" + s.join('&'), "newwindow", "width=721,height=572, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no" + ",top=" + that.setwin(721, 567).iTop + ",left=" + that.setwin(721, 567).iLeft);
                return;
            }
            this.open(query);
        },

        /**
         * 设置分享内容
         * @param  {String} type 分享到的社交媒体，如tsina,qqzone，以data-type的形式存储在 .btn-share 标签上
         * @param  {Object} data 需要分享的hash表，以data-***的形式存储在 .share-list 标签上
         * @return {String} queryString  序列化的分享内容url字符串;
         *
         */
        set: function(type, data) {
            var query = {};
            query.click = 1;
            query.url = (data.url || "");
            query.uid = this.uid;
            query.to = type;
            query.type = "text";
            query.relateUid = data.wbuid || "";
            query.pic = (data.pic || "");
            query.title = this._formatTitle(data.text);
            query.key = "";
            query.sign = "on";
            query.desc = (data.desc || "");
            query.summary = (data.summary || "");
            query.comment = encodeURIComponent(data.comment || "");
            query.searchPic = 0;
            query.l = this.time();
            query.linkid = this.string();
            query.sloc = "";
            query.apiType = 0;
            query.buttonType = 0;
            query.site = "bshare";

            this.options.text = query.url;
            return '?' + $.param(query);
        },

        load: function(query) {
            var img = new Image();
            img.onload = function() {
                img = img.onload = null;
            };
            img.src = this.url + "commit" + query + "&t=" + Math.random();
        },

        open: function(query) {
            var that = this;
            window.open(that.url + query, "_blank", "width=721,height=572, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no" + ",top=" + that.setwin(721, 567).iTop + ",left=" + that.setwin(721, 567).iLeft);
        },

        time: function() {
            var t = +new Date,
                e = t + 1000,
                n = t + 3000;
            return t.toString(32) + e.toString(32) + n.toString(32)
        },

        string: function() {
            var t = (new Date).toString(36),
                e = Math.random().toString(36).substr(3);

            return t + e
        },
        _formatTitle: function(text) {
            return text ? (text.substr(0, 120)) : this.title;
        },

        renderQrCode: function(self) {
            var that = this;
            var followtop = $(window).height() * 0.5;
            $('#J_qr_code_share').empty().append('<span style="position: absolute;top: 6px;left: 12px;">扫码查看</span><i class=" fa fa-remove" style="position: absolute;top: 10px;right: 26px;cursor:pointer"></i>').qrcode({
                text: window.location.href,
                width: 210,
                height: 210,

            }).css({
                top: followtop,
                left: self.offset().left - that.options.width / 2 + 30
            }).show(200);
        },
        _randomString: function(str, e) {
            var n = str.length,
                o = "",
                i = 1;
            while (i < n) {
                var a = Math.floor(n * Math.random());
                o += str.charAt(a);
                i++;
            }

            return o
        }
    };

    window.Share = function() {
        return Share();
    }

}(window.jQuery));

//微信分享
var wxShare = function() {
    //引入
    $("body").append("<script src='http:\/\/res.wx.qq.com/open/js/jweixin-1.0.0.js'><\/script>");
    var js = document.createElement('script');
    js.setAttribute('type', 'text/javascript');
    js.setAttribute('src', 'http:\/\/res.wx.qq.com/open/js/jweixin-1.0.0.js');
    $("head").append(js);
    js.onload=function(){
        var ramId=new Date().getTime();
        //配置
        wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: 'gh_fc019f690550', // 必填，公众号的唯一标识
            timestamp: ramId, // 必填，生成签名的时间戳
            nonceStr: '"'+ramId+'"', // 必填，生成签名的随机串
            signature: '', // 必填，签名，见附录1
            jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function() {

                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });
        //朋友圈
        wx.onMenuShareTimeline({
            title: document.title, // 分享标题
            link: '', // 分享链接
            imgUrl: 'http://img.wqdian.com/group2/M00/4E/B4/yq0KEVVpqI2AffAxAAd2m9DDums282.jpg', // 分享图标
            success: function() {
                // 用户确认分享后执行的回调函数
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        });

        //朋友
        wx.onMenuShareAppMessage({
            title: document.title, // 分享标题
            desc: 'desc111111111', // 分享描述
            link: 'link222222', // 分享链接
            imgUrl: 'http://img.wqdian.com/group2/M00/4E/B4/yq0KEVVpqI2AffAxAAd2m9DDums282.jpg', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
                // 用户确认分享后执行的回调函数
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        });
        //到QQ
        wx.onMenuShareQQ({
            title: document.title, // 分享标题
            desc: 'desc1111111111', // 分享描述
            link: 'link22222222', // 分享链接
            imgUrl: 'http://img.wqdian.com/group2/M00/4E/B4/yq0KEVVpqI2AffAxAAd2m9DDums282.jpg',// 分享图标
            success: function() {
                // 用户确认分享后执行的回调函数
            },
            cancel: function() {
                // 用户取消分享后执行的回调函数
            }
        });
    };
    
  

}();
