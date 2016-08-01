/* 先沿用application */
    var yz = yizhan();
$(function() {
        htmlHeader = $('#HTMLDATAHEADER .wqdView');
        //关闭侧边栏
        $(document).on("wqdComponentD:overlay", function() {

            //删除元素工具栏
            $(".elementToolbar").remove()
            /* 关闭其他没用的 */
            $("#wqdPageInfD span.close").click();
            //如果轮播存在，并正在往里拖元素，那么不能再拖入轮播控件
            if ($("body").attr("data-carouseEditing") == "true") {
                if ($(".wqd-carouseOverlay").find("div[data-elementtype='carouse']").length) {
                    $("#wqdpageLeft ul li").eq(6).hide();
                    //$("#wqdpageLeft ul li").eq(7).hide();
                    $("#wqdComponentD ul.ctrlD>li:not(:eq(5))").hide();
                    $("#wqdComponentD ul.picD li").eq(1).hide();
                    $("#wqdComponentD ul.picD li").eq(2).hide();
                } else if ($(".wqd-carouseOverlay").find("div[data-elementtype='hoverContainer']").length) {
                    $("#wqdpageLeft ul li").eq(6).hide();
                    //$("#wqdpageLeft ul li").eq(7).hide();
                    $("#wqdComponentD ul.ctrlD>li:not(:eq(5),:eq(2),:eq(1))").hide();
                    $("#wqdComponentD ul.picD li").eq(1).hide();
                    $("#wqdComponentD ul.picD li").eq(2).hide();
                } else if ($(".wqd-carouseOverlay").find("div[data-elementtype='form']").length) {
                    $("#wqdpageLeft ul li").eq(7).hide();
                    $("#wqdComponentD ul.picD li").eq(1).hide();
                    $("#wqdComponentD ul.picD li").eq(2).hide();
                    $("#wqdControlFormD ul li").eq(0).hide();
                   // $("#wqdControlFormD ul li").show().eq(0).hide();
                } else if ($(".wqd-carouseOverlay").find("div[data-elementtype='secondNav']").length) {
                    $("#wqdpageLeft ul li").eq(6).hide();
                    $("#wqdpageLeft ul li").eq(7).hide();
                    $("#wqdComponentD ul.picD li").eq(1).hide();
                    $("#wqdComponentD ul.picD li").eq(2).hide();
                } else if($(".wqd-carouseOverlay").find("div[data-elementtype='groupContainer']").length) {
                    $("#wqdComponentD ul.picD li").eq(1).hide();
                    $("#wqdComponentD ul.picD li").eq(2).hide();
                    $("#wqdpageLeft ul li").eq(6).hide();
                    $("#wqdComponentD ul.ctrlD>li").eq(0).hide().end().eq(3).hide().end().eq(4).hide().end().eq(6).hide();
                }
            } else {
                $("#wqdpageLeft ul li").show();
                $("#wqdComponentD ul.picD li").show();
                $("#wqdControlFormD ul li").show();
                $("#wqdComponentD ul.ctrlD>li").show();
                // $("#wqdControlFormD ul li").hide().eq(0).show();
                // 报错临时注释
                // yz.removeRule();
            }

            //自动执行点击出来
            var span = $("#wqdpHeaderD ul.func-list .funcBtn1");
            if (!span.hasClass("on")) {
                span.click();
            }
            //默认切换到基础元素
            //$("#wqdComponentD .tabqie p:first-child").click();

            //轮播图打开遮罩以后阻挡其他的设置
            if ($('body').attr('data-carouseediting') != 'true' && $('#wqdpHeaderD').hasClass('carousehidenav')) {
                $('#wqdpHeaderD').removeClass('carousehidenav');
            } else {
                $('#wqdpHeaderD').addClass('carousehidenav');
            }

        });

        //通条定位---通条选中
        $(document).on('click', 'ul.usercontent li, ul.userht li', function(event) {
            $(this).parents(".sectionList").find("ul.usercontent li, ul.userht li").removeClass("on")
            $(this).addClass("on");
            if (event.target.className == 'facBtn1') {
                return false;
            }
            // 设置顶部栏目设置的属性通条id
            if ($(this).attr('sectioncategoryid') == 21) {
                $('.tool-list2').attr('partid', $(this).attr('partid')).attr('isheader', true);
            } else {
                $('.tool-list2').attr('partid', $(this).attr('partid')).attr('isheader', false);
            }

            var node = $('div[partid=' + $(this).attr('partid') + ']'),
                h = $('#HTMLDATAHEADER').height();
            if (node.length) {
                $('#wqdpageSectionD ul li').removeClass('bor');
                $(this).addClass('bor');
                $('.yzmoveContent').removeClass('yzmoveContentBor');
                node.parent().addClass('yzmoveContentBor');
                $('html,body').animate({
                    scrollTop: $('div[partid=' + $(this).attr('partid') + ']').offset().top - 50 + 'px'
                }, 500);
            }
        })

        //宽度
        /*$("div.viewwidth").on("input propertychange", "input", function() {
            var val = $(this).val() || "0";
            if (val.match(/[^0-9]/g)) {
                val = parseInt(val.replace(/[^0-9]/g, "")) || 0;
                if (val != $(this).attr("value")) {
                    val = $(this).attr("value");
                }
                $(this).val(val);
            }
            $(this).attr("value", val);
            yz.getSectionHeight();
            yz.removeRule();
        });

        $('div.viewwidth').on('blur', 'input', function(e) {
            var userview = $('#HTMLDATAHEADER .wqdAreaView');
            var w = $(this).val();
            $('style#styleCss').remove();
            yz.removeRule();
            if (userview.find('div.yzmoveContent').length) {
                userview.find('.yzmoveContent').before($('<style type="text/css" id="styleCss" uw="' + w + '">.wqdAreaView .wqdSectiondiv{min-width:' + w + 'px;} .wqdAreaView .wqdBkEditos{width:' + w + 'px;} .fullscreen .bannerContainer{margin:0 auto;width:' + w + 'px !important;}</style>'));
            } else {
                userview.append($('<style type="text/css" id="styleCss" uw="' + w + '">.wqdAreaView .wqdSectiondiv{min-width:' + w + 'px;} .wqdAreaView .wqdBkEditos{width:' + w + 'px;} .fullscreen .bannerContainer{margin:0 auto;width:' + w + 'px !important;}</style>'));
            }
            $(document).trigger("appSetCatch");
        });*/







        //通条级通条复制
        var part_list = $('#wqdUpdateCutBox');
        var $siteId = $.getUrlParam('siteId');
        $(document).on("click", "#wqdpageSectionD li[data=cont] span.facBtn1", function() {
            if (part_list.is(":hidden")) {
                part_list.show();
            }
            if ($(this).hasClass("on")) return; //剪切板已满
            var leng = part_list.find("ul li").length;
            if (leng <= 2) {
                // yz.copyPart($(this).parents('li'));
                //新版方式
                yz.yxsavePartHTML($(this).parents('li'));
            }
            if(leng == 2){
                $("#wqdUpdateCutBox b.full").css("opacity","1");
            }
        });
        //黏贴通条
        part_list.on("click", "span.facBtn8", function() {
            //AJAX 成功以后，直接调用  addPart
            var that = this;
            $.ajax({
                type: "GET",
                url: URLPATH + 'design/section/readSection?key=' + $(that).parents("li").attr("partid"),
                data: {
                    siteId: $siteId
                },
                async: true,
                dataType: "json",
                success: function(data) {
                    //AJAX成功后
                    if (data.status == 200) {
                        var arr = $.base64.atob(data.data, true).split(";;");
                        yz.addPart("wqd" + new Date().getTime() + "serial", arr[0], arr[1], "（复制can）" + arr[2], arr[3], arr[4]);
                    }
                }
            });
        });
        //删除通条
        part_list.on('click', 'span.facBtn3', function() {
            $("#wqdUpdateCutBox b.full").removeClass("on");
            var $liLength = $("ul li", part_list).length;
            var that = this;
            $.ajax({
                type: "GET",
                url: URLPATH + 'design/section/removeSection?key=' + $(that).parents("li").attr("partid"),
                data: {
                    siteId: $siteId
                },
                async: true,
                dataType: "json",
                success: function(data) {
                    if (data.status == 200) {
                        //AJAX成功后
                        $(that).parents("li").remove();
                        //showCutBox();//剪切板显示
                    } else {
                        // _this.val('域名不可用');
                        // setTimeout(  function(){   _this.val('http://');  },2000 );
                    }
                }
            });
            if ($liLength == 1) {
                part_list.hide();
            }
            if($liLength == 3){
                $("#wqdUpdateCutBox b.full").css("opacity","0");
            }
        });
        //显示隐藏剪切板
        part_list.on("click", "p.togglebtn", function() {
            var $liLength = $("ul li", part_list).length;
            switch ($liLength) {
                case 1:
                    $(this).parent().toggleClass("slideToggleo");
                    break;
                case 2:
                    $(this).parent().toggleClass("slideTogglew");
                    break;
                case 3:
                    $(this).parent().toggleClass("slideTogglet");
                    break;
            }
        });
    })
    //获取网址参数
$.getUrlParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return (decodeURIComponent(r[2]));
    return null;
};
