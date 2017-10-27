
(function(){
    $("[data-elementtype=numberprogress]").each(function(index, el) {
        if($(this).parents(".freeContainerTwo").is(":hidden")){
                    return
            }
        $(el).one("unveil.wqdAnimate",function(e){
            var obj=$(this);
            var  start_number=parseInt(obj.attr("start_step"))||0;
            var  end_number=parseInt(obj.attr("end_step"))||parseInt(obj.find("em").text());
            var step=(end_number>start_number)?end_number-start_number:start_number-end_number;
            var  duration=parseInt(obj.attr("wqdpro-duration"))||2;
            var maxLen=obj.attr("end_step")?obj.attr("end_step").length:obj.find("em").text().length;
            var minLen=obj.attr("start_step")?obj.attr("start_step").length:0;
            var timer=null;
            var maxNumber=end_number>start_number?end_number:start_number;
            obj.find(".wqdprop").css("width",obj.find(".wqdelementEditBox").css("width"));
            if(obj.find(".wqdprop").css("text-align")=="center"){
                obj.find("em").css("width",obj.find(".wqdelementEditBox").css("width"))&&obj.find(".wqdprop em").css("text-align","center");
            }
            else if(obj.find(".wqdprop").css("text-align")=="right"){
                obj.find("em").css("width",obj.find(".wqdelementEditBox").css("width"))&&obj.find(".wqdprop em").css("text-align","right");
            }
            else{
                obj.find("em").css("width",obj.find(".wqdelementEditBox").css("width"))&&obj.find(".wqdprop em").css("text-align","left");
            }

            timer=setInterval(function(){
                if(duration==0){
                    return;
                    obj.find("em").text(maxNumber);
                }
                if(end_number>start_number){
                    if(obj.attr("flag")=="true"){
                        start_number++;
                        var newNumber=(Array(maxLen).join('0')+start_number).substr(-maxLen);
                        if(start_number==end_number){
                            clearInterval(timer)
                        }
                        obj.find("em").text(newNumber);
                    }
                    else{
                        start_number++;
                        if(start_number==end_number){
                            clearInterval(timer)
                        } 
                        obj.find("em").text(start_number);     
                    }
                    
                }
                else{
                    if(obj.attr("flag")=="true"){
                        obj.find("em").css("width","auto");
                        start_number--;
                        var newNumber=(Array(minLen).join('0')+start_number).substr(-minLen);
                        obj.find("em").text(newNumber);
                        if(end_number==start_number){
                          clearInterval(timer)
                        }
                    }
                    else{
                       start_number--;
                        if(end_number==start_number){
                          clearInterval(timer)
                        }
                        obj.find("em").text(newNumber);
                    }
                }
                
           },duration/(step)*1000)
        })

      })
})(jQuery);