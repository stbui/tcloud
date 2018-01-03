define(['utility', 'elementInfo', 'elementAlign', 'elementDistribute'], function(_ut, _el, _ea, _ed) {
    elementGroup = {
        'onEditing': [],
        'existGroupArray': [],
        'minLeft': 0,
        'minTop': 0,
        'maxHeight': 0,
        'maxWidth': 0,
        'copyCont': {
            'elem': [],
            'parent': null,
            'style': {}
        },
        'downC': false,
        'downV': false,
        'keyStatus': false,
        'num': 0
    };
    elementGroup.init = function() {
            var _this = this;
            //粘贴
            $(document).on('pasteEG', function(e, node) {
                    _this.pasteEG(node);
                })
                //复制
            $(document).on('copyEG', function(e, node) {
                    _this.copyEG(node);
                })
                //清除复制
            $(document).on('wqdComponentD:overlay', function(e, node) {
                    _this.clearCopy();
                })
                //消除元素选中状态
            $(document).on('removeGroup', function(event) {
                    if (!_this.keyStatus) $('.wqdelementEdit').removeClass('onGrouping');
                })
                //监听ctrl按键  组合准备
            $(document).on('keydown',function(event) {
                var node = $('.wqdselected');
                $('.wqdelementEditBox').siblings(":not(.artlitemp)").remove();
                if ((event.keyCode==17 || event.keyCode==91) && !_this.keyStatus) {
                    _this.keyStatus = true;
                    $('.elementToolbar').remove();
                    if (_this.onEditing.length) _this.onEditing[0].elem.removeClass('onEditing').addClass('onGrouping');
                }

                if(event.keyCode==91){
                    _this.downC = _this.downV = false;
                }

                if (event.keyCode == 67 && !_this.downC) {
                    _this.downC = true;
                    if (_this.keyStatus) _this.copyEG(node.clone(true));
                }
                if (event.keyCode == 86 && !_this.downV && event.target.nodeName.toLowerCase() != 'input') {
                    _this.downV = true;
                    if (_this.keyStatus) _this.pasteEG();
                }
                var $this = $(event.target);
                if ((event.keyCode==46 || event.keyCode==8) &&
                    !_this.keyStatus &&
                    !/input/ig.test($this[0].tagName) &&
                    !$('.wqdselected').closest(".articleListsTag").length) {
                    var c = $('.wqdselected').hasClass('elementsContainer') ? $('.wqdselected.elementsContainer').find('.wqdselected').length ? $('.wqdselected.elementsContainer').find('.wqdselected') : $('.wqdselected.elementsContainer') : $('.wqdselected');
                    if ($('#colorbox:visible').length || !c.hasClass("wqdelementEdit") || !c.length) return;
                    _el.deleteElement(c);
                    _el.removeElementEditBtn({
                        toolbar: true
                    });
                    event.preventDefault();
                }
            });
            //圈选
            $(document).on('mousedown.circleSelect', '.sectionV2', function(e) {
                    var circleSelectNode = $('<div id="wqdcircleSelectos"></div>'),
                        section = $(e.target),
                        x1 = e.pageX - section.offset().left,
                        y1 = e.pageY - section.offset().top,
                        isCircle = false,
                        clientX = e.clientX,
                        clientY = e.clientY,
                        isMove = false,
                        array = [],
                        moveCircleSelectos = function(node, w, h, x1, y1) {
                            section.append(node);
                            if (w < 0 && h < 0) { // left top
                                node.css({
                                    'width': Math.abs(w) + 'px',
                                    'height': Math.abs(h) + 'px',
                                    'left': x1 - Math.abs(w) + 'px',
                                    'top': y1 - Math.abs(h) + 'px'
                                });
                            }
                            if (w < 0 && h > 0) { // left bottom
                                node.css({
                                    'width': Math.abs(w) + 'px',
                                    'height': Math.abs(h) + 'px',
                                    'left': x1 - Math.abs(w) + 'px'
                                });
                            }
                            if (w > 0 && h > 0) { // right bottom
                                node.css({
                                    'width': w + 'px',
                                    'height': h + 'px'
                                });
                            }
                            if (w > 0 && h < 0) { // right top
                                node.css({
                                    'width': Math.abs(w) + 'px',
                                    'height': Math.abs(h) + 'px',
                                    'top': y1 - Math.abs(h) + 'px'
                                });
                            }
                        },
                        moveCircleElm = function(x, y, arr, parent) {
                            var circle = $('#wqdcircleSelectos'),
                                parent = parent.closest('.sectionV2');
                            for (var j = 0; j < arr.length; j++) {
                                circle.css({
                                    'left': circle.data('locat')[0] + x + 'px',
                                    'top': circle.data('locat')[1] + y + 'px'
                                });
                                (function(a, b, c, d, e) {
                                    var css = _this.moveCircleLimit(a, b, c, d, e);
                                    if (typeof css != 'boolean') _el.setNewPosition(css);
                                })(circle, arr[j], parent, x, y);
                            }
                        };
                    if (section.hasClass('sectionV2')) $('.wqdGroupmove').removeClass('wqdGroupmove');
                    $('.elementToolbar').remove();
                    isCircle = (section.attr('id') != 'wqdcircleSelectos') ? true : false;
                    if (isCircle) {
                        $('#wqdcircleSelectos').remove();
                        circleSelectNode.css({
                            'top': y1 + 'px',
                            'left': x1 + 'px'
                        }).data('posX', x1).data('poxY', y1);
                        _this.clearData();
                    } else {
                        array = _this.onEditing.concat(_this.existGroupArray);
                        $('#wqdcircleSelectos').data('locat', [parseFloat($('#wqdcircleSelectos').css('left')), parseFloat($('#wqdcircleSelectos').css('top'))]);
						if(array.length){
							for(k=0;k<array.length;k++){
								array[k].inf.left = parseInt(array[k].elem.css('left'));
								array[k].inf.top = parseInt(array[k].elem.css('top'));
							}
						}
                    }
                    $('.yzmoveContent').removeClass('yzmoveContentBor')
                    section.closest('.yzmoveContent').addClass('yzmoveContentBor');
                    $(document).on('mousemove.circleSelect', '.sectionV2', function(e) {
                        var w = e.pageX - x1 - section.offset().left,
                            h = e.pageY - y1 - section.offset().top;
                        e.stopPropagation();
                        isMove = true;
                        _this.isCircling = true;
                        isCircle ? moveCircleSelectos(circleSelectNode, w, h, x1, y1) : moveCircleElm.call(_this, e.clientX - clientX, e.clientY - clientY, array, section);
                    });
                    $('body').on('mouseup.circleSelect', function(e) {
                        $(document).off('mousemove.circleSelect');
                        $(this).off('mouseup.circleSelect');
                        _this.minLeft = _this.minTop = _this.maxHeight = _this.maxWidth = 0;
                        _this.minLeftObj = _this.minTopObj = null;
                        if(_this.isCircling) {
                            setTimeout(function() {
                                _this.circleSelectElm(section, isCircle,e);
                            }, 0);
                            _this.isCircling = false;
                        }

                        if (isMove && !isCircle) isMove = false, $(document).trigger("appSetCatch");
                    });
                })
                //wqdGroup
            $(document).on('click.wqdGroup', 'div.wqdGroup', function() {
                    var node = $(this);
                    $('div.wqdGroup').removeClass('wqdGroupmove');
                    if($(this).parents(".elementsContainer").length>1 &&$("body").attr("data-carouseediting")!="true") {
                        return;
                    }
                    $(this).addClass('wqdGroupmove');
                    $('.yzmoveContent').removeClass('yzmoveContentBor');
                    $(this).parents('.yzmoveContent').addClass('yzmoveContentBor');
                    if (_this.keyStatus && _this.onEditing.length) {
                        $('.elementToolbar').remove();
                        _ut.elementtToolBar({
                            element: $(this),
                            toolbarBtn: [{
                                identClass: "dogroup",
                                btnCss: {},
                                text: "群组",
                                onclick: function() {
                                    _this.join(node.parents('div[data-type=wqdSectiondiv]'), node);
                                }
                            }]
                        });
                    }
                    _el.setResizeUI(node);
                })
                //撤销组合
            $(document).on('keyup', function(event) {
                if (event.keyCode == 17 || event.keyCode==91) {
                    _this.keyStatus = false;
                }
                if (event.keyCode == 67) {
                    _this.downC = false;
                }
                if (event.keyCode == 86) {
                    _this.downV = false;
                }
            });
            $(document).on("disjoin", function(e, data) {
                    var f = data.node,
                        bf = null,
                        onEditing, elems;
                    _this.onEditing.length = _this.existGroupArray.length = 0;
                    if (f.children('.wqdelementEditBox').length) {
                        elems = f.children('.wqdelementEditBox').children('div.wqdelementEdit').sort(function(a, b) {
                            return $(a).attr("data-zindex") - $(b).attr("data-zindex");
                        });
                    } else {
                        elems = f.children('div.wqdelementEdit').sort(function(a, b) {
                            return $(a).attr("data-zindex") - $(b).attr("data-zindex");
                        });
                    }
                    var selector = '.item.active .bannerContainer,form.wqd-form,.wqdSecondNav,.freeContainerTwo .elemContBox,.freeContainerOne .elemContBox,.groupContainerTwo .elemContBox,.groupContainerOne .elemContBox,.hoverContainer .wqdelementEditBox';
                    bf = $('body').attr('data-carouseediting') == 'true' ? $('.wqd-carouseOverlay').find(selector).eq(0) : f.parents('div[data-type=wqdSectiondiv]').children('.sectionV2');
                    for (var i = 0; i < elems.length; i++) {
                        onEditing = {
                            'element': $(elems[i]),
                            'parent': bf,
                            'left': parseFloat($(elems[i]).css('left')),
                            'top': parseFloat($(elems[i]).css('top')),
                            'width': $(elems[i]).outerWidth(),
                            'height': $(elems[i]).outerHeight(),
                            'group': 'disjoin',
                            'groupleft': parseFloat(f.css('left')),
                            'grouptop': parseFloat(f.css('top'))
                        };
                        _this.onEditing.push(onEditing);
                        bf.append($(elems[i]));
                        _el.setNewPosition(onEditing);
                    }
                    f.remove();
                    _this.onEditing.length = _this.existGroupArray.length = 0;
                    $('.elementToolbar').remove();
                    $(document).trigger("appSetCatch");
                })
                //点击元素后判断最大left top值
            $(document).on('click', '.wqdelementEdit', function() {
                var sectionDiv = $(this).parents('div[data-type=wqdSectiondiv]'),
                    isNodeExit = false,
                    parent = $(this).parents('.wqdGroup[data-elemandgroup]'),
                    iselementsContainer = false;
                //_this.existGroupArray.length = 0;
                //非修改模式下不能选中容器中
                var $parContainer = $(this).parents(".wqdelementEdit.elementsContainer");
                if($parContainer.length && $parContainer.filter("[data-elementtype=carouse]").length) {
                    return;
                }
                $('#wqdcircleSelectos').remove();
                $('.yzmoveContent').removeClass('yzmoveContentBor');
                $(this).parents('.yzmoveContent').addClass('yzmoveContentBor');
                if (sectionDiv.attr('partcategoryid') == 21) {
                    $('.tool-list2').attr('partid', sectionDiv.attr('partid')).attr('isheader', true);
                } else {
                    $('.tool-list2').attr('partid', sectionDiv.attr('partid')).attr('isheader', false);
                }
                if (!_this.keyStatus) {
                    _this.maxTop = _this.maxLeft = _this.onEditing.length = _this.existGroupArray.length = 0;
                }
                $(this).parents('div.wqdGroup').addClass('wqdGroupmove wqdselected');
                if (($('body').attr('data-carouseediting') || !parent.length) && !$(this).hasClass('wqdGroup') && $(this).attr('data-elementtype') != 'groupContainer' && $(this).attr('data-elementtype') != 'secondNav' && !$(this).closest('div[data-elementtype=articleLists]').length) {
                    iselementsContainer = true;
                } else if ($(this).attr('data-elementtype') != 'groupContainer' && $(this).attr('data-elementtype') != 'secondNav' && !$(this).closest('div[data-elementtype=articleLists]').length) {
                    if (_this.existGroupArray.length) {
                        for (i = 0; i < _this.existGroupArray.length; i++) {
                            if (_this.existGroupArray[i].elem.attr('id') != $(this).attr('id')) {
                                _this.existGroupArray.push({
                                    'elem': $(this),
                                    "inf": {}
                                });
                            }
                        }
                    } else {
                        _this.existGroupArray.push({
                            'elem': $(this),
                            "inf": {}
                        });
                    }
                }
                if (iselementsContainer && !_this.keyStatus) {
                    if (_this.onEditing.length) {
                        _this.onEditing[0].elem.removeClass('onGrouping');
                    }
                    $('.wqdGroup').removeClass('wqdGroupmove');

                    _this.onEditing[0] = {
                        'elem': $(this).addClass('onGrouping'),
                        'inf': {}
                    };
                }
                //每次点击以后进入一个数组
                if (_this.keyStatus) {
                    var node = $(this).hasClass('elementsContainer') ? $(this) : $(this).addClass('onGrouping');
                    if ($('.wqdGroupmove').length == 1 && ($('.wqdGroupmove').parents('.wqdSectiondiv').attr('partid') != node.parents('.wqdSectiondiv').attr('partid'))) {
                        return;
                    }
                    if ($(this).attr('data-elementtype') == 'firstNav' || $(this).find('.wqdPhoneNavBtn').length) {
                        return;
                    }
                    if (_this.onEditing.length && (node.parents('.wqdSectiondiv').attr('partid') != _this.onEditing[0].elem.parents('.wqdSectiondiv').attr('partid'))) {
                        return;
                    }
                    if(/artList|article/g.test($(this).attr("class"))) {
                        return;
                    }
                    for (i = 0; i < _this.onEditing.length; i++) {
                        if (_this.onEditing[i].elem.attr('id') == node.attr('id')) {
                            isNodeExit = true;
                        }
                    }
                    if (!isNodeExit && iselementsContainer) {
                        _this.onEditing.push({
                            'elem': node,
                            'inf': {}
                        });
                    }
                    var $elmArray = _this.onEditing.concat(_this.existGroupArray);
                    var tagButtonStr = $.map(_this.onEditing,function(v,i) {
                        return v.elem.hasClass("artlTagButton")
                    }).join("");
                    var mixingTagButton = tagButtonStr.indexOf("true") != -1 && tagButtonStr.indexOf("false") != -1;
                    var isAllTag = tagButtonStr.indexOf("true") != -1 && tagButtonStr.indexOf("false") == -1;
                    if(mixingTagButton){
                        return;
                    }
                    // 当有ctrl时候 产生组的按钮
                    if (_this.existGroupArray.length > 1 || isAllTag) {
                        var toolbarConfig = {
                            element: $(this),
                            toolbarBtn: [{
                                identClass: "align",
                                btnCss: {},
                                text: "对齐",
                                desc: "当前分组内元素对齐方式",
                                context: {
                                    list: [{
                                        identClass: "alignCenter",
                                        text: "水平对齐",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择对齐方式
                                            _ea.selectAlign($elm, "alignCenter", $elmArray);
                                        }
                                    }, {
                                        identClass: "alignMiddle",
                                        text: "垂直对齐",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择对齐方式
                                            _ea.selectAlign($elm, "alignMiddle", $elmArray);
                                        }
                                    }, {
                                        identClass: "alignTop",
                                        text: "上对齐",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择对齐方式
                                            _ea.selectAlign($elm, "alignTop", $elmArray);
                                        }
                                    }, {
                                        identClass: "alignLeft",
                                        text: "左对齐",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择对齐方式
                                            _ea.selectAlign($elm, "alignLeft", $elmArray);
                                        }
                                    }, {
                                        identClass: "alignBottom",
                                        text: "下对齐",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择对齐方式
                                            _ea.selectAlign($elm, "alignBottom", $elmArray);
                                        }
                                    }, {
                                        identClass: "alignRight",
                                        text: "右对齐",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择对齐方式
                                            _ea.selectAlign($elm, "alignRight", $elmArray);
                                        }
                                    }]
                                }
                            }, {
                                identClass: "distribute",
                                btnCss: {},
                                text: "分布",
                                desc: "当前分组内元素分布方式",
                                context: {
                                    list: [{
                                        identClass: "distributeHorizontally",
                                        text: "水平分布",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择分布方式
                                            _ed.selectDistribute($elm, "distributeHorizontally", $elmArray);
                                        }
                                    }, {
                                        identClass: "distributeVertically",
                                        text: "垂直分布",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择分布方式
                                            _ed.selectDistribute($elm, "distributeVertically", $elmArray);
                                        }
                                    }]
                                }
                            }]
                        };
                        _ut.elementtToolBar(toolbarConfig);
                    } else if ((_this.existGroupArray.length == 0 && _this.onEditing.length > 1) || (_this.existGroupArray.length == 1 && _this.onEditing.length >= 1) ) {
                        var toolbarConfig = {
                            element: $(this),
                            toolbarBtn: [{
                                identClass: "dogroup",
                                btnCss: {},
                                text: "群组",
                                onclick: function() {
                                    _this.join(sectionDiv, _this.existGroupArray[0] ? _this.existGroupArray[0].elem : []);
                                }
                            }, {
                                identClass: "align",
                                btnCss: {},
                                text: "对齐",
                                desc: "当前分组内元素对齐方式",
                                context: {
                                    list: [{
                                        identClass: "alignCenter",
                                        text: "水平对齐",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择对齐方式
                                            _ea.selectAlign($elm, "alignCenter", $elmArray);
                                        }
                                    }, {
                                        identClass: "alignMiddle",
                                        text: "垂直对齐",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择对齐方式
                                            _ea.selectAlign($elm, "alignMiddle", $elmArray);
                                        }
                                    }, {
                                        identClass: "alignTop",
                                        text: "上对齐",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择对齐方式
                                            _ea.selectAlign($elm, "alignTop", $elmArray);
                                        }
                                    }, {
                                        identClass: "alignLeft",
                                        text: "左对齐",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择对齐方式
                                            _ea.selectAlign($elm, "alignLeft", $elmArray);
                                        }
                                    }, {
                                        identClass: "alignBottom",
                                        text: "下对齐",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择对齐方式
                                            _ea.selectAlign($elm, "alignBottom", $elmArray);
                                        }
                                    }, {
                                        identClass: "alignRight",
                                        text: "右对齐",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择对齐方式
                                            _ea.selectAlign($elm, "alignRight", $elmArray);
                                        }
                                    }]
                                }
                            }, {
                                identClass: "distribute",
                                btnCss: {},
                                text: "分布",
                                desc: "当前分组内元素分布方式",
                                context: {
                                    list: [{
                                        identClass: "distributeHorizontally",
                                        text: "水平分布",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择分布方式
                                            _ed.selectDistribute($elm, "distributeHorizontally", $elmArray);
                                        }
                                    }, {
                                        identClass: "distributeVertically",
                                        text: "垂直分布",
                                        autohide: true,
                                        onclick: function(e, $elm) {
                                            //选择分布方式
                                            _ed.selectDistribute($elm, "distributeVertically", $elmArray);
                                        }
                                    }]
                                }
                            }]
                        };
                        _ut.elementtToolBar(toolbarConfig);
                    }
                }
            });
        }
        //圈选移动
    elementGroup.moveCircleLimit = function(circle, node, parent, x, y) {
            var circleTop = parseFloat(circle.css('top')),
                circleLeft = parseFloat(circle.css('left')),
                circleHeight = circle.height(),
                circleWidth = circle.width(),
                css = {};
            if (circleTop <= 0) {
                circle.css({
                    'top': 0
                });
                css = false;
            } else if (circleLeft <= 0) {
                circle.css({
                    'left': 0
                });
                css = false;
            } else if (circleTop + circle.height() >= parent.height()) {
                circle.css({
                    'top': parent.height() - circle.height() + 'px'
                });
                css = false;
            } else if (circleLeft + circle.width() >= parent.width()) {
                circle.css({
                    'left': parent.width() - circle.width() + 'px'
                });
                css = false;
            } else {
                css = {
                    'element': node.elem,
                    'parent': parent,
                    'left': node.inf.left + x,
                    'top': node.inf.top + y
                };
            }
            return css;
        }
        //圈选 选择元素
    elementGroup.circleSelectElm = function(section, iscircle,e) {
            var circleNode = $('#wqdcircleSelectos'),
                x1 = parseFloat(circleNode.css('left')),
                x2 = x1 + circleNode.width(),
                y1 = parseFloat(circleNode.css('top')),
                y2 = y1 + circleNode.height(),
                _this = this,
                array;
            section.children('.wqdelementEdit').each(function(i) {
                var nodeX = parseFloat($(this).css('left')),
                    nodeY = parseFloat($(this).css('top')),
                    nodeX2 = nodeX + $(this).width(),
                    nodeY2 = nodeY + $(this).height();
                if (x1 <= nodeX && x2 >= nodeX2 && y1 <= nodeY && y2 >= nodeY2) {
                    if ($(this).hasClass('wqdGroup')) {
                        _this.existGroupArray.push({
                            'elem': $(this),
                            "inf": {
                                'left': parseFloat($(this).css('left')),
                                'top': parseFloat($(this).css('top'))
                            }
                        });
                    } else {
                        if ($(this).attr('data-elementtype') != 'groupContainer') _this.onEditing.push({
                            'elem': $(this).addClass('onGrouping'),
                            'inf': {
                                'left': parseFloat($(this).css('left')),
                                'top': parseFloat($(this).css('top'))
                            }
                        });
                    }
                }
            });
            this.maxVal();
            if (iscircle) circleNode.css({
                'left': this.minLeft + 'px',
                'top': this.minTop + 'px',
                'width': this.maxWidth - this.minLeft + 'px',
                'height': this.maxHeight - this.minTop + 'px'
            });
            array = this.onEditing.concat(this.existGroupArray);
            if (array.length > 1 && this.existGroupArray.length < 2) {
                var toolbarConfig = {
                    element: $('#wqdcircleSelectos'),
                    toolbarBtn: [{
                        identClass: "dogroup",
                        btnCss: {},
                        text: "群组",
                        onclick: function() {
                            _this.join(section.closest('div[data-type=wqdSectiondiv]'), _this.existGroupArray[0] ? _this.existGroupArray[0].elem : []);
                        }
                    }, {
                        identClass: "align",
                        btnCss: {},
                        text: "对齐",
                        desc: "当前分组内元素对齐方式",
                        context: {
                            list: [{
                                identClass: "alignCenter",
                                text: "水平对齐",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择对齐方式
                                    _ea.selectAlign($elm, "alignCenter", array);
                                }
                            }, {
                                identClass: "alignMiddle",
                                text: "垂直对齐",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择对齐方式
                                    _ea.selectAlign($elm, "alignMiddle", array);
                                }
                            }, {
                                identClass: "alignTop",
                                text: "上对齐",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择对齐方式
                                    _ea.selectAlign($elm, "alignTop", array);
                                }
                            }, {
                                identClass: "alignLeft",
                                text: "左对齐",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择对齐方式
                                    _ea.selectAlign($elm, "alignLeft", array);
                                }
                            }, {
                                identClass: "alignBottom",
                                text: "下对齐",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择对齐方式
                                    _ea.selectAlign($elm, "alignBottom", array);
                                }
                            }, {
                                identClass: "alignRight",
                                text: "右对齐",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择对齐方式
                                    _ea.selectAlign($elm, "alignRight", array);
                                }
                            }]
                        }
                    }, {
                        identClass: "distribute",
                        btnCss: {},
                        text: "分布",
                        desc: "当前分组内元素分布方式",
                        context: {
                            list: [{
                                identClass: "distributeHorizontally",
                                text: "水平分布",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择分布方式
                                    _ed.selectDistribute($elm, "distributeHorizontally", array);
                                }
                            }, {
                                identClass: "distributeVertically",
                                text: "垂直分布",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择分布方式
                                    _ed.selectDistribute($elm, "distributeVertically", array);
                                }
                            }]
                        }
                    }]
                };
                _ut.elementtToolBar(toolbarConfig);
            } else if (array.length == 1) {
                circleNode.remove();
                // _el.setResizeUI(array[0].elem);
                var event = $.Event("click",{
                    clientX:e.clientX,
                    clientY:e.clientY
                });
                array[0].elem.trigger(event);
                _this.clearData();
            } else if (this.existGroupArray.length > 1) {
                var toolbarConfig = {
                    element: $('#wqdcircleSelectos'),
                    toolbarBtn: [{
                        identClass: "align",
                        btnCss: {},
                        text: "对齐",
                        desc: "当前分组内元素对齐方式",
                        context: {
                            list: [{
                                identClass: "alignCenter",
                                text: "水平对齐",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择对齐方式
                                    _ea.selectAlign($elm, "alignCenter", array);
                                }
                            }, {
                                identClass: "alignMiddle",
                                text: "垂直对齐",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择对齐方式
                                    _ea.selectAlign($elm, "alignMiddle", array);
                                }
                            }, {
                                identClass: "alignTop",
                                text: "上对齐",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择对齐方式
                                    _ea.selectAlign($elm, "alignTop", array);
                                }
                            }, {
                                identClass: "alignLeft",
                                text: "左对齐",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择对齐方式
                                    _ea.selectAlign($elm, "alignLeft", array);
                                }
                            }, {
                                identClass: "alignBottom",
                                text: "下对齐",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择对齐方式
                                    _ea.selectAlign($elm, "alignBottom", array);
                                }
                            }, {
                                identClass: "alignRight",
                                text: "右对齐",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择对齐方式
                                    _ea.selectAlign($elm, "alignRight", array);
                                }
                            }]
                        }
                    }, {
                        identClass: "distribute",
                        btnCss: {},
                        text: "分布",
                        desc: "当前分组内元素分布方式",
                        context: {
                            list: [{
                                identClass: "distributeHorizontally",
                                text: "水平分布",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择分布方式
                                    _ed.selectDistribute($elm, "distributeHorizontally", array);
                                }
                            }, {
                                identClass: "distributeVertically",
                                text: "垂直分布",
                                autohide: true,
                                onclick: function(e, $elm) {
                                    //选择分布方式
                                    _ed.selectDistribute($elm, "distributeVertically", array);
                                }
                            }]
                        }
                    }]
                };
                _ut.elementtToolBar(toolbarConfig);
            }
        }
        //取得极值
    elementGroup.maxVal = function() {
            var l = t = 999999999,
                w = h = 0,
                group = $('.wqdGroupmove'),
                array = this.onEditing.concat(this.existGroupArray);
            //循环 出最大的 left top
            for (i = 0; i < array.length; i++) {
                var el = et = 0,
                    node = array[i].elem;
                array[i].inf = {
                    'left': parseFloat(node.css('left')),
                    'top': parseFloat(node.css('top')),
                    'width': node.outerWidth(),
                    'height': node.outerHeight()
                };
                el = array[i].inf.left;
                et = array[i].inf.top;
                w = el + array[i].inf.width;
                h = et + array[i].inf.height;
                if (l > el) {
                    this.minLeft = l = el;
                    this.minLeftObj = array[i].elem;
                }
                if (t > et) {
                    this.minTop = t = et;
                    this.minTopObj = array[i].elem;
                }
                if (w > this.maxWidth) this.maxWidth = w;
                if (h > this.maxHeight) this.maxHeight = h;
            }
        }
        //合组
    elementGroup.join = function(section, existGroup) {
        var i = 0,
            _this = this,
            group = groupId = null,
            f = $('.wqd-carouseOverlay').find('.item.active .bannerContainer,form.wqd-form,.wqdSecondNav,.freeContainerTwo .elemContBox,.freeContainerOne .elemContBox,.groupContainerTwo.insideShow .elemContBox,.groupContainerOne .elemContBox,.hoverContainer .wqdelementEditBox').eq(0);
        this.maxVal();
        if (!existGroup.length) {
            groupId = _ut.creatID('groupId');
            group = $('<div class="wqdelementEdit wqdselected wqdGroup wqdGroupmove elementsContainer" data-groupstatus="off" data-elemandgroup="true" groupId=' + groupId + ' id=' + groupId + '><div class="wqdelementEditBox"></div></div>');
            $('body').attr('data-carouseediting') == 'true' ? f.append(group) : section.children('.sectionV2').append(group);
        } else {
            group = existGroup;
            group.addClass('wqdselected').find('div.wqdelementEdit').each(function() {
                _this.onEditing.push({
                    'elem': $(this),
                    'inf': {
                        'left': parseFloat($(this).css('left')),
                        'top': parseFloat($(this).css('top')),
                        'width': $(this).outerWidth(),
                        'height': $(this).outerHeight(),
                        'isexist': true
                    }
                });
            });
        }
        group.css({
            'height': this.maxHeight - this.minTop + 'px',
            'width': this.maxWidth - this.minLeft + 'px',
            'left': this.minLeft + 'px',
            'top': this.minTop + 'px'
        });
        for (; i < this.onEditing.length; i++) {
            var data = this.onEditing[i],
                clone = null;
            if (data.inf.isexist && group.length) {
                clone = data.elem;
                _el.setNewPosition({
                    'element': clone,
                    'parent': section.children('.sectionV2'),
                    'left': data.inf.left,
                    'top': data.inf.top,
                    'width': data.inf.width,
                    'height': data.inf.height
                });
            } else {
                clone = data.elem;
                group.children('.wqdelementEditBox').append(clone);
                _el.setNewPosition({
                    'element': clone,
                    'parent': section.children('.sectionV2'),
                    'left': data.inf.left,
                    'top': data.inf.top,
                    'width': data.inf.width,
                    'height': data.inf.height,
                    'group': 'join'
                });
            }
        }
        $('.elementToolbar').remove();
        $('#wqdcircleSelectos').remove();
        _el.setNewPosition({
            'element': group,
            'parent': section.children('.sectionV2'),
            'left': parseFloat(group.css('left')),
            'top': parseFloat(group.css('top')),
            'width': group.outerWidth(),
            'height': group.outerHeight(),
            'group': 'joinGroup'
        });
        _el.setResizeUI(group);
        this.clearData();
    }
    elementGroup.clearData = function() {
            this.existGroupArray.length = this.onEditing.length = this.minLeft = this.minTop = this.maxHeight = this.maxWidth = 0;
            this.minLeftObj = this.minTopObj = null;
        }
        //清除复制
    elementGroup.clearCopy = function() {
            this.copyCont = {
                'elem': [],
                'style': {},
                'parent': null
            };
        }
        //复制元素  wqdGroup
    elementGroup.copyEG = function(arg) {
        var node = !arg.element ? ((arg instanceof $) ? arg : $(arg)) : $(arg.element),
            _this = this;
        if (!node.length || node.attr('data-unused') != undefined && node.attr('data-unused').indexOf('copy') != -1 || node.attr('data-elementtype') == 'groupContainer') return;
        node.find('.wqdCarousel').data("Wqdcarousel", "");
        this.copyCont = {
            'elem': [],
            'style': {},
            'parent': null
        };
        this.num = 0;
        if (node.attr('data-elementtype') == 'carouse') {
            node.find('.item').removeClass('prev next left right');
            this.copyElm(node, false);
            node.find('.item').find('.wqdelementEdit').each(function() {
                _this.copyElm($(this), true);
            });
        } else if (node.hasClass('wqdGroup') || node.attr('data-elementtype').match(/(form)|(wqdTable)/)) {
            this.copyElm(node, false);
            node.find('.wqdelementEdit').each(function() {
                _this.copyElm($(this), true);
            });
        } else {
            this.copyElm(node, false);
        }
        $(document).trigger("copied");
        $('.elementToolbar').remove();
    }
    elementGroup.copyElm = function($old, isMore) {
        var id = $old.attr('id');
        this.copyCont.style[id] = $('style.' + id).clone();
        if (!isMore) this.copyCont.elem.push($old.clone(true));
        if ($old.closest('.wqdGroup').length) this.copyCont.parent = $old.closest('.wqdGroup');
    }
        //粘贴元素
    elementGroup.pasteEG = function() {
            var partid = $('li.tool-list2').attr('partid'),
                copyCont = null,
                f = null,
                elementid = _ut.creatID('elementid'),
                groupId = _ut.creatID('groupId'),
                cloneStyle = null,
                conleElm = null,
                targetParent = this.copyCont.parent;
            changeCss = $.proxy(this.changeStyle, this),
                changeRelate = $.proxy(this.changeRelate, this);
            copyCont = this.copyCont.elem.length ? this.copyCont.elem : null;
            if (copyCont == null) return;
            f = $('body').attr('data-carouseediting') == 'true' ? $('.wqd-carouseOverlay').find('.item.active .bannerContainer,form.wqd-form,.wqdSecondNav,.artListContainer,.containerWarp') : $('.yzmoveContentBor').find('.sectionV2');
            $('.onGrouping,.wqdGroupmove').removeClass('onGrouping wqdselected wqdGroupmove');
            this.num++;
            if (copyCont[0].length == 1 && copyCont[0].hasClass('wqdGroup')) {
                conleElm = copyCont[0].clone(true);
                changeCss(conleElm, groupId);
                conleElm.attr('groupid', groupId).attr('id', groupId).find('div.wqdelementEdit').each(function(i) {
                    changeCss($(this), elementid + i);
                    changeRelate($(this), elementid + i);
                    $(this).attr('elementid', elementid + i).attr('id', elementid + i);
                });
                f.append(conleElm);
                _el.setNewPosition({
                    'element': conleElm,
                    'isAdd': true,
                    'parent': f,
                    'left': parseFloat(conleElm.css('left')) + 8 * this.num,
                    'top': parseFloat(conleElm.css('top')) + 8 * this.num,
                    'width': parseFloat(conleElm[0].style.width),
                    'height': parseFloat(conleElm[0].style.height)
                });
            } else if (copyCont[0].length == 1 && copyCont[0].attr('data-elementtype').match(/(carouse)|(form)|(map)|(wqdTable)/)) {
                conleElm = copyCont[0].clone(true);
                changeCss(conleElm, elementid);
                changeRelate(conleElm, elementid);
                conleElm.attr('elementid', elementid).attr('id', elementid).find('div.wqdelementEdit').each(function(i) {
                    changeCss($(this), elementid + i);
                    changeRelate($(this), elementid + i);
                    $(this).attr('elementid', elementid + i).attr('id', elementid + i);
                });
                f.append(conleElm);
                _el.setNewPosition({
                    'element': conleElm,
                    'isAdd': true,
                    'parent': f,
                    'left': parseFloat(conleElm.css('left')) + 8 * this.num,
                    'top': parseFloat(conleElm.css('top')) + 8 * this.num,
                    'width': parseFloat(conleElm[0].style.width),
                    'height': parseFloat(conleElm[0].style.height)
                });
            } else {
                for (i = 0; i < copyCont.length; i++) {
                    var newID = elementid + i;
                    conleElm = copyCont[i].clone(true);
                    changeCss(conleElm, newID);
                    changeRelate(conleElm, newID);
                    conleElm.attr('elementid', newID).attr('id', newID);
                    if (targetParent && targetParent.length) f = targetParent;
                    f.append(conleElm);
                    _el.setNewPosition({
                        'element': conleElm,
                        'isAdd': true,
                        'parent': f,
                        'left': parseFloat(conleElm.css('left')) + 8 * this.num,
                        'top': parseFloat(conleElm.css('top')) + 8 * this.num,
                        'width': parseFloat(conleElm[0].style.width),
                        'height': parseFloat(conleElm[0].style.height)
                    });
                }
            }
            conleElm.addClass('wqdselected').siblings('.wqdelementEdit').removeClass('wqdselected');
            _el.setResizeUI(conleElm);
            $(document).trigger("appSetCatch");
        }
        //改变动画相关的ID
    elementGroup.changeRelate = function(node, newid) {
            if (node.attr('triggerelem')) {
                var m = node.attr('triggerelem').replace(new RegExp(node.attr('id'), 'gi'), newid);
                node.attr('triggerelem', m);
            }
        }
        //改变元素的样式
    elementGroup.changeStyle = function(copyCont, newid) {
        var oldelemid = copyCont.attr('id'),
            o = $('style.' + oldelemid),
            section = null,
            elementsContainer = $('#' + $('#' + oldelemid).parents('.elementsContainer[data-elementtype]').attr('id'));
        cloneStyle = this.copyCont.style[oldelemid].length ? this.copyCont.style[oldelemid].clone() : null;
        if (cloneStyle) {
            cloneStyle.removeClass().addClass(newid);
            cloneStyle.html(cloneStyle.html().replace(new RegExp(oldelemid, 'gi'), newid));
            section = $('.yzmoveContentBor').find('.sectionV2').length ? $('.yzmoveContentBor').find('.sectionV2') : elementsContainer.parents('.sectionV2');
            section.before(cloneStyle);
        }
    }
    return elementGroup;
});
