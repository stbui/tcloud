define(['elementInfo', 'popupEdit', 'utility'], function(elementInfo, popupEdit, utility) {
    var numbergressEditor = {};
    numbergressEditor.init = function() {
            this.bindEdit(".wqdelementEdit");
        }
        // 绑定编辑
    numbergressEditor.bindEdit = function(elm) {
        var self = this;
        $(document).on("elmenentEdit", function(e, data) {
            var $node = data.element;
            if ($node.attr("data-elementtype") == "numberprogress") {
                var $node = data.element;
                setTimeout(function() {
                    // _ei.removeElementEditBtn();
                    window.edit = $node;
                    $.ajax({
url:'../js/app/JSON/designComponentEdit.json',
                        type: "GET",
                        dataType: "json",
                        success: function(json) {
                            $.colorbox({
                                transition: "none",
                                opacity: 0.5,
                                html: json.edit.numberprogress,
                                fixed: true,
                                closeButton: false,
                                onOpen: function() {
                                    window.scroll_top = $(document).scrollTop();
                                },
                                onComplete: function() {
                                    var obj = window.edit;
                                    //进度条控件开始
                                    $(".wqdEditBox .edit_unitbox input").each(function(i) {
                                        $(this).attr("pro_bar", i + 1)
                                    })
                                    var duration, startNumber,endNumber,timer = null;
                                    //清除定时器
                                    var flag=false;
                                      // 清除定时器
                                    function clearTimer(){
                                        clearInterval(timer);
                                        flag=false;
                                        obj.find("em").css("width","auto");
                                    }
                                    //进度条控件设置开始
                                    $(".wqdEditBox .edit_unitbox input").on("input propertychange", function() {
                                        var val = $(this).val() || "";
                                        $(this).val(val.replace(/\D/g, ""));
                                    })
                                    .on("blur", function(e) {
                                        var val = $(this).val();
                                        if (val < 0) {
                                            val = 0;
                                            $(this).val(0);
                                        }
                                         if ($(this).attr("pro_bar") == 1) {
                                            val && obj.attr("start_step",$(this).val());
                                        }
                                        if ($(this).attr("pro_bar") == 2) {
                                            val && obj.find(".wqdprop em").text($(this).val());
                                            obj.attr("end_step",$(this).val()||obj.find("em").text());
                                        } ;
                                        clearTimer();
                                        $(document).trigger('appSetCatch');
                                    }).on("keydown",function(e){
                                       if(e.keyCode==38){
                                           var val = $(this).val();
                                           $(this).val(val*1+1);
                                          if ($(this).attr("pro_bar") == 1) {
                                            val && obj.attr("start_step",$(this).val());
                                          }
                                          if ($(this).attr("pro_bar") == 2) {
                                            obj.attr("end_step",$(this).val());
                                            val && obj.find(".wqdprop em").text($(this).val());
                                          } ;
                                       }
                                       if(e.keyCode==40){
                                           var val = $(this).val();
                                           $(this).val(val-1);
                                          if ($(this).attr("pro_bar") == 1) {
                                            val && obj.attr("start_step",$(this).val());
                                          }
                                          if ($(this).attr("pro_bar") == 2) {
                                            obj.attr("end_step",$(this).val());
                                            val && obj.find(".wqdprop em").text($(this).val());
                                          } ;
                                       }
                                       if(e.keyCode==13){
                                        $(this).trigger("blur")
                                       }
                                       $(document).trigger('appSetCatch');
                                    })
                                    //pro-gress基础颜色设置
                                    $(".wqdColorPicker").on("changeColor", function() {
                                        var colorVal = $(this).val();
                                        $(this).attr("value", colorVal).next(".colordeviceBg").children().css("background-color", colorVal);
                                        obj.attr("wqdPro-color", colorVal);
                                        obj.find("em").css("color", colorVal)
                                        $(document).trigger('appSetCatch');
                                    })

                                        //pro-gress基础按钮设置
                                    numbergressEditor.bindEvent = function() {
                                            $(".wqdEditBox").on("click", ".pro-uparrow,.pro-downarrow", function(e) {
                                                    e.stopPropagation();
                                                    var _this = $(this).parent(".pro-arrow").prev().find("input");
                                                    if ($(this).hasClass("pro-uparrow")) {
                                                        _this.val(parseInt(_this.val()) + 1);
                                                    }
                                                    if ($(this).hasClass("pro-downarrow")) {
                                                        _this.val(parseInt(_this.val()) - 1);
                                                        if(_this.val()<0){_this.val(0)}
                                                    }
                                                    if ($(this).parent(".pro-arrow").prev().find("input").attr("pro_bar") == 1) {
                                                        obj.attr("start_step",$(_this).val());
                                                    }
                                                    if ($(this).parent(".pro-arrow").prev().find("input").attr("pro_bar") == 2) {
                                                        obj.find(".wqdprop  em").text(_this.val())&&obj.attr("end_step",$(_this).val());
                                                    }
                                                })

                                                //动画时间设置
                                            utility.range({
                                                slider: $(".numprogressEdit .edit_unitbox>div.scale .slider").eq(0),
                                                obj: obj,
                                                maxval:15,
                                                unMax:true,
                                                type: "animation-duration",
                                                callback: numnerCallback

                                            });
                                            function numnerCallback(radio, _type, maxval, rangeVal) {
                                                    duration =Math.round(radio*maxval);


                                                if (_type == "animation-duration") {
                                                    obj.attr("wqdPro-duration", Math.round(duration) + "s");
                                                }

                                            }
                                                $(".wqdEditBox").on('click', 'input[type="radio"]', function(event) {
                                                    $(this).attr("checked",true).siblings().removeAttr("checked");
                                                    if($(this).attr("pro_bar")==4){
                                                        obj.attr("flag",true)
                                                    }
                                                    else{
                                                        obj.removeAttr('flag')
                                                    }
                                                });
                                            //获取统一宽度按钮是否是统一宽度
                                            $(".pro_play").on("click", function() {
                                                 duration=obj.attr("wqdPro-duration")?parseInt(obj.attr("wqdPro-duration").replace(/s/ig,"")):2;
                                                 obj.find("em").css("width",obj.find(".wqdelementEditBox").css("width"));
                                                if(flag){return}
                                                if(!flag){
                                                    flag=true;
                                                    var startNumber = parseInt(obj.attr("start_step")) || 0,
                                                    endNumber =parseInt(obj.attr("end_step"))?parseInt(obj.attr("end_step")):parseInt(obj.find(".wqdprop  em").text()),
                                                    maxLen=endNumber.toString().length;
                                                    minLen=startNumber.toString().length;
                                                    var step=endNumber>startNumber?(endNumber-startNumber):(startNumber-endNumber);
                                                    var maxNumber=endNumber>startNumber?endNumber:startNumber;
                                                    timer=setInterval(function() {
                                                        if(duration==0){
                                                          return;
                                                           obj.find(".wqdprop  em").text( maxNumber);
                                                        }
                                                        if(obj.attr("flag")){
                                                            if(endNumber>startNumber){
                                                              startNumber++;
                                                              var newNumber=(Array(maxLen).join('0')+startNumber).substr(-maxLen);
                                                              obj.find(".wqdprop  em").text(newNumber);
                                                                if (startNumber>=endNumber){
                                                                    startNumber=endNumber;
                                                                    clearTimer();
                                                                }
                                                            }
                                                            else{
                                                              startNumber--;
                                                              var newNumber=(Array(minLen).join('0')+startNumber).substr(-minLen);
                                                              obj.find(".wqdprop  em").text(newNumber);
                                                              if (endNumber>=startNumber){
                                                                endNumber=startNumber;
                                                                clearTimer();
                                                                }
                                                            }

                                                       }
                                                       else{
                                                          if(endNumber>startNumber){
                                                            startNumber++;
                                                            if(startNumber>=endNumber){
                                                                startNumber=endNumber
                                                                clearTimer();
                                                            }
                                                            obj.find(".wqdprop  em").text( startNumber);

                                                          }
                                                          else{
                                                            startNumber--;
                                                            if(endNumber>=startNumber){
                                                                endNumber=startNumber
                                                                clearTimer();
                                                            }
                                                            obj.find(".wqdprop  em").text( startNumber);

                                                          }

                                                      }
                                                   }, duration / (step) * 1000);
                                                }

                                            })
                                            //设置字体
                                            $("[wqdfontfamily]").next(".style").find("input").on("input propertychange", function() {
                                                var font_size = $(this).val() || "";
                                                $(this).val(font_size.replace(/\D/g, ""));
                                            })
                                            .on("blur", function() {
                                                var val = $(this).val();
                                                if (val < 12) {
                                                    $(this).val(12)
                                                  }
                                                if(val<45){obj.find("em ").css("margin",0)}
                                                obj.find("em ").css("font-size", val + "px");
                                                $(document).trigger("appSetCatch");
                                            })
                                            .on("keydown", function(e) {
                                                fontSize = $(this).val();
                                                if (event.keyCode == 38) {
                                                    $(this).val(++fontSize)
                                                }
                                                else if(event.keyCode == 40) {
                                                    if (parseInt($(this).val()) == 12) return;
                                                    $(this).val(--fontSize);
                                                  }
                                            })
                                                //设置字体样式
                                            if (obj.attr("wqdfont_family")) {
                                                var family_n = parseInt(obj.attr("wqdfont_family"));
                                                }
                                                else {
                                                var family_n = 4;
                                                }
                                            obj.find("a").css("font-family","微软雅黑");
                                            $("[wqdfontfamily]").attr("wqdfontfamily", family_n);
                                            $("[wqdfontfamily]").find("li").removeClass("on").eq(family_n - 1).addClass("on");
                                            $("[wqdfontfamily] p span").html($("[wqdfontfamily] ul li").eq(family_n - 1).find("span").html());
                                            //设置
                                            $(".wqdEditBox .borerwidthselect p").on("click", function(e) {
                                                e.preventDefault();
                                                if ($(this).hasClass("readonly")) return false;
                                                if ($(this).parent().hasClass("on")) {
                                                    $(this).removeClass("on").parent().removeClass("on").find("i").removeClass("on");
                                                    $(this).siblings(".selectWarp").hide();
                                                }
                                                else {
                                                    $(this).addClass("on").parent().addClass("on").find("i").addClass("on");
                                                    $(this).siblings(".selectWarp").show().nanoScroller({
                                                        alwaysVisible: true
                                                    });
                                                }
                                            });
                                            $("[wqdfontfamily]>ul>li").on("click", function() {
                                                $(this).parents("[wqdfontfamily]").removeClass("on").find("i").removeClass("on").parent().removeClass("on").end().end().end().addClass("on").siblings().removeClass("on");
                                                $(this).parent().siblings("p").find("span").remove().end().prepend($(this).children().clone());
                                                obj.attr("wqdfont_family", $(this).index() + 1);
                                                switch ($(this).index() + 1) {
                                                    case 1:
                                                        obj.find("em").css("font-family", "宋体");
                                                        break;
                                                    case 2:
                                                        obj.find("em").css("font-family", "新宋体");
                                                        break;
                                                    case 3:
                                                        obj.find("").css("font-family", "黑体");
                                                        break;
                                                    case 4:
                                                        obj.find("em").css("font-family", "微软雅黑");
                                                        break;
                                                    case 5:
                                                        obj.find("em").css("font-family", "Arial");
                                                        break;
                                                    case 6:
                                                        obj.find("em").css("font-family", "Verdana");
                                                        break;
                                                }
                                                $(document).trigger('appSetCatch');
                                            });
                                            //设置字体
                                            if (obj.find("em").css("font-weight") == 400) {
                                                $("[wqdfontfamily]").next(".style").find("strong").removeClass("on");
                                            }
                                            else {
                                                $("[wqdfontfamily]").next(".style").find("strong").addClass("on");
                                            }
                                            $("[wqdfontfamily]").next(".style").find("strong").on("click", function() {
                                                if ($(this).hasClass("on")) {
                                                    $(this).removeClass("on");
                                                    obj.find("em").css("font-weight", 400)
                                                }
                                                else {
                                                    $(this).addClass("on");
                                                    obj.find("em").css("font-weight", "bolder")
                                                }
                                                $(document).trigger('appSetCatch');
                                            })
                                        }
                                        //设置字体斜体
                                    if (obj.find("em").css("font-style") == "normal") {
                                        $("[wqdfontfamily]").next(".style").find("em").removeClass("on");
                                    }
                                    else {
                                        $("[wqdfontfamily]").next(".style").find("em").addClass("on");
                                    }
                                    //设置
                                    $("[wqdfontfamily]").next(".style").find("em").on("click", function() {
                                        if ($(this).hasClass("on")) {
                                            $(this).removeClass("on");
                                            obj.find("em").css("font-style", "normal");
                                        }
                                        else {
                                            $(this).addClass("on");
                                            obj.find("em").css("font-style", "italic");
                                        }
                                        $(document).trigger('appSetCatch');
                                    });
                                    // 设置统一宽度
                                    $(".wqdEditBox input[type='radio']").on("click", function() {
                                        clearInterval(timer);
                                        obj.find("em").text(obj.attr("end_step"));
                                        if ($(this).attr("pro_bar") == 4 && $(this).prop("checked", true)) {
                                            $(".pro_popup").hide();
                                        }
                                        if ($(this).attr("pro_bar") == 5 && $(this).prop("checked", true)) {
                                            $(".pro_popup").show();
                                            $(".wqdEditBox input[pro_bar=6]").prop("checked",true)&& obj.find(".wqdprop").css("text-align","left")
                                        }
                                        if ($(this).attr("pro_bar") == 6 && $(this).prop("checked", true)) {
                                            obj.find(".wqdprop ").css("text-align","left");

                                        }
                                        if ($(this).attr("pro_bar") == 7 && $(this).prop("checked", true)) {
                                            obj.find(".wqdprop").css("text-align","center");
                                        }
                                        if ($(this).attr("pro_bar") == 8 && $(this).prop("checked", true)) {
                                            obj.find(".wqdprop").css("text-align","right");
                                        }

                                    })
                                    //回显
                                    var wqd_wordColor=obj.attr("wqdPro-color")||obj.find("em").css("color");
                                    $(".wqdColorPicker").attr("value",wqd_wordColor).next(".colordeviceBg").children().css("background-color", wqd_wordColor);
                                    //保存起始值和最终值
                                    if(obj.attr("flag")!="true"){$(".wqdEditBox input[pro_bar=5]").prop("checked",true)&&$(".pro_popup").show()}
                                    else{$(".wqdEditBox input[pro_bar=4]").prop("checked",true)}
                                    if(obj.find(".wqdprop").css("text-align")=="right"){
                                        $(".wqdEditBox input[pro_bar=8]").prop("checked",true)
                                    }
                                    else if(obj.find(".wqdprop").css("text-align")=="center"){
                                        $(".wqdEditBox input[pro_bar=7]").prop("checked",true)
                                    }
                                    else if(obj.find(".wqdprop").css("text-align")=="left"){
                                        $(".wqdEditBox input[pro_bar=6]").prop("checked",true)
                                    }
                                    //时间的回显
                                    var $duration=$(".wqdEditBox .edit_probox");
                                    var _duration=parseInt(obj.attr("wqdPro-duration"))||2;
                                    if(_duration){Timercallback($duration,_duration,15)}
                                    function Timercallback($node,times,val){
                                        if(times>=val){
                                            $node.find(".slider").css("left", $node.find(".scale").width()-$node.find(".slider").width()/2);
                                            $node.find(".moment").css("width", $node.find(".scale").width()-$node.find(".slider").width()/2);
                                        }
                                        else{
                                           $node.find(".slider").css("left", times*$node.find(".scale").width()/val);
                                           $node.find(".moment").css("width", times*$node.find(".scale").width()/val);
                                        }

                                       $node.find("input.r_val").val(val);

                                    }

                                    obj.find("em").css("font-size")?$("[wqdfontfamily]").next(".style").find("input").val(obj.find(" em").css("font-size").replace(/px/ig,"")):$("[wqdfontfamily]").next(".style").find("input").val(obj.find(".wqdprop ").css("font-size").replace(/px/ig,""));
                                    obj.find("em").text()?$(".wqdEditBox input.input_endstep").val(obj.find("em").text()):$(".wqdEditBox input.input_endstep").val(obj.attr("end_step"));
                                    obj.attr("start_step")?$(".wqdEditBox input.input_startstep").val(obj.attr("start_step")):0;
                                    if(!obj.attr("end_step")){
                                       obj.attr("end_step",obj.find("em").text());
                                    }
                                    obj.attr("wqdPro-duration")?$(".wqdEditBox input.r_val").val(parseInt(obj.attr("wqdPro-duration"))):($(".wqdEditBox input.r_val").val(2)&&obj.attr("wqdPro-duration",$(".wqdEditBox input.r_val").val()+"s"));

                                    numbergressEditor.bindEvent();
                                    popupEdit.commonInit();
                                },
                                onClosed: function() {
                                    window.scrollTo(0, window.scroll_top);
                                }
                            });
                        }
                    });

                }, 0);

            }
        })
    };

    return numbergressEditor;

});
