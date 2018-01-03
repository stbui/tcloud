/**
 * Created by user on 2016/5/05.
 */


define(['elementInfo','utility','popupEdit'],function(_ei,utility,popupEdit) {
    var progressBar = {};
    progressBar.init = function () {
        this.bindEdit(".wqdelementEdit");
        this.bindEvent();
    };
    //进度条的控件操作
    progressBar.bindEdit = function (elm) {
        var self = this;
        $(document).on("elmenentEdit",function (e,data) {
            var $node = data.element || $(".wqdelementEdit.onEditing");
            if($node.attr("data-elementtype") == "progressBar") {
                setTimeout(function(){
                    _ei.removeElementEditBtn();
                    window.edit = $node;
                    $.ajax({
                        url: '../js/app/JSON/component/designComponentProgress.json',
                        type: "GET",
                        dataType: "json",
                        success: function(json) {
                            $.colorbox({
                                transition:"none",
                                opacity:0.5,
                                html:json.edit.progressbar,
                                fixed:true,
                                closeButton:false,
                                onOpen:function(){
                                    window.scroll_top = $(document).scrollTop();
                                },
                                onComplete:function(){
                                    var obj = window.edit;
                                    var $proStart=obj.find(".pro-start");
                                    var $proEnd=obj.find(".pro-end");
                                    //进度条基础控件 基础开始
                                    $(".pro-submit").each(function (i) {
                                        $(this).attr("pro-bar",i+1)
                                    });
                                    //输入框输入关联

                                    var proEdit={};
                                    proEdit.proInput=function(newVal,startV){
                                        if($(this).attr("pro-bar")==1){
                                            obj.find(".wqdproc").width(newVal);
                                            $proStart.css("left",newVal-10+"px");
                                            obj.attr("wqdPros_width",newVal);
                                        };
                                        if($(this).attr("pro-bar")==2){
                                            $proEnd.css("left",newVal-10+"px");
                                            obj.attr("wqdProe_width",newVal);
                                        };
                                        if($(this).attr("pro-bar")==3){
                                            obj.width(newVal+2);
                                            obj.attr("wqdProf_width",newVal);
                                        };
                                        if($(this).attr("pro-bar")==4){
                                            $proEnd.parents(".progunveil").height(newVal+2);
                                            obj.attr("wqdProf_height",newVal);
                                        }
                                        $(document).trigger("appSetCatch");
                                    };

                                    //pro-bar设计器基础设置
                                    proEdit.base= function () {
                                        //pro-bar宽高
                                        function _proVal(x){
                                            return parseFloat($("[pro-bar="+x+"]").val())
                                        }
                                        $(".pro-submit").on("blur.bar", function () {
                                            var newVal=parseInt($(this).val(),10);
                                            newVal = /\D/g.test(newVal)?0:newVal>=2000?2000:newVal;
                                            var _probar=parseFloat($(this).attr("pro-bar"));
                                            var endV;
                                            if (_probar==1||_probar==2) {
                                                endV = _proVal(3);
                                                newVal = newVal >= endV ? endV : newVal;
                                            }
                                            if (_probar == 3) {
                                                endV = _proVal(2) > _proVal(1) ? _proVal(2) : _proVal(1);
                                                newVal = newVal <= endV ? endV : newVal;
                                            }
                                            $(this).val(newVal);
                                            proEdit.proInput.call(this,newVal);
                                        }).on("keydown.bar", function (event) {
                                            event.stopPropagation();
                                            var newVal=parseInt($(this).val())||0;
                                            var _probar=parseFloat($(this).attr("pro-bar"));
                                            var endV;
                                            if(event.keyCode==38){
                                                newVal++;
                                                if(_probar==1||_probar==2){
                                                    endV=_proVal(3);
                                                    newVal=newVal>=endV?endV:newVal;
                                                }
                                            }else if(event.keyCode==40){
                                                if(parseInt($(this).val())==0) return;
                                                newVal--;
                                                if (_probar == 3) {
                                                    endV = _proVal(2) > _proVal(1) ? _proVal(2) : _proVal(1);
                                                    newVal = newVal <= endV ? endV : newVal;
                                                }
                                                if( newVal <0){
                                                    newVal = 0;
                                                    return;
                                                }
                                            }else if(event.keyCode==13){
                                                $(this).trigger("blur.bar");
                                                return
                                            }else{
                                                return
                                            }
                                            $(this).val(newVal);
                                            proEdit.proInput.call(this,newVal);
                                        });

                                        //pro-bar基础回显
                                        //开始宽度
                                        var $proc = obj.find(".wqdproc");
                                        var _barStartW=obj.attr("wqdPros_width")||$proc.width();
                                        if(_barStartW){
                                            $(".wqdEditBox").find(".pro-submit").eq(0).val(_barStartW);
                                        }
                                        //结束宽度

                                        var _barEndW=obj.attr("wqdProe_width")||220;
                                        if(_barEndW){
                                            $(".wqdEditBox").find(".pro-submit").eq(1).val(_barEndW);
                                        }

                                        //固定宽度
                                        var _barFixW=obj.attr("wqdProf_width")||obj.width()-2;
                                        if(_barFixW){
                                            $(".wqdEditBox").find(".pro-submit").eq(2).val(_barFixW);
                                        }
                                        //固定高度
                                        var _barHeight=obj.attr("wqdProf_height")||$proc.height();
                                        if(_barHeight){
                                            $(".wqdEditBox").find(".pro-submit").eq(3).val(_barHeight);
                                        }
                                        //颜色
                                        var _proColor=obj.attr("wqd-procolor")||$proc.css("background-color");
                                        if(_proColor){
                                            $(".wqdEditBox").find(".colorval").eq(0).val(_proColor).end().end().find(".colordevice").eq(0).css("background-color", _proColor);
                                        }
                                        //背景
                                        var _bgColor=obj.attr("wqd-bgcolor")||obj.find(".wqdprop").css("background-color");
                                        if(_bgColor){
                                            $(".wqdEditBox").find(".colorval").eq(1).val(_bgColor).end().end().find(".colordevice").eq(1).css("background-color", _bgColor);
                                        }
                                        //边框
                                        var _bodcolor=obj.attr("wqd-bodcolor")||$proc.css("background-color");
                                        if(_bodcolor){
                                            $(".wqdEditBox").find(".colorval").eq(2).val(_bodcolor).end().end().find(".colordevice").eq(2).css("background-color", _bodcolor);
                                        }

                                        //pro-bar其他
                                        //borderradius的回显
                                        var $proFoot2=$(".wqdEditBox .pro-radio");
                                        var _borderR=obj.attr("wqdborderradius")||parseFloat(obj.find(".wqdprop").css('border-top-left-radius'));
                                        if (_borderR)barCallback($proFoot2,_borderR,50);
                                        //动画时长
                                        var $proDuration=$(".wqdEditBox .pro-duration");
                                        var _animateDr= obj.attr("wqdPro-duration");
                                        if(parseFloat(_animateDr)>5)barCallback($proDuration,5,5,parseFloat(_animateDr));
                                        if(parseFloat(_animateDr)<=5)barCallback($proDuration,parseFloat(_animateDr),5);
                                        if(!_animateDr)barCallback($proDuration,1,5);
                                        //动画延迟
                                        var $proDlay=$(".wqdEditBox .pro-delay");
                                        var _animateDl=obj.attr("wqdPro-delay");
                                        if(parseFloat(_animateDl)>5)barCallback($proDlay,5,5,parseFloat(_animateDl));
                                        if(parseFloat(_animateDl)<=5)barCallback($proDlay,parseFloat(_animateDl),5);
                                        if(!_animateDl)barCallback($proDlay,0,5);
                                        function barCallback(ele,scale,size,_scale){
                                            ele.find(".r_val").val(_scale||scale);
                                            ele.find(".slider").css("left", scale *ele.find(".scale").width() / size);
                                            ele.find(".moment").css("width", scale*ele.find(".scale").width() / size);
                                        }

                                        //pro-bar基础颜色设置
                                        $(".colorval").each(function (i) {
                                            $(this).attr("pro-cercal",i+1)
                                        });
                                        $(".wqdColorPicker").on("changeColor", function() {
                                            var colorVal = $(this).val();
                                            var _procercal=$(this).attr("pro-cercal");
                                            if(_procercal==1){
                                                $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
                                                obj.find(".wqdproc").css("background-color",colorVal);
                                                obj.attr("wqd-procolor",colorVal);
                                            } if(_procercal==2){
                                                $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
                                                obj.find(".wqdprop").css("background-color",colorVal);
                                                obj.attr("wqd-bgcolor",colorVal);
                                            } if(_procercal==3){
                                                $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
                                                obj.find(".wqdprop").css("border-color",colorVal);
                                                obj.attr("wqd-bodcolor",colorVal);
                                            }

                                            $(document).trigger('appSetCatch');
                                        });


                                        //播放动画

                                        if(obj.attr("move")=="moving"){
                                            $(".pro-submit").each(function (i) {
                                                if(i<=1)$(this).attr( "disabled","disabled")
                                            });
                                        }

                                        var _flag=true;
                                        $(".pro-barbtn").off("click.transmit").on("click.transmit", function (e) {
                                            if(!_flag)return;
                                            _flag=false;
                                            obj.attr("move","moving");
                                            var $proc = obj.find(".wqdproc");
                                            var _animateDr= parseFloat(obj.attr("wqdPro-duration")||1);
                                            var _animateDl=parseFloat(obj.attr("wqdPro-delay")||0);
                                            var startSite=$proc.width();
                                            var endSite=obj.attr("wqdProe_width")||220;
                                            if(parseFloat(startSite)==parseFloat(endSite)){
                                                _flag=true;
                                                return;
                                            }
                                            $(".pro-submit").each(function (i) {
                                                if(i<=1)$(this).attr( "disabled","disabled")
                                            });
                                            var prefixCss= function(_ele, _cssName, _cssValue) {
                                                function polishingCss(_cssName) {
                                                    var endCss = {};
                                                    $.each(_cssName, function (i, _) {
                                                        $.each(["-webkit-", "-moz-", "-ms-", "-o-", ""], function (j, __) {
                                                            endCss[i + "." + j] = __ + _;
                                                        })
                                                    });
                                                    return endCss;
                                                }
                                                var endCss = polishingCss(_cssName);
                                                function addCSS(_cssValue) {
                                                    for (var m = 0; m < _cssValue.length; m++) {
                                                        for (var n = 0; n < 5; n++) {
                                                            _ele.css(endCss[m + "." + n], _cssValue[m])
                                                        }
                                                    }
                                                }
                                                addCSS(_cssValue)
                                            };
                                            var _curN =["transition-property", "transition-duration", "transition-timing-function", "transition-delay"];
                                            var _curV=["width",_animateDr+"s","ease",_animateDl+"s"];
                                            if(obj.attr("movDir")==1||!obj.attr("movDir")){
                                                prefixCss($proc,_curN,_curV);
                                                $proc.width(endSite);
                                                setTimeout(function () {
                                                    $proc.css("transition","none").width(startSite);
                                                    $(".pro-submit").each(function (i) {
                                                        if(i<=1)$(this).removeAttr( "disabled")
                                                    });
                                                    obj.removeAttr("move");
                                                    _flag=true;
                                                },(_animateDr+_animateDl)*1000);
                                            }
                                        })
                                    };
                                    //pro基础控件 基础结束

                                    //por-bar设计器其他设置

                                    proEdit.rests= function () {
                                        var $slider=$(".graphicalEdit .edit_unitbox>div.scale .slider");
                                        utility.range({
                                            slider: $slider.eq(0),
                                            obj: obj,
                                            maxval: 5,
                                            unMax:true,
                                            type: "animation-duration",
                                            callback: proBarCallback
                                        });
                                        utility.range({
                                            slider: $slider.eq(1),
                                            obj: obj,
                                            maxval: 5,
                                            unMax:true,
                                            type: "animation-delay",
                                            callback: proBarCallback
                                        });
                                        utility.range({
                                            slider: $slider.eq(2),
                                            obj: obj,
                                            maxval: 50,
                                            type: "borderRadius",
                                            callback: proBarCallback
                                        });
                                        function proBarCallback(radio, _type, maxval,rangeVal){
                                            var range = radio * maxval;
                                            var $prop=obj.find(".wqdprop");
                                            var $proc=obj.find(".wqdproc");
                                            if(_type=="borderRadius"){
                                                obj.attr("wqdborderradius", Math.round(range));
                                                $prop.css("border-radius",Math.round(range));
                                                $proc.css("border-radius",Math.round(range));
                                            }
                                            if(_type=="animation-duration"){
                                                obj.attr("wqdPro-duration",Math.round(range));
                                            }
                                            if(_type=="animation-delay"){
                                                obj.attr("wqdPro-delay",Math.round(range));
                                            }
                                        }

                                    };
                                    //pro-bar其他控件 其他结束
                                    proEdit.base();
                                    proEdit.rests();
                                    popupEdit.commonInit();
                                },
                                onClosed:function(){
                                    window.scrollTo(0, window.scroll_top);
                                }
                            });
                        }
                    });
                },0);
            }
        })
    };

    //实例的拖拽操作
    progressBar.bindEvent=function(elm){
        $(document).on("mousedown",".pro-start,.pro-end",function(e){
            var $parents=$(this).parents(".wqdelementEdit");
            if($parents.attr("move")=="moving")return;
            e.stopPropagation();
            var _this=this;
            var mouseStart= e.pageX;
            var eleLeft=parseFloat($(this).css("left"));
            var $proc = $parents.find(".wqdproc");
            var $prop = $parents.find(".wqdprop");
            var startWidth = $proc.width();
            var endWidth=$prop.width();
            $(document).on("mousemove.pro",function (e) {
                var dist=parseFloat(e.pageX-mouseStart);
                var _curLeft,_curWidth;
                if($(_this).hasClass("pro-start")) {
                    ($proc.width()>=endWidth && dist > 0)? (_curLeft=endWidth-10,_curWidth=endWidth):(_curLeft=eleLeft+dist,_curWidth=startWidth+dist);
                    $(_this).css("left",_curLeft+"px");
                    $proc.width(_curWidth);
                    if($proc.width()<=0)$(_this).css("left",-10+"px");
                    $parents.attr("wqdPros_width",$proc.width());
                }else{
                    var _maxLeft=$parents.attr("wqdProf_width")||$parents.width()-2;
                    _curLeft=eleLeft+dist>=_maxLeft-10?(_maxLeft-10):eleLeft+dist<=(-10)?(-10):eleLeft+dist;
                    $(_this).css("left",_curLeft+"px");
                    $parents.attr("wqdProe_width",_curLeft+10)
                }
            }).mouseup(function (e) {
                $(document).off("mousemove.pro");
                $(document).trigger("appSetCatch");
            });
            $(document).trigger("appSetCatch");
        });

    };

    return progressBar;

});

