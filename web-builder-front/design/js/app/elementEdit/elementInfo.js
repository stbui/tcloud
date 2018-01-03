/*
* @Author: liumingren
* @Date:   2015-11-23 20:02:21
* @Last Modified by:   liumingren
*/
define(['utility','smartMenu','elementRotate','animate','createColorStyle','adsorbGuides'],function(_utility,_smartMenu,_er,_animate,_ccs,adsorb) {
    return {

        init:function () {
            this.bindEvent("[data-elemandgroup='true']");
        },

        bindEvent:function (elementSelector) {
            var self = this,$docu = $(document),
                $body = $("body");
            // 绑定拖动
            this.bindDrag(elementSelector);
            // 绑定拖动改变大小
            this.bindResize(elementSelector, elementSelector+">.resizeT",false, true, true, false);//上
            this.bindResize(elementSelector, elementSelector+">.resizeB",false, false, true, false);//下
            this.bindResize(elementSelector, elementSelector+">.resizeL",true,false,false,true);//左
            this.bindResize(elementSelector, elementSelector+">.resizeR",false, false, false, true);//右

            this.bindResize(elementSelector, elementSelector+">.resizeLT",true, true, false, false);//左上
            this.bindResize(elementSelector, elementSelector+">.resizeTR",false, true, false, false);//右上
            this.bindResize(elementSelector, elementSelector+">.resizeLB",true, false, false, false);//左下
            this.bindResize(elementSelector, elementSelector+">.resizeBR",false,false,false,false);//右下

            //选中元素，添加拖拽节点和工具栏
            $docu.on("click.elem",elementSelector,function(e) {
                var $this = $(this);
                $(".elementToolbar,.rotationdiv").remove();
                $this.attr("elementId") && !$this.attr("id") && $this.attr("id",$this.attr("elementId"));

                var $group = $this.closest(".wqdGroup,.articleLists");
                if($group.length && $group.attr("data-groupstatus") != "on") {// 如果是分组内元素初次不能改变
                    if($group.parents(".elementsContainer").length < 2 || $group.hasClass("articleLists")) {
                        $group.attr("data-groupstatus","on").trigger("toolbar.show",{event:e});
                        e.stopPropagation();
                    }
                    return;
                }

                $docu.trigger('texteditor:close');//退出文本编辑器

                var $parContainer = $this.parents(".elementsContainer"),
                    unused        = $this.attr("data-unused") || "";
                // 如果是通条编辑界面下的非组合容器，不让里面内容可以选中,并冒泡到轮播元素
                if(unused.indexOf("bubble") == -1 && $parContainer.length > 1 && $body.attr("data-carouseediting") != "true" && !$group.length) return;
                //修改界面下的被修改容器不能选中
                if($this.hasClass("elementsContainer") && $this.parent().hasClass("wqd-carouseOverlay-box") && $body.attr("data-carouseediting") == "true") return;
                e.stopPropagation();
                //若元素不是容器,添加旋转按钮
                if(!$this.hasClass('elementsContainer') && unused.indexOf("rotate") == -1) $docu.trigger("rotate.show",{element:$this});
                //全屏轮播禁止拖拽大小
                if($this.attr("data-elementtype") == "carouse" && $this.parents(".fullscreen").length) {
                    $(e.target).closest(".carousel-control").length || $this.trigger("toolbar.show",{event:e});
                    return $this.addClass("wqdselected");
                }

                unused.indexOf("resize") == -1 && self.setResizeUI($this,$this.attr("data-elementtype") == "line"|| unused.indexOf("reupdo") != -1);// 如果是横线只能横向拉伸,否则八个方向
                self.showElemResizeInfo($this);
                // 文章选中时父节点出工具栏
                if($this.hasClass("artListContainer") || $this.hasClass("wqdArticleListContainer")
                    || $this.hasClass("newArticleListDetail")) {
                    $this = $this.parents("[data-elementtype='articleLists'],.newArticleList").eq(0).addClass("wqdselected");
                }
                $(e.target).closest(".carousel-control").length || $this.trigger("toolbar.show",{event:e});
            })

            // 点击非元素时移除工具栏
            .on("click",function (e) {
                var $this = $(e.target);

                // $(".sectionDragCtrl").remove();
                // $this.closest(".wqdSectiondiv").after("<div class='sectionDragCtrl'></div>");
                if($this.closest(".carousel-control").length) {
                    $(".elementToolbar,.rotationdiv").remove();
                }else if ($this.closest(".wqdelementEdit").length && $body.attr("data-carouseediting") == "true") {
                    $(".elementToolbar,.rotationdiv").remove();
                }else if($this.attr("data-elemandgroup")=="true" || $this.closest(".wqdelementEdit,.wqdGroup,.elementToolbar").length ) {
                    return;
                }else {
                    $(".elementToolbar,.rotationdiv").remove();
                }
                self.editingNode = false;
                $(".wqdselected").removeClass("wqdselected");
                $docu.trigger("removeGroup");
            })

            // 鼠标抬起时解绑移动事件并更新缓存
            .on("mouseup.elem",function (e) {
                //删除参考线
                $(".wqdAdsorbGuides").remove();
                $body.off("mousemove.elem");
                self.removeElementEditBtn({elm:$(e.target)});

                this.releaseCapture && this.releaseCapture();

                if(self.elementChange) {
                    var $node = self.editingNode;
                    if($node && $node instanceof jQuery) {
                        $node.trigger("element.changed");
                        // 拖拽出通条一部分时候回滚
                        if($node.parent().hasClass('sectionV2') && !$node.closest('.articleDetails').length && !$node.hasClass("hc-fixed")) {
                            self.setNewPosition({
                                element:$node,
                                parent:$node.parent(),
                                width:$node.width(),
                                height:$node.height(),
                                left:parseFloat($node.css("left")),
                                top:parseFloat($node.css("top")),
                                isChangeSection:true
                            })
                        }
                    }
                    $docu.trigger("elementDragEnd").trigger("appSetCatch");
                    self.elementChange = false;
                }
                $(".onRotating").removeClass("onRotating");
            })

            //元素改变的时候更新editingNode
            .on("element.change",function (e) {
                self.elementChange = true;
            })

            //显示元素信息事件
            .on("elemResizeInfo:show",function (e) {
                self.showElemResizeInfo($(e.target));
            })

            //按下方向键调整元素位置
            .on('keydown',function(e){
                if($.inArray(e.keyCode,[37,38,39,40]) == -1 || !self.editingNode || !self.editingNode instanceof jQuery || (self.editingNode.attr("data-unUsed") || "").indexOf("move") != -1) {
                    return;
                }
                e.preventDefault();
                var left = parseFloat(self.editingNode.css("left")),top = parseFloat(self.editingNode.css("top"));
                if(e.keyCode === 37){
                    left -= 1;
                    top = false;
                }else if(e.keyCode === 38){
                    top -= 1;
                    left = false;
                }else if(e.keyCode === 39){
                    left += 1;
                    top = false;
                }else if(e.keyCode === 40){
                    top += 1;
                    left = false;
                }

                self.setNewPosition({
                    element:self.editingNode,
                    parent:self.editingNode.parents(".elementsContainer"),
                    width:self.editingNode.outerWidth(),
                    height:self.editingNode.outerHeight(),
                    left:left || (left === 0 ? 0 : parseFloat(self.editingNode.css("left"))),
                    top:top || (top === 0 ? 0 : parseFloat(self.editingNode.css("top"))),
                    isDrag:true,
                    elemKeyDown:true
                }).editingNode.trigger("element.change");
                $(".elementToolbar").css({
                    "top": self.editingNode.offset().top+self.editingNode.outerHeight(),
                    "left":self.editingNode.offset().left
                });
            })
            // 点击a标签的时候阻止默认事件
            .on("click","#HTMLDATA .wqdelementEdit a,.wqd-carouseOverlay .wqdelementEdit a",function(e){
                $(this).closest(".carousel-control").length || e.preventDefault();
            })
            .on("dragstart","#HTMLDATA .wqdelementEdit a,.wqd-carouseOverlay .wqdelementEdit a",function (e) {
                e.preventDefault();
            })

            //双击编辑元素
            .on("dblclick",".wqdelementEdit",function (e) {
                var $group = $(this).closest(".wqdGroup");
                // 如果是通条编辑界面下的非组合容器，不让里面内容可以选中,然后向上冒泡到容器本身
                if($(this).parents(".elementsContainer").length > 1 && $body.attr("data-carouseediting") != "true" && !$group.length) return;
                if($(this).parents(".wqdCarousel").length && $body.attr("data-carouseediting") == "true") e.stopPropagation();
                // 容器修改状态下禁止双击弹出编辑器
                if($(this).hasClass("elementsContainer") && $(this).parent().hasClass("wqd-carouseOverlay-box") && $body.attr("data-carouseediting") == "true") return false;
                self.removeElementEditBtn({toolbar:true,elm:$(e.target)});
                $docu.trigger("elmenentEdit",{element:$(this)});
            });
        },

        /**
         * [返回元素/元素组的换算后数据]
         * @param  {[object]}  data
         * @param  {[object]} data.element [元素的jquery对象]
         * @param  {[object]} data.parent [元素所在/将插入的父节点]
         * @param  {[number]} data.width [元素宽度]
         * @param  {[number]} data.height [元素高度]
         * @param  {[number]} data.minWidth [最小宽度]
         * @param  {[number]} data.minHeight [最小高度]}
         * @return {[object]} [新宽度高度定位 width,height,left,top]
         */
        getInfo:function (data) {
            var $elm  = data.element, $parent = data.parent,
                width = data.width, height = data.height, left = data.left, top = data.top,
                parentWidth  = $parent.innerWidth(),
                parentHeight = $parent.innerHeight(),
                minWidth     = 10,
                minHeight    = $elm.attr("data-elementtype") == "line" ? 1 : 10,
                maxLeft      = parentWidth - width,
                maxTop       = parentHeight - height,
                isFreeMove   = data.isFreeMove || this.isFreeMove($elm,data.isDrag),
                $parPrev     = $parent.parents(".yzmoveContent").prev().find("section.sectionV2"),
                $parNext     = $parent.parents(".yzmoveContent").next().find("section.sectionV2"),
                canOverTop,canOverBottom;

            if(data.isDrag && $elm.parent().hasClass('sectionV2')) {//切换通条，可以拖出上边缘，下边缘
                canOverTop = $parPrev.length ? true : false;
                canOverBottom = $parNext.length ? true : false;
            }

            //竖版导航  控制内容的最大宽度 并且判断不是二级导航
            if($elm.attr("data-elementtype") != "secondNav"&&$parent.hasClass("wqdSideNavWrap")){
                var wqdnavwidth = $parent.attr("wqdnavwidth");
                if(wqdnavwidth < width) {
                    width = wqdnavwidth;
                }
            }
            if(width < minWidth) width = minWidth;
            if(height < minHeight) height = minHeight;

            if(maxTop < 0) maxTop = 0;
            top = top ? top > 0 || (isFreeMove && $elm.parents(".wqd-carouseOverlay").length) || canOverTop ? top : 0 : 0;
            if(!data.keepChildren && top > maxTop && !isFreeMove && !canOverBottom) top = maxTop;

            if(maxLeft < 0) maxLeft = 0;
            if($elm.parents(".elementsContainer.fullMode").length) isFreeMove = true;

            if(!$elm.parent(".sectionV2").length || data.parent.hasClass("wqdSideNavWrap")){
                left = left ? left > 0 || isFreeMove ? left : 0 : 0;//left小于0并且不是自由拖动的时候设为0
                if(left > maxLeft && !isFreeMove) left = maxLeft;//关联元素的容器可以超出边距自由拖动
            }

            return {
                width:width,
                height:height,
                left:left,
                top:top
            };
        },

        /**
         * [更新元素定位]
         * @param  {[object]} data
         * @param  {[object]} data.element [元素的jQuery对象]
         * @param  {[object]} data.parent [元素所在/将插入的通条的jQuery对象]
         * @param  {[number]} data.width [元素宽度]
         * @param  {[number]} data.height [元素高度]
         * @param  {[number]} data.left []
         * @param  {[number]} data.top []
         * @param  {[number]} data.minWidth [最小宽度]
         * @param  {[number]} data.minHeight [最小高度]
         * @param  {[boolean]} data.keepChildren [保持子节点位置]}
         */
        setNewPosition:function (data) {
            var $elm         = data.element,
                $group       = $elm.parents(".wqdGroup"),
                isDrag       = data.isDrag,
                newElementId = _utility.creatID("elementId"),right;
            // 如果是刚创建分组,更新位置
            if(data.group == "join") {
                data.left = data.left - parseFloat($group.css("left"));
                data.top  = data.top - parseFloat($group.css("top"));
            } else {
                $elm.each(function(index, el) {
                    !$(this).attr("elementId") && !$(this).hasClass("wqdGroup") &&
                        $(this).hasClass("wqdelementEdit") && $(this).attr({"elementId":newElementId,"id":newElementId});
                });
            }

            if(data.notStyle) return this;
            // 解组时重新计算位置
            if(data.group == "disjoin") {
                data.left += data.groupleft;
                data.top  += data.grouptop;
            }

            if($group.length) data.parent = $group;
            if(!data.parent.length) data.parent = this.getNode($elm).parent;
            if(data.width === 0 || data.height === 0) return this;
            if(data.hcFixed) {
                data.isFreeMove = true;
            }

            var newCss = this.getInfo(data),css;
            if(isDrag) {
                if(data.parent.hasClass('sectionV2') && newCss.top < 0 || newCss.top > data.parent.height() - $elm.height() / 2) {
                    data.top = newCss.top;
                    this.changeSection(data);
                    newCss.top = parseFloat(data.top);
                }
                css = {
                    left:newCss.left,
                    top:newCss.top
                };
                if(data.right) {
                    css.right = data.right;
                }
            }else {
                css = {
                    width:newCss.width,
                    height:newCss.height,
                    left:newCss.left,
                    top:newCss.top
                }
                if(data.right) {
                    css.right = data.right;
                    css.left = "auto";
                }

            }
            if($elm.hasClass('dragMar')) {
                delete css.top;
                delete css.height;
                css.marginTop = newCss.top;
            }
            var $articleList = $elm.parents(".articleLists,.newArticleList");
            if($articleList.length) {
                for(var i in css) {
                    /px/g.test(css[i]) ? css[i] += " !important" : css[i] += "px !important";
                }
                if($elm.hasClass("artListContainer") || $elm.hasClass("newArticleListDetail")) {
                    css.top = 0;
                    css.left = 0;
                }
                _ccs.styleInit($articleList.attr("id"),"."+$elm.attr("data-elementtype"),css);
            } else {
                $elm.css(css);
            }

            if(data.deg && typeof +data.deg === "number") {
                _ccs.styleInit($elm.attr("id")," ",{
                    "transform":"rotateZ("+data.deg+"deg)",
                    "-webkit-transform":"rotateZ("+data.deg+"deg)"
                });
                $elm.attr("data-rotate",data.deg);
            }
            if(data.deg == 0) $elm.trigger('clearRotate');
            if( data.isAdd || data.group === "joinGroup" || data.group === "disjoin" ) this.getElemZindex($elm,"top",data.parent,data.isAdd,data.group);
            data.elemKeyDown && this.showElemResizeInfo($elm);
            return this;
        },

        /**
         * 跨通条移动
         * @param  {[object]} data [description]
         * @return {[type]}      [description]
         */
        changeSection:function (data) {
            var $elm  = data.element,
                $prev = $elm.parents(".yzmoveContent").prev().find(".sectionV2"),
                $next = $elm.parents(".yzmoveContent").next().find(".sectionV2"),
                $parent = this.getNode($elm).parent,
                elemH = $elm.height(),isAppend = false,$newPar,top = data.top;
            if(-top > elemH / 2 && $prev.length) {
                $elm.css("top",$prev.height() + parseFloat($elm.css("top")) );
                isAppend = true;
                $newPar = $prev;
                top = $prev.height() - elemH;
            }else if(top > data.parent.height() - elemH / 2 && $next.length) {
                $elm.css("top",parseFloat($elm.css("top")) - data.parent.height() );
                isAppend = true;
                $newPar = $next;
                top = 0;
            }

            // if(isAppend && !$newPar.hasClass("fullscreen")) {
            if(isAppend) {
                var $siblings = $elm.siblings("[data-elemandgroup='true']"),
                    styles = [],
                    $style = $('style.'+$elm.attr('id'));
                $style.length && styles.push($style);
                $elm.find("[data-elemandgroup='true']").each(function (i,_) {
                    $style = $('style.'+$(this).attr('id'));
                    $style.length && styles.push($style);
                });
                $newPar.append($elm.css("top",top));
                data.parent = $newPar;
                data.isAdd = true;
                data.top = top;
                this.setNewPosition(data);
                $("body").off("mousemove.elem");
                styles.length && $.each(styles,function (i,_) {
                    $newPar.before(_);
                });
                this.getElemZindex($siblings.eq(0),"reset",$siblings.length ? void 0 : $parent,void 0,void 0,true);
            }
        },

        getNode:function ($this) {
            var $elm = $this,
                $parent = $elm.parents(".wqdGroup,.wqdCarousel,.wqd-form,.elemContBox,.elementsContainer,.bannerContainer,.artListContainer,.sectionV2").eq(0);
            if($parent.hasClass("wqdGroup")||$parent.hasClass("artListContainer")) $parent = $parent.children(".wqdelementEditBox");
            return {
                element:$elm,
                parent:$parent
            };
        },

        isFreeMove:function ($elm,isDrag) {
            return !!($elm.hasClass("correlationBox") ||
            $elm.hasClass('freeMove') ||
            // ($elm.parent().hasClass('sectionV2') && $elm.parents(".yzmoveContent").siblings().find("section.sectionV2").length && isDrag) ||
            $elm.parents(".fullscreen").length &&
            $elm.parent().hasClass('sectionV2') && !$("#wqdIphoneContainer").length &&
            $("body").attr("data-carouseediting") == "true") || $elm.hasClass("hc-fixed");
        },

        /**
         * [获得元素层级]
         * @param  {[object]}   $elm [元素对象]
         * @param  {[string]}   indexType [定位类型 up,down,top,bottom]
         * @param  {[object]}   parent [元素父节点对象]
         * @param  {[boolean]}  isAdd [是否新加元素]
         * @param group
         * @param notSetCatch
         */
        getElemZindex:function ($elm,indexType,parent,isAdd,group,notSetCatch) {
            if(group === "join") return;
            var $parent   = $(parent).length ? $(parent) : this.getNode($elm).parent,
                isDisjoin = group == "disjoin",isResetOther = group == "resetother",isJoinGroup = group == "joinGroup",
                $allEment = isResetOther? $elm.siblings("[data-elemandgroup='true']") : $parent.find(">[data-elemandgroup='true']"),
                maxzIndex,zindex,newzIndex;

            maxzIndex = $allEment.length - (isDisjoin ? 1 : 0);//如果是解组的话maxzindex为元素数减去分组本身
            zindex    = isAdd || isDisjoin ? maxzIndex : +$elm.attr("data-zindex");
            zindex    = zindex == "auto" || isNaN(zindex) ? 1 : zindex;

            // 兼容之前已经可能因误操作引起的排列混乱
            if($parent.attr("data-maxZindex") > maxzIndex && maxzIndex != 0 && !isDisjoin && !isResetOther && !isJoinGroup && indexType != "reset") {
                $parent.attr("data-maxZindex",maxzIndex);
                this.getElemZindex($elm,"reset",$parent,false,false);
            }
            // 根据选择切换需改变的元素们的z-index,向上一层，向下一层，顶层，底层
            switch(indexType || "top") {
                case "up":
                    newzIndex = parseInt(zindex,10)+1;
                    $allEment.each(function (i,_) {
                        var tzindex = $(this).attr("data-zindex") || 1;
                        if(tzindex == newzIndex) {
                            $(this).css("z-index",tzindex-1).attr("data-zindex",tzindex-1);
                        }
                    });
                    zindex = newzIndex > maxzIndex ? maxzIndex : newzIndex;
                    break;
                case "down":
                    newzIndex = parseInt(zindex,10)-1;
                    $allEment.each(function (i,_) {
                        var tzindex = $(this).attr("data-zindex") || 1;
                        if(tzindex == newzIndex) {
                            $(this).css("z-index",parseInt(tzindex,10)+1).attr("data-zindex",parseInt(tzindex,10)+1);
                        }
                    });
                    zindex = newzIndex > maxzIndex ? maxzIndex : newzIndex;
                    break;
                case "top":
                    $allEment.each(function (i,_) {
                        var tzindex = $(this).attr("data-zindex") || 1;
                        if(tzindex > zindex) {
                            $(this).css("z-index",parseInt(tzindex,10)-1).attr("data-zindex",parseInt(tzindex,10)-1);
                        }
                    });
                    zindex = maxzIndex;
                    break;
                case "bottom":
                    $allEment.each(function (i,_) {
                        var tzindex = $(this).attr("data-zindex") || 1;
                        if(tzindex < zindex) {
                            $(this).css("z-index",parseInt(tzindex,10)+1).attr("data-zindex",parseInt(tzindex,10)+1);
                        }
                    });
                    zindex = 1;
                    break;
                case "reset":
                    var newAllElem = $allEment.sort(function(a, b) {
                        return $(a).attr("data-zindex") - $(b).attr("data-zindex");
                    });
                    for(var i = 0; i < newAllElem.length; i++) {
                        $(newAllElem[i]).attr("data-zindex",i+1).css("z-index",i+1);
                    }
                    zindex = $elm.attr("data-zindex");
                    break;
            }


            if(zindex < 1) zindex = 1;
            if(zindex >= maxzIndex) maxzIndex = zindex;
            $parent.attr("data-maxZindex",maxzIndex);
            indexType != "reset" && $elm.css({"z-index":zindex}).attr("data-zindex",zindex);

            if(group=="joinGroup") {
                // 如果是新添加组,重置组内zindex
                this.getElemZindex($elm.children("[data-elemandgroup='true']").eq(0),"reset",$elm.attr("data-maxZindex",0),false,false);
                this.getElemZindex($elm,"reset",$elm.parents(".sectionV2"),false,"resetother");
            }
            if( !notSetCatch && !isAdd && !group) $(document).trigger("appSetCatch");
        },

        /**
         * [生成拖拽节点]
         * @param {[object]} $elm  [选中元素]
         * @param {[boolean]} onlyX [是否仅允许拖拽X方向]
         */
        setResizeUI:function ($elm,onlyX) {
            var elmDragDom = [];
            this.removeElementEditBtn();
            elmDragDom.push("<div class='resizeL'></div><div class='resizeR'></div>");
            if(!onlyX) {
                elmDragDom.push("<div class='resizeT'></div>","<div class='resizeB'></div>","<div class='resizeLT'></div>","<div class='resizeTR'></div>","<div class='resizeBR'></div>","<div class='resizeLB'></div>");
            }
            $elm.append(elmDragDom.join(""));
        },

        /**
         * 绑定拖动
         * @param  {[string]} elm [拖动元素的上下文选择器字符串]
         */
        bindDrag:function (elm) {
            // 默认整个div可拖动
            var self = this;

            $(document).on("mousedown",elm,function (e) {
                if(e.button != 0) return false; //不是鼠标左键时返回
                var $elm          = $(this),
                    $group        = $elm.parents(".wqdGroup,.articleLists"),
                    elementType   = $elm.attr("data-elementtype");

                //没有元素id的话主动添加一个新id
                if(!$elm.attr("elementId") && !$elm.hasClass("wqdGroup")){
                    var newElementId = _utility.creatID("elementId");
                    $elm.attr({"elementId":newElementId,"id":newElementId});
                }

                if(elementType == "carouse" && $elm.parents(".fullscreen").length && !$elm.parent().hasClass('wqd-carouseOverlay-box')) return;//全屏轮播禁止拖拽大小
                // 文章拖拽父节点
                if(/artListContainer|newArticleListDetail/g.test(elementType)) {
                    $elm = $elm.parents("[data-elementtype='articleLists'],.newArticleList").eq(0);
                }

                var unused = $elm.attr("data-unused") || "";
                // 如果handle是分组中的元素并且是第一次点击，向上冒泡到分组元素

                if($group.length && $group.attr("data-groupstatus") != "on") return;
                // 如果是通条编辑界面下的非分组容器下元素，不允许拖动,向上冒泡到容器元素
                if(unused.indexOf("bubble") == -1 && $elm.parents(".elementsContainer").length > 1 && $("body").attr("data-carouseediting") != "true" && !$group.length) return;
                if($(e.target).closest("[data-slide]").length) return;// 如果点击的是轮播的按钮，return;

                $(".wqdselected").removeClass("wqdselected");
                self.editingNode = $elm;
                $elm.hasClass("wqdSecondNavbox") && $elm.addClass("wqdselected");//临时兼容导航二级容器不能删除
                if(unused.indexOf("drag") != -1 || unused.indexOf("move") != -1) return false;

                var $parent = self.getNode($elm).parent;
                var isFreeMove = false;

                // 修改模式下容器可以拖动
                //if($elm.parent().hasClass('wqd-carouseOverlay-box')) {
                var $target = $(e.target);
                if($target.parents(".wqd-carouseOverlay-box").length && $elm.parents(".wqdelementEdit").length<1) {
                    //$elm = $elm.parent();
                    $elm = $target.parents(".wqd-carouseOverlay-box");
                    $parent = $target.parents(".wqd-carouseOverlay");
                    isFreeMove = true;
                }

                if(!$elm.length || !$parent.length) return false;
                $elm.addClass("wqdselected");
                var disX = e.clientX,disY = e.clientY;
                e.stopPropagation();
                this.setCapture && this.setCapture();
                self.showElemResizeInfo($elm);
                //初始化吸附线的坐标数据
                adsorb.dataInit($elm);

                //悬浮容器相关
                var hcFixed = $elm.hasClass("hc-fixed");
                var left = hcFixed ? $elm.offset().left-50 : parseFloat($elm.css("left")),
                    top = $elm.hasClass('dragMar') ? parseFloat($elm.css("marginTop")) :
                        hcFixed && $elm.css("top") == "auto" ? $elm[0].offsetTop : parseFloat($elm.css("top")),
                    right = parseFloat($elm.css("right")||0);

                var hcLeft = ($elm.offset().left||0)-50;
                $("body").off("mousemove.elem").on("mousemove.elem.drag",function (e) {
                    e.stopPropagation();
                    var eLeft   = e.clientX - disX, eTop = e.clientY - disY;
                    if(!eLeft && !eTop) {
                        return;
                    }
                    //悬浮容器悬浮状态下贴右时拖动
                    if(hcFixed) {
                        top += parseFloat($elm.css("marginTop"));
                        if($elm.hasClass("hc-fixed-bottom")) {
                            $elm.removeClass("hc-fixed-bottom");
                            top -= 50;
                        }
                        if(!$elm.hasClass("hc-fixed-right")) {
                            $elm.css({
                                "margin-top":"",
                                "margin-left":""
                            });
                        } else {
                            var winWidth = $(window).width();
                            if(Math.abs( winWidth - hcLeft - eLeft) < (winWidth - 50)/2 ) {
                                // left = "auto";
                                var eRight = right - eLeft;
                                $elm.css({
                                    "margin-top":"",
                                    "margin-left":""
                                });
                                // if(eRight < 0) eRight = 0;
                            }
                            left = "auto";
                        }
                        isFreeMove = true;
                    } 
                    // 设置定位
                    self.setNewPosition({
                        element:$elm,
                        parent:$parent,
                        width:$elm.outerWidth(),
                        height:$elm.outerHeight(),
                        left: left == "auto" ? left : left + eLeft,
                        top: top + eTop,
                        isDrag:true,
                        isFreeMove:isFreeMove,
                        event:e,
                        hcFixed:hcFixed,
                        right:eRight
                    });
                    self.removeElementEditBtn({type:"move",toolbar:true});//拖动时也显示拖拽节点
                    //拖拽吸附
                    !hcFixed && adsorb.moveAdsorb($elm, $elm.position().left, $elm.position().top,true);
                    // 拖拽结束时触发改动事件
                    $elm.trigger("element.change");
                    self.showElemResizeInfo($elm);
                    // 拖动时候其他元素透明
                    $elm.addClass("onDragingElement").parents(".sectionV2,.wqd-carouseOverlay").addClass("onDraging");
                    $(".elementToolbar").remove();
                });
            });
        },

        /**
         * 拖动改变元素大小
         * @param  {[String]} elm [元素选择器]
         * @param  {string} handle [触发的元素(上下左右 左上 左下 右上 右下)选择器]
         * @param  {boolean} isLeft [是否左侧]
         * @param  {[Boolean]} isTop [是否上]
         * @param  {[Boolean]} lockX [锁定x轴]
         * @param  {[Boolean]} lockY [锁定y轴]
         * @return {[object]} {width,height,left,top} [新宽度高度定位]
         */
        bindResize:function (elm,handle,isLeft,isTop,lockX,lockY) {
            var self = this;
            $(document).on("mousedown",handle,function (e) {
                if(e.button == 2) return false; //右键按下的时候阻止默认事件
                var $group = $(this).parents(".wqdGroup");
                if($group.length && $group.attr("data-groupstatus") != "on") return false;
                e.stopPropagation();
                var $this    = $(this),
                    $elm     = $this.parents(elm).eq(0),
                    $parent  = self.getNode($elm).parent,
                    $editBox = $elm.children('.wqdelementEditBox'),
                    offLeft  = $(handle).offset().left, offTop = $(handle).offset().top,//当前相对文档left,top
                    clientX  = e.clientX, clientY = e.clientY, disX = clientX - offLeft, disY = clientY - offTop,//x,y,偏移x,偏移y
                    hcFixed = $elm.hasClass("hc-fixed"),
                    top      = $elm.hasClass('dragMar') ? parseFloat($elm.css("marginTop")):parseFloat($elm.css("top")),
                    left = parseFloat($elm.css("left")),//元素离通条顶部、左边距离
                    elmOffLeft = $elm.offset().left,
                    width    = $elm.outerWidth(), height = $elm.outerHeight();//元素宽高
                //初始化吸附线的坐标数据
                adsorb.dataInit($elm);
                self.editingNode = $elm;
                var right = parseFloat($elm.css("right"));
                $("body").off("mousemove.elem").on("mousemove.elem.resize",function (e) {
                    e.stopPropagation();
                    var ndisX = e.clientX - disX, ndisY = e.clientY - disY,//偏移距离
                        addWidth   = isLeft ? offLeft - ndisX : e.clientX - clientX,//增加/减少的宽度
                        // parWidth   = $parent.width(),
                        parHeight  = $parent.height(),
                        // maxWidth   = parWidth - left,
                        newLeft    = isLeft ? left-addWidth : left,
                        newWidth   = lockX ? width : width + addWidth,//新宽度
                        // newWidth   = lockX ? width : width + (isLeft ? addWidth >= left ? left : addWidth:addWidth),//新宽度，如果为向左拉则不能超过元素离左边距离
                        addHeight  = isTop ? offTop - ndisY : e.clientY - clientY,
                        maxHeight  = parHeight - top,
                        newTop     = isTop ? top - addHeight : top,
                        newHeight  = lockY ? height : height + (!isTop || addHeight < top ? addHeight : top),//新高度，如果为向上拉则不能超过元素离上边距离
                        // newHeight  = lockY ? height : height + (isTop ? addHeight >= top ? top : addHeight:addHeight),//新高度，如果为向上拉则不能超过元素离上边距离
                        hoverContainerFixed    = $parent.parents(".wqdSectiondiv ").hasClass("hoverCon-section"),
                        isFreeMove = self.isFreeMove($elm),minTop,maxTop,maxLeft;

                    // 图片元素高度最大不超过图片的高度
                    var $img = $elm.find(".wqd-img").not(".wqd-img-default");
                    if($elm.attr("data-elementtype") == "img" && $img.length && newHeight > $img.outerHeight()) {
                        var $editBox = $elm.find(".wqdelementEditBox"),border = $editBox.css("border-width"),padding = $editBox.css("padding");
                        newHeight = $img.outerHeight() + (border ? parseFloat(border) * 2 : "") + (padding ? parseFloat(padding) * 2 : "");
                        minTop = top + height - newHeight;
                        newTop < minTop && (newTop = minTop);
                    }
                    // 如果拖动的是左边框，距离左边最小left为0,向右最大left不能超过原right的距离
                    if(isLeft && !isFreeMove && !hoverContainerFixed) {
                        // newLeft = newLeft >= 0 ? newLeft : 0;
                        maxLeft = left + width - 10;
                        newLeft = newLeft > maxLeft ? maxLeft : newLeft;

                    }
                    // else if(newWidth >= maxWidth && (!isFreeMove || isPhone)) {//手机或自由拖动状态下可以拖出主区域
                    //      newWidth = maxWidth;
                    // }
                    // 如果拖动的是上边框，距离上边最小top为0
                    if(isTop && !hoverContainerFixed) {
                        newTop = newTop >= 0 ? newTop :0;
                        maxTop = top + height - 10;
                        newTop = newTop > maxTop ? maxTop : newTop;
                    }else if(newHeight >= maxHeight && !isFreeMove && !hoverContainerFixed) {
                         newHeight = maxHeight;
                    }

                    //悬浮容器拖拽右边改变大小时计算right值
                    if(hcFixed && $elm.hasClass("hc-fixed-right")) {
                        var newRight = right - addWidth;
                        var maxRight = $(window).width() - elmOffLeft - 10;
                        if(newRight > maxRight) newRight = maxRight;
                    }

                    // 如果宽度达到97%,自动100%

                    // if(newWidth/parWidth > 0.97 && !isFreeMove) {
                    //     newWidth = parWidth;
                    //     newLeft = 0;
                    // }
                    var newPosition = {
                        element:$elm,
                        parent:$parent,
                        width:newWidth,
                        height:newHeight,
                        left:newLeft,
                        top:newTop,
                        isLeft:true,
                        right:newRight
                    };
                    // 兼容已使用百分比的容器 拉伸容器的时候子元素转换为px
                    if($elm.hasClass("elementsContainer") && $elm[0].style.width.indexOf("%") != -1) {
                        self.updateElements(self.getNode($elm.find(".wqdelementEdit").eq(0)).parent);
                    }

                    //拖拽吸附
                    adsorb.moveAdsorb($elm, newLeft, newTop,false);
                    self.setNewPosition(newPosition).showElemResizeInfo($elm);
                    // 拖拽结束时触发改动事件 导航用到
                    $elm.trigger("element.change").trigger("element.resize");
                    // 拖动时候其他元素透明
                    $elm.addClass("onDragingElement").parents(".sectionV2,.wqd-carouseOverlay").addClass("onDraging");
                    $(".elementToolbar").css({
                        "top": $elm.offset().top+$elm.outerHeight(),
                        "left":$elm.offset().left
                    });
                });
            });
        },

        //转化pc元素信息到手机
        // convertPcToPhone:function () {
        //     var self = this,
        //         $sections = $(".sectionV2").not("[sectionwidth=320]"),
        //         $elements = $sections.not("[data-coverPhone=true]").find("[data-elemandgroup='true']");
        //
        //     //遍历未更新为手机样式的通条下的所有元素
        //     if($sections.length) {
        //         $elements.each(function (i,_) {
        //             var $this         = $(_),
        //                 $parent       = self.getNode($this).parent,
        //                 $section      = $this.parents(".sectionV2"),
        //                 phoneStWidth  = 320,
        //                 pcStWidth     = $section.attr("sectionwidth") || 1600,
        //                 widthRatio    = phoneStWidth / pcStWidth;
        //
        //             $this.css({
        //                 width:$this.width() * widthRatio,
        //                 height:$this.height() * widthRatio,
        //                 left:parseFloat($this.css("left")) * widthRatio,
        //                 top:parseFloat($this.css("top")) * widthRatio
        //             });
        //             if($section.attr("data-coverPhone") != "true") {
        //                 $section.attr("data-coverPhone",true).height($section.height() * widthRatio);
        //             }
        //
        //         });
        //         $sections.each(function (i,_) {
        //             $(_).attr("sectionwidth",320);
        //         });
        //         $(".yzmoveContent").show();
        //         $(document).trigger("convertPcToPhoneCallBack").trigger("appSetCatch");
        //     }
        // },

        /** 更新元素宽高定位 (父节点改变宽高等)
         * @param  {[object]} $parent       [父节点对象]
         */
        updateElements:function ($parent) {
            var self = this;
            $parent.find(">[data-elemandgroup='true']").each(function(i,_){
                var $elm = $(_);
                var newData = {
                    element:$elm,
                    parent:$parent,
                    width:$elm.outerWidth(),
                    height:$elm.outerHeight(),
                    left:parseFloat($elm.css("left")),
                    top:parseFloat($elm.css("top")),
                    keepChildren:true
                };
                self.setNewPosition(newData);
                $elm.trigger('element.change').trigger("element.changed");
            });
        },

        /** 设置宽高位移提示信息
         * @param  {[object]} $elm [元素对象]
         */
        showElemResizeInfo:function ($elm) {
            var self = this,
                deg  = +$elm.attr("data-rotate") || 0,
                unused = $elm.attr("data-unused") || "",
                $elemResizeInfo = $(".elemResizeInfo").hide();
            if(unused.indexOf("info") != -1) return;

            $elemResizeInfo.show().attr("data-unused",$elm.attr("data-unused"))
                .find(".elemResizeInfoX").html(Math.round($elm.position().left))
                .siblings(".elemResizeInfoY").html(Math.round($elm.position().top));

            var $infoW = $elemResizeInfo.find(".elemResizeInfoW"),
                $infoH = $elemResizeInfo.find(".elemResizeInfoH");
            $elemResizeInfo.find("span").show();
            if(unused.indexOf("resize") == -1) {
                $infoW.html(Math.round($elm.outerWidth()));
                $infoH.html(Math.round($elm.outerHeight()));
            }else {
                $infoW.hide().prev(".texts").hide();
                $infoH.hide().prev(".texts").hide();
            }

            unused.indexOf("rotate") == -1 && $elemResizeInfo.find(".elemResizeInfoDeg").html(( deg >=0 ? deg : 360 + deg ).toFixed(1));
            $(document).off("elemResizeInfo:change").on("elemResizeInfo:change",function (e,data) {
                var $parent = $elm.parents(".elementsContainer"),
                    newData = {
                        element:$elm,
                        parent:$parent,
                        width:data.width || $elm.width(),
                        height:data.height || $elm.height(),
                        left:data.left - _er.getDiffInfo($elm).left || (data.left === 0 ? data.left : parseFloat($elm.css("left"))),
                        top:data.top - _er.getDiffInfo($elm).top || (data.top === 0 ? data.top : parseFloat($elm.css("top"))),
                        deg:data.deg
                    };
                if(data.width || data.height) {
                    var maxWidth  = $parent.width() - parseFloat($elm.css("left"));
                    var maxHeight = $parent.height() - parseFloat($elm.css("top"));
                    newData.width = data.width > maxWidth ? maxWidth : data.width;
                    newData.height = data.height > maxHeight ? maxHeight : data.height;
                }
                self.setNewPosition(newData);
                data.setCatch && $(document).trigger("appSetCatch");
            });
        },

        /** [移除选中元素时显示的按钮节点等]
         * @param  {[object]} list [移除的借点列表]
         */
        removeElementEditBtn:function (list) {
            list = list || {};
            var $resizes = $(".resizeT,.resizeB,.resizeL,.resizeR,.resizeLT,.resizeTR,.resizeLB,.resizeBR");
            $resizes.length && list.type != "move" && $resizes.remove();

            list.toolbar && $(".elementToolbar,.rotationdiv").remove();// 移除元素浮动工具栏
            $(".onDraging").removeClass("onDraging").find(".onDragingElement").removeClass("onDragingElement");// 移除正在拖动class
            $(document).trigger("removeGroup");

            if (list.elm) {//双击元素编辑时触发的操作
                var $group = list.elm.parents(".wqdGroup,.articleLists,.newArticleList");
                $group.length ? $group.siblings("[data-groupstatus='on']").attr("data-groupstatus","off") : $("[data-groupstatus='on']").attr("data-groupstatus","off");
            }
        },

        deleteElement:function ($elm) {
            $elm.trigger("element.remove");
            var $siblings = $elm.siblings().eq(0),
                $parent   = $elm.parents("[data-elemandgroup=true]").eq(0);
            $("style."+$elm.attr("elementid")+",style."+$elm.attr("groupid")).remove();

            if($elm.hasClass("fullMode")) {
                $elm.parents(".yzmoveContent").remove();
                return $(document).trigger("appSetCatch").trigger("sectionList:reload");
            }
            $elm.remove();
            this.getElemZindex($siblings,"reset",$siblings.length ? void 0 : $parent);
        }
    };
});

