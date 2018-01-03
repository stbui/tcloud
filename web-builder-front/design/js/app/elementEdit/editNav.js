define(['popupEdit'], function(popupEdit) {
    var navEditor = {};
    navEditor.init = function(elm) {
        $("body").on("click", ".tool-list2", function(e) {
            e.stopPropagation();
        	// var isheader = $(this).attr("isheader") || "";
        	// if(!isheader) return;
            var partid = $(this).attr("partid");
            if(!partid) return;
            window.edit = $("#"+partid).find(".wqdBkEditos");
            $this = $(".tool-list2");
			$.ajax({
				url: '../js/app/JSON/designComponentEdit.json',
					type: "GET",
					dataType: "json",
					success: function(json) {
						$.colorbox({
							transition: "none",
							opacity: 0.5,
							html: json.edit.background,
							fixed: true,
							closeButton: false,
							onOpen: function() {
								window.scroll_top = $(document).scrollTop();
							},
							onComplete: function() {
								popupEdit.backgroundInit();
                                $this.addClass("on");
							},
							onClosed: function() {
								window.scrollTo(0, window.scroll_top);
                                $(".tool-list2").removeClass("on");
							}
						});
					}
			});
        });
    }
    return navEditor;

});
