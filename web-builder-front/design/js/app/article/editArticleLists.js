/*
* @Author: liumingren
* @Date:   2016-03-17 13:42:08
* @Last Modified by:   liumingren
* @Last Modified time: 2016-06-06 10:59:49
*/
define(['utility','elementInfo','articleLists','popupEdit','createColorStyle'],function(_util,_ei, _al,_pe,_css) {
	var articleEditor = {
        init:function () {
            this.bindEdit(".wqdelementEdit");
        },
        // 绑定编辑
        bindEdit:function (elm) {
            var self = this;
            $(document).on("elmenentEdit",function (e,data) {
                var $node = data.element;
                if($node.attr("data-elementtype") == "articleLists") {
                    _al.element = self.element = $node;
                    setTimeout(function(){
                        _ei.removeElementEditBtn();
                        //获取编辑器内容并打开
                        $.getJSON('../js/app/JSON/component/designArticleListsEditor.json', function(json, textStatus) {
                            self.tempModel = json.defaultStyle;
                            self.setColorBox(self.getTempalte(json), $node);
                        });
                    },0);
                }
            });
        },
        setUI:function () {
            var $elem = this.element,
                $editor = $(".articleListsEditor"),
                $tabCont = $editor.find(".common_content");

            // 样式页 checkbox的选中状态
            $tabCont.eq(0).find(".edit_gcheckbox ul li").filter(function() {
                var type = $(this).attr("type"),
                    $node = /tag/ig.test(type) ? $(".articleListsTag[data-artllistid="+$elem.attr("data-artllistid")+"]") : $elem.find("."+_al.mdList[type]);
                return !$node.hasClass('artlHide');
            }).children("span").addClass("on");

            //回显样式
            var setBaseStyle = function (artlType,$boxNode) {
                if(/time/g.test(artlType)) {
                    var sIndex = $elem.attr("data-timetype") || "0",
                        textType = sIndex != 3 ? ["yyyy","MM","dd"].join(["-","/","."][sIndex]) : "yyyy年MM月dd日";
                    $boxNode.find(".art-timeType ul li").eq(sIndex).addClass("on").siblings().removeClass("on")
                        .parents(".edit_select").find("p span").text(textType);
                }else if(/detail/g.test(artlType)) {//关联详情页列表
                    var $artDetailsLi = $(".pagedeatllist>li[viewnews=true]"),
                        detailTemp = "<li class='{{on}}' data-pageid='{{pageid}}'>{{text}}</li>",
                        artdListModel = $artDetailsLi.map(function (i,_) {
                            var $this = $(_),
                                pageId = $this.attr("pageid"),
                                text = $this.find(".pageShow em").text() || "";
                                isOn = pageId == $elem.attr("data-pageid");
                            isOn && $boxNode.find(".edit_select p span").text(text);
                            return {
                                on:isOn ? "on":"",
                                pageid:pageId,
                                text:text
                            };
                        }).get();
                    $boxNode.find("ul").append(_util.format(detailTemp,artdListModel))
                } else if(/linkbutton/g.test(artlType)) {
                    var $borderSelect = $boxNode.find(".borer-width-select");
                    var borderWidth = parseInt($borderSelect.attr("data-bordertype"));
                    var linkBorderTemp = borderWidth == 0 ? "无" : "<span class='border-width width" + borderWidth+"'></span>";
                    $borderSelect.find("p span").html(linkBorderTemp).end()
                        .find("ul li").each(function (i,_) {
                            $(_).attr("data-type") == borderWidth && $(_).addClass("on").siblings().removeClass("on");
                    })
                }
            };

            //下拉框设置为选中
            $editor.find(".edit_selectBox").each(function (i,_) {
                var selecttext = $(_).find("p span").text();
                $(_).find("ul li").each(function (i,__) {
                    if($.trim($(__).text()) == $.trim(selecttext)) {
                        $(__).addClass("on").siblings("li").removeClass("on");
                        return false;
                    }
                })
            });
            $editor.find("[data-artltype]").each(function (i,_) {
                var $this = $(this);
                setBaseStyle($this.attr("data-artltype")||"",$this);
            });
            //设置tag列表
            var dfd = $.Deferred();
            this.setTagList(dfd);
            $.when(dfd).done(function () {
                $(".articleListsEditor .contTagList >li").eq(0).trigger("click");
            });
        },
        bindEvent:function () {
            var self = this;
            $(".articleListsEditor").off(".artList")
                .on("click.artList", ".edit_search ul li", function() {//tab列表切换
                    self.changeTab($(this));
                })
                .on("click.artList", ".edit_selectBox p", function() {//展开收起下拉
                    $(this).toggleClass("on").next("ul").toggle();
                })
                .on("click.artList", ".edit_selectBox li", function() {//选择下拉项
                    self.setSelectValue($(this));
                    $(this).parents(".edit_selectBox").find("p").removeClass("on");
                })
                .on("click.artList", ".artEditorStyle .group_checkBox li:not(.title,.content) span", function() {//复选按钮
                    _al.showNode({
                        type:[$(this).toggleClass("on").parent("li").attr("type"),true]
                    });
                    $(document).trigger("appSetCatch");
                })
                .on("click.artList", ".artEditorContent .group_checkBox li .check-btn", function() {//复选按钮
                    var $this = $(this),
                        tagids = $this.toggleClass("on").parent("li").attr("data-tagid"),
                        $tagLists = $this.parents(".contTagList").children("li:not(:first)"),
                        isAllSelected;//是否全选
                    if($this.hasClass("tag-all")) {//全选按钮为全部
                        isAllSelected = $this.hasClass("on");
                        tagids = isAllSelected ? $tagLists.map(function (i,_) {
                            return $(_).find(".check-btn").addClass("on").end().attr("data-tagid");
                        }).get().join(",") : "";
                        isAllSelected || $tagLists.find(".check-btn").removeClass("on");
                    } else {
                        isAllSelected = $tagLists.map(function (i,_) {
                            return $(_).find(".check-btn").hasClass("on");
                        }).get().join("").indexOf("false") == -1;
                    }

                    isAllSelected && $this.parents(".contTagList").find(".tag-all").addClass("on");//如果其他全部选中则设置全选按钮为选中状态
                    _al.setTags(tagids);
                    $(document).trigger("appSetCatch");
                })
                .on("click",".on_off",function () {//收起展开悬浮隐藏等
                    $(this).toggleClass("on").parents(".edit_unitbox").siblings(".hoverset").toggleClass("on");
                    _al.setAttr($(this),$(this).hasClass("on") ? "on":"");
                })
                .on("changeColor.artList", ".wqdColorPicker",function(e) {//更改颜色
                    changeColor($(this));
                    $(document).trigger("appSetCatch");
                })
                .on("keydown.artList",".edit_fontbox input,.edit_unitbox input",function(e){//修改字体大小
                    var value = $(this).val();
                    if(e.keyCode == 38){
                        $(this).val(++value);
                    }else if(e.keyCode == 40){
                        $(this).val(--value);
                    } else if(e.keyCode == 13) {
                        $(this).blur();
                    }
                })
                .find(".edit_fontbox input").on("blur.artList",function(){
                    var val = $(this).val().replace(/[^0-9]/g,"");
                    if(val < 12) val = 12;
                    $(this).val(val);
                    changeFont($(this),"font-size");
                    $(document).trigger("appSetCatch");
                }).end()
                .on("input.artList",".edit_fontbox input,.artl-pageSize-text",function(e){
                    var val = $(this).val().replace(/[^0-9]/g,"");
                    $(this).val(val);
                })
                .on("blur.artList",".artl-text",function () {
                    _al.setLinkbutton($(this),$(this).val());
                    $(document).trigger("appSetCatch");
                })
                .on("blur.artList",".artl-pageSize-text",function () {
                    _al.setPageSize($(this).val());
                    $(document).trigger("appSetCatch");
                })
                .on("click.artList", ".edit_fontbox em", function() {//字体加粗 倾斜
                    var self = $(this), value = "";
                    if(self.hasClass("on")) {
                        self.removeClass("on");
                        value = "normal";
                    } else {
                        self.addClass("on");
                        value = self.index() == 2 ? "700" : "italic";
                    }
                    changeFont($(this),self.index() == 2 ? "font-weight" : "font-style",value);
                    $(document).trigger("appSetCatch");
                });

            _util.range({
                slider : $(".articleListsEditor .artEditorLinkbutton .slider"),
                maxval : 50,
                callback : function(val,type,maxval,rangeVal,$node){
                    // self.changeMargin(val*50,$node);
                    self.setBorderRadius(val*50,$node);
                }
            });
        },
        /**
         * 加载文章标签列表
         */
        setTagList : function (dfd) {
            $.get("/article/tags",function (data) {
                var $tagList = $(".articleListsEditor .contTagList"),
                    liString = $tagList.html(),
                    tagIds = _al.element.attr("data-tagid"),
                    list = [],
                    isAllSelected = true,isSelected;
                _al.tagsData = data;
                //生成标签列表
                $.each(data.data,function (i,v) {
                    isSelected = new RegExp(v.id,"g").test(tagIds);
                    if(!isSelected && isAllSelected) {//是否全部选中
                        isAllSelected = false;
                    }
                    list[list.length] = _util.format(liString,{
                        "tagid":v.id,
                        "checkbtn":isSelected ? "on":"",
                        "checktext":(v.name||"").slice(0,5),
                        "title":v.name
                    });
                });
                list.unshift(_util.format(liString,{
                    "tagid":"",
                    "checkbtn":isAllSelected || /all/g.test(tagIds) ? "tag-all on":"tag-all",
                    "checktext":"全选",
                    "title":""
                }));
                $tagList.removeClass("hidden").html("").append(list.join(""));
                dfd.resolve();
            });
        },
        /**
         * 设置选中项
         * @param $this 选中项jquery对象
         */
        setSelectValue : function ($this) {
            $this.addClass("on").siblings().removeClass("on").end()
                .parents(".edit_select").find(">p span").html($this.html()); //赋值给下拉显示
            var $selectBox = $this.parents(".edit_selectBox"),
                fontType = $selectBox.attr("data-fonttype"),
                timeType = $selectBox.attr("data-timetype"),
                orderType = $selectBox.attr("data-orderbytype"),
                isborder = $selectBox.attr("data-styletype") == "borderWidth";
            if(fontType) {
                changeFont($this,fontType);
            } else if(timeType) {
                changeTimeType($this,+$this.index());
            } else if(orderType) {
                _al.setOrderby($this.attr("data-type"));
            } else if($selectBox.attr("data-detailtype")) {
                this.changeDetail($this,$selectBox.attr("data-detailtype"));
            } else if(isborder) {
                this.setBorder($this,$this.attr("data-type"));
            }
            $this.parents("ul").eq(0).hide();
            $(document).trigger("appSetCatch");
        },
        changeTab : function ($node) {
            $node.addClass("on").siblings().removeClass("on").end()
                .parents(".edit_search").next(".edit_content").children(".common_content").eq($node.index()).removeClass("hidden").siblings().addClass("hidden");
            $(".articleListsEditor .nano").nanoScroller({alwaysVisible: false});
        },
        setBorder : function ($node,value) {
            var $par = $node.parents("[data-artltype]").eq(0);
            var css = {
                elemClass:_al.mdList[$par.attr('data-artltype')],
                "borderWidth":value + "px"
            };
            _al.setCss(css,$node);
        },
        setBorderRadius : function (value,$node) {
            var $par = $node.parents("[data-artltype]").eq(0);
            var css = {
                elemClass:_al.mdList[$par.attr('data-artltype')],
                "border-radius":value+"px"
            };
            _al.setCss(css,$node);
        },
        /**
         * 切换绑定的详情页
         * @param $node
         */
        changeDetail : function ($node) {
            _al.element.attr("data-pageid",$node.attr("data-pageid"));
        },
        //根据模版生成设置菜单
        getTempalte : function (json) {
            var html = '<div class="wqdEditBox articleListsEditor articleSet">' +
                json.header +
                json.search +
                "<div class='edit_content edit_contentbox'>";
            for (var i in json.content) {
                html += json.content[i];
            }
            html += "</div></div>";
            //替换变量
            html = this.setTemp(html);
            return html;
        },
        //根据模版替换变量
        setTemp : function (temp) {
            var self  = this,
                style = this.element.attr("data-style") || "";
            $.each(style.split(";"),function (i,_) {
                if(!_) return true;
                var key = _.split(":");
                self.tempModel[key[0]] = /\.fontSize|borderRadius/g.test(key[0]) ? parseInt(key[1]) : key[1];
            });

            self.tempModel["linkbutton.borderRadiusSlider"] = self.tempModel["linkbutton.borderRadius"] * 2 + "px";
            self.tempModel["pageSize.text"] = this.element.attr("data-pagesize")||self.tempModel["pageSize.text"];
            self.tempModel["orderby.text"] = {"PUBLISH_TIME":"按时间","PV":"按查看量","FAVOURABLE":"按点赞量"}[this.element.attr("data-orderby")] || self.tempModel["orderby.text"];
            return _util.format(temp,this.tempModel);
        },
        setColorBox : function(html, $node) {
            var self = this;
            $.colorbox({
                transition:"none",
                opacity:0.5,
                html:html,
                fixed:true,
                closeButton:false,
                onOpen:function(){
                    window.scroll_top = $(document).scrollTop();
                },
                onComplete:function(){
                    self.setUI();
                    self.bindEvent();
                    _pe.commonInit();
                },
                onClosed:function(){
                }
            });
        }
    };

    // articleEditor.changeMargin = function (value,$node) {
    //     var css = {
    //         elemClass:"artListContainer",
    //         "margin-bottom":value+"px"
    //     };
    //     _al.setCss(css,$node);
    // };

	function changeColor ($colorInput) {
		var $cont = $colorInput.parents("[data-artltype]").eq(0),
			color = $colorInput.val(),
			css   = {
				elemClass:_al.mdList[$cont.attr('data-artltype')]
			};
		$colorInput.parents(".art-hover-color").length ? css.hoverColor = color :
		$colorInput.parents(".art-share-color").length ? css.shareColor = color :
		$colorInput.parents(".art-background").length ? css["background-color"] = color :
		$colorInput.parents(".art-bordercolor,.art-border-color").length ? css["border-color"] = color :
        $colorInput.parents(".art-background-hover-color").length ? css.backgroundHoverColor = color :
        $colorInput.parents(".art-border-hover-color").length ? css.borderHoverColor = color :
		$colorInput.parents(".art-share-hovercolor").length	? css.shareHoverColor = color : css.color = color;
		_al.setCss(css,$colorInput);
		$colorInput.prev("span").find("i").css({"background":color});
	}

	function changeFont ($node,type,value) {
		var $cont = $node.parents("[data-artltype]").eq(0),
			data = {
				elemClass:_al.mdList[$cont.attr('data-artltype')]
			};
		switch(type) {
			case "font-family" :
				data[type] = $node.text();break;
			case "font-size" :
				data[type] = $node.val()+"px";break;
			default :
				data[type] = value;break;
 		}
		_al.setCss(data,$node);
	}

	function changeTimeType ($node,num) {
		var data = {
				elemClass:_al.mdList["time"],
				type:+num
			};
		return _al.setTimeType(data);
	}

	return articleEditor;
});

