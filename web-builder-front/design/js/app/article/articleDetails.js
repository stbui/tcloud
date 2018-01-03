/*
* @Author: liumingren
* @Date:   2016-01-18 11:06:26
* @Last Modified by:   liumingren
* @Last Modified time: 2016-06-06 10:59:51
*/
define(['utility','createColorStyle','popupEdit','elementInfo'], function(_utility,_ccs,_popupEdit,_elementInfo) {
	var articleDetails = {};
	articleDetails.mdList = {
    	"title":"artDetlTitle",
    	"time":"artDetlTime",
    	"breadcrumb":"artDetlBreadcrumb",
        "hr":"artDetlHr",
    	"source":"artDetlSource",
    	"author":"artDetlAuthor",
    	"viewcount":"artDetlViewcount",
    	"follow":"artDetlFollow",
    	"summary":"artDetlSummary",
    	"img":"artDetlImg",
    	"content":"artDetlContent",
    	"share":"artDetlShare"
    };

	articleDetails.showNode = function(data){
        var $elem = this.element,
        	elemClass = articleDetails.mdList[data.type[0]],
        	$node = $elem.find("."+elemClass),
            $next = $node.nextAll(".wqdelementEdit:visible").eq(0);
        if($node.hasClass("dragMar") && $next.hasClass("dragMar")) {
            if($node.hasClass("artdetlHide")) {
                $node.css("marginTop",$next.css("marginTop"));
                $next.css("marginTop",20);
            }else {
                $next.css("marginTop",$node.css("marginTop"));
            }
        }
        $node.toggleClass("artdetlHide");
	};

	articleDetails.setCss = function (data) {
		var $elem = this.element.find("."+data.elemClass);
		for (var i in data) {
			if(i == "elemClass") continue;
			if(i.indexOf("font") != -1 && data.elemClass.indexOf("Content") == -1) $elem = $elem.find(".wqdelementEditBox").children();
			if(i.indexOf("hoverColor") != -1 || i.indexOf("shareHoverColor") != -1) {
                var selectId = $elem.parents(".wqdSectiondiv").attr("id");
				_ccs.styleInit(selectId,".wqdelementEdit.articleDetails ." + data.elemClass + ":hover svg path",{
	                "fill":data[i]
	            });
                _ccs.styleInit(selectId,".wqdelementEdit.articleDetails ." + data.elemClass + ".on svg path",{
                    "fill":data[i]
                });
	            $elem.attr("data-hover-color",data[i]);
			}else if(i.indexOf("shareColor") != -1) {
                $elem.find("svg path").attr("fill",data[i]);
			}else {
				$elem.css(i,data[i]);
                if(i == "color" && ($elem.hasClass("artDetlFollow") || $elem.hasClass("artDetlViewcount"))) {
                    $elem.find("svg path").attr("fill",data[i]);
                }
			}
		};
	};

	articleDetails.setBreadcrumb = function (dept,value) {
		this.element.find(".artDetlBreadcrumb .wqdelementEditBox .wqd-breadcrumb li").eq(dept-1).text(value);
	};

    articleDetails.setTimeType = function (data) {
        var $elem = this.element.find("."+data.elemClass).find(".wqdelementEditBox p"),
            timeText = $elem.text() || "",
            list = timeText.split(/\/|-|\.|年|月|日/),
            jsptemp,val;
        list.length > 3 && list.length--;
        if(data.type != 3){
            var sep = ["-","/","."][data.type];
            val = list.join(sep);
            jsptemp = "(news.createDate?string('"+["yyyy","MM","dd"].join(sep)+"'))";
        } else {
            val = list[0]+"年"+list[1]+"月"+list[2]+"日";
            jsptemp = "(news.createDate?string('yyyy"+"年"+"MM"+"月"+"dd"+"日'))";
        }
        $elem.text(val).attr("data-timetype",+data.type+1).attr("data-jsptemp",jsptemp);
    };

    articleDetails.toggleShareStyle = function (data,dfd) {
        var $elem = this.element.find("."+data.elemClass).find(".wqdControlShare"),
            color = $elem.find("svg path").eq(0).attr("fill"),
            self = this;
        $.getJSON('../js/app/JSON/component/designArticleDetailsShare.json', function(json, textStatus) {
            var $share = $(json.data[data.type]);
            $elem.attr("data-sharetype",data.type.replace(/share/g,"")).html($share);
            self.setCss({elemClass: "artDetlShare", shareColor: color});
            dfd.resolve();
        });
        return dfd.promise();
    }
	return articleDetails;

});

