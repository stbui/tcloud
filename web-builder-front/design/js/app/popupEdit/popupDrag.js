define(function() {
    var popupDrag = {};
    popupDrag.bindEvent = function(){
      $(document).on("mousedown",".wqdEditBox .edit_titlebox",function(event){
        var that = $(this),
            DragElem = $(this).parents(".wqdEditBox"),
            DragView = $(document);
        var startPagex, intervalX, intervalY, startLeft, startTop, boole = false, maxLeft = DragView.outerWidth()-DragElem.outerWidth(), maxTop = DragView.outerHeight()-DragElem.outerHeight();
          boole = true;
          startLeft = DragElem.position().left;
          startTop = DragElem.position().top;
          startPagex = event.pageX;
          startPagey = event.pageY;
         DragView.on("mousemove.viewDrop",{obj:that},function(event){
              if(boole){
                DragElem.find("input:visible").attr("readonly","readonly");
                //console.log()
                  intervalX = event.pageX - startPagex + startLeft;
                  intervalY = event.pageY - startPagey + startTop;
                  if(intervalX > maxLeft){
                    intervalX = maxLeft;
                  }else if(intervalX < 0){
                    intervalX = 0;  
                  } 
                  if(intervalY < 0){
                    intervalY = 0;  
                  } 
        
                  event.data.obj.parents(".wqdEditBox").css({"left":intervalX+"px","top":intervalY+"px","transform":"none"});
              }
          }).on("mouseup.viewDrop",{obj:that},function(event){
              boole = false;
              DragView.off("mousemove.viewDrop").off("mouseup.viewDrop");
              DragElem.find("input:visible").removeAttr("readonly");
          });
      });
    };
    popupDrag.bindEvent();
	
	return popupDrag;
});