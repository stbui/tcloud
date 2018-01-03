/**
 * Created by user on 2016/5/10.
 */

define(['elementInfo','utility','popupEdit'],function(_ei,utility,popupEdit) {
    var progressCircle = {};
    progressCircle.init = function () {
        this.bindEdit(".wqdelementEdit");
    };
    // 绑定编辑
    progressCircle.bindEdit = function (elm) {
        var self = this;
        $(document).on("elmenentEdit",function (e,data) {
            var $node = data.element || $(".wqdelementEdit.onEditing");
            if($node.attr("data-elementtype") == "progressCircle") {
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
                                html:json.edit.progresscircle,
                                fixed:true,
                                closeButton:false,
                                onOpen:function(){
                                    window.scroll_top = $(document).scrollTop();
                                },
                                onComplete:function(){
                                    var obj = window.edit;
                                    var proCircaliEdit={};
                                    var _flag=true,_timer,_timer1;


                                    //slider拖拽回调
                                    proCircaliEdit.proCircalCallback= function(radio, _type, maxval,rangeVal) {
                                        var range = radio * maxval;
                                        var $circals=obj.find(".circal-start");
                                        var $circale=obj.find(".circal-end");
                                        var $cercalf=obj.find(".wqd-cercalf");
                                        var _radius =parseFloat($cercalf.attr("r"));
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
                                        var _curN =["transform"];
                                        var _curV=["rotate("+Math.round(range)*360/100+"deg)"];
                                        if((_type=="start-proportion"||_type=="end-proportion")&&(obj.attr("move")=="moving")){
                                            clearInterval(_timer);
                                            clearInterval(_timer1);
                                            if(_type=="end-proportion"){
                                                proCircaliEdit.setValue({
                                                    radius: parseFloat(obj.attr("wqd_cercalr")),
                                                    value: parseFloat(obj.attr("wqd-startScale"))
                                                });
                                            }
                                            _flag = true;
                                            $(".pro-submit").removeAttr("disabled");
                                            obj.removeAttr("move");
                                        }
                                        if(_type=="start-proportion"){
                                            prefixCss($circals,_curN,_curV);
                                            proCircaliEdit.setValue({
                                                radius:_radius,
                                                value:Math.round(range)
                                            });
                                            obj.attr("wqd-startScale",Math.round(range));

                                        }
                                        if(_type=="end-proportion"){
                                            prefixCss($circale,_curN,_curV);
                                            obj.attr("wqd-endScale",Math.round(range));
                                        }
                                        if(_type=="circal-duration"){
                                            obj.attr("wqdcercal-duration",Math.round(range));
                                        }
                                        if(_type=="circal-delay"){
                                            obj.attr("wqdcercal-delay",Math.round(range));
                                        }

                                        if(_type=="circal-inner"){
                                            var curRange=$cercalf.attr("r")-Math.round(range);
                                            obj.find(".wqd-cercalc").css({
                                                "width":curRange*2+"px",
                                                "height":curRange*2+"px"
                                            });
                                            if (curRange<=0){
                                                obj.find(".wqd-cercalc").css("border","none")
                                            }else{
                                                var curColor=$(".wqdEditBox").find(".colorval").eq(4).val();
                                                obj.find(".wqd-cercalc").css({
                                                    "border-width":"1px",
                                                    "border-style":"solid",
                                                    "border-color":curColor
                                                })
                                            }
                                            obj.attr("wqdcercal-width",Math.round(range))
                                        }


                                    };
                                    //回显设置回调
                                    proCircaliEdit.scaleCallback= function (ele,scale,size,_scale){
                                        ele.find(".r_val").val(_scale||scale);
                                        ele.find(".slider").css("left", scale *ele.find(".scale").width() / size);
                                        ele.find(".moment").css("width", scale*ele.find(".scale").width() / size);
                                    };

                                    proCircaliEdit.getValue=function (data) {
                                        var percentToDegree = function (percent) {
                                            return Math.round(3.6*percent);
                                        };
                                        var  anim;
                                        var  radius = data.radius;
                                        var  alpha = percentToDegree(data.value);
                                        var currentAlpha = alpha;
                                        if(currentAlpha > alpha) {
                                            currentAlpha--;
                                        } else if (currentAlpha < alpha) {
                                            currentAlpha++;
                                        }
                                        if(currentAlpha == 360) {
                                            currentAlpha = 359.99;
                                        }
                                        var r = ( currentAlpha * Math.PI / 180 );
                                        var x = Math.sin( r ) * radius;
                                        var y = Math.cos( r ) * - radius;
                                        var mid = ( currentAlpha > 180 ) ? 1 : 0;
                                        return anim = 'M 0 0 v -'+radius+' A '+radius+' '+radius+' 1 '+ mid +' 1 '+  x  +' '+  y  +' z';

                                    };


                                    proCircaliEdit.setValue = function (data) {
                                        var $cercals = obj.find(".wqd-cercals");
                                        var value = proCircaliEdit.getValue(data);
                                        obj.css({
                                            "width": data.radius * 2,
                                            "height": data.radius * 2
                                        });
                                        if (data.value == 0) {
                                            $cercals.css("display", "none")
                                        } else {
                                            $cercals.css("display", "block")
                                        }

                                        $cercals.attr({
                                            "d": value,
                                            "transform": "translate(" + data.radius + "," + data.radius + ")"
                                        });
                                    };
                                    //pro-circal设计器基础设置
                                    proCircaliEdit.base= function () {
                                        var $slider=$(".graphicalEdit .edit_unitbox>div.scale .slider");
                                        //起始比例
                                        utility.range({
                                            slider: $slider.eq(0),
                                            obj: obj,
                                            maxval: 100,
                                            type: "start-proportion",
                                            callback: this.proCircalCallback
                                        });
                                        //最终比例
                                        utility.range({
                                            slider: $slider.eq(1),
                                            obj: obj,
                                            maxval: 100,
                                            type: "end-proportion",
                                            callback: this.proCircalCallback
                                        });
                                        //动画时长
                                        utility.range({
                                            slider: $slider.eq(2),
                                            obj: obj,
                                            maxval: 5,
                                            unMax:true,
                                            type: "circal-duration",
                                            callback: this.proCircalCallback
                                        });
                                        //延迟播放
                                        utility.range({
                                            slider: $slider.eq(3),
                                            obj: obj,
                                            maxval: 5,
                                            unMax:true,
                                            type: "circal-delay",
                                            callback:  this.proCircalCallback
                                        });


                                        var previousVal = (obj.attr("wqd_cercalr")) || 50;
                                        //内环宽度 nav
                                        utility.range({
                                            slider: $slider.eq(4),
                                            obj: obj,
                                            maxval: previousVal,
                                            type: "circal-inner",
                                            callback: this.proCircalCallback
                                        });


                                        //起始比例的回显
                                        var $proContent=$(".wqdEditBox .pro-content");
                                        var $cercalStart=$proContent.eq(0);
                                        var _proportion=parseFloat(obj.attr("wqd-startScale"));
                                        var _cercalR=parseFloat(obj.attr("wqd_cercalr"));
                                        proCircaliEdit.setValue({
                                            radius:_cercalR,
                                            value:_proportion
                                        });
                                        proCircaliEdit.scaleCallback($cercalStart,_proportion,100);

                                        //结束比例的回显
                                        var $cercalEnd=$proContent.eq(1);
                                        var _endScale=obj.attr("wqd-endScale")||$cercalEnd.find(".r_val").val();
                                        if(_endScale)proCircaliEdit.scaleCallback($cercalEnd,_endScale,100);
                                        //固定直径的回显
                                        var $diameter=$proContent.eq(2);
                                        if(_cercalR){
                                            $diameter.find(".pro-submit").val(_cercalR*2);
                                        }
                                        //进度颜色回显
                                        var _progresColor= obj.attr("wqd-progressc")||obj.find(".wqd-cercals").css("fill");
                                        if(_progresColor){
                                            $(".wqdEditBox").find(".colorval").eq(0).val(_progresColor).end().end().find(".colordevice").eq(0).css("background-color", _progresColor);
                                        }
                                        //背景颜色回显
                                        var _backgroundColor=obj.attr("wqd-backgroudc")||obj.find(".wqd-cercalf").css("fill");
                                        if(_backgroundColor){
                                            $(".wqdEditBox").find(".colorval").eq(1).val(_backgroundColor).end().end().find(".colordevice").eq(1).css("background-color", _backgroundColor);
                                        }
                                        //外边框的回显
                                        var _borderColor=obj.attr("wqd-borderc")||obj.find(".wqd-cercalf").css("stroke");
                                        if(_borderColor){
                                            $(".wqdEditBox").find(".colorval").eq(2).val(_borderColor).end().end().find(".colordevice").eq(2).css("background-color", _borderColor);
                                        }
                                        //动画时长的回显
                                        var $cercalDuration=$(".wqdEditBox .pro-duration");
                                        var _cercalDuration= obj.attr("wqdcercal-duration");
                                        if(parseFloat(_cercalDuration)>5)proCircaliEdit.scaleCallback($cercalDuration,5,5,parseFloat(_cercalDuration));
                                        if(parseFloat(_cercalDuration)<=5)proCircaliEdit.scaleCallback($cercalDuration,parseFloat(_cercalDuration),5);
                                        if(!_cercalDuration)proCircaliEdit.scaleCallback($cercalDuration,1,5);
                                        //动画延时的回显
                                        var $cercalDelay=$(".wqdEditBox .pro-delay");
                                        var _cercalDelay= obj.attr("wqdcercal-delay");
                                        if(parseFloat(_cercalDelay)>5)proCircaliEdit.scaleCallback($cercalDelay,5,5,parseFloat(_cercalDelay));
                                        if(parseFloat(_cercalDelay)<=5)proCircaliEdit.scaleCallback($cercalDelay,parseFloat(_cercalDelay),5);
                                        if(!_cercalDelay)proCircaliEdit.scaleCallback($cercalDelay,0,5);

                                        //环形宽度的回显
                                        var $cercalWidth=$(".wqdEditBox .pro-circalwidth");
                                        var _cercalWidth=obj.attr("wqdcercal-width")||$cercalWidth.find(".r_val").val();
                                        if(_cercalWidth)proCircaliEdit.scaleCallback($cercalWidth,_cercalWidth,previousVal);

                                        //内环背景颜色回显
                                        var _innerbackground=obj.attr("wqd-innerc")||obj.find(".wqd-cercalc").css("background-color");
                                        if(_innerbackground){
                                            $(".wqdEditBox").find(".colorval").eq(3).val(_innerbackground).end().end().find(".colordevice").eq(3).css("background-color", _innerbackground);
                                        }
                                        //内环边框颜色回显
                                        var _innerborder=obj.attr("wqd-innerborderc")||obj.find(".wqd-cercals").css("fill");
                                        if(_innerborder){
                                            $(".wqdEditBox").find(".colorval").eq(4).val(_innerborder).end().end().find(".colordevice").eq(4).css("background-color", _innerborder);
                                        }
                                        //固定直径 输入框关联事件
                                        $(".pro-submit").on("keydown.circle", function (event) {
                                            event.stopPropagation();
                                            var initialRatio=parseInt($(this).val(),10)||0;
                                            if(event.keyCode==38) {
                                                initialRatio++;
                                            }else if(event.keyCode==40) {
                                                initialRatio--;
                                                if( initialRatio <= 0){
                                                    initialRatio=0;
                                                    return;
                                                }
                                            }else if(event.keyCode==13){
                                                $(this).trigger("blur.circle");
                                                return
                                            }else{
                                                return;
                                            }
                                            $(this).val(initialRatio);
                                            submitCallback.call(this,initialRatio);
                                            $(document).trigger("appSetCatch");
                                        }).on("blur.circle", function () {
                                            var newVal=$(this).val()||0;
                                            newVal = /\D/g.test(newVal)?0:newVal>=2000?2000:newVal;
                                            $(this).val(newVal);
                                            submitCallback.call(this,newVal);
                                            $(document).trigger("appSetCatch");
                                        });

                                        //固定直径 回调
                                        function submitCallback (initialVal) {
                                            var cercalScale=(obj.attr("wqd-startScale")||$cercalStart.find(".r_val").val());
                                            var initial=initialVal/2;
                                            proCircaliEdit.setValue({
                                                radius:initial,
                                                value:cercalScale
                                            });
                                            obj .find(".wqd-cercalf").attr({
                                                "r":initial,
                                                "cx":initial,
                                                "cy":initial
                                            });
                                            obj.find(".circal-start,.circal-end").css("height",initial*2+2+"px");

                                            //控制内圆
                                            var innerWh=obj.attr("wqdcercal-width")?initial*2-obj.attr("wqdcercal-width")*2:initial*2-20;
                                            obj.find(".wqd-cercalc").css({
                                                "width":innerWh+"px",
                                                "height":innerWh+"px"
                                            });
                                            obj.attr("wqd_cercalr",initial);

                                            //直径发生改变从新初始化slider比例位置和输入框最大值
                                            var curVal=parseFloat($(".wqdEditBox .pro-content").eq(2).find(".pro-submit").val())/2;
                                            var $cercalWidth=$(".wqdEditBox .pro-circalwidth");
                                            var _cercalWidth=$cercalWidth.find(".r_val").val();
                                            if(parseFloat(_cercalWidth)>=curVal){
                                                curVal=initial;
                                                _cercalWidth=initial;
                                                obj.attr("wqdcercal-width",_cercalWidth)
                                            }
                                            if(/(\.5)/.test(curVal))curVal+=0.5;
                                            if(/(\.5)/.test(_cercalWidth))_cercalWidth+=0.5;
                                            if(_cercalWidth)proCircaliEdit.scaleCallback($cercalWidth,_cercalWidth,curVal);
                                            if(_cercalWidth>=curVal){
                                                obj.find(".wqd-cercalc").css("border","none")
                                            }else{
                                                var curColor = $(".wqdEditBox").find(".colorval").eq(4).val();
                                                obj.find(".wqd-cercalc").css({
                                                    "border-width": "1px",
                                                    "border-style": "solid",
                                                    "border-color": curColor
                                                })
                                            }
                                            utility.range({
                                                slider: $slider.eq(4),
                                                obj: obj,
                                                maxval: curVal,
                                                type: "circal-inner",
                                                callback:  proCircaliEdit.proCircalCallback
                                            });
                                        };


                                        //颜色设置
                                        $(".colorval").each(function (i) {
                                            $(this).attr("pro-cercal",i+1)
                                        });
                                        $(".wqdColorPicker").on("changeColor", function() {
                                            var colorVal = $(this).val();
                                            if($(this).attr("pro-cercal")==1){
                                                $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
                                                obj.find(".wqd-cercals").css("fill",colorVal);
                                                obj.attr("wqd-progressc",colorVal);
                                            } if($(this).attr("pro-cercal")==2){
                                                $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
                                                obj.find(".wqd-cercalf").css("fill",colorVal);
                                                obj.attr("wqd-backgroudc",colorVal);
                                            }if($(this).attr("pro-cercal")==3){
                                                $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
                                                obj.find(".wqd-cercalf").css("stroke",colorVal);
                                                obj.attr("wqd-borderc",colorVal);
                                            }
                                            if($(this).attr("pro-cercal")==4){
                                                $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
                                                obj.find(".wqd-cercalc").css("background-color",colorVal);
                                                obj.attr("wqd-innerc",colorVal);
                                            }
                                            if($(this).attr("pro-cercal")==5){
                                                $(this).attr("value", colorVal).siblings(".colordeviceBg").find(".colordevice").css("background-color", colorVal);
                                                obj.find(".wqd-cercalc").css("border-color",colorVal);
                                                obj.attr("wqd-innerborderc",colorVal);
                                            }

                                            $(document).trigger('appSetCatch');
                                        });

                                        //播放动画

                                        if(obj.attr("move")=="moving")$(".pro-submit").attr( "disabled","disabled");
                                        $(".pro-cercalbtn").off("click.transmit").on("click.transmit", function (e) {
                                            e.preventDefault();
                                            if(!_flag)return;
                                            _flag=false;
                                            var _startScale=parseFloat(obj.attr("wqd-startScale"));
                                            var _endScale=obj.attr("wqd-endscale")||100;
                                            var _cercalR=parseFloat(obj.attr("wqd_cercalr"));
                                            var _cercalDuration= parseFloat(obj.attr("wqdcercal-duration")||$cercalDuration.find(".r_val").val())*1000;
                                            var _cercalDelay= parseFloat(obj.attr("wqdcercal-delay")||$cercalDelay.find(".r_val").val())*1000;
                                            var _duration=_cercalDuration+_cercalDelay;
                                            if((_cercalDuration==0)||(_startScale==_endScale)){
                                                _flag=true;
                                                return;
                                            }
                                            obj.attr("move","moving");
                                            $(".pro-submit").attr( "disabled","disabled");
                                            if(_startScale<parseFloat(_endScale)){
                                                var scaleDif=parseFloat(_endScale)-_startScale;
                                                var _step=_cercalDuration/scaleDif;
                                                setTimeout(function () {
                                                    var i=_startScale;
                                                     _timer = setInterval(function () {
                                                        proCircaliEdit.setValue({
                                                            radius:_cercalR,
                                                            value:++i
                                                        });
                                                        if(i==parseFloat(_endScale)) {
                                                            clearInterval(_timer)
                                                        }
                                                    },_step)
                                                },_cercalDelay);
                                            }else{
                                                scaleDif=_startScale-parseFloat(_endScale);
                                                _step=_cercalDuration/scaleDif;
                                                setTimeout(function () {
                                                    var i=_startScale;
                                                     _timer = setInterval(function () {
                                                        proCircaliEdit.setValue({
                                                            radius:_cercalR,
                                                            value:--i
                                                        });
                                                        if(i==parseFloat(_endScale)) {
                                                            clearInterval(_timer)
                                                        }
                                                    },_step)
                                                },_cercalDelay);
                                            }
                                            //当起始比例小于结束比例
                                            _timer1=setTimeout(function () {
                                                    proCircaliEdit.setValue({
                                                        radius: _cercalR,
                                                        value: _startScale
                                                    });
                                                    $(".pro-submit").removeAttr("disabled");
                                                    obj.removeAttr("move");
                                                    _flag = true;
                                                }, _duration + 500);
                                        });
                                    };
                                    //pro-circal设计器基础设置结束
                                    //por-circal设计器其他设置
                                    proCircaliEdit.rests= function () {
                                        var $cercalclidren=obj.find(".wqd-cercalc");
                                        var $circleselect=$(".wqdEditBox .circleselect");
                                        if($cercalclidren.is(":visible")){
                                            $circleselect.removeClass("pro-circalfoot2").siblings(".pro-circalwidth").show().siblings(".pro-circalcolor").show();
                                            $(".wqdEditBox .borerwidthselect").find("span:first").text("环形").end().find("li:first").removeClass("on").end().find("li:last").addClass("on")
                                        }

                                        //设计器形状选择控制
                                        $(".wqdEditBox .borerwidthselect").on("click", "p,ul li", function (e) {
                                            e.preventDefault();
                                            if (this.tagName.toLowerCase() == "p") {
                                                if ($(this).hasClass("readonly")) return false;
                                                if ($(this).parent().hasClass("on")) {
                                                    $(this).removeClass("on").parent().removeClass("on").find("i").removeClass("on");
                                                } else {
                                                    $(this).addClass("on").parent().addClass("on").find("i").addClass("on");
                                                }
                                            }
                                            if (this.tagName.toLowerCase() == "li") {
                                                $(this).parents(".borerwidthselect").removeClass("on").find("p").removeClass("on").find("i").removeClass("on");
                                                $(this).addClass("on").siblings("li").removeClass("on").parent().siblings("p").find("span").remove().end().prepend($(this).children().clone());
                                                var index = $(this).index();
                                                if(index == 0){
                                                    $(this).parents(".circleselect").addClass("pro-circalfoot2").siblings(".pro-circalwidth").hide().siblings(".pro-circalcolor").hide();
                                                    obj.find(".wqd-cercalc").hide();
                                                }
                                                if(index == 1){
                                                    $(this).parents(".circleselect").removeClass("pro-circalfoot2").siblings(".pro-circalwidth").show().siblings(".pro-circalcolor").show();
                                                    obj.find(".wqd-cercalc").show();
                                                }

                                            }

                                            $(document).trigger('appSetCatch');

                                        });
                                    };
                                    //por-circal设计器其他设置结束
                                    proCircaliEdit.base();
                                    proCircaliEdit.rests();
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

    return progressCircle;

});

