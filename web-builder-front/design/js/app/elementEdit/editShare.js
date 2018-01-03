// liumingren 2015.10.31

define(['elementInfo', 'popupEdit'], function(_ei, popupEdit) {
    var shareEditor = {};
    shareEditor.init = function() {
            this.bindEdit(".wqdelementEdit");
        }
        // 绑定编辑
    shareEditor.bindEdit = function(elm) {
        var self = this;
        $(document).on("elmenentEdit", function(e, data) {
            var $node = data.element || $(".wqdelementEdit.onEditing");
            if ($node.attr("data-elementtype") == "share") {
                setTimeout(function() {
                    _ei.removeElementEditBtn();
                    window.edit = $node;
                    $.ajax({
                        url: '../js/app/JSON/designComponentEdit.json',
                        type: "GET",
                        dataType: "json",
                        success: function(json) {
                            $.colorbox({
                                transition: "none",
                                opacity: 0.5,
                                html: json.edit.shareSetBox,
                                fixed: true,
                                closeButton: false,
                                onOpen: function() {
                                    window.scroll_top = $(document).scrollTop();
                                },
                                onComplete: function() {
                                    popupEdit.shareInit();
                                    $(".nano").nanoScroller();
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

    return shareEditor;

});
