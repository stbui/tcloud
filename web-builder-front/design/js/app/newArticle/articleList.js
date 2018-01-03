define(['utility','createColorStyle','popupEdit','elementInfo'], function(_util,_ccs,_popupEdit,_elementInfo,_artlStatic,_artlDynamic) {

	var newArticleList = {
        mdList:{
            "title":"artListTitle",
            "time":"artListTime",
            "hr":"artListHr",
            "source":"artListSource",
            "author":"artListAuthor",
            "pv":"artListPV",
            "favourable":"artListFavourable",
            "summary":"artListSummary",
            "negative":"artListNegative",
            "top":"artListTop",
            "image":"artListImage",
            "content":"artListContent",
            "share":"artListShare",
            "container":"artListContainer",
            "paging":"artListPaging",
            "tag":"artListTag",
            "detail":"newArticleListDetail"
        },
        init:function ($elm,$editor) {
            this.$element = $elm;
            this.$editor = $editor;
            this.bindEvent();
            this.allLoadNews(true);
        },
        bindEvent:function () {
            var self = this;
            $(document)
                .on("artlLists:load",".newArticleList",function (e) {
                    var dfd = $.Deferred();
                    self.bindDefaultDetail($(this),dfd);
                    self.loadNews($(this),true);
                })
                .on("arlLists:reload",function () {
                    self.allLoadNews(true);
                })
                .on("artLists:pushTemplate",function () {
                    // self.updateLiTemp($(this));
                    $(document).trigger("appSetCatch");
                });
        },
        /**
         * 格式化时间
         * @param $elem
         * @param timeText
         * @param timetype
         * @returns {*}
         */
        formatTime:function ($elem,timeText,timetype) {
            timeText = $.trim(timeText).replace(/\s+(.+)+/g,"");
            var rxp     = /([0-9]+).([0-9]+).([0-9]+)(?:.)?/g,val;
            timetype = timetype || this.getAttr("time.type",$elem) || 1;
            if(timetype != 3){
                var sep = ["-","/","."][timetype];
                val = timeText.replace(rxp,'$1'+sep+'$2'+sep+'$3');
            } else {
                val = timeText.replace(rxp,'$1年$2月$3日');
            }
            return val;
        },
        setTimeType : function (type,$node) {
            var self = this;
            this.$element.find("."+this.mdList.time).each(function (i,_) {
                $(_).text(self.formatTime(self.$element,$(_).text(),type));
            });
            this.setAttr($node,type);
            // this.updateLiTemp(this.$element);
        },

        /**
         * 选择列表可见的标签
         */
        setTags:function (value) {
            this.$element.attr("data-tagid",value);
            this.loadCurrentNews(this.$element,{
                tagIds:value
            });
        },
        /**
         * 遍历页面中的文章列表，载入数据
         */
        allLoadNews:function (isPageLoad) {
            var self = this;
            $(".wqdelementEdit.newArticleList[data-artltype=dynamic]").each(function (i,_) {
                self.loadNews($(_),void 0,isPageLoad);
            });
        },
        /**
         * 列表控件载入数据
         */
        loadNews:function ($this,isFirstLoad,isPageLoad) {
            var self = this,
                data = {};
            data.tagIds = $this.attr("data-tagid");
            data.tagIds && self.loadCurrentNews($this,data);
            !isPageLoad && $(document).trigger("appSetCatch");
        },
        getTempalte:function ($elem) {
            var $temp = $elem.find(".artlitemp"),tempPromise = $.Deferred(),self = this;
            this.template = this.template || $temp.text();
            if(this.template) {
                tempPromise.resolve();
            } else {
                $.getJSON("../js/app/newArticle/articleListTemp.json").done(function(json){
                    self.template = json.template;
                    $elem.prepend("<script type='text/template' class='artlitemp'>"+json.template+"</script>")
                    tempPromise.resolve();
                });
            }
            return tempPromise;
        },
        /**
         * 载入文章列表数据
         */
        loadCurrentNews:function ($elem,data) {
            var self = this,
                pageId = $elem.attr("data-pageid"),
                lis = [],listModel,html;
            data.tagIds = data.tagIds || this.getAttr("tagid",$elem) || "";
            data.pageNo = data.pageNo || 0;
            data.pageSize = data.pageSize || this.getAttr("page-size",$elem) || 1;
            data.orderBy = data.orderBy || this.getAttr("orderBy",$elem) || "PUBLISH_TIME";
            data.isPublish = true;

            var tempPromise = this.getTempalte($elem);
            $.when(tempPromise).done(function (json) {
                $.get("/article/page",data,function (data) {
                    if(!$.isArray(data.data.data) || data.endRows == 0) {
                        html = "";
                    } else {
                        $.each(data.data.data,function(index, value) {
                            listModel = {
                                title:value.title,
                                time:self.formatTime($elem,value.publishTime || ""),
                                pv:value.pv || 0,
                                top:value.top,
                                negative:value.negative,
                                favourable:value.favourable||0,
                                summary:value.summary || value.descn,
                                image:value.icon ? CSSURLPATH + value.icon : value.otherIcons ? value.otherIcons.split(",")[0] : "http://img.wqdian.com/group2/M00/01/95/yq0KXlad6FmASHPDAAALAiR3NvE906.jpg",
                                url:pageId ? "page_" + pageId + "_" + value.id + ".html" : "",
                                tag:_util.format("<span>{{tag}}</span>",$.map((value.categoryName||"").split(","),function (v,i) {
                                    return i > 2 ? null : {
                                        tag:v
                                    };
                                }))
                            };
                            lis.push(_util.format(self.template,listModel));
                        });
                        html = lis.join("");
                    }
                    $elem.find("ol.artlist").html(html);
                    if($elem.attr("data-artltype") == "dynamic") self.showPaging(data.data,$elem);
                });
            })

        },
        /**
         * 绑定默认文章详情页
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
        },
        /**
         * 设置排序方式
         */
        setOrderby:function ($node,value) {
            this.setAttr($node,value);
            this.loadCurrentNews(this.$element,{
                orderBy:value
            });
        },
        /**
         *  设置分页
         */
        showPaging:function (data,$elem) {
            $elem = $elem || this.$element;
            var start    = data.pageNo / 5 < 0.75 ? 1 : data.totalPages - data.pageNo > 2 ? data.pageNo - 2 : data.totalPages > 4 ? data.totalPages - 4 : 1,
                end = start > data.totalPages - 4 ? data.totalPages : start + 4,
                temp = '<li data-index="{{index}}" class="{{class}}">{{text}}</li>',
                pagingModel = [],
                pagingStyle = this.getAttr("paging.type",$elem) || "artlPagingStyle2",
                $artlPaging = $elem.find('.artListPaging');
            $artlPaging.attr("class",$artlPaging.attr("class").replace(/artlPagingStyle\d/g,pagingStyle))
            end = end > data.totalPages ? data.totalPages : end;
            if(end == 1) {
                return $artlPaging.hide() .find("ul").html("");
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
                        text:pagingStyle=="artlPagingStyle1" ? "<<": "首页"
                    },{
                        index:data.pageNo-1,
                        class:"prev",
                        text:pagingStyle=="artlPagingStyle1" ? "<": "上一页"
                    });
                }
                if(isEnd) {
                    pagingModel.push({
                        index:data.pageNo + 1,
                        class:"next",
                        text:pagingStyle=="artlPagingStyle1" ? ">": "下一页"
                    },{
                        index:data.totalPages,
                        class:"last",
                        text:pagingStyle=="artlPagingStyle1" ? ">>": "末页"
                    });
                }
            }
            $artlPaging.find("ul").html(_util.format(temp,pagingModel)).end().show();
        },
        showNode : function($node,data){
            var selector = "."+this.mdList[data.type];
            $(selector).is(":visible") ? _ccs.styleInit(this.$element.attr("id"),selector,{
                "display":"none !important"
            }) : _ccs.styleInit(this.$element.attr("id"),selector,{
                "display":""
            });
            this.setAttr($node,data.value);
        },
        /**
         * 设置文章控件样式
         */
        setCss : function (data,$node,state) {
            data.elemClass = /Title/ig.test(data.elemClass) ? data.elemClass+" a" :
                                /tag/ig.test(data.elemClass) ? data.elemClass+" span" :data.elemClass;
            var parentId = this.$element.attr("id"),
                selector = "." + data.elemClass,
                css = {};

            for (var i in data) {
                if(i == "elemClass") continue;
                // if(i == "color" && /follow/ig.test(data.elemClass) || /pv/ig.test(data.elemClass))) {
                //     selector += " svg path";
                //
                //     $elem.find("").attr("fill",data[i]);
                // }
                if(/paging/ig.test(selector) && /border|color/ig.test(i) || state == "onselect" ) {
                    selector += " li";
                }
                css[i] = data[i] + (i == "font-size" || i == "border-width" || i == "margin-top" ? "px" : "");
                if(state) {
                    if(state == "onselect") {
                        selector += ".on";
                    } else {
                        selector += ":" +state;
                    }

                }
                _ccs.styleInit(parentId,selector,css);
                this.setAttr($node,data[i]);
            }
            // this.updateLiTemp(this.$element);
        },
        /**
         * 设置data-style属性用于回显
         */
        setAttr:function ($node,value,isRemove) {
            var styClass = $node.parents("[tp-nodetype]").attr("tp-nodetype") || "",
                type     = $node.closest("[tp-type]").attr("tp-type") || "";
            if(!type) return;
            type = styClass ?  styClass + "." + type : type;
            if(/font-weight|font-style/g.test(type)) {
                value = value == "normal" ? "":"on"; 
            }

            var style    = this.$element.attr("data-style")||"",
                reg      = new RegExp(type+":[^;]*;","g"),
                stylrStr;
            stylrStr= isRemove ? "" : type + ":" + value + ";";
            style = reg.test(style) ? style.replace(reg,stylrStr) : style + stylrStr;
            this.tempModel[type] = value;//模版数据中更新值
            this.$element.attr("data-style",style); 
        },
        getAttr:function (type,$elem) {
            $elem = $elem || this.$element;
            var style    = $elem.attr("data-style")||"",
                reg      = new RegExp(type+":([^;]*);","g"),
                value;
            style.replace(reg,function (m,n) {
                value = n;
            });
            return value;
        },
        setTagStyle:function ($node,type) {
            var $tag = this.$element.find("."+this.mdList.tag);
            $tag.attr("class",$tag.attr("class").replace(/artlTagStyle\d/g,type));
            this.setAttr($node,type);
        },
        /**
         * 设置一页显示几条数据
         */
        setPageSize:function ($node,value) {
            this.setAttr($node,value);
            if(this.$element.attr("data-artltype") == "dynamic") {
                this.loadCurrentNews(this.$element,{
                    pageSize:value
                });
            }
        }
        // setLinkbutton:function ($node,value) {
        //     this.$element.find(".artListLinkButton .wqd-button > em").text(value);
        //     this.setAttr($node,value);
        //     this.updateLiTemp(this.$element);
        // }
    };
	return newArticleList;
});

