$(function() {
    /**
     * [简单模板，用来组装字符串 liumingren]
     * @param {[string]} 模板
     * @param {[object|array]} 替换的对象数据 格式为 (模板:值),多个放在数组里
     * @return {[string]} [替换后的htmlString]
     */
    format = function(){
        var args = [].slice.call(arguments),str = String(args.shift() || ""), ar = [], first = args[0];
        args = $.isArray(first) ? first : typeof(first) == 'object' ? args : [args];
        $.each(args, function(i, o){
            ar.push(str.replace(/\{\{([\d\w\.]+)\}\}/g, function(m, n, v){
                v = n === 'INDEX' ? i : o[n];
                return v === undefined ? m : ($.isFunction(v) ? v.call(o, n) : v)
            }));
        });
        return ar.join('');
    };
    var articleList = {
        init:function () {
            this.allLoadNews();
            this.bindEvent();
        },
        bindEvent:function () {
            var self = this;
            $(document)
                .on("click",".artlTagUl > .artlTagButton",function (e) {
                    var tagId = $(this).addClass("on").siblings(".artlTagButton").removeClass("on").end().attr("data-tagid") || "",
                        artlListId = $(this).parents(".wqdelementEdit.articleListsTag").attr("data-artllistid")||"",
                        $elem      = $(".wqdelementEdit.articleLists").filter("[data-artllistid="+artlListId+"]").attr("data-ontagid",tagId);
                    self.loadCurrentNews($elem,{
                        tagIds:tagId
                    });
                })
                .on("click",".artListPaging li",function (e) {
                    var $elem = $(this).parents(".articleLists");
                    self.loadCurrentNews($elem,{
                        tagIds:$elem.attr("data-ontagId")|| ($elem.attr("data-tagid")||"").split(",")[0] || "",
                        pageNo:$(this).attr("data-index")
                    });
                });
        },
        /**
         * 页面中的列表载入数据
         */
        allLoadNews:function () {
            var self = this;
            $(".wqdelementEdit.articleLists").each(function (i,_) {
                self.loadNews($(_));
            });
        },
        /**
         * 某列表控件载入数据
         * @param $this
         */
        loadNews:function ($this) {
            var self = this,
                data = {};
            var dfd = this.showTagList($this);
            $.when(dfd).done(function () {
                data.tagIds = $this.attr("data-ontagId");
                self.loadCurrentNews($this,data);
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
            data.tagIds = data.tagIds || $elem.attr("data-ontagId")|| ($elem.attr("data-tagid")||"").split(",")[0] || "";
            data.pageNo = data.pageNo || 0;
            data.pageSize = data.pageSize || $elem.attr("data-pagesize") || 3;
            data.orderBy = data.orderBy || $elem.attr("data-orderby") || "PUBLISH_TIME";

            $.get("/article/page",data,function (data) {
                if(!$.isArray(data.data.data) || data.endRows == 0) {
                    html = "";
                } else {
                    $.each(data.data.data,function(index, value) {
                        listModel = {
                            "title":value.title,
                            "time":self.formatTime($elem,value.publishTime || ""),
                            "viewCount":value.pv || 0,
                            "follow":value.favourable||0,
                            "summary":value.summary || value.descn,
                            "image":value.icon ? CSSURLPATH + value.icon : value.otherIcons ? value.otherIcons.split(",")[0] : "http://img.wqdian.com/group2/M00/01/95/yq0KXlad6FmASHPDAAALAiR3NvE906.jpg",
                            "url":pageId ? "page_" + pageId + "_" + value.id + ".html" : ""
                        };
                        lis.push(format(temp,listModel));
                    });
                    html = lis.join("").replace(/data-src/g,"src");
                }
                html = lis.join("").replace(/data-src/g,"src");
                $elem.addClass("artlShow").find(".artlUl").html(html);
                self.showPaging($elem,data.data);
            });
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

            temp = formatTemp($li);
            $artlitemp.length ? $artlitemp.html(temp) : $elem.prepend("<script type='text/template' class='artlitemp'>"+temp+"</script>");
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
                    // tagModel.unshift({
                    //     "on":"class='on'",
                    //     "tagId":"",
                    //     "text":"全部",
                    //     left:0,
                    //     top:0,
                    //     width:"180px",
                    //     height:"40px"
                    // });
                    onTagId || $elem.attr("data-ontagid","");//没有选中项则置空
                    isFirstLoad && $elem.attr("data-tagid",tags.join(","));
                    $tagUl.html(format(temp,tagModel));
                }
            });
            return tagDfd.promise();
        },
        /**
         *  设置分页
         * @param data [{object}]
         */
        showPaging:function ($elem,data) {
            var start    = data.pageNo / 5 < 0.75 ? 1 : data.totalPages - data.pageNo > 2 ? data.pageNo - 2 : data.totalPages > 4 ? data.totalPages - 4 : 1,
                end = start > data.totalPages - 4 ? data.totalPages : start + 4,
                temp = '<li data-index="{{index}}" class="{{class}}">{{text}}</li>',
                $artlPaging = $elem.find('.artListPaging'),
                pagingModel = [];

            if(end == 1 || data.endRows == 0) {
                return $artlPaging.html("");
            }
            for(var i = start ;i <= end ;i++){
                var isEnd = i == end;
                pagingModel.push({
                    index:i,
                    class:i == data.pageNo ? "on" : "",
                    text:i
                });
                // if(i == start && data.pageNo > 1) {
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
                // if(isEnd && data.pageNo < data.totalPages) {
                if(isEnd) {
                    pagingModel.push({
                        index:data.pageNo + 1,
                        class:"next",
                        text:"下一页"
                    },{
                        index:data.totalPages,
                        class:"last",
                        text:"末页"
                    })
                }
            }
            $artlPaging.html(format(temp,pagingModel));
        },
        formatTime:function ($elem,timeText,timetype) {
            timeText = timeText.replace(/\s+(.+)+/g,"");
            var rxp     = /([0-9]+).([0-9]+).([0-9]+)(?:.)?/g,val;
            timeText = timeText || "";
            timetype = timetype || $elem.attr("data-timetype") || 0;
            if(timetype != 3){
                var sep = ["-","/","."][timetype];
                val = timeText.replace(rxp,'$1'+sep+'$2'+sep+'$3');
            } else {
                val = timeText.replace(rxp,'$1年$2月$3日');
            }
            return val;
        },
    };
    articleList.init();
});
