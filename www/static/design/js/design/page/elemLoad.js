define(["utility","templateIcon","templateText","templateButton","templateImage","templateShare","templateFollow","templateDrawing"],function(_util,_icon,_text,_button,_img,_share,_follow,_drawing) {
    //liumingren
    var temp = '<li class="{{liclass}}"><script class="wqdElementTemplate" type="text/template" charset="UTF-8">{{model}}</script>{{view}}</li>',
        tempObject = {
            icon:{
                model:'<div class="wqdelementEdit" data-elementtype="icon" data-elemandgroup="true">\
                        <div class="wqdelementEditBox">{{model}}</div>\
                    </div>',
                view:'<div class="selfIcon">\
                            <div class="wqdDIcon" style="display:inline-block;vertical-align: middle;margin:0 auto;width:40px;height:40px;">{{model}}</div>\
                        </div>'
            }
        };

	return {
        init:function() {
            var self = this;
            $.each({
                text:_text,
                button:_button,
                img:_img,
                icon:_icon,
                share:_share,
                follow:_follow,
                drawing:_drawing
            },function (i,value) {
                self.setElementList(i,value);
            });

            /* 旧有加载元素列表，待提取*/
            var _path = "../js/app/JSON/component/";
            //添加表格
            $.getJSON(_path+"designControlTab.json", function(data) {
                var Tabhtml = "";
                for (var i = 0; i < data.json.length; i++) {
                    Tabhtml += '<li class="wqdDragTabD">';
                    Tabhtml += ' <script type="text/template" charset="UTF-8">';
                    Tabhtml += '<div class="wqdelementEdit" data-elementtype="wqdTable" data-elemandgroup="true">';
                    Tabhtml += '<div class="wqdelementEditBox">';
                    Tabhtml += data.json[i].model;
                    Tabhtml += '<\/div> <\/div> <\/script>';
                    Tabhtml += '<div class="wqdDTab">';
                    Tabhtml += data.json[i].html;
                    Tabhtml += "<\/div><\/li>";
                }
                $("#wqdControlTabD ul").html(Tabhtml);
            });
            //添加图册
            $.getJSON(_path+"designControlPicture.json", function(data) {
                var Tabhtml = "";
                for (var i = 0; i < data.json.length; i++) {
                    Tabhtml += '<li class="wqdDragPictureD wqdSpecialEl">';
                    Tabhtml += ' <script type="text/template" charset="UTF-8">';
                    Tabhtml += '<div class="wqdelementEdit" data-elementtype="picture" data-elemandgroup="true">';
                    Tabhtml += '<div class="wqdelementEditBox">';
                    Tabhtml += data.json[i].model;
                    Tabhtml += '<\/div> <\/div> <\/script>';
                    Tabhtml += '<div class="wqdDAtlas">';
                    Tabhtml += data.json[i].html;
                    Tabhtml += "<\/div><\/li>";
                }
                $("#wqdControlPictureD ul").html(Tabhtml);
            });

            $.getJSON(_path+"designControlForm.json", function(data) {
                var Formhtml = "";
                for (var i = 0; i < data.json.length; i++) {
                    Formhtml += '<li class="wqdDragFormD ' + (data.json[i].type == "form" ? "wqdSpecialEl" : "") + '">';
                    Formhtml += ' <script type="text/template" charset="UTF-8">';
                    var container = data.json[i].type == "form" ? "elementsContainer" : "";
                    var notCopy = data.json[i].type == "formButton" ? "data-unused=\"copy\" wqdeleradius=\"4\"" : "";
                    Formhtml += '<div class="wqdelementEdit ' + container + '" data-elementtype="' + data.json[i].type + '" data-elemandgroup="true" ' + notCopy + '>';
                    Formhtml += '<div class="wqdelementEditBox">';
                    Formhtml += data.json[i].model;
                    Formhtml += '<\/div> <\/div> <\/script>';
                    Formhtml += '<div class="wqdDFormEl">' + data.json[i].html + '<\/div>';
                    Formhtml += "<\/li>";
                }
                $("#wqdControlFormD ul").html(Formhtml);
            });
            //关联元素
            $.getJSON(_path+"designControlRelative.json", function(data) {
                var Relativehtml = "";
                for (var i = 0; i < data.json.length; i++) {
                    Relativehtml += '<li class="wqdDragRelativeD wqdRelConD" style="margin-bottom:15px;">';
                    Relativehtml += ' <script type="text/template" charset="UTF-8">';
                    var unused = 'data-unused="copy"';
                    for (var j = 0; j < data.json[i].model.length; j++) {
                        unused = i==1&&j==1 ? ' data-unused="set,copy,dele"' : "";
                        Relativehtml += '<div class="wqdelementEdit elementsContainer ' + data.json[i].className[j] + '" data-elementtype="' + data.json[i].type[j] + '" data-elemandgroup="true"'+unused+'>';
                        Relativehtml += '<div class="wqdelementEditBox">';
                        Relativehtml += data.json[i].model[j];
                        Relativehtml += '<\/div> <\/div>###';
                    }
                    Relativehtml += '<\/script>';
                    Relativehtml += '<div class="wqdDRelative" style="position:relative;display:inline-block;">' + data.json[i].html + '<\/div>';
                    Relativehtml += "<\/li>";
                }
                $("#wqdControlRelativeD ul").html(Relativehtml);
            });
        },
        setTemplate:function (temp,type) {
            var model = tempObject[type] || {};
            return _util.format(temp,{
                liclass:"wqdDrag"+ type.substring(0,1).toUpperCase()+type.substring(1)+"D",
                model:model.model,
                view:model.view
            });
        },
        setElementList:function (type,data) {
            var template = this.setTemplate(temp,type);
            var selector = (type == "icon" ? "." : "#") + "wqdComponent"+ type.substring(0,1).toUpperCase() + type.substring(1) + "D";
            for(var i in data) {
                $(selector + (/drawing|icon/g.test(type) ? ".template-"+type+"-"+ i : "")).find("ul").html(_util.format(template,data[i]));
            }
        }
    };
});
