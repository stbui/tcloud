define(["pageHeader", "pageRuler"], function(_ph, _pr) {
	var headerCtrl = {};

	headerCtrl.init = function() {

		/* design--顶部网站设置按钮开关 */
        $("#wqdpHeaderD").on("click", ".station", function() {
            var $phssObj = $("#wqdpHeaderSetStationD");
            var $li = $(this).parent("li");
            $phssObj.show();
            /* 网站设置列表 */
            $phssObj.on("click.list", "ul.left li", function() {
                var _self = $(this), _index = _self.index();
                /* 列表切换 */
                _self.addClass("on").siblings("li").removeClass("on");
                /* 列表标题切换 */
                $phssObj.find(".right .title span").eq(_index).addClass("on").siblings("span").removeClass("on");
                /* 列表内容切换 */
                $phssObj.find(".right ul.rcontent li").eq(_index).addClass("on").siblings("li").removeClass("on");
            });

            /* 网站设置关闭按钮 */
            $phssObj.on("click.close", ".right .title em,.mask", function() {
                $phssObj.off("click.list click.close");
                $phssObj.hide();
                $li.removeClass("on");
            });

            /* 点击灰色区域也能关闭 */
            // $phssObj.on("click.close", ".mask", function() {
            //     $phssObj.off("click.list click.close");
            //     $phssObj.hide();
            //     $(this).parent("li").removeClass("on");
            // });

            $li.addClass("on");

        });

        /* window尺寸改变时，标尺消失 */
        $(window).resize(function(){
            _pr.removeRule();
        })
        // 复制的时候使粘贴按钮可用
        $(document).on("copied",function () {
            $("#wqdpHeaderD .li-copy").addClass("pasted");
        })
		/* design--头部控制---主要右半部分 */
		$("#wqdpHeaderD").on("click", "ol.icon-list li", function(e) {
			var _self = $(this), _index = _self.index();
			/* 选择对应的不同点击对应不同功能 */
			switch(_index) {
				case 0:break;
				case 1:$(document).trigger("pasteEG");break;	//粘贴
				case 2:_self.hasClass("on") && _ph.cancel();break;						//撤销
				case 3:_self.hasClass("on") && _ph.back();break;							//恢复
				case 4:
					if(!$('.ruler').length) {
						_pr.rulerInit();
					} else {
						$('.ruler').remove();
						_pr.removeRule();
					};break;
				default:break;
			}
		});
        $("body").on("click","#savesite.on",function (e) {
            _ph.save();
        })
        .on("click","#issue",function (e) {
			e.preventDefault();
			var link = $(this).attr("data-href");
            //发布
            $.colorbox({
                'speed': 350,
                'fixed': true,
				'href':link,
                'closeButton': false,
                onComplete:function(){
                    // $('#cboxWrapper,#colorbox').width(530).height(274);
                    $("#cboxOverlay").addClass("cboxOverlayShow");
                },
                onClosed:function(){
                    $("#cboxOverlay").removeClass("cboxOverlayShow");
                }
            });
        })

		/* 退出设计器 */
		$('#wqdpHeaderSetStationD li.back').click(function() {
			// window.location.href = 'http://' + window.location.host + '/index.html?siteId=' + USERSITEID;
			window.location.href = MEMCTX || "http://member.wqdian.com/";
		});

		/* X、Y、W、H位置设置*/
		var val = 0;
        var setElementInfo = function (e,$this) {
            if (!$this.find("input").length) {
                var val = parseInt($this.html());
                $this.html('<input type="text" value="' + val + '">');

                var _self = $this.find("input");
                _self.focus().select();
                _self.off("blur").on("blur", function() {
                    val = $this.attr("value");
                    _self.parent().html(val);
                })
            }
        };
		$("#wqdpHeaderD .elemResizeInfo span.viewPosition").on("dblclick", function(e) {
			setElementInfo(e,$(this));
		}).on("click",function (e) {
            setElementInfo(e,$(this));
        })
        .on("input propertychange", "input", function() {
			val = $(this).val() || "0";
			if (val.match(/[^0-9]/g) && !$(this).parent(".elemResizeInfoDeg").length) {
				val = parseInt(val.replace(/[^0-9]/g, "")) || 0;
				if (val != $(this).attr("value")) {
					val = $(this).attr("value");
				}
				// $(this).val(val);
			}

			objVal($(this), true);
		}).on("keydown", "input", function(e) {
			val = parseInt($(this).val());
			switch (e.keyCode) {
				case 38:val++;
					// $(this).val(val);
					objVal($(this), false);break;
				case 40:val--;
					if (val < 0) val = 0;
					// $(this).val(val);
					objVal($(this), false);break;
				default:break;
			}
		}).on("keyup", "input", function(e) {
			objVal($(this), true);
		});

		function objVal($this, isSetCatch) {
			var obj = {}, $parent = $this.parent();

			$parent.hasClass("elemResizeInfoDeg") ? $this.val(val % 360) : $this.val(val);

			$parent.hasClass("elemResizeInfoX") ? obj = {
					left: parseInt(val),
					setCatch: isSetCatch
				} :
				$parent.hasClass("elemResizeInfoY") ? obj = {
					top: parseInt(val),
					setCatch: isSetCatch
				} :
				$parent.hasClass("elemResizeInfoW") ? obj = {
					width: parseInt(val),
					setCatch: isSetCatch
				} :
				$parent.hasClass("elemResizeInfoH") ? obj = {
					height: parseInt(val),
					setCatch: isSetCatch
				} :
				$parent.hasClass("elemResizeInfoDeg") ? obj = {
					deg: parseFloat(val % 360),
					setCatch: isSetCatch
				} : obj = {};

			if (val != $this.attr("value")) {
				$(document).trigger("elemResizeInfo:change", obj);
				if (obj.setCatch) {
					$parent.hasClass("elemResizeInfoDeg") ? $this.attr("value", val) : $this.attr("value", val % 360);
				}
			}
		}
	}
	return headerCtrl;
})
