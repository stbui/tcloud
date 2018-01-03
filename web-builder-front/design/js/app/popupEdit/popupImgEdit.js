define(['popupDrag', 'createColorStyle', 'utility', 'elementInfo'], function(popupDrag, createColorStyle, utility, elementInfo) {
    var popupImgEdit = {};
    //获取分类列表category：1为用户，2为在线 obj：数据容器 url：请求地址
    function getCategoryList(category, obj, url) {
        $.ajax({
            url: url,
            type: "get",
            data: {},
            dataType: "json",
            success: function(json) {
                if (json && json.length > 0) {
                    var html = "";
                    if (category == 1) html += '<li category="0">全部</li>';
                    for (var k in json) {
                        html += '<li category="' + json[k].id + '"><div class="kind">' + json[k].name + '</div><i class="fa fa-cog"></i></li>';
                    }
                    obj.html(html);
                    if (category == 1) {
                        $('.super_editor .part1_content .category li').eq(0).trigger('click');
                        if(json.length>=6){
                            obj.parents("#colorbox").attr("limit","true");
                            $('.add_category').hide();
                        }
                    } else {
                        $('.super_editor .part2_content .category li').eq(0).trigger('click');
                    }
                } else {
                    if (category == 1) {
                        obj.html('<li category="0"><a href="javascript:void(0);">全部</a></li>');
                        $('.super_editor .part1_content .category li').eq(0).trigger('click');
                    }
                }
                $(".nano").nanoScroller({
                    alwaysVisible: true
                });
            }
        });
    };
    //获取分类图片category：1为用户，2为在线 obj：数据容器 url：请求地址
    function getImages(category, obj, url,eventType) {
        $.ajax({
            url: url,
            type: "get",
            data: {},
            dataType: "json",
            success: function(json) {
                // if (category == 1) $('.super_editor .part1 .mesg em').text(json.totalCount);
                var initHtml=obj.html();
                if (json.data && json.data.length > 0) {
                    var html = '';
                    if (category == 1) {
                        for (var k in json.data) {
                            html += '<li class="move" img_id="' + json.data[k].id + '"><div class="imgwap"><p><a href="javascript:void(0);" class="delete" title="删除图片"><i class="fa fa-trash-o"></i></a></p><img src="' + CSSURLPATH + json.data[k].path + '" bigimg="' + json.data[k].path + '"></div></li>';
                        }
                    } else {
                        for (var k in json.data) {
                            html += '<li img_id="' + json.data[k].id + '"><div class="imgwap"><img src="' + CSSURLPATH + json.data[k].path + '" bigimg="' + json.data[k].path + '"></div></li>';
                        }
                    }
                    eventType=="scroll"?obj.html(initHtml+html):obj.html(html);
                    // obj.html(html);
                } else {
                    if (category == 1) {
                        obj.html('<div style="position:absolute;z-index:3;top:0;left:0;width:100%;height:100%; background:url(../../../images/v2/design/popup/noImg.png) no-repeat center center;"><p style="color:#999;text-align:center;margin-top:260px;">该分类暂无图片，请点击“上传图片”按钮，或从全部分类中拖入。<span class="new_post_img" style="color:#72add7;cursor:pointer;">上传图片<span><p></div>');
                        obj.find(".new_post_img").on("click", function() {
                            $("#fileupload").trigger("click");
                        });
                    } else {
                        obj.html('<div style="position:absolute;z-index:3;top:0;left:0;width:100%;height:100%; background:url(/images/v2/design/popup/noImg.png) no-repeat center center;"><p style="color:#999;text-align:center;margin-top:260px;">该分类暂无图片。<p></div>');
                    }
                }
                $(".nano").nanoScroller({
                    alwaysVisible: true
                });
                // obj.scrollTop(0);
            }
        });
    };
    //删除图片
    function deleteImg(obj) {
        var img_id = obj.attr("img_id");
        $.ajax({
            url: '/user/gallery/delete/' + img_id,
            type: "post",
            timeout: 30000,
            data: {},
            dataType: "json",
            success: function(json) {
                if (json.status == 200) {
                    obj.remove();
                    // $('.super_editor .part1 .mesg em').text($('.super_editor .part1 .mesg em').text() - 1);
                } else {
                    alert(json.msg);
                }
            }
        });
    }
    popupImgEdit.commonInit = function() {
        $(".colorpicker.dropdown-menu").remove();
        var colorpic = $('.wqdColorPicker').colorpicker({
            format: false,
            colorSelectors: {
                '#777777': 'rgba(119, 119, 119,1)',
                '#337ab7': 'rgba(51, 122, 183,1)',
                '#5cb85c': 'rgba(92, 184, 92,1)',
                '#5bc0de': 'rgba(91, 192, 222,1)',
                '#f0ad4e': 'rgba(240, 173, 78,1)',
                '#d9534f': 'rgba(217, 83, 79,1)'
            }
        });
        //初始化颜色编辑器位置
        $('.wqdColorPicker').on("showPicker", function(e) {
            var elm = $(this),
                viewTop = elm.offset().top + elm.outerHeight() - $(window).scrollTop() + "px";
            setTimeout(function() {
                $(".colorpicker-visible").addClass("wqdDeleteArrows").css({
                    "top": viewTop,
                    "position": "fixed",
                    "z-index": "9999"
                });
            }, 0);
        });
        //初始化编辑器位置(保持居中)
        var editBoxW = $(".wqdEditBox").width(),
            editBoxH = $(".wqdEditBox").height(),
            nowLeft = $(window).width() / 2 - editBoxW / 2,
            nowTop = $(window).height() / 2 - editBoxH / 2;
        $(".wqdEditBox").css({
            "left": nowLeft,
            "top": nowTop,
            "opacity": 1
        });
        //编辑器弹窗关闭
        $(".wqdEditBox .edit_close").on("click", function() {
            $.fn.colorbox.close();
        });
        /*背景设置---左侧导航*/
        $(".wqdEditBox  .edit_content_nav li").click(function() {
            var index = $(this).index();
            $(this).parents("nav.edit_content_nav").siblings("ul.edit_content").children().removeClass("on").eq(index).addClass("on");
            if ($(this).hasClass("on")) return false;
            $(this).addClass("on").siblings().removeClass("on");
            if ($(this).hasClass("imagesEdit") || $(this).hasClass("imagesSet")) {
                $(".super_editor .editor_footer>a").attr("picBox", "true");
                //添加选中图片
                var oldLiLen = $(".part5_content .img_item_box li").length;
                // var $addLi = $(".album ul li.active");
                var flag = false;
                // $addLi.each(function() {
                //     var selectImg = $(this).find("img");
                //     $(".img_item_box").each(function() {
                //         var liLen = $(this).children().length;
                //         $('<li class="add" data_pic="' + (liLen + 1) + '" txttitle="打造一流的响应式网站" style="cursor: pointer;"><img src="' + selectImg.attr("src") + '"> <div class="mask" style="cursor: move;"></div></li>').appendTo($(this));
                //     });
                //     $(this).removeClass("active");
                //     flag = true;
                // });
                //新逻辑
                for(var x in popupImgEdit.pictureImgArr){
                   $(".img_item_box").each(function() {
                        var liLen = $(this).children().length;
                        $('<li class="add" data_pic="' + (liLen + 1) + '" txttitle="打造一流的响应式网站" style="cursor: pointer;"><img src="' + popupImgEdit.pictureImgArr[x] + '"> <div class="mask" style="cursor: move;"></div></li>').appendTo($(this));
                    });
                    flag = true;
                };
                if (flag) {
                    edit.attr("data-elementtype")=="picture"&&$(".img_item_box").children().eq(oldLiLen).trigger("mousedown");
                    // var posTop =$(".img_item_box ").find("li:eq("+oldLiLen+")").offset().top;
                    $(".img_item_box").animate({
                        scrollTop: oldLiLen * 70
                    }, 500); //70为每一个li的高度
                };
                $(".album ul li.active").removeClass("active");//去类
                popupImgEdit.pictureImgArr=[];//清空
            } else {
                // var $addLi = $(".album ul li.active");
                // $addLi.each(function() {
                //     var selectImg = $(this).find("img");
                //     $(".img_item_box").each(function() {
                //         var liLen = $(this).children().length;
                //         $('<li class="add" data_pic="' + (liLen + 1) + '" txttitle="打造一流的响应式网站" style="cursor: pointer;"><img src="' + selectImg.attr("src") + '"> <div class="mask" style="cursor: move;"></div></li>').appendTo($(this));
                //     });
                //     $(this).removeClass("active")
                // });
                getCategoryList(1, $('.category ul', $(".super_editor .part1_content")), URLPATH+'user/gallery/categories');
                $(".super_editor .editor_footer>a").attr("picBox", "false");
            }
            $('.super_editor .part4_content .img_box_panel>a').css("display", "none");
            //处理点击变形问题
            if ($(".part4_content .clip_list a.active").length) {
                $(".img_box_panel .img_box img#img_clip").css("display", "inline");
                $(".part4_content .clip_list a.active").trigger("click");
            };
            $(".nano").nanoScroller({
                alwaysVisible: true,
            });
            return false;
        });
        //编辑框问号点击链接
        $(".wqdEditBox  .edit_help").click(function() {
            if ($(this).siblings("h1:contains('分享设置')").length != 0 || $(this).siblings("h1:contains('关注设置')").length != 0) {
                window.open("http://127.0.0.1");
            };
        });

        //编辑框问号点击链接
        $(".wqdEditBox  .edit_help").off("click").click(function() {
            var  $pictureType = !edit.attr("data-elementtype") ? edit.parents('[data-elementtype]').attr('data-elementtype') : edit.attr("data-elementtype");
            if ($pictureType=="picture") {
                window.open("http://127.0.0.1");
            }else if($pictureType=="img"){
                window.open("http://127.0.0.1");
            };

        });
    };
    //编辑图片入口
    popupImgEdit.editImgInit = function() {
        //链接设置思路：设置---切换---使用---回显
        //图册排序思路：添加---删除---排序---重置
        var $obj = window.edit,
            $pictureType = !$obj.attr("data-elementtype") ? $obj.parents('[data-elementtype]').attr('data-elementtype') : $obj.attr("data-elementtype"),
            $editBox = $obj.find(".wqdelementEditBox");
        //初始化图片编辑器
        if ($pictureType == 'img') {
            var imgBgColor=!!$obj.find(".maskPanel").length ? $obj.find(".maskPanel").css("background-color") : "rgba(0,0,0,0)";
            $(".super_editor.menu .link,.super_editor.menu .links,.super_editor.menu .linkout,.super_editor li.link>a").css("display", "inline-block");
            $(".img_title input").addClass("disabled");
            if ($obj.attr("linktype") == "innerPage" || $obj.attr("linktype") == "pageOuter") {
                if ($obj.attr("newWindow") == "true") {
                    $(".desp").css("display", "block").find("span").addClass("on");
                } else if (!$obj.attr("newWindow")) {
                    $(".desp").css("display", "block").find("span").removeClass("on");
                }
            } else {
                $(".desp").css("display", "none");
            }
            //蒙版颜色
            $(".img_box .maskPanel").css({"background-color": imgBgColor });
            //遮罩小圆背景
             $(".super_editor .part4_content .colordeviceBg i").css({"background-color": imgBgColor }).parent().siblings("input").val(imgBgColor);
        } else if ($pictureType == 'picture') {
            $(".super_editor.menu .link,.super_editor.menu .links,.super_editor.menu .linkout,.super_editor li.link>a").css("display", "inline-block");
            $(".super_editor .part4_content .content_right .confirm").css("left", 252);
            $(".super_editor .part4_content .content_right .cancel").css("left", 382);
            //根据功能区分
            if ($obj.find(".atlasWrap3,.atlasWrap5").length != 0) {
                $(".img_title input").addClass("disabled").attr("disabled", "disabled");
            };
            if ($obj.find(".atlasWrap3,.atlasWrap4,.atlasWrap5").length != 0) {
                $obj.find(".wqd-atlas a").each(function() {
                    $(this).css({
                        "background-image": $(this).css("background-image")
                    });
                });
            };
            //保存子元素样式
            $obj.attr("savestyle", $obj.find("ul.wqd-atlas li").attr("style"));
            $obj.attr("saveclass", $obj.find("ul.wqd-atlas li").attr("class"));
            //重置属性data_pic
            $obj.find(".wqd-atlas li").each(function() {
                var $picImg = $(this);
                $picImg.attr("data_pic", $picImg.index() + 1).removeAttr("dele");
            });
        } else {
            $(".part4_content .mask_btn").css("display","none");
            $(".img_title input").addClass("disabled");
            $(".part5_content ul.menu li:gt(1)").addClass("noview");
        };
        //蒙版设置
        var $maskSet = {
            $getInput: $(".partbox .mask_set input"),
            $getMaskI: $(".partbox .mask_set .colordeviceBg i"),
            $getMaskPanel: $(".partbox .img_box span.maskPanel"),
            $getObjPicLimask: $obj.find(".wqd-atlas li[data_pic=1]")
        }
        //图册编辑
        var $allAttr = {
            getObjPic: $obj.find("img").attr("src"), //单图的图片路径
            getPartBox: $("ul.partbox"),
            getPicList: $obj.find("ul.wqd-atlas li"), //获得图册中图片列表
            getPicListBox: $(".super_editor .img_item"), //获取弹窗中图片展示列表wqdelementEditBox
            getEditBox: $obj.find(".wqdelementEditBox"),
            picSectionBox: $obj.parents(".yzmoveContent"), //hasClass("yzmoveContentBor")
            picMenu: $(".partbox ul.menu")
        };
        //设置链接
        var $wqdlink = ["wqdlink"],
            $linka = $(".super_editor li.link>a"),
            $linkstext = $(".super_editor li.links a.links-text"),
            $linkout = $(".super_editor li.linkout .link-url");
        var $picturePanelMain = {
            clearMaskPanel: function() { //清除蒙版
                $maskSet.$getInput.val(" ");
                $maskSet.$getMaskI.css("background", "transparent");
                $maskSet.$getMaskPanel.css("background-color", "transparent");
            },
            setMaskPanel: function(setColor) { //设置蒙版
                $maskSet.$getInput.val(setColor);
                $maskSet.$getMaskI.css("background", setColor);
                $maskSet.$getMaskPanel.css("background-color", setColor);
            },
            thisPageLinks: function(eleparent) { //本页链接
                $(".plist.on .usercontent>li").each(function(index, element) {
                    var partid = $(this).attr("partid"),
                        content = $("[partid=" + partid + "] em").html(),
                        ele = $("<li linkType='thisPage'><span partid=" + partid + ">" + content + "</span></li>");
                    eleparent.append(ele);
                });
            },
            innerPageLinks: function(eleparent) { //站内链接
                eleparent.empty(); //先在外面清空(解决出现“我的站点bug”)
                $(".pagedeatllist>li").not("[viewnews]").each(function(){
                    var href = $(this).attr("data-uri"),
                        content = $(this).find("em").eq(0).html();
                    var ele = $("<li linkType='innerPage'><span partid=" + href + ">" + content + "</span></li>");
                        eleparent.append(ele);
                });
            },
            setLinks: function(picLink, otherLink) {
                $linkstext.empty();
                if ($maskSet.$getObjPicLimask.length) {
                    $(".super_editor li.links span[partid='" + picLink + "']").clone().appendTo($linkstext);
                } else {
                    $(".super_editor li.links span[partid='" + otherLink + "']").clone().appendTo($linkstext);
                }
            },
            showLinks: function() { //设置连接
                var $linktype = function() {
                    if ($pictureType == "picture") {
                        return $(".img_item_box li.active").attr("linktype");
                    } else {
                        return $maskSet.$getObjPicLimask.length ? $(".img_item_box li.active").attr("linktype") : $obj.attr("linktype");
                    }
                }();
                $linkstext.removeAttr("disabled");
                var $getmaskWqdlink = function() {
                    if ($pictureType == "picture") {
                        return $(".img_item_box li.active").attr("wqdlink");
                    } else {
                        return $maskSet.$getObjPicLimask.attr("wqdlink");
                    }

                }();
                var $getObjwqdLikn = function() {
                    if ($pictureType == "picture") {
                        return $(".img_item_box li.active").attr("wqdlink");
                    } else {
                        return $obj.attr("wqdlink");
                    }

                }();
                var $getmaskWqdlinkouter = function() {
                    if ($pictureType == "picture") {
                        return $(".img_item_box li.active").attr("wqdlink");
                    } else {
                        return $maskSet.$getObjPicLimask.attr("wqdlink");
                    }
                }();
                switch ($linktype) {
                    case "thisPage":
                        getLinksbox.empty();
                        $picturePanelMain.thisPageLinks(getLinksbox);
                        $linka.eq(1).addClass("active").siblings().removeClass("active");
                        $(".super_editor li.links").show();
                        $(".super_editor li.linkout").hide();
                        $picturePanelMain.setLinks($getmaskWqdlink, $getObjwqdLikn);
                        break;
                    case "innerPage":
                        $picturePanelMain.innerPageLinks(getLinksbox);
                        $linka.eq(2).addClass("active").siblings().removeClass("active");
                        $linkstext.empty();
                        $(".super_editor li.links").show();
                        $(".super_editor li.linkout").hide();
                        $picturePanelMain.setLinks($getmaskWqdlink, $getObjwqdLikn);
                        break;
                    case "pageOuter":
                        $linka.eq(3).addClass("active").siblings().removeClass("active");
                        $(".super_editor li.links").hide();
                        $(".super_editor li.linkout").show();
                        if ($maskSet.$getObjPicLimask.length) {
                            $linkout.empty().text($getmaskWqdlinkouter);
                        } else {
                            $linkout.empty().text($getObjwqdLikn);
                        }
                        break;
                    default:
                        $linkstext.attr("disabled", "disabled").text("---------------请选择---------------");
                        $(".super_editor li.links").show();
                        $(".super_editor li.linkout").hide();
                        $linka.eq(0).addClass("active").siblings().removeClass("active");
                        break;
                }
            },
            pictureBoxshow: function() { //图册列表初始化
                var $imgListBox = $allAttr.getPicListBox.find(".img_item_box"),
                    $imgList = "";
                $allAttr.getPicList.each(function() {
                    var $this = $(this);
                    var txtTitle = $this.find(".txt_box>h5").text();
                    var txtTitleAttr = txtTitle.split("");
                    $.each(txtTitleAttr, function(n, value) {
                        value = value.replace(/\.|\\|\$|\[|\]|\(|\)|\'|\\|\<|\>|\"|\?|\:|\,|\*|\%|\^|\#|\ |\`|\~|\!|\&|\_|\||\{|\}|\+|\=|\;|\@|\/|\-/g, "\\" + value);
                    });
                    txtTitle = txtTitleAttr.join("").replace(/\"/g, "&quot;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;");
                    $cloneImg = $this.find(".wrap a").find("img").removeAttr("style").end().html().replace("<span></span>", " ");
                    var $cloneImg = function() {
                        if (edit.find(".atlasWrap3,.atlasWrap4,.atlasWrap5").length != 0) {
                            return "<img src=" + $this.find(".wrap a").css("background-image").replace(/\"|\(|url|\)/g, "") + "\><div class='mask' style='background-color:" + $this.find(".mask").css("background-color") + "'></div>";
                        } else {
                            return $this.find(".wrap a").html().replace("<span></span>", " ");
                        }
                    }();
                    //图册列表第一项设置
                    if ($this.attr("data_pic") == "1") {
                        $imgList += "<li data_pic=\'" + $this.attr("data_pic") + "\'class=\'active\' txtTitle=\'" + txtTitle + "\' wqdlink=\'" + ($this.attr("wqdlink") ? $this.attr("wqdlink") : "") + "\' linktype=\'" + ($this.attr("linktype") ? $this.attr("linktype") : "") + "\' newWindow=\'" + ($this.attr("newWindow") ? $this.attr("newWindow") : "") + "\'\>" + $cloneImg + "\<\/li\>";
                        if ($(this).attr("linktype") == "innerPage" || $(this).attr("linktype") == "pageOuter") {
                            if ($(this).attr("newWindow") == "true") {
                                $(".desp").css("display", "block").find("span").addClass("on");
                            } else if (!$(this).attr("newWindow")) {
                                $(".desp").css("display", "block").find("span").removeClass("on");
                            }
                        } else {
                            $(".desp").css("display", "none");
                        }
                        $(".partbox .img_box>img").attr("src", edit.find(".atlasWrap3,.atlasWrap4,.atlasWrap5").length != 0 ? $this.find(".wrap a").css("background-image").replace(/\"|\(|url|\)/g, "") : $(this).find("a img").attr("src"));
                        if ($this.find(".txt_box").length) {
                            $(".img_title input", $allAttr.picMenu).removeAttr("disabled").val(txtTitle);
                            //图册三五无主题
                            if ($obj.find(".atlasWrap3").length != 0 || $obj.find(".atlasWrap5").length != 0) {
                                $(".img_title input").addClass("disabled").attr("disabled", "disabled").val("");
                            };
                        } else {
                            return;
                        }
                    } else {
                        $imgList += "<li data_pic='" + $this.attr("data_pic") + "' txtTitle='" + txtTitle + "' wqdlink='" + ($this.attr("wqdlink") ? $this.attr("wqdlink") : "") + "' linktype='" + ($this.attr("linktype") ? $this.attr("linktype") : "") + "' newWindow='" + ($this.attr("newWindow") ? $this.attr("newWindow") : "") + "'>" + $cloneImg + "</li>"
                    }
                });
                $imgListBox.empty().append($imgList);
                //对首张图片的设置---start
                $picturePanelMain.showLinks();
                var image = new Image();    
                image.src = $(".img_item_box li:eq(0)").find("img").attr("src");
                var realWidth = image.width;
                var realHeight = image.height;
                $('.img_box img').each(function() {
                    $(this).attr("realWidth", realWidth).attr("realHeight", realHeight);
                });
                //对首张图片的设置---end
            }
        }
        if ($pictureType == "picture") {
            $('.super_editor .part5_content .img_box_panel>a').css("display", "block");
            $picturePanelMain.setMaskPanel($obj.find(".wqd-atlas li:eq(0) div.mask").css("background-color"));
        } else if($pictureType=="carouse"){
            $picturePanelMain.setMaskPanel($obj.attr("curbgcolor"));
            $('.super_editor .part5_content .img_box_panel>a').css("display", "none");
        }else {
            var $getWqdbgcolor = $obj.attr("wqdbgcolor");
            $('.super_editor .part5_content .img_box_panel>a').css("display", "none");
        }
        //新窗口打开链接
        $(".part5_content .newWindow .desp span").click(function() {
            $(this).toggleClass("on");
            if ($(this).hasClass("on")) {
                if ($pictureType == 'img') {
                    $obj.attr("newWindow", "true");
                } else if ($pictureType == 'picture') {
                    if (!$(".img_item_box li.active").hasClass("add")) {
                        $obj.find(".wqd-atlas li[data_pic='" + $(".img_item_box li.active").attr("data_pic") + "']").attr("newWindow", "true");
                    }
                    $(".img_item_box li.active").attr("newWindow", "true");
                } else if ($pictureType == "carouse") {
                    if ($obj.parents("section").hasClass("fullscreen")) {
                        $obj.find(".bannerContainer").attr("newWindow", "true");
                    } else {
                        $obj.attr("newWindow", "true");
                    }
                };
            } else {
                if ($pictureType == 'img') {
                    $obj.attr("newWindow", "false");
                } else if ($pictureType == 'picture') {
                    if (!$(".img_item_box li.active").hasClass("add")) {
                        $obj.find(".wqd-atlas li[data_pic='" + $(".img_item_box li.active").attr("data_pic") + "']").attr("newWindow", "false");
                    }
                    $(".img_item_box li.active").attr("newWindow", "false");
                } else if ($pictureType == "carouse") {
                    if ($obj.parents("section").hasClass("fullscreen")) {
                        $obj.find(".bannerContainer").attr("newWindow", "false");
                    } else {
                        $obj.attr("newWindow", "false");
                    }
                };
            };
            SetLinkFun(); //链接即时生效
            $(document).trigger('appSetCatch');
        });
        $(".wqdColorPicker").on("changeColor", function() {
            var category = $(this).attr("category") || "",
                colorVal = $(this).val();
            $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
            if (category == "4") {
                //蒙版设置
                var getId=$obj.parent().attr("id"),
                    getEle=":before";
                if ($pictureType == "picture") {
                    $obj.find(".wqd-atlas li[data_pic='" + $(".img_item_box li.active").attr("data_pic") + "']").attr("wqdbgcolor", colorVal);
                }else if($pictureType == "carouse"){
                    var $elementid=$obj.parents("[elementid]");
                    var carouseIndex=$obj.parent().index();
                    getId=$obj.parents("[id]").attr("id");
                    getEle=".carousel-inner .item.mengban" + carouseIndex + ":before";
                    $obj.attr("curbgcolor",colorVal);
                } else {
                    $obj.attr("wqdbgcolor", colorVal);
                };
                createColorStyle.styleInit(getId,getEle, {
                    "content": "' '",
                    "position": "absolute",
                    "top": 0,
                    "left": 0,
                    "width": "100%",
                    "height": "100%",
                    'background-color': colorVal
                });

                //右边缩略图蒙板
                $(".img_item_box li.active div.mask").css("background-color", colorVal);
                // find("div.mask").remove().end().append("<div class='mask' style='background-color:"+colorVal+";'></div>")
                $(this).parents(".partbox").find(".img_box span.maskPanel").css("background-color", colorVal);
            }
            $(document).trigger('appSetCatch');
        });
        //为图片添加链接
        var getalinks = $(".super_editor a.links-text"),
            getLinksbox = $(".super_editor .links ul.nano-content"),
            $getimg = $obj.find("img").clone();
        $(".super_editor").on("click", "li.link a", function() {
            var $this = $(this);
            $this.addClass("active").siblings().removeClass("active");
            $(".super_editor li.links").show();
            $(".super_editor li.linkout").hide();
            var $linktype = function() {
                if ($pictureType == "img") { //单图
                    return $obj;
                } else if ($pictureType == "picture") {
                    return $obj.find("li[data_pic='" + $(".img_item_box li.active").attr("data_pic") + "']");
                } else if ($pictureType == "carouse") {
                    if ($obj.parents("section").hasClass("fullscreen")) {
                        return $obj.find(".bannerContainer");
                    } else {
                        return $obj;
                    }
                } else {
                    return;
                }
            }();
            switch ($this.index()) {
                case 1: //无连接
                    getalinks.attr("disabled", "disabled").text("---------------请选择---------------");
                    $(".part5_content .linkout textarea").text(" ");
                    if ($pictureType == "img") { //单图
                        var noLinkHtml=$editBox.find("img")[0].outerHTML;
                        $editBox.empty().append(noLinkHtml);
                        $obj.removeAttr("wqdlink").removeAttr("linktype");
                    } else if ($pictureType == "picture") {
                        if ($(".img_item_box li.active").hasClass("add")) {
                            return;
                        } else {
                            $maskSet.$getObjPicLimask.find("a").attr("href", "javascript:void(0);");
                            $maskSet.$getObjPicLimask.removeAttr("wqdlink").removeAttr("linktype");
                            $(".img_item_box li.active").removeAttr("wqdlink").removeAttr("linktype");
                        };

                    } else if ($pictureType == "carouse") {
                        if ($obj.parents("section").hasClass("fullscreen")) {
                            $obj.find(".bannerContainer").removeAttr("wqdlink").removeAttr("linktype");
                        } else {
                            $obj.removeAttr("wqdlink").removeAttr("linktype");
                        }
                    } else {
                        return;
                    }
                    $(".newWindow .desp").css("display", "none");
                    SetLinkFun(); //链接即时生效
                    $(document).trigger('appSetCatch');
                    break;
                case 2: //本页链接
                    getalinks.removeAttr("disabled");
                    getLinksbox.empty();
                    $picturePanelMain.thisPageLinks(getLinksbox);
                    $linktype.attr("linktype") == "thisPage" ? $picturePanelMain.setLinks($linktype.attr("wqdlink"), $obj.attr("wqdlink")) : getalinks.text("---------------请选择---------------");
                    // $linktype.removeAttr("newWindow").find("a").removeAttr("target");
                    $(".newWindow .desp ").css("display", "none");
                    break;
                case 3: //站内链接
                    getalinks.removeAttr("disabled");
                    getLinksbox.empty();
                    $picturePanelMain.innerPageLinks(getLinksbox);
                    $linktype.attr("linktype") == "innerPage" ? $picturePanelMain.setLinks($linktype.attr("wqdlink"), $obj.attr("wqdlink")) : getalinks.text("---------------请选择---------------");
                    $(".newWindow .desp ").css("display", "block");
                    //设置新窗口勾选状态
                    if ($linktype.attr("linktype") == "innerPage" && $linktype.attr("newWindow") == "true") {
                        $(".newWindow .desp span").addClass("on");
                    } else {
                        $(".newWindow .desp span").removeClass("on");
                        if (!$(".img_item_box li.active").hasClass("add")) {
                            $linktype.attr("newWindow", "false");
                        }
                        $(".img_item_box li.active").attr("newWindow", "false");
                    };
                    break;
                case 4: //站外链接
                    var wqdlink_out = $linktype.attr("wqdlink");
                    var textarealink = wqdlink_out ? wqdlink_out : "";
                    $(".super_editor li.links").hide();
                    if ($linktype.attr("linktype") == "pageOuter") {
                        !textarealink.match(/http:\/\/|https:\/\//) && $(".super_editor li.linkout").show().find("textarea").val('http://' + textarealink.replace(/^http:\/\//, ''));
                        // textarealink.indexof("https://")!=-1&&$(".super_editor li.linkout").show().find("textarea").val('https://' + textarealink.replace(/^https:\/\//, ''));
                    } else {
                        $(".super_editor li.linkout").show().find("textarea").val('http://');
                    };
                    $(".newWindow .desp ").css("display", "block");
                    //设置新窗口勾选状态
                    if ($linktype.attr("linktype") == "pageOuter" && $linktype.attr("newWindow") == "true") {
                        $(".newWindow .desp span").addClass("on");
                    } else {
                        $(".newWindow .desp span").removeClass("on");
                        if (!$(".img_item_box li.active").hasClass("add")) {
                            $linktype.attr("newWindow", "false");
                        }
                        $(".img_item_box li.active").attr("newWindow", "false");
                    };
                    break;
                default:
                    break;
            }
        });
        //下拉
        $(".super_editor").on("click", "a.links-text,a.links-btn", function(e) {
            if ($(this).hasClass("links-btn") && $(".link a.linka:eq(0)").hasClass("active")) {
                return;
            };
            e.stopPropagation();
            var $this = $(this);
            if ($this.attr("disabled") != "disabled") {
                $(".super_editor .nav_link").toggleClass("on");
                $(".nano").nanoScroller({
                    alwaysVisible: true
                });
            } else {
                return;
            }
            $(document).trigger('appSetCatch');
        });
        //站内、本页链接
        $(".super_editor .nav_link ul").on("click", "li", function() {
            var $this = $(this),
                $getPartid = $this.find("span").attr("partid");
            $(".super_editor a.links-text").empty().append($this.html());
            if ($pictureType == "img") {
                if ($this.attr("linktype") == "thisPage") {
                    $obj.attr("wqdlink", $getPartid).attr("linktype", "thisPage");
                } else {
                    $editBox.empty().append("<a href='" + $getPartid + "'></a>");
                    $editBox.find("a").append($getimg);
                    $obj.attr("wqdlink", $getPartid).attr("linktype", "innerPage");
                }
            } else if ($pictureType == "picture") {
                if ($this.attr("linktype") == "thisPage") {
                    //如果不是新加的
                    if (!$(".img_item_box li.active").hasClass("add")) {
                        $maskSet.$getObjPicLimask.attr({
                            "wqdlink": $getPartid,
                            "linktype": "thisPage"
                        });;
                    };
                    $(".img_item_box li.active").attr({
                        "wqdlink": $getPartid,
                        "linktype": "thisPage"
                    });
                } else {
                    //如果不是新加的
                    if (!$(".img_item_box li.active").hasClass("add")) {
                        $maskSet.$getObjPicLimask.attr({
                            "wqdlink": $getPartid,
                            "linktype": "innerPage"
                        });;
                    };
                    $(".img_item_box li.active").attr({
                        "wqdlink": $getPartid,
                        "linktype": "innerPage"
                    });
                };
                //站外链接清空
                $(".super_editor li.linkout textarea.link-url").val("");
            } else if ($obj.hasClass("bannerContainer")) {
                if ($this.attr("linktype") == "thisPage") {
                    $obj.attr("wqdlink", $getPartid).attr("linktype", "thisPage");
                } else {
                    $obj.attr("wqdlink", $getPartid).attr("linktype", "innerPage");
                }
            } else {
                return;
            }
            SetLinkFun(); //链接即时生效
            $(document).trigger('appSetCatch');
        });
        $("body").on("click", function(e) {
            //e.preventDefault();
            $(".super_editor .nav_link").removeClass("on");
        });
        //站外链接内容设置
        $(".super_editor .linkout").on("input", "textarea.link-url", function() {
            var $this = $(this); //linktype
            // $pictureType == "picture" ? $maskSet.$getObjPicLimask.attr("linktype", "pageOuter") : $obj.attr("linktype", "pageOuter");
            if ($pictureType == "img") {
                // $obj.attr("wqdlink", $this.val());
                $obj.attr({
                    "wqdlink": $this.val(),
                    "linktype": "pageOuter"
                });
            } else if ($pictureType == "picture") {
                if (!$(".img_item_box li.active").hasClass("add")) {
                    $maskSet.$getObjPicLimask.attr({
                        "wqdlink": $this.val(),
                        "linktype": "pageOuter"
                    });
                };
                $(".img_item_box li.active").attr({
                    "wqdlink": $this.val(),
                    "linktype": "pageOuter"
                });
            } else if ($obj.hasClass("bannerContainer")) {
                $obj.attr("wqdlink", $this.val());
            } else {
                return;
            }
            if ($this.val() == "") {
                $this.val("http://")
            };
            SetLinkFun(); //链接即时生效
            $(document).trigger('appSetCatch');
        });
        //栏目设置入口
        if (!$pictureType && $obj.hasClass('sectionV2') && $allAttr.picSectionBox.hasClass("yzmoveContentBor")) {
            var lanmuBacksrc = $obj.attr('wqdimgurlos');
            $allAttr.getPartBox.find("li.part4 .img_box img").attr("src", lanmuBacksrc);
            $allAttr.getPartBox.find("li.part5 .img_box img").attr("src", lanmuBacksrc);
            var image = new Image();    
            image.src = lanmuBacksrc;
            var realWidth = image.width;
            var realHeight = image.height;
            $allAttr.getPartBox.find("li.part4 .img_box img,li.part5 .img_box img").attr("realWidth", realWidth).attr("realHeight", realHeight);
        }
        //视频入口
        if ($obj.hasClass("bannerContainer")) {
            $picturePanelMain.showLinks();
            $(".part5_content").find("li.link").show().end().find("li.linkout>textarea").css("display", "block");
        }
        //这里也是初始化
        switch ($pictureType) {
            case "img": //单图
                $allAttr.getPartBox.find("li.part4 .img_box img").attr("src", $allAttr.getObjPic);
                $allAttr.getPartBox.find("li.part5 .img_box img").attr("src", $allAttr.getObjPic);
                $picturePanelMain.showLinks();
                $(".part5_content").find("li.link").show().end().find("li.linkout>textarea").css("display", "block");
                var image = new Image();    
                image.src = $allAttr.getObjPic;
                var realWidth = image.width;
                var realHeight = image.height;
                $allAttr.getPartBox.find("li.part4 .img_box img,li.part5 .img_box img").attr("realWidth", realWidth).attr("realHeight", realHeight);
                break;
            case "carouse":
                var carouseImgURl = $obj.css('background-image').replace(/\"|url|\(|\)|/g, "");
                $allAttr.getPartBox.find("li.part4 .img_box img").attr("src", carouseImgURl);
                $allAttr.getPartBox.find("li.part5 .img_box img").attr("src", carouseImgURl);
                var image = new Image();    
                image.src = carouseImgURl;
                var realWidth = image.width;
                var realHeight = image.height;
                $allAttr.getPartBox.find("li.part4 .img_box img,li.part5 .img_box img").attr("realWidth", realWidth).attr("realHeight", realHeight);
                break;
            case "picture": //图册
                $obj.find(".wqd-atlas li").each(function() {
                    var $picImg = $(this);
                    $picImg.attr("data_pic", $picImg.index() + 1).removeAttr("dele");
                });
                $(".wqdEditBox .edit_content_nav li").eq(3).addClass("on").siblings().removeClass("on");
                $(".wqdEditBox .edit_content li.part5 ").addClass("on").siblings().removeClass("on");
                $allAttr.getPicListBox.show();
                $(".partbox .img_box_panel a").show();
                $(".super_editor .editor_footer>a").attr("picBox", "true");
                //初始化选中链接
                $picturePanelMain.pictureBoxshow();
                $picturePanelMain.showLinks();
                $(".part5_content").find("li.link").show().end().find("li.linkout>textarea").css("display", "block");
                break;
            default:
                break;
        }
        //图片列表单张切换(点击图片列表图片)
        $(".img_item_box").on("mousedown", "li", function() {
            $('.super_editor .part4_content .img_box_panel>a').css("display", "none");
            var $this = $(this);
            $(".img_item_box li[data_pic='" + $this.attr("data_pic") + "']", $allAttr.getPartBox).addClass("active").siblings().removeClass("active");
            var $getPicTit = $obj.find("ul.wqd-atlas li[data_pic='" + $this.attr("data_pic") + "'] .txt_box>h5"),
                $getMaskPanel = $obj.find(".wqd-atlas li[data_pic=" + $this.attr("data_pic") + "]"),
                picTitle = $this.attr("txttitle");
            $maskSet.$getObjPicLimask = $getMaskPanel;
            $(".img_box img", $allAttr.getPartBox).attr("src", $this.find("img").attr("src"));
            //图片主题
            if (!edit.find(".atlasWrap3,.atlasWrap5").length) {
                $(".img_title input", $allAttr.picMenu).removeAttr("disabled").val(picTitle);
            } else if (edit.find(".atlasWrap3,.atlasWrap5").length) {
                $(".img_title input", $allAttr.picMenu).val("");
            };
            // if (picTitle.length) {

            // } else {
            //     $(".img_title input", $allAttr.picMenu).attr("disabled", "disabled");
            //     $(".part5_content .img_title input").attr("disabled", "disabled");
            // }

            $picturePanelMain.setMaskPanel($(".img_item_box li.active div.mask").css("background-color"));
            $picturePanelMain.showLinks();
            //图片链接显示
            if ($(".img_item_box li.active").attr("linktype") == "pageOuter") {
                $(".part5_content .link").children("a").eq(3).add("active");
                var wqdlink_out = $(".img_item_box li.active").attr("wqdlink");
                var textarealink = wqdlink_out ? wqdlink_out : "";
                $(".menu .linkout textarea.link-url").val(textarealink);
            };
            var image = new Image();    
            image.src = $this.find("img").attr("src");
            var realWidth = image.width;
            var realHeight = image.height;
            $('.img_box img', $parentBox.parConfore).each(function() {
                $(this).attr("realWidth", realWidth).attr("realHeight", realHeight);
            });
            //新窗口打开显示
            if ($(".img_item_box li.active").attr("linktype") == "innerPage" || $(".img_item_box li.active").attr("linktype") == "pageOuter") {
                if ($(".img_item_box li.active").attr("newWindow") == "true") {
                    $(".newWindow .desp ").css("display", "block");
                    $(".newWindow .desp span").addClass("on");
                } else {
                    $(".newWindow .desp ").css("display", "block");
                    $(".newWindow .desp span").removeClass("on");
                }
            } else {
                $(".newWindow .desp ").css("display", "none");
            }

        });
        //设置通条背景图
        //点击使用
        $('.super_editor .editor_footer a').on('click', function() {
            var $getPic = $(".nano-content li.active .imgwap"),
                $getMask = $(".super_editor .part4 .img_box"),
                $getMaskPanel = $getMask.find("span.maskPanel[style]"),
                $getImgsrc = $getMask.find("img").attr("src"),
                $getPicimgsrc = $getPic.find("img").attr("src");
            //轮播入口
            var $imgChangeEle;
            if ($obj.parents("section").hasClass("fullscreen")) {
                $imgChangeEle = $obj.find(".bannerContainer");
            } else {
                $imgChangeEle = $obj;
            }
            if ($imgChangeEle.hasClass("bannerContainer")) {
                var activeIndex = $imgChangeEle.parent().index();
                if ($(this).attr("picbox") == "true") {
                    var $setImg = $imgChangeEle.attr("url", $getImgsrc),
                        $getMaskpanel = $imgChangeEle.parent().find("span.maskPanel");
                    if ($getMaskPanel.length) {
                        $getMaskpanel.css("background-color", $imgChangeEle.attr("wqdbgcolor"));
                        // $obj.parents("section").hasClass("fullscreen") ? $imgChangeEle.parent().css("background-image", "url(" + $getImgsrc + ")") : $imgChangeEle.css("background-image", "url(" + $getImgsrc + ")");
                    } else {
                        $imgChangeEle.removeAttr("wqdbgcolor");
                        $imgChangeEle.parent().find("span.maskPanel[style]").remove();
                        // $obj.parents("section").hasClass("fullscreen") ? $imgChangeEle.parent().css("background-image", "url(" + $getPicimgsrc + ")") : $imgChangeEle.css("background-image", "url(" + $getPicimgsrc + ")");
                    }
                } else {
                    $imgChangeEle.removeAttr("wqdbgcolor");
                    $imgChangeEle.parent().find("span.maskPanel[style]").remove();
                    $imgChangeEle.attr("url", $getPicimgsrc);
                    // $obj.parents("section").hasClass("fullscreen") ? $imgChangeEle.parent().css("background-image", "url(" + $getPicimgsrc + ")") : $imgChangeEle.css("background-image", "url(" + $getPicimgsrc + ")");
                }
                $obj.parents("section").hasClass("fullscreen") ? $imgChangeEle.parent().css("background-image", "url(" + $getImgsrc + ")") : $imgChangeEle.css("background-image", "url(" + $getImgsrc + ")");
                $(".lunboImgBox .thumbnail li").eq(activeIndex).find("img").attr("src", $getImgsrc);
                $.fn.colorbox.close();
            }
            //栏目设置入口
            if (!$pictureType && $obj.hasClass('sectionV2') && $allAttr.picSectionBox.hasClass("yzmoveContentBor")) {
                var $bgEle = $obj.hasClass("wqdSideNavWrap") ? $obj: $obj.parent();
                if ($(this).attr("picbox") == "true") {
                    var realImgSrc=$getImgsrc=="/images/v2/design/popup/noImg.png"?"":$getImgsrc;
                    $obj.attr("wqdimgurlos", realImgSrc);
                    $bgEle.css({"background-image":"url(" + realImgSrc + ")","background-size":"cover"});
                } else if (!$imgChangeEle.hasClass("bannerContainer")) {
                    $obj.attr("wqdimgurlos", $getPicimgsrc);
                    $obj.find(".carousel-innerbg").length?$obj.find(".carousel-innerbg").css("background-image","url(" +$getPicimgsrc + ")"):$bgEle.css({"background-image":"url(" + $getPicimgsrc + ")","background-size":"cover"});
                }
                $.fn.colorbox.close();
            }
            //换图-------------start
            switch ($pictureType) {
                case "img": //单图
                    //判断在哪种情况下保存
                    if ($(this).attr("picbox") == "true") {
                        var $setImg = $obj.find("img").attr("src", $getImgsrc),
                            $findMaskpanel = $obj.find("span.maskPanel");
                        if ($getMaskPanel.length) {
                            var $mengbanInsertPar=$setImg.end().find(".wqdelementEditBox a").length?$setImg.end().find(".wqdelementEditBox a"):$setImg.end().find(".wqdelementEditBox");
                            $findMaskpanel.length ? $findMaskpanel.css("background-color", $obj.attr("wqdbgcolor")) : $mengbanInsertPar.append($getMaskPanel.clone());
                        } else {
                            $obj.removeAttr("wqdbgcolor");
                            $obj.find("span.maskPanel[style]").remove();
                            $setImg;
                        }
                        $getimg = $obj.find("img").clone().attr("src", $(".img_box").find("img").attr("src"));
                    } else {
                        $obj.removeAttr("wqdbgcolor");
                        $obj.find("span.maskPanel[style]").remove();
                        $obj.find("img").attr("src", $getPicimgsrc);
                        //换图后保存
                        $getimg = $obj.find("img").clone();
                    }

                    $.fn.colorbox.close();
                    break;
                case "picture": //图册
                    var $setdivMask = $maskSet.$getObjPicLimask.find("a"),
                        //根据图册类型添加类
                        setClass = function() {
                            return !$obj.attr("saveclass") ? "" : $obj.attr("saveclass");
                        }(),
                        setStyle = function() {
                            return !$obj.attr("savestyle") ? "" : $obj.attr("savestyle");
                        }(),
                        $setActive = function() {
                            if ($(".partbox>li:visible .album li").hasClass("move")) {
                                return "move active";
                            } else {
                                return "active";
                            }
                        }();

                    //不添加图片只是编辑的情况
                    if ($(this).attr("picbox") == "true") {
                        //图片编辑界面
                        if ($getMaskPanel.length) {
                            // $maskSet.$getObjPicLimask.find("img").attr("src", $getImgsrc);
                            $obj.find(".wqd-atlas>li").each(function() {
                                var $li = $(this);
                                // $maskSet.$getObjPicLimask.attr("wqdMaskPanel", "true");
                                !!$li.attr("clipimgurl") && $li.find("a img").attr("src", $li.attr("clipimgurl"));
                                !!$li.attr("clipimgurl") && $obj.find(".atlasWrap3,.atlasWrap4,.atlasWrap5") && $li.find("a").css("background-image", "url(" + $li.attr("clipimgurl") + ") ");
                                !!$li.attr("wqdbgcolor") && $li.find("a div.mask").css("background-color", $li.attr("wqdbgcolor"));
                            });

                        } else { //图片设置界面
                            $maskSet.$getObjPicLimask.removeAttr("wqdMaskPanel");
                            $setdivMask.find("div.mask").length ? $setdivMask.find("div.mask").remove() : false;
                        }
                    } else {
                        for(var x in popupImgEdit.pictureImgArr){
                            $(".img_item_box").each(function() {
                                var liLen = $(this).children().length;
                                $('<li class="add" data_pic="' + (liLen + 1) + '" txttitle="打造一流的响应式网站" style="cursor: pointer;"><img src="' + popupImgEdit.pictureImgArr[x] + '"> <div class="mask" style="cursor: move;"></div></li>').appendTo($(this));
                            });
                            $(this).removeClass("active");
                        };
                    }
                    $maskSet.$getObjPicLimask.removeAttr("wqdMaskPanel");
                    // $setdivMask.find("div.mask").length ? $setdivMask.find("div.mask").remove() : false;
                    //处理图库选中
                    var $getCheckImg = $(".partbox .album li[class='" + $setActive + "']"),
                        $getImgBox = $obj.find(".wqd-atlas");
                    //添加图册
                    // var $add = $(".part5_content .img_item_box li.add").length != 0 ? $(".part5_content .img_item_box li.add") : $(".album li.active"); //解决前两个界面直接点击使用
                    $(".part5_content .img_item_box li.add").each(function() { //只是为了要个循环
                        var $this = $(this),
                            linkAttr = $(this).attr("wqdlink") ? $(this).attr("wqdlink") : "javascript:void(0);",
                            targetAttr = $(this).attr("newwindow") == "true" ? "_blank" : "",
                            titleAttr = $(this).attr("txtTitle") ? $(this).attr("txtTitle") : "打造一流的响应式网站",
                            newwindowAttr = $(this).attr("newwindow") == "true" ? "true" : "",
                            linktypeAttr = $(this).attr("linktype") ? $(this).attr("linktype") : "",
                            maskBg = $(this).find(".mask").css("background-color"),
                            realImg, realBg;
                        ! function() {
                            if (edit.find(".atlasWrap3,.atlasWrap4,.atlasWrap5").length != 0) {
                                realImg = "";
                                realBg = "url(" + $this.find("img").attr("src") + ") no-repeat center center;background-size:cover";
                            } else {
                                realImg = "<img src=" + $this.find("img").attr("src") + "\>";
                                realBg = "";
                            }
                        }();
                        $("<li class='" + setClass + "' style='" + setStyle + "' data_pic='" + ($this.attr("data_pic")) + "' newwindow='" + newwindowAttr + "' linktype='" + linktypeAttr + "' wqdlink='" + linkAttr + "'><div class='wrap'><a href='" + linkAttr + "' target='" + targetAttr + "' ondragstart='return false;' style='background:" + realBg + "'>" + realImg + "<span></span><div class='mask' style='background-color:" + maskBg + "'></div></a><div class='txt_box'><h5>" + titleAttr + "</h5><p></p></div></div></li>").appendTo($getImgBox);
                    });
                    $obj.find(".wqd-atlas li").each(function(i) {
                        //设置文字
                        // var $imgListBox = $(".part5_content .img_item_box li");
                        // $(this).find(".txt_box h5").text($imgListBox.eq(i).attr("txttitle"));
                        //移除
                        $(this).attr("dele") == "true" && $(this).remove();
                        // //如果是第四个图册
                        // $obj.find(".atlasWrap4") && $(this).find("a").css({
                        //     "background": "url(" + $(this).find("img").attr("src") + ") no-repeat center center",
                        //     height: $(this).parents("[data-elementtype='picture']").height()
                        // });
                    });
                    //图册排序(确认排序)
                    var paixu = []; //图册排序变量
                    $(".part5_content .img_item_box li").each(function() {
                        paixu.push($(this).attr("data_pic"));
                    });
                    if (paixu.length != 0) {
                        for (var k = 0; k < paixu.length; k++) {
                            $obj.find(".wqd-atlas li[data_pic='" + paixu[k] + "']").appendTo($obj.find(".wqd-atlas"));
                            $obj.find(".wqd-atlas li").each(function(i) {
                                // 设置文字
                                var $imgListBox = $(".part5_content .img_item_box li");
                                $(this).find(".txt_box h5").text($imgListBox.eq(i).attr("txttitle"));
                            });
                        };
                    };
                    //第一个图册  编辑之后让编辑的图片高度100%  缩放的时候保持图片大小一样 然后按照最小的比例来缩放
                    var getWqdatlasLiHei=[];
                    if($obj.find(".wqdPictureUsual").length){
                        $obj.find(".wqdPictureUsual li img").each(function(){
                             getWqdatlasLiHei.push($(this).innerHeight())
                        });
                        var minHei=Math.min.apply(null, getWqdatlasLiHei),
                        parHei=$obj.width();

                        $obj.attr("heiRatio",minHei/parHei).find(".wqdPictureUsual li a").css({"height":minHei,"overflow":"hidden"}).find("img").each(function(){
                            var imgHei=$(this).height(),imgWid=$(this).width();
                           //$(".wqdPictureUsual img").css("height","100%");
                            $(".wqdPictureUsual img").css({
                                "width":"100%",
                                "position":"absolute",
                                "top":"0",
                                "left":"0",
                                "right":"0",
                                "bottom":"0",
                                "margin":"auto"
                            });



                            //$(this).css("marginTop","-"+(imgHei-minHei)/2+"px").parent().attr("marRatio",(imgHei-minHei)/(2*imgWid));
                        });
                    };
                    //瀑布流图册(第二个图册)
                    if ($getImgBox.hasClass("wqdPictureFalls") && $obj.find(".wqd-atlas li").length != 0) {
                        $($getImgBox).MM();
                    };
                    //第三个图册
                    $obj.find(".atlasWrap3 li").each(function(i) {
                        var $li = $(this);
                        var image = new Image();    
                        image.src = $li.find("a").css("background-image").replace(/\"|\(|\)|url/g, '');
                        var realWidth = image.width;
                        var realHeight = image.height;
                        $li.css({
                            "width": $(".atlasWrap3").height() * (realWidth / realHeight),
                            "margin-right": $obj.attr("colspace") ? $obj.attr("colspace") + "px" : 30 + "px"
                        }).find("a").css({
                            "background-repeat": "no-repeat",
                            "background-size": "cover"
                        });
                    });
                    //第四个图册
                    $obj.find(".atlasWrap4 li").each(function(i) {
                        var $li = $(this);
                        var liLen = $li.parent().children().length;
                        var liWidth = $li.parents("[data-elementtype='picture']").width() / liLen;
                        $li.css("width", $li.parents("[data-elementtype='picture']").width() / liLen);
                        $li.find("a").css({
                            height: $li.parents("[data-elementtype='picture']").height(),
                        }).end().css({
                            "width": liWidth,
                            "left": i * liWidth,
                            "top":0
                        }).find(".wrap,.wrap a").css("width", liWidth);
                    });
                    //第五个图册
                    if ($obj.find(".atlasWrap5").length) {
                        if (!$obj.find(".wqd-atlas li").length) {
                            $obj.find(".pohotoshow a").css({
                                "background-image": "url()"
                            });
                        };
                        $obj.find(".wqd-atlas li").each(function() {
                            $(this).css({
                                "padding-right": $obj.attr("colspace") ? $obj.attr("colspace") + "px" : 10 + "px"
                            });
                            if (!$(this).next().length) {
                                $(this).css("padding-right", 0);
                            };
                        });
                        !$obj.find(".wqd-atlas li").length && $obj.find('.pohotoshow a div.mask').css({
                            "background-color": "rgba(0,0,0,0)"
                        });
                        $obj.find(".pohotoindex .wqd-atlas  li:eq(0) a").trigger("click");
                    };
                    $.fn.colorbox.close();
                    break;
                default:
                    break;
            };
            $obj.find(".wqd-img-default").removeClass("wqd-img-default");
            var imgH = $obj.find(">.wqdelementEditBox img").height();
            if($obj.height() > imgH && $obj.attr("data-elementtype") == "img") {
                $obj.height(imgH);
            }
            //换图-------------end
            $(document).trigger('appSetCatch');
        });
        var $parentBox = {
            parConone: $(".super_editor .part1_content"),
            parContwo: $(".super_editor .part2_content"),
            parConfore: $(".super_editor .part4_content"),
            parConfive: $(".super_editor .part5_content")
        }
        getCategoryList(1, $('.category ul', $parentBox.parConone), URLPATH+'user/gallery/categories'); //用户图库分类
        getCategoryList(2, $('.category ul', $parentBox.parContwo), URLPATH+'system/material/categories'); //在线图库分类
        //用户图库分类浏览
        $('.category ul', $parentBox.parConone).on('click', 'li', function() {
            var url = URLPATH+'user/gallery/data/' + $(this).attr("category") + '/1?pageSize=10000';
            $('.category ul li', $parentBox.parConone).removeClass('active');
            $(this).addClass("active").find("i").css("display", "inline-block").end().siblings().find("i").css("display", "none");
            getImages(1, $('.super_editor .part1_content .album ul'), url);
            //上传图片
            $("#fileupload").fileupload({
                pasteZone: null,
                url: "/user/gallery/upload", //文件上传地址，可以直接写在input的data-url属性内
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                maxFileSize: 3145728, // 3 MB
                dataType: 'text',
                sequentialUploads: true,
                formData: {
                    typeId: $('.category ul li.active', $parentBox.parConone).attr("category")
                }, //参数
                done: function(e, result) {
                    if (result.result) {
                        var data = JSON.parse(result.result);
                        if (data && data.status == 500) {
                            alert(data.msg);
                            return;
                        }
                        var html = '<li class="move" img_id="' + data.id + '"><div class="imgwap"><p><a href="javascript:void(0);" class="delete" title="删除图片"><i class="fa fa-trash-o"></i></a></p><img src="' + data.path + '"></div></li>';
                        if ($(".album ul li", $parentBox.parConone).length == 0) $(".album ul", $parentBox.parConone).html("");
                        setTimeout(function() {
                            $(html).prependTo(".super_editor .part1_content .album ul");
                        }, 1000);
                        // $('.super_editor .part1 .mesg em').text($('.super_editor .part1 .mesg em').text() - 0 + 1);
                    } else {
                        //console.log(result.result);
                    }
                },
                messages: {
                    acceptFileTypes: '图片格式不正确',
                    maxFileSize: '图片大小不超过3M'
                },
                change:function(e,result){
                    var files = result.files;
                    if(files.length>15) {alert("一次上传文件最多不超过15个！");return false};
                }
            }).off("fileuploadprocessalways").on('fileuploadprocessalways', function(e, data) {
                var index = data.index,
                    file = data.files[index];
                if (file.error) {
                    alert(file.error);
                }
            });
        });

        //在线图库滚动加载
        $(".part2_content .content_right .album .nano-content").scroll(function(e){
             var t=$(this),nScrollHight = t[0].scrollHeight,nScrollTop = t[0].scrollTop,nDivHight=t.height(),
                 liNum=t.find("li").length,tHtml=t.html(),category=$(".part2_content .category li.active").attr("category");
             if(nScrollTop + nDivHight >= nScrollHight&&liNum%50==0)
             {
                var urlPath="/system/material/"+category+"/"+(liNum/50+1);
                getImages(2, $('.super_editor .part2_content .album ul'), urlPath,e.type);
             };
        });

        //在线图库分类浏览
        $('.category ul', $parentBox.parContwo).on('click', 'li', function() {
            var url = URLPATH+'system/material/?id=' + $(this).attr("category");
            $('.category ul li', $parentBox.parContwo).removeClass('active');
            $(this).addClass("active");
            getImages(2, $('.super_editor .part2_content .album ul'), url);
        });
        //用户图库分类设置
        $('.category ul', $parentBox.parConone).on('click', 'i', function(event) {
            event.stopPropagation();
            if ($(this).siblings(".set").length == 0) {
                var html = '<div class="set"><label></label><dd class="rename">重命名</dd><dd class="delete">删&nbsp;除</dd></div>';
                $(this).parents("li.active").append(html);
            } else {
                $(this).siblings(".set").show();
            }
            $(".nano").nanoScroller({
                alwaysVisible: true
            });
            $(this).parents("li").bind('mouseleave', function() {
                $(this).find(".set").hide();
            });
        });
        //添加分类
        if($('.add_category').prev().children(".nano-content").find("[category]").length>=7)$('.add_category').parents("#colorbox").attr("limit","true");
        $('.add_category').parents("#colorbox").attr("limit")?$('.add_category').hide():$('.add_category').show();
        $('.add_category', $parentBox.parConone).on('click', function() {
            $.ajax({
                url: '/user/gallery/type/add',
                type: "post",
                timeout: 30000,
                data: {
                    name: '未命名分类'
                },
                dataType: "json",
                success: function(json) {
                    if (json.status == 200) {
                        var html = '<li category="' + json.data.id + '"><div class="kind">' + json.data.name + '</div><i class="fa fa-cog"></i></li>';
                        $('.category ul', $parentBox.parConone).append(html);
                        $(".nano").nanoScroller({
                            alwaysVisible: true
                        });
                        if($('.add_category').prev().children(".nano-content").find("[category]").length>=7){
                            $('.add_category').hide().parents("#colorbox").attr("limit","true");
                            $(document).trigger('appSetCatch');
                        }
                    }
                }
            });
        });
        //重命名分类
        $('.category ul', $parentBox.parConone).on('click', '.rename', function(event) {
            event.stopPropagation();
            var self = $(this);
            self.parent().hide();
            self.parent().siblings("i").css("display", "none");
            self.parents("li.active").find("div.kind").html('<input type="text" value="' + self.parents("li.active").find("div.kind").html() + '" maxlength="8" onfocus="this.select()"/>');
            var $input = self.parents("li.active").find("input");
            $input.focus();
            $input.on('click', function(event) {
                event.stopPropagation();
            });
            $input.one('blur', function() {
                self.parent().siblings("i").css("display", "inline-block");
                var keyword = $(this).val();
                keyword = keyword ? keyword : '未命名分类';
                $.ajax({
                    url: '/user/gallery/type/rename/' + $(this).parents("li.active").attr("category"),
                    type: "post",
                    timeout: 30000,
                    data: {
                        name: keyword
                    },
                    dataType: "json",
                    success: function(json) {
                        if (json.status != 200) {
                            alert(json.msg);
                        }
                    }
                });
                $(this).parent().html(keyword);
            });
        });
        //删除分类
        $('.category ul', $parentBox.parConone).on('click', '.delete', function(event) {
            event.stopPropagation();
            var element = $(this).parents("li.active");
            $.ajax({
                url: '/user/gallery/type/delete/' + $(this).parents("li").attr("category"),
                type: "post",
                timeout: 30000,
                data: {},
                dataType: "json",
                success: function(json) {
                    if (json.status == 200) {
                        element.remove();
                        $(".nano").nanoScroller({
                            alwaysVisible: true
                        });
                        if( $('.add_category').is(':hidden'))$(".add_category").show().parents("#colorbox").removeAttr("limit");
                    } else {
                        alert(json.msg);
                    }
                }
            });
        });
        //图片拖拽分类
        $(".super_editor .part1_content .album ul").dragsort({
            dragSelector: "li",
            dragSelectorExclude: "input, textarea, a[href], span, i, dd",
            dragBetween: true,
            dragEnd: saveOrder,
            placeHolderTemplate: '<li style="border:1px dashed gray;"><div></div></li>',
            scrollSpeed: 5
        });
        //图册列表排序
        $(".part5_content .img_item_box,.part4_content ul.img_item_box").dragsort({
            dragSelector: "li",
            dragSelectorExclude: "input, textarea, a[href], span, i, dd",
            dragBetween: false,
            dragEnd: pictureSaveOrder,
            placeHolderTemplate: '<li></li>',
            scrollSpeed: 5
        }).on("mousedown", "li", function() {
            $(this).addClass("active").siblings().removeClass("active");
        });
        //图片列表排序(为了同步两个界面的顺序)
        function pictureSaveOrder() {
            //图册排序-----start
            var arrImgList = [];
            $(".partbox li.on .img_item_box li").each(function() {
                arrImgList.push($(this).attr("data_pic"));
            });
            // paixu = arrImgList;
            for (var k = 0; k < arrImgList.length; k++) {
                $(".img_item_box ").each(function() {
                    $(this).find("li[data_pic='" + arrImgList[k] + "']").appendTo($(this));
                });
                if ($obj.find(".wqd-atlas").hasClass("wqdPictureFalls")) {
                    $obj.find(".wqd-atlas").MM();
                };
            };
            //图册排序-----end
        }
        //图片拖拽回调函数
        function saveOrder() {
            var $getLiMove = $(".super_editor .part1_content .category ul li.move");
            if ($getLiMove.length > 0) { //拖拽图片分类
                var that = $getLiMove;
                if (that.prev().length == 0 || that.prev(".active").length != 0) {
                    $getLiMove.attr("data-itemidx", "-1");
                    $getLiMove.prependTo('.super_editor .part1_content .album ul');
                    $getLiMove.remove();
                } else {
                    //重新排序
                    var typeid = parseInt(that.prev().attr("category"));
                    $.ajax({
                        url: '/user/gallery/move/' + $getLiMove.attr("img_id"),
                        type: "post",
                        timeout: 30000,
                        data: {
                            typeId: typeid
                        },
                        dataType: "json",
                        success: function(json) {
                            if (json.status != 200) {
                                alert(json.msg);
                            }
                        }
                    });
                    $getLiMove.remove();
                }
            }
        };
        //用户图库选中效果
        var curImgboxImg = $('.img_box img').attr("src");
        popupImgEdit.pictureImgArr=[];//存储选择图片
        $('.part1_content .album ul,.part2_content .album ul').on('mousedown', 'li', function() {
            var exist=false,imgSrc=$(this).find("img").attr("src");
            if ($pictureType == "picture") {
                $(this).toggleClass("active");
                if($(this).hasClass("active")){
                   for(var x in popupImgEdit.pictureImgArr){
                      if(popupImgEdit.pictureImgArr[x]==imgSrc){exist=true;}
                   };
                   !exist&&popupImgEdit.pictureImgArr.push(imgSrc);
                }else{
                   for(var x in popupImgEdit.pictureImgArr){
                      if(popupImgEdit.pictureImgArr[x]==imgSrc){exist=true;}
                   };
                   exist&&popupImgEdit.pictureImgArr.pop(imgSrc);
                };
            } else {
                // $('.album ul li', $parentBox.parConone).removeClass("active");
                // $('.album ul li', $parentBox.parContwo).removeClass("active");
                $(this).toggleClass("active").siblings().removeClass("active");
                if ($(this).hasClass("active")) {
                    $('.img_box img', $parentBox.parConfore).attr("src", $(this).find("img").attr("src"));
                    $('.img_box img', $parentBox.parConfive).attr("src", $(this).find("img").attr("src"));
                    var image = new Image();    
                    image.src = $(this).find("img").attr("src");
                    var realWidth = image.width;
                    var realHeight = image.height;
                    $(".img_box img", $parentBox.parConfore).attr("realWidth", realWidth).attr("realHeight", realHeight);
                } else {
                    $('.img_box img', $parentBox.parConfore).attr("src", curImgboxImg);
                    $('.img_box img', $parentBox.parConfive).attr("src", curImgboxImg);
                }

            }
        });
        // //在线图库选中效果
        // $('.part2_content .album ul').on('click', 'li', function() {
        //     if ($pictureType == "picture") {
        //         // if ($(this).hasClass("active")) {
        //         //     $(this).removeClass("active");
        //         // } else {
        //         //     $(this).addClass("active");
        //         // }
        //         $(this).toggleClass("active")
        //     } else {
        //         $('.img_box img', $parentBox.parConfore).attr("src", $(this).find("img").attr("src"));
        //         $('.img_box img', $parentBox.parConfive).attr("src", $(this).find("img").attr("src"));
        //         // $('.album ul li', $parentBox.parContwo).removeClass("active");
        //         // $('.album ul li', $parentBox.parConone).removeClass("active");
        //         $(this).addClass("active").siblings().removeClass("active");
        //         var image = new Image();    
        //         image.src = $(this).find("img").attr("src");
        //         var realWidth = image.width;
        //         var realHeight = image.height;
        //         $('.img_box img', $parentBox.parConfore).attr("realWidth", realWidth).attr("realHeight", realHeight);
        //     }
        // });
        //我的图库删除图片
        $('.album ul', $parentBox.parConone).on('mousedown', '.delete', function() {
            deleteImg($(this).parents("li.move"));
        });
        //图片设置拖拽排序
        $(".pic_list ul", $parentBox.parConfive).dragsort({
            dragSelector: "li",
            dragBetween: true,
            placeHolderTemplate: '<li style="border:1px dashed gray;background:rgba(0,0,0,0.3);"><div></div></li>',
            scrollSpeed: 5
        });
        //图片设置添加图片
        $(".add-img", $parentBox.parConfive).on("click", function() {
            $('.super_editor .subnav ol.nav li').eq(0).trigger('click');
        });
        //图片标题设置
        $(".menu .img_title input").on("input", function() {
            var val = $(this).val();
            var $imgActive = $(".img_item_box li.active");
            $imgActive.attr("txttitle", val);
        });
        //图片设置删除图片
        $(".delete-img", $parentBox.parConfive).on("click", function() {
            var $this = $(this),
                $partItemBox = $(".img_item_box li", $parentBox.parConfive),
                $partItemBoxf = $(".img_item_box li", $parentBox.parConfore),
                $getImgBox = $obj.find(".wqd-atlas"),
                $liActive = $(".img_item_box li.active"),
                $liActiveIndex = $(".img_item_box li.active").index();
            $getImgBox.find("li[data_pic='" + $(".img_item_box li.active").attr("data_pic") + "']").attr("dele", "true");
            // $(".img_item_box li[class='active']", $parentBox.parConfive).remove();
            // $(".img_item_box li[class='active']", $parentBox.parConfore).remove();
            // $maskSet.$getObjPicLimask.remove(); //开始为第一项删除
            $liActive.remove();
            //自动定位到下一个
            $(".img_item_box").each(function() {
                var self = $(this);
                var sonLen = self.find("li").length;
                if ($liActiveIndex <= (sonLen - 1)) {
                    self.children().eq($liActiveIndex).addClass("active").trigger("mousedown");
                } else {
                    self.animate({
                        scrollTop: 0
                    }, 500).children().eq(0).addClass("active").trigger("mousedown");

                };
            });
            // $partItemBox.eq(1).addClass("active").trigger("mousedown");
            // $partItemBoxf.eq(1).addClass("active").trigger("mousedown");
            if ($partItemBox.length == 1) {
                $(".img_box img", $parentBox.parConfive).attr("src", " ");
                $(".img_title input", $parentBox.parConfive).attr("disabled", "disabled").val(" ");
            }
            if ($partItemBoxf.length == 1) {
                $(".img_box img", $parentBox.parConfore).attr("src", " ");
                $(".img_title input", $parentBox.parConfore).attr("disabled", "disabled").val(" ");
            }
            //删除到最后一张
            if ($(".img_item_box li").length == 0) {
                $("#img_clip,.img_box img").attr("src", "/images/v2/design/popup/noImg.png");
                $(".img_box .maskPanel").css({
                    "background-color": "rgba(0,0,0,0)"
                })
            };
            $(document).trigger('appSetCatch');
        });
        //裁剪
        var jcrop;
        $('.content_left .clip_list a', $parentBox.parConfore).on('click', function() {
            // $('.img_box_panel>a', $parentBox.parConfore).css("display", "block");
            var self = $(this);
            if ($("#img_clip").attr("src") == "/images/v2/design/popup/noImg.png") {
                return;
            };
            $(this).addClass("active").siblings("a").removeClass("active");
            if ($(this).parent().siblings(".clip_btn").attr('status') == 'true') jcrop.destroy();
            var category = $(this).attr("category"),
                cropRatio = function() { //推荐比例
                    if ($obj.find(".wqdPictureUsual").length && self.hasClass("clip_two")) {
                        var image = new Image();    
                        image.src = $obj.find(".wqdPictureUsual li img").attr("src");
                        var realWidth = image.width;
                        var realHeight = image.height;
                        return realWidth / realHeight;
                    } else {
                        return 0;
                    };
                }();
            if (category == "2") {
                var imgel = edit.is("img") ? edit : edit.find("img"),
                    wqdRatio = imgel.attr("wqdRatio") || "";
                if (wqdRatio) {
                    wqdRatio = wqdRatio.split(":");
                    cropRatio = wqdRatio[0] / wqdRatio[1];
                }
            }
            jcrop = $.Jcrop('#img_clip', {
                //bgOpacity: 0.2,
                bgColor: 'rgba(0,0,0,0.1)',
                onSelect: callback,
                aspectRatio: cropRatio
            });
            $(this).parent().siblings(".clip_btn").attr('status', 'true');
        });
        //取消裁剪
        $('.cancel', $parentBox.parConfore).on('click', function() {
            if ($('.content_left .clip_btn', $parentBox.parConfore).attr('status') != "true") return;
            jcrop.destroy();
            $('.content_left .clip_list a', $parentBox.parConfore).removeClass("active");
            $('.content_left .clip_btn', $parentBox.parConfore).attr('status', 'false');
            $('.confirm', $parentBox.parConfore).attr("status", 0);
            $(".cancel,.confirm").css("display", "none");
        });
        //裁剪回调
        var coord;

        function callback(c) {
            coord = {
                x: c.x,
                y: c.y,
                w: c.w,
                h: c.h
            };
            $('.confirm,.cancel', $parentBox.parConfore).attr("status", 1).css("display", "block");
        }
        //裁剪确认
        $('.confirm', $parentBox.parConfore).on('click', function() {
            if ($(this).attr("status") == 1) {
                jcrop.destroy();
                $('.content_left .clip_list a', $parentBox.parConfore).removeClass("active");
                $('.content_left .clip_btn', $parentBox.parConfore).attr('status', 'false');
                $(this).attr("status", 0);
                var imgwidth = parseInt($('.img_box img', $parentBox.parConfore).width()),
                    imgheight = parseInt($('.img_box img', $parentBox.parConfore).height());
                var rewidth = parseInt($('.img_box img', $parentBox.parConfore).attr("realwidth"));
                var reheight = parseInt($('.img_box img', $parentBox.parConfore).attr("realheight"));
                var url = $('.img_box img', $parentBox.parConfore).attr("src");
                var clipx = coord.x / imgwidth * rewidth;
                var clipy = coord.y / imgheight * reheight;
                var clipw = coord.w / imgwidth * rewidth;
                var cliph = coord.h / imgheight * reheight;
                $.ajax({
                    url: "/user/gallery/cut",
                    type: "post",
                    data: {
                        x: Math.round(clipx),
                        y: Math.round(clipy),
                        width: Math.round(clipw),
                        height: Math.round(cliph),
                        url: url
                    },
                    dataType: "json",
                    success: function(json) {
                        //获取裁剪后的图片路径
                        setTimeout(function() {
                            if (json.status == 200) {
                                $('.img_box img', $parentBox.parConfore).attr("src", json.data.path);
                                $('.img_box img', $parentBox.parConfive).attr("src", json.data.path);
                                $obj.find(".wqd-atlas>li[data_pic='" + $(".img_item_box li.active").attr("data_pic") + "']").attr("clipImgUrl", json.data.path);
                                $('.img_box img', $parentBox.parConfore).attr("realWidth", json.data.width).attr("realHeight", json.data.height);
                                $(".img_item_box li.active img").attr("src", json.data.path);
                                $(".confirm,.cancel").css("display", "none");

                            } else {
                                alert(json.msg);
                            }
                        }, 1000);
                    }
                });
            }
        });
        //图片设置多图选中
        $('.preview .pic_list ul', $parentBox.parConfive).on("mousedown", "li", function() {
            $('.pic_list ul li', $parentBox.parConfive).removeClass("active");
            $(this).addClass("active");
            $('.img_box img', $parentBox.parConfive).attr("src", $(this).find("img").attr("src"));
        });
        //图片编辑多图选中
        $('.preview .pic_list ul', $parentBox.parConfore).on("click", "li", function() {
            $('.pic_list ul li', $parentBox.parConfore).removeClass("active");
            $(this).addClass("active");
            if ($('.content_left .clip_btn', $parentBox.parConfore).attr("status") == "true") {
                jcrop.destroy();
                $('.content_left .clip_list a', $parentBox.parConfore).removeClass("active");
            }
            $('.img_box img', $parentBox.parConfore).attr("src", $(this).find("img").attr("src"));
            $('.content_left .clip_btn', $parentBox.parConfore).attr("status", "false");
        });
        //弹出裁剪选择
        $('.super_editor .part4_content .clip_btn,.super_editor .part4_content .mask_btn_head').on("click", function() {
            // $('.super_editor .part4_content .img_box_panel>a').css("display", "none");
            if ($(this).siblings().is(":visible")) {
                $(this).find(".icon_wap").html('<i class="fa fa-angle-down"></i>');
                $(this).siblings().hide();
                $(this).parent().siblings().find(".icon_wap").html('<i class="fa fa-angle-up"></i>')
                $(this).parent().siblings().find("div:eq(1)").show();
            } else {
                $(this).find(".icon_wap").html('<i class="fa fa-angle-up"></i>');
                $(this).siblings().show();
                $(this).parent().siblings().find(".icon_wap").html('<i class="fa fa-angle-down"></i>')
                $(this).parent().siblings().find("div:eq(1)").hide();
            }
        });

        var SetLinkFun = function() {
            var commonSetLink = function($curele) { //$curele为含有链接属性的元素
                if ($curele.attr("linktype") == "pageOuter" || $curele.attr("linktype") == "innerPage") {
                    if ($curele.attr("newWindow") == "true") {
                        $curele.find("a").attr("target", "_blank");
                    } else if ($curele.attr("newWindow") == "false" || !$curele.attr("newWindow")) {
                        $curele.find("a").removeAttr("target", "_blank");
                    }
                    if ($curele.attr("linktype") == "pageOuter") {
                        !$curele.attr("wqdlink").match(/http:\/\/|https:\/\//) && $curele.find("a").attr("href", "http://" + $curele.attr("wqdlink"));
                    };
                    if (!$(".newWindow span").hasClass("on") && ($curele.attr("newwindow") == "false") || !$curele.attr("newwindow")) {
                        $curele.attr({
                            "newwindow": "false"
                        }).find("a").removeAttr("target");
                    }
                } else if ($curele.attr("linktype") == "thisPage") {
                    $curele.attr({
                        "newWindow": "false"
                    }).find("a").attr("href", "#" + $curele.attr("wqdlink")).removeAttr("target", "_blank");
                } else if (!$curele.attr("linktype")) {
                    $curele.find("a").removeAttr("target", "_blank");
                }
            };
            switch ($pictureType) {
                case "img":
                    if (!$obj.attr("linktype")) {
                        return;
                    } else {
                        var $img = $editBox.find("img");
                        var mask = function() {
                            if ($(".editor_footer a").attr("picbox") == "true" && $obj.attr("wqdbgcolor")) {
                                return "<span class='maskPanel' style='background-color:" + $obj.attr("wqdbgcolor") + "'></span>"
                            }
                        }();
                        $editBox.empty().append("<a><\/a>").find("a").attr("href", $obj.attr("wqdlink") ? $obj.attr("wqdlink") : 'javascript:void(0);').append($img).append(mask);
                        // $("<a href='" + $obj.attr("wqdlink") + "'></a>").wrapInner($obj.find("img"));
                        // $obj.find("img").wrap("a");
                        commonSetLink($obj)
                    }
                    break;
                case "picture":
                    $maskSet.$getObjPicLimask.find("a").attr("href", $maskSet.$getObjPicLimask.attr("wqdlink"));
                    $obj.find(".wqd-atlas>li").each(function() {
                        $(this).find("a").attr("href", $(this).attr("wqdlink"));
                        commonSetLink($(this));
                    });
                    break;
                case "bannerContainer":
                    $obj.empty().append("<a href='" + $obj.attr("wqdlink") + "'></a>");
                    break;
                default:
                    break;
            };
        }

        this.commonInit();
    };
    return popupImgEdit;
});

