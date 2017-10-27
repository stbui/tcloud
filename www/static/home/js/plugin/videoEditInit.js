(function($) {
	var videoEdit = {};
	videoEdit.videoEditInit = function() {
            $(".wqd-video").each(function() {
            	$(this).find(".videoEdit").remove();
            });
        }
        //视频设置 end
    videoEdit.videoEditInit();
	return videoEdit;
})(jQuery);

