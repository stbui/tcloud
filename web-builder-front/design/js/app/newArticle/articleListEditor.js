define(['utility','elementInfo','app/newArticle/articleList','popupEdit','createColorStyle','popupBase','app/newArticle/articleListEditorStatic'],function(_util,_ei, _al,_pe,_css,PopupBase,_artlEditorStatic) {
    var editor = {
        init: function () {
            this.bindEdit(".wqdelementEdit");
        },
        // 绑定编辑
        bindEdit: function (elm) {
            var self = this;
            $(document).on("elmenentEdit", function (e, data) {
                var $node = data.element;
                if ($node.attr("data-elementtype") == "newArticleList") {
                    _al.$element = self.$element = $node;
                    setTimeout(function () {
                        _ei.removeElementEditBtn();
                        //获取编辑器内容并打开
                        $.getJSON('../js/app/JSON/component/designNewArticleListEditor.json', function (json, textStatus) {
                            var _popupBase = new PopupBase(self.$element, $.extend(json, {boxClass: "newArtListEditor articleSet"}));
                            self.$editor = _popupBase.$editor;
                            _popupBase.$element = self.$element;
                            self.tempModel = _al.tempModel = _popupBase.tempModel;
                            self.template = json.template;
							self._popupBase = _al._popupBase = _popupBase;
                            self._al = _al;
                            _pe.commonInit();
                            _popupBase.init();
                            self.artltype =  _al.artltype = $node.attr("data-artltype");
                            self.setUI();
                            self.bindEvent();
							_artlEditorStatic.init(self);
                            // self.tempModel = json.defaultStyle;
                            // self.setColorBox(self.getTempalte(json), $node);
                        });
                    }, 0);
                }
            });
        },
        setUI:function () {
            var $elem = this.$element,
                $editor = this.$editor;

            if(this.artltype == "dynamic") {
                $editor.find(".artleditor-static").hide();
            }else {
                $editor.find(".artleditor-dynamic").hide();
            }

            // // 样式页 checkbox的选中状态
            // $editor.find(".artl-editor-nodelist li").filter(function() {
            //     var type = $(this).attr("type"),
            //         $node = $elem.find("."+_al.mdList[type]).eq(0);
            //     return !$node.hasClass('artlHide');
            // }).children("span").addClass("on");

            //生成、回显文章详情样式
            var $artDetailsLi = $(".pagedeatllist>li[viewnews=true]"),
                $artDetailSelect = $editor.find(".artl-select-detail");
                detailTemp = "<li class='{{on}}' data-pageid='{{pageid}}'>{{text}}</li>",
                artdListModel = $artDetailsLi.map(function (i,_) {
                    var $this = $(_),
                        pageId = $this.attr("pageid"),
                        text = $this.find(".pageShow em").text() || "";
                    isOn = pageId == $elem.attr("data-pageid");
                    isOn && $artDetailSelect.find(" p span").text(text);
                    return {
                        on:isOn ? "on":"",
                        pageid:pageId,
                        text:text
                    };
                }).get();
            $artDetailSelect.find("ul").append(_util.format(detailTemp,artdListModel));

            //生成、回显时间样式
            var sIndex = $elem.attr("tp-type") || "0",
                textType = sIndex != 3 ? ["yyyy","MM","dd"].join(["-","/","."][sIndex]) : "yyyy年MM月dd日";
            $editor.find(".art-timeType ul li").eq(sIndex).addClass("on").siblings().removeClass("on")
                .parents(".edit_select").find("p span").text(textType);

            //生成、回显更多按钮
            var $borderSelect = $editor.find(".artEditorLinkbutton .borer-width-select");
            var borderWidth = parseInt($borderSelect.attr("tp-type"));
            var linkBorderTemp = borderWidth == 0 ? "无" : "<span class='border-width width" + borderWidth+"'></span>";
            $borderSelect.find("p span").html(linkBorderTemp).end()
                .find("ul li").each(function (i,_) {
                $(_).attr("data-type") == borderWidth && $(_).addClass("on").siblings().removeClass("on");
            });

            //设置tag列表
            this.setTagList();
        },
        bindEvent:function () {
            var self = this;
            this.$editor.off(".artList") 
                .on("click.artList", ".artl-editor-nodelist li:not(.title) span", function() {//复选按钮
                    var select = $(this).hasClass("on") ? "" : "true";
                    _al.showNode($(this),{
                        type:$(this).toggleClass("on").parent("li").attr("tp-value",select).attr("tp-type"),
                        value:select
                    });
                    $(document).trigger("appSetCatch");
                })
                .on("click.artList", ".edit_selectBox li", function() {//选择下拉项
                    self.setSelectValue($(this));
                })
                .on("click.artList", ".contTagList li .check-btn", function() {//标签列表  复选按钮
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
                        var tagArr = [];
                        isAllSelected = $tagLists.map(function (i,_) {
                                var isOn = $(_).find(".check-btn").hasClass("on");
                                isOn && tagArr.push($(_).attr("data-tagid"));
                                return isOn;
                            }).get().join("").indexOf("false") == -1;
                        tagids = tagArr.length ? tagArr.join(",") : "";
                    }

                    $this.parents(".contTagList").find(".tag-all").toggleClass("on",isAllSelected);//如果其他全部选中则设置全选按钮为选中状态
                    _al.setTags(tagids);
                    $(document).trigger("appSetCatch");
                })
                .on("changeColor.artList", ".wqdColorPicker",function(e) {//更改颜色
                    self.changeCss($(this));
                    $(document).trigger("appSetCatch");
                })
                .on("click.artList",".art-tag-list .selectview-bl",function (e) {//设置标签样式
                    _al.setTagStyle($(this),$(this).attr("data-type"));
                    $(document).trigger("appSetCatch");
                })
                .on("click.artList",".art-time-list .selectview-bl",function (e) {//设置时间样式
                    _al.setTimeType($(this).attr("data-type"),$(this));
                    $(document).trigger("appSetCatch");
                })
                .on("changeOnOff.artList",".on_off",function () {
                    var type = $(this).attr("tp-type"),
                        nodeType = $(this).closest("[tp-nodetype]").attr("tp-nodetype");
                    if(type == "border-style") {
                        self.changeCss($(this),$(this).hasClass("on") ? "solid" : "");
                        $(document).trigger("appSetCatch");
                    }
                })
                .on("click.artList",".art-paging-list .selectview-bl",function (e) {
                    var type = $(this).attr("data-type");
                    _al.setAttr($(this),type);
                    _al.loadNews(self.$element);
                    $(document).trigger("appSetCatch");
                })
                .on("click.artList",".geshi li",function () {//切换格式，基于张阳static提取过来
                    var model = {
                        "model1" : 156,
                        "model2" : 181,
                        "model3" : 205,
                        "model4" : 175,
                        "model5" : 205,
                        "model6" : 186
                    };
                    $(this).addClass('on').siblings().removeClass('on');
                    self.$element.find(".artlist").removeClass().addClass('artlist '+$(this).attr('class'));
                    self._popupBase.setAttr('model',$(this).attr('class'));
                    _css.styleInit(self.$element.attr('id') ,'.artlist .newArticleListDetail' ,{"height": (model[$(this).attr('class').match(/model\d/i)]||model.model1) +'px!important'});
                    $(document).trigger('appSetCatch');
                });

                // .on("blur.artList",".artl-text",function () {
                //     _al.setLinkbutton($(this),$(this).val());
                //     $(document).trigger("appSetCatch");
                // })
                // .on("blur.artList",".artl-pageSize-text",function () {
                //     _al.setPageSize($(this).val());
                //     $(document).trigger("appSetCatch");
                // });

            this.$element.on("changeFont.artList",function (e,data) {//字体加粗、倾斜
                var $node = data.node;
                self.changeCss($node,data.value);
                $(document).trigger("appSetCatch");
            });

            this.$editor.find(".slider").each(function (i,_) {
                var $this = $(_),
                    conf = {
                        slider : $(_),
                        maxval :50
                    },
                    type = $this.closest("[tp-type]").attr("tp-type");
                if(type == "margin-top") {
                    conf.maxval = 100;
                }
                if(type == "font-size" || type == "border-width" || type == "margin-top") {
                    conf.callback = function (val,type,maxval,rangeVal,$node) {
                        self.changeCss($node,rangeVal);
                        $(document).trigger("appSetCatch");
                    };
                } else if(type == "page-size") {
                    conf.callback = function (val,type,maxval,rangeVal,$node) {
                        _al.setPageSize($node,rangeVal);
                        $(document).trigger("appSetCatch");
                    };
                }
                _util.range(conf);

            });
        },
        /**
         * 加载文章标签列表
         */
        setTagList : function () {
            var self = this;
            $.get("/article/tags",function (data) {
                var $tagList = self.$editor.find(".contTagList"),
                    liString = $tagList.html(),
                    tagIds = _al.$element.attr("data-tagid"),
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
            });
        },
        /**
         * 设置选中项
         * @param $this 选中项jquery对象
         */
        setSelectValue : function ($this) {
            var $selectBox = $this.parents(".edit_selectBox");

            var type = $this.parents("[tp-type]").attr("tp-type") || "";
            if(/font/g.test(type)) {
                 this.changeCss($this,$.trim($this.text()));
            } else if(type=="orderby") {
                _al.setOrderby($this,$this.attr("data-type"));
            } else if(type=="detail") {//切换绑定的详情页
                _al.$element.attr("data-pageid",$this.attr("data-pageid"));
            } else if(type=="border") {
                this.changeCss($this,$this.attr("data-type"));
            }
            $this.parents("ul").eq(0).hide();
            $(document).trigger("appSetCatch");
        },
        changeCss:function ($node,value) {
            var nodetype = $node.parents("[tp-nodetype]").eq(0).attr("tp-nodetype"),
                type = $node.closest("[tp-type]").attr("tp-type") || "",
                state;
            //如果hover相关处理
            var reg = /\-hover|\-active|\-onselect/g;
            if(reg.test(nodetype)) {
                nodetype.replace(reg,function(m,n){
                    nodetype = nodetype.replace(reg,"");
                    state = m.replace(/\-/g,"");
                });
            }
            var css = {
                    elemClass:_al.mdList[nodetype]
                }; 
            value = value || $node.val();
            css[type] = value;
            _al.setCss(css,$node,state);
            /color/g.test(type) && $node.prev("span").find("i").css({"background":value});
        }
    };
    return editor;
});

