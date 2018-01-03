/*
* @Author: liumingren
* @Date:   2016-03-15 19:24:51
* @Last Modified by:   liumingren
* @Last Modified time: 2016-06-12 16:39:29
*/
define(['utility','createColorStyle','popupEdit','elementInfo'], function(_util,_ccs,_popupEdit,_elementInfo) {
	var articleLists = {
        mdList:{
            "title":"artListTitle",
            "time":"artListTime",
            "hr":"artListHr",
            "source":"artListSource",
            "author":"artListAuthor",
            "viewcount":"artListViewcount",
            "follow":"artListFollow",
            "summary":"artListSummary",
            "image":"artListImage",
            "content":"artListContent",
            "share":"artListShare",
            "container":"artListContainer",
            "paging":"artListPaging",
            "linkbutton":"artListLinkButton",
            "tag":"artlTagButton"
        },
        init:function () {
            // this.showList();
            this.bindEvent();
            this.allLoadNews(true);
        },
        bindEvent:function () {
            var self = this;
            $(document)
                .on("click",".artlTagUl > .artlTagButton",function (e) {
                    var tagId = $(this).addClass("on").siblings(".artlTagButton").removeClass("on").end().attr("data-tagid") || "",
                        artlListId = $(this).parents(".wqdelementEdit.articleListsTag").attr("data-artllistid")||"",
                        $elem      = $(".wqdelementEdit.articleLists").filter("[data-artllistid="+artlListId+"]").attr("data-ontagid",tagId);
                    $(document).trigger("appSetCatch");
                    self.loadCurrentNews($elem,{
                        tagIds:tagId
                    });
                })
                .on("click",".articleLists .artListPaging li",function (e) {
                    var $elem = $(this).parents(".articleLists");
                    self.loadCurrentNews($elem,{
                        pageNo:$(this).attr("data-index")
                    });
                })
                .on("element.remove",".articleLists",function (e) {
                    var artllistId = $(this).attr("data-artllistid");
                    artllistId && $("[data-artllistid="+artllistId+"]").remove();
                })
                .on("element.changed",".articleLists .artlelement",function (e) {
                    self.updateLiTemp($(this).parents(".articleLists").eq(0));
                })
                .on("artlLists:load",".articleLists",function (e) {
                    var dfd = $.Deferred();
                    self.bindDefaultDetail($(this),dfd);
                    self.loadNews($(this),true);
                })
                .on("arlLists:reload",function () {
                    self.allLoadNews(true);
                })
                .on("artLists:pushTemplate",function () {
                    self.updateLiTemp($(this));
                    $(document).trigger("appSetCatch");
                })
        },
        /**
         * 页面中的列表载入数据
         */
        allLoadNews:function (isPageLoad) {
            var self = this;
            $(".wqdelementEdit.articleLists").each(function (i,_) {
                self.loadNews($(_),void 0,isPageLoad);
            });
            // isPageLoad && $(document).trigger("appSetCatch");//刷新页面刚进入时保存
        },
        /**
         * 某列表控件载入数据
         * @param $this
         * @param isFirstLoad
         * @param isPageLoad
         */
        loadNews:function ($this,isFirstLoad,isPageLoad) {
            var self = this,
                data = {};
            var dfd = this.showTagList($this,"",isFirstLoad);
            $.when(dfd).done(function () {
                data.tagIds = $this.attr("data-ontagid");
                self.loadCurrentNews($this,data);
                !isPageLoad && $(document).trigger("appSetCatch");
            });
        },
        /**
         * 载入文章列表数据
         * @param  {[type]} $elem [description]
         * @param data
         * @return {[type]}       [description]
         */
        loadCurrentNews:function ($elem,data) {
            var self = this,
                temp = $elem.find(".artlitemp").text() || this.updateLiTemp($elem),
                pageId = $elem.attr("data-pageid"),
                lis = [],listModel,html;
            data.tagIds = data.tagIds || $elem.attr("data-ontagid") || ($elem.attr("data-tagid")||"").split(",")[0] || "";
            data.pageNo = data.pageNo || 0;
            data.pageSize = data.pageSize || $elem.attr("data-pagesize") || 3;
            data.orderBy = data.orderBy || $elem.attr("data-orderby") || "PUBLISH_TIME";
            data.isPublish = true;

            $.get("/article/page",data,function (data) {
                if(!$.isArray(data.data.data) || data.endRows == 0) {
                    html = "";
                } else {
                    $.each(data.data.data,function(index, value) {
                        listModel = {
                            title:value.title,
                            time:self.formatTime($elem,value.publishTime || ""),
                            viewCount:value.pv || 0,
                            follow:value.favourable||0,
                            summary:value.summary || value.descn,
                            image:value.icon ? CSSURLPATH + value.icon : value.otherIcons ? value.otherIcons.split(",")[0] : "http://img.wqdian.com/group2/M00/01/95/yq0KXlad6FmASHPDAAALAiR3NvE906.jpg",
                            url:pageId ? "page_" + pageId + "_" + value.id + ".html" : ""
                        };
                        lis.push(_util.format(temp,listModel));
                    });
                    html = lis.join("").replace(/data-src/g,"src");
                }
                $elem.removeClass("artlHide").find(".artlUl").html(html);
                self.showPaging($elem,data.data);
            });
        },
        /**
         * 绑定默认文章详情页
         * @param $elem
         * @param dfd
         */
        bindDefaultDetail:function ($elem,dfd) {
            var hasDetailPage = !!$(".pagedeatllist>li[viewnews=true]").length,
                addPageDfd = $.Deferred(),pageId,needCatch;
            if(hasDetailPage) {
                addPageDfd.resolve();
            } else {
                needCatch = true;
                $(document).trigger("addArticleDetailPage",{dfd:addPageDfd});
            }
            //添加详情页成功后再取值
            $.when(addPageDfd).done(function () {
                pageId = $(".pagedeatllist>li[viewnews=true]").eq(0).attr("pageid")||"";
                $elem.attr("data-pageid",pageId);
                needCatch && $(document).trigger("appSetCatch");
                dfd.resolve();
            });
            // $.when(dfd).done(function () {
            //     $elem.attr("data-pageid",pageId);
            // });
        },
        /**
         * 生成li的模版
         * @param  {[type]} $elem [description]
         * @return {[type]}       [description]
         */
        updateLiTemp:function ($elem) {
            var $li        = $elem.find(".artlUl li").eq(0).clone(),
                $artlitemp = $elem.find("script.artlitemp"),temp;

            // 替换内容为模版
            var formatTemp = function ($li) {
                $li.find("[data-artltemp]").each(function (i,_) {
                    $(_).html("{{"+$(_).attr("data-artltemp")+"}}");
                }).end()
                .find("[data-artlAttrTemp]").each(function(i, _) {
                    var $this = $(_),
                        artTemp = $this.attr("data-artlAttrTemp");
                    var artTempArr = artTemp.split(".");
                    if(artTempArr[0] == "src") {
                        $this.attr("data-"+artTempArr[0],"{{"+artTempArr[1]+"}}").removeAttr(artTempArr[0]);
                    }else {
                        $this.attr(artTempArr[0],"{{"+artTempArr[1]+"}}");
                    }
                });
                return $li[0].outerHTML.replace(/wqdselected/g,"");
            };
            if($li.length) {
                temp = formatTemp($li);
                $artlitemp.length ? $artlitemp.html(temp) : $elem.prepend("<script type='text/template' class='artlitemp'>"+temp+"</script>");
            }
            return temp;
        },
        /**
         * 加载标签列表
         * @return {[type]} [description]
         */
        showTagList:function ($elem, tagIds,isFirstLoad) {
            var self = this,
                tagDfd = $.Deferred();
            tagIds = tagIds || $elem.attr("data-tagid")||"";
            if(self.tagsData) {
                tagDfd.resolve();
            }else {
                $.get("/article/tags",function (data) {
                    self.tagsData = data;
                    tagDfd.resolve();
                });
            }
            $.when(tagDfd).done(function () {
                var artllistId = $elem.attr("data-artllistid");
                if(artllistId) {
                    var temp = "<div class='wqdelementEdit artlTagButton {{on}}' style='width: {{width}}; height: {{height}};left:{{left}};top:{{top}};' data-tagid='{{tagId}}' data-elemandgroup='true' data-elementtype='artlTagButton' data-unused='bubble,set,del,copy,animate,help,rotate'>\
                                    <div class='wqdelementEditBox'><p>{{text}}</p></div>\
                               </div>", //标签列表html模版
                        $tagUl = $(".articleListsTag[data-artllistid="+artllistId+"] .artlTagUl"),//根据新闻列表找到对应的标签列表
                        top = -40,tags = [],
                        onTagId = $elem.attr("data-ontagid") || "",
                        tagModel = $.map(self.tagsData.data,function (v,i) {
                            var $theLi = v.id ? $tagUl.find("[data-tagid="+v.id+"]") : $("");
                            if(isFirstLoad || tagIds.indexOf(v.id) != -1) {
                                if(i == 0 && !$elem.attr("data-ontagid")){//如果没有选中id设置当前选中id
                                    $elem.attr("data-ontagid",v.id);
                                    onTagId = v.id;
                                }
                                tags.push(v.id);
                                return top+=40,{
                                    on:onTagId == v.id ? "on" : "",
                                    tagId:v.id||"",
                                    text:v.name||"",
                                    left:!isFirstLoad && $theLi.length ? $theLi.css("left") : 0,
                                    top:isFirstLoad ? top + "px" : $theLi.length ? $theLi.css("top") : 0,
                                    width:!isFirstLoad && $theLi.length ? $theLi.css("width") : "180px",
                                    height:!isFirstLoad && $theLi.length ? $theLi.css("height") : "40px"
                                };
                            }
                        });

                    onTagId || $elem.attr("data-ontagid","");//没有选中项则置空
                    isFirstLoad && $elem.attr("data-tagid",tags.join(","));
                    $tagUl.html(_util.format(temp,tagModel));
                }
            });
            return tagDfd.promise();
        },
        /**
         * 选择列表可见的标签
         * @param value
         */
        setTags:function (value) {
            var tagIds = !value ? "" : this.element.attr("data-tagid")||"",
                reg = new RegExp(value+"\,?","g");
            if(reg.test(tagIds)){
                tagIds = tagIds.replace(reg,"");
            }else {
                tagIds += tagIds ? "," + value :value;
            }
            this.element.attr("data-tagid",tagIds);
            //加载标签列表
            this.showTagList(this.element,tagIds);
        },
        /**
         * 设置排序方式
         */
        setOrderby:function (value) {
            var $elem = this.element.attr("data-orderby",value);
            this.loadCurrentNews($elem,{
                orderby:value
            });
        },
        /**
         *  设置分页
         * @param $elem
         * @param data [{object}]
         */
        showPaging:function ($elem,data) {
            var start    = data.pageNo / 5 < 0.75 ? 1 : data.totalPages - data.pageNo > 2 ? data.pageNo - 2 : data.totalPages > 4 ? data.totalPages - 4 : 1,
                end = start > data.totalPages - 4 ? data.totalPages : start + 4,
                temp = '<li data-index="{{index}}" class="{{class}}">{{text}}</li>',
                $artlPaging = $elem.find('.artListPaging'),
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
        },
        showNode : function(data){
            var $elem;
            if(/tag/ig.test(data.type[0])) {
                $elem = $(".articleListsTag[data-artllistid="+this.element.attr("data-artllistid")+"]");
            } else {
                $elem = this.element.find("."+articleLists.mdList[data.type[0]]);
            }
            $elem.toggleClass("artlHide");
            this.updateLiTemp(this.element);
        },
        /**
         * 设置文章控件样式
         * @param data
         * @param $node
         */
        setCss : function (data,$node) {

            data.elemClass = /Title|linkButton/ig.test(data.elemClass) ? data.elemClass+" a" :
                                /paging/ig.test(data.elemClass) ? data.elemClass+" li" : data.elemClass;
            var $elem    = this.element.find("."+data.elemClass),
                parentId = this.element.attr("id"),
                selector = "." + data.elemClass,
                css = {},selector2;
            if(/tag/ig.test(data.elemClass)) {
                $elem    = $(".articleListsTag[data-artllistid="+this.element.attr("data-artllistid")+"]");
                parentId = $elem.attr("id");
            }
            for (var i in data) {
                if(i == "elemClass") continue;
                if(/artListHr/g.test(data.elemClass)) {//文章列表分割线
                    $elem = $elem.find(".wqdelementEditBox").children();
                    selector += " .hr-line";
                    css[i] = data[i];
                } else if(/hoverColor/ig.test(i)) {
                    css[{"hoverColor":"color","backgroundHoverColor":"background-color","borderHoverColor":"border-color"}[i]] = data[i];
                    if(/paging|tag/ig.test(data.elemClass)) {//分页和标签选中和悬浮是同一个样式
                        selector2 = selector + ".on";
                    }

                    selector += ":hover";
                } else if(i=="borderColor") {
                    css["border-color"] = data[i];
                }else if(/marginBottom/g.test(i)) {
                    css["margin-bottom"] = data[i];
                } else if(/borderRadius/g.test(i)) {
                    css["border-radius"] = data[i];
                } else if(/borderWidth/g.test(i)) {
                    css["border-width"] = data[i];
                }else {
                    css[i] = data[i];
                    if(i == "color" && ($elem.hasClass("artListFollow") || $elem.hasClass("artListViewcount"))) {
                        $elem.find("svg path").attr("fill",data[i]);
                    }
                }
                _ccs.styleInit(parentId,selector,css);
                selector2 && _ccs.styleInit(parentId,selector2,css);
                this.setAttr($node,data[i]);
            }
            this.updateLiTemp(this.element);
        },
        /**
         * 设置data-style属性用于回显
         */
        setAttr:function ($node,value) {
            var styClass = $node.parents("[data-artltype]").attr("data-artltype") || "",
                type     = $node.closest("[data-styletype]").attr("data-styletype") || "",
                key      = styClass + "." + type,
                style    = this.element.attr("data-style")||"",
                reg      = new RegExp(key+":[^;]+;","g"),
                stylrStr;
            if(/fontWeight|fontStyle/g.test(type)) {
                value = value == "normal" ? "":"on";
            }
            stylrStr= key + ":" + value + ";";
            style = reg.test(style) ? style.replace(reg,stylrStr) : style + stylrStr;
            this.element.attr("data-style",style);
        },
        /**
         * 设置一页显示几条数据
         */
        setPageSize:function (value) {
            this.element.attr("data-pagesize",value);
            this.loadCurrentNews(this.element,{
                pageSize:value
            });
            this.updateLiTemp(this.element);
        },
        /**
         * 格式化时间
         * @param $elem
         * @param timeText
         * @param timetype
         * @returns {*}
         */
        formatTime:function ($elem,timeText,timetype) {
            timeText = timeText.replace(/\s+(.+)+/g,"");
            var rxp     = /([0-9]+).([0-9]+).([0-9]+)(?:.)?/g,val;
            timetype = timetype || $elem.attr("data-timetype") || 0;
            if(timetype != 3){
                var sep = ["-","/","."][timetype];
                val = timeText.replace(rxp,'$1'+sep+'$2'+sep+'$3');
            } else {
                val = timeText.replace(rxp,'$1年$2月$3日');
            }
            return val;
        },
        setTimeType : function (data) {
            var self = this;
            this.element.attr("data-timetype",+data.type).find("[data-artltemp='time']").each(function (i,_) {
                $(_).text(self.formatTime(self.element,$(_).text(),data.type));
            });
            this.updateLiTemp(this.element);
        },
        setLinkbutton:function ($node,value) {
            this.element.find(".artListLinkButton .wqd-button > em").text(value);
            this.setAttr($node,value);
            this.updateLiTemp(this.element);
        }
    };

	return articleLists;

});

