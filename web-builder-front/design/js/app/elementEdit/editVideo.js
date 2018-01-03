// liumingren 2015.10.31
define(['elementInfo','popupEdit'],function(_ei,popupEdit) {
	var videoEdit = {};
	videoEdit.init = function () {
		this.bindEdit(".wqdelementEdit");
	}
	// 绑定编辑
	videoEdit.bindEdit = function (elm) {
		var self = this;
		$(document).on("elmenentEdit",function (e,data) {
			var $node = data.element;
			if($node.attr("data-elementtype") == "video") {
				setTimeout(function(){
					_ei.removeElementEditBtn();
					window.edit = $node;
					$.ajax({
				        url: '../js/app/JSON/designComponentEdit.json',
				        type: "GET",
				        dataType: "json",
				        success: function(json) {
				        	$.colorbox({
								transition:"none",
								opacity:0.5,
								html:json.edit.videoEdit,
								fixed:true,
								closeButton:false,
								onOpen:function(){
									window.scroll_top = $(document).scrollTop();
								},
								onComplete:function(){
									self.videoEditInit();
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
	 //视频设置23
    videoEdit.videoEditInit = function() {
            var obj = window.edit;
            var urlPath = "";
               if($(obj).attr("videoPic") != "" || $(obj).attr("videoPic") != "undefind"){
               	$("div.picBox img").attr("src",$(obj).attr("videoPic"));
               }
               if($("div.picBox img").attr("src") == "/images/v2/design/elementEdit/video-picdef.png"){
               	$("div.picBox").removeClass("showPic");
               }else{
               	$("div.picBox").addClass("showPic");
               }
            $(".videoEdit .edit_contentbox input.submit").val(edit.attr("videoVal"));
            $(document).on("change", ".videoEdit .edit_contentbox input", function() {
                urlPath = $.trim($(this).val());
                edit.attr("videoVal",urlPath);//保存视频路径
                getHtml(urlPath);
            });
            //编辑器弹窗关闭
	        $(".wqdEditBox .edit_close").on("click", function() {
	            $.fn.colorbox.close();
	        });
	        //编辑框问号点击链接
	        $(".wqdEditBox .edit_titlebox .edit_help").click(function() {
	            window.open("http://12.0.0.1");
	        });
            function getHtml(url) {
                var html = '';
                html += '<div class="videoEdit" style="position: relative;width: 100%;height: 100%;z-index: 2;background: rgba(0,0,0,0);"></div>';
                var newUrl = url.replace("<iframe height=498 width=510 ",'<iframe  style="width:100%;height:100%;" ');
                html += newUrl;
                edit.find(".wqd-video").empty().append(html);
                $(document).trigger("appSetCatch");
            }
            //删除图片
               $(document).on("click","#videoDel",function(){
               	$("div.picBox img").attr("src","/images/v2/design/elementEdit/video-picdef.png");
               	$(obj).removeAttr("videoPic");
               	$(document).trigger("appSetCatch");
               	$("div.picBox").removeClass("showPic");
               });
               //上传图片
               $(".editPicture input[type='file']").on("click",function(){
               	upLoadPic({
	                 ele: $(this),
	                 target: $("div.picBox img"),
	                 save: "videoPic",
	                 saveEle: obj
	             });
               });
               //设置
           $("ul.imagefocuslist>li").on("click", function() {
               var imgSrc = obj.find(".wqd-video").css("background-image");
               var arrPos = [{
                   "background-size": "cover",
                   "background-position": " center center",
                   "background-repeat": "no-repeat",
                   "background-image": imgSrc
               }, {
                   "background-size": "100% 100%",
                   "background-position": " center center",
                   "background-repeat": "no-repeat",
                   "background-image": imgSrc
               }, {
                   "background-size": "",
                   "background-position": " center center",
                   "background-repeat": "repeat",
                   "background-image": imgSrc
               }, {
                   //"background-size": "initial",
                   "background-size": "",
                   "background-position": " center center",
                   "background-repeat": "no-repeat",
                   "background-image": imgSrc
               }];
               switch ($(this).index() + 1) {
                   case 1: //适应
                       obj.find(".wqd-video").css(arrPos[0]);
                       break;
                   case 2: //拉伸
                       obj.find(".wqd-video").css(arrPos[1]);
                       break;
                   case 3: //平铺
                       obj.find(".wqd-video").css(arrPos[2]);
                       break;
                   case 4: //居中
                       obj.find(".wqd-video").css(arrPos[3]);
                       $(".wqdEditBox.backgroundEdit .imagefocuslist>li").each(function() {
                           $(this).removeClass("on");
                       });
                       $(".wqdEditBox.backgroundEdit .imagefocuslist>li").eq(4).addClass("on");
                       break;
               }
               $(this).parents("[wqdbackposition]").removeClass("on").find("i").removeClass("on").parent().removeClass("on").end().end().end().addClass("on").siblings().removeClass("on");
               $(this).parent().siblings("p").find("span").remove().end().prepend($(this).children().clone());
               obj.attr("wqdback_position", $(this).index() + 1);
               $(document).trigger("appSetCatch");
          });
               upLoadPic = function(json) {
	             json.ele.fileupload({
	                 pasteZone: null,
	                 url: "/user/gallery/upload", //文件上传地址，可以直接写在input的data-url属性内
	                 acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
	                 maxFileSize: 2000000, // 2 MB
	                 dataType: 'text',
	                 formData: {
	                     typeId: "10061"
	                 }, //参数
	                 done: function(e, result) {
	                     if (result.result) {
	                         var data = JSON.parse(result.result);
			             	if (data && data.status==500) {
			             		alert(data.msg);
			             		return;
			             	}
	                         json.target.attr("src", data.path);
	                         json.saveEle.attr(json.save, data.path);
	                         var getDataPath = data.path;
	                         $(".picBox").addClass("showPic");
	                         obj.find(".wqd-video").removeAttr("style").css({
	                         	"width": "100%",
	                         	"height": "100%",
	                         	"background-image":"url("+getDataPath+")",
	                         	"background-position":"50% 50%",
	                         	"background-size":"cover",
	                         	"background-repeat":"no-repeat"
	                         });;
	                         $(document).trigger("appSetCatch");
	                     }
	                 },
	                 messages: {
	                     acceptFileTypes: '图片格式不正确',
	                     maxFileSize: '图片大小不超过2M'
	                 }
	             }).off("fileuploadprocessalways").on('fileuploadprocessalways', function(e, data) {
	                 var index = data.index,
	                     file = data.files[index];
	                 if (file.error) {
	                     alert(file.error);
	                 }
	             });
	         };
        }
	return videoEdit;
});

