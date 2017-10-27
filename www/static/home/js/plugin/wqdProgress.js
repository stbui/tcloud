(function ($) {
    //progressCircle
    $("[data-elementtype=progressCircle]").each(function (i, _) {
        var obj = $(this);
        var getValue=function (data) {
            var percentToDegree = function (percent) {
                return Math.round(3.6*percent);
            };
            var  anim;
            var radius = data.radius;
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
        var setValue= function (data) {
            var $cercals=obj.find(".wqd-cercals");
            var value = getValue(data);
            obj.css({
                "width":data.radius*2,
                "height":data.radius*2
            });
            if(data.value==0){
                $cercals.css("display","none")
            }else{
                $cercals.css("display","block")
            }

            $cercals.attr({
                "d":value,
                "transform":"translate("+data.radius+","+data.radius+")"
            });
            //data.value != 0 && $cercals.show();
        };
        var _startScale=parseFloat(obj.attr("wqd-startScale"));
        var _endScale=obj.attr("wqd-endscale")||100;
        var _cercalR=parseFloat(obj.attr("wqd_cercalr"));
        var _cercalDuration= obj.attr("wqdcercal-duration")||1;
        var _cercalDelay= obj.attr("wqdcercal-delay")||0;
        $(this).one("unveil.wqdAnimate", function (e) {
            if((parseFloat(_cercalDuration)==0)||(_startScale==parseFloat(_endScale))){
                return;
            }
            if(_startScale<parseFloat(_endScale)){
                var scaleDif=parseFloat(_endScale)-_startScale;
                var _step=parseFloat(_cercalDuration)*1000/scaleDif;
                setTimeout(function () {
                    var i=_startScale;
                    var _timer = setInterval(function () {
                        setValue({
                            radius:_cercalR,
                            value:++i
                        });
                        if(i==parseFloat(_endScale)) {
                            clearInterval(_timer)
                        }
                    },_step)
                },parseFloat(_cercalDelay)*1000);
            }else{
                scaleDif=_startScale-parseFloat(_endScale);
                _step=parseFloat(_cercalDuration)*1000/scaleDif;
                setTimeout(function () {
                    var i=_startScale;
                    var _timer = setInterval(function () {
                        setValue({
                            radius:_cercalR,
                            value:--i
                        });
                        if(i==parseFloat(_endScale)) {
                            clearInterval(_timer)
                        }
                    },_step)
                },parseFloat(_cercalDelay)*1000);
            }
            //当起始比例小于结束比例

        });
        if(obj.parents(".freeContainerTwo").is(":hidden")){
            setValue({
                radius:_cercalR,
                value:_endScale
            });
        }

    });
    //progressBar
    $("[data-elementtype=progressBar]").each(function (i, _) {
        var obj = $(this);
        var $proc = obj.find(".wqdproc");
        var _animateDr = obj.attr("wqdPro-duration")|| 1;
        var _animateDl = obj.attr("wqdPro-delay") || 0;
        var endSite =obj.attr("wqdproe_width") || 220;
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
        $(this).one("unveil.wqdAnimate", function (e) {
            prefixCss($proc,_curN,_curV);
            $proc.width(endSite);
        });
        if(obj.parents(".freeContainerTwo").is(":hidden")){
            $proc.width(endSite);
        }
    });

})($);
