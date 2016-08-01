$(function() {
    var baseInit = {
        init : function(){
            //this.setCarouseWidth();
            this.navAutoOutside();
            this.bindEvent();
        },
        bindEvent : function(){
            var self = this;
            $(document).on("click","[data-link-href]",function (e) {
                var url = $(this).attr("data-link-href");
                if(!url) return;
                if(/link-moveTo-/ig.test(url)) {
                    if(/top/g.test(url)) {
                        $("html,body").scrollTop(0);
                    } else if(/bottom/g.test(url)) {
                        setTimeout(function () {
                            $("html,body").scrollTop($(document).height());
                        },100)
                    }
                } else if($(this).attr("data-link-newwindow") == "true") {
                    window.open(url);
                } else {
                    location.href = url;
                }
                return false;
            }).on("click", "[wqdhref=1] a,[linktype=thisPage] a", function(e) {
                e.preventDefault();
                var top = $($(this).attr("href")).offset().top;
                if(top || top === 0 ) $("html,body").scrollTop(top );
            });
            // $(window).on("resize",function () {
            //     self.setCarouseWidth();
            // });
        },
        setCarouseWidth : function(){
            $('.fullscreen [data-elementtype=carouse]').each(function() {
                var $this = $(this),
                    width = $(window).width(),
                    sectionWidth = +$this.parents(".sectionV2").attr("sectionwidth") || 1200;
                $this.width(width < sectionWidth ? sectionWidth : width).css("opacity",1);
            });
        },
        //导航自动选择（发布后��?
        navAutoOutside : function(){
            var lingAll = $(".wqdNavTemplate a[data-link-href]").not(".a_top"),
                pathName = location.pathname.replace("\/",""),
                elmenDom = null;
            lingAll.each(function(){
                if(!$(this).attr("href")) $(this).attr("href","javascript:void(0);");
                var hrefurl = $(this).attr("data-link-href") ? $(this).attr("data-link-href").replace("\/","") : "";
                if(($(this).attr("homepage")=="true" && !pathName) || (hrefurl==pathName && pathName)){
                    elmenDom = $(this);
                    return false;
                }
            });
            if(elmenDom){
                elmenDom.parent().addClass("active");
                lingAll.parent().not(elmenDom.parent()).removeClass("active");
            }else{
                lingAll.parent().removeClass("active");
            }
        }
    };
    baseInit.init();
});
