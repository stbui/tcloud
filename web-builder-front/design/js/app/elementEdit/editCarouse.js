define(['utility', 'elementInfo'], function(utility, _ei, popupEdit, popupCommon) {
    var carouseEditor = {};
    carouseEditor.init = function() {
        var self = this;
        this.bindEdit(".wqdelementEdit");
        setTimeout(function () {
            self.showCarouse();
        },1);
    };
        // 绑定编辑
    carouseEditor.bindEdit = function(elm) {
        var self = this;
        $(document).on("elmenentEdit", function(e, data) {
            var $node = data.element;
            if ($node.attr("data-elementtype") == "carouse") {
                var $node = data.element;
                setTimeout(function() {
                    // _ei.removeElementEditBtn();
                    window.edit = $node;
                    $.ajax({
                        url: '../js/app/JSON/designComponentEdit.json',
                        type: "GET",
                        dataType: "json",
                        success: function(json) {
                            $.colorbox({
                                transition: "none",
                                opacity: 0.5,
                                html: json.edit["lunboBox"],
                                fixed: true,
                                closeButton: false,
                                onOpen: function() {
                                    window.scroll_top = $(document).scrollTop();
                                },
                                onComplete: function() {
                                    require(['utility', 'elementInfo', 'popupCommon', 'popupCarouse'], function(utility, _ei, popupCommon, wrapCarouse) {
                                        popupCommon.commonInit();
                                        wrapCarouse.render();
                                        $(".nano").nanoScroller({
                                            alwaysVisible: true
                                        });
                                    });
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
        .on("showCarouse",function () {
            self.showCarouse();
        })
    };
    carouseEditor.showCarouse = function () {
        $(".fullMode").each(function (i,_) {
            $(_).width($(_).parents(".wqdSectiondiv").width()).addClass("fullMode-show");
        });
    };

    return carouseEditor;
});
