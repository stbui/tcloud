LIBCTX = LIBCTX || "http://libs.wqdian.com/";
/*配置要加载的js*/
require.config({
    // urlArgs: 'v='+wqdVersion,
    paths: {
        //工具类
        'utility': 'app/utility',
        /* ----- common ----- */
        // "jquery": "http://libs.wqdian.net/jquery/jquery-1.11.2.min",
        // "amplify": "../v2/lib/amplify.core.min",
        // "ckeditor":"http://libs.wqdian.net/ckeditor/ckeditor",
        /* -----动画编辑器----- */
        "animate": "app/animate/animate",
        /* -----元素编辑器----- */
        "navCommon" : "app/elementEdit/navCommon",
        "elementInit": "app/elementEdit/elementInit",
        "smartMenu": "app/elementEdit/smartMenu",
        "elementInfo": "app/elementEdit/elementInfo",
        "elementToolbar": "app/elementEdit/elementToolbar",
        "elementAlign": "app/elementEdit/elementAlign",
        "elementDistribute": "app/elementEdit/elementDistribute",
        "elementRotate": "app/elementEdit/elementRotate",
        "editText": "app/elementEdit/editText",
        "editImg": "app/elementEdit/editImg",
        "editButton": "app/elementEdit/editButton",
        "editIcon": "app/elementEdit/editIcon",

        "editVideo": "app/elementEdit/editVideo",
        "editTable": "app/elementEdit/editTable",

        "editNav": "app/elementEdit/editNav",
        "editSvg": "app/elementEdit/editSvg",
        "editMap": "app/elementEdit/editMap",
        "editCarouse": "app/elementEdit/editCarouse",
        "editForm": "app/elementEdit/editForm",
        "editEBS": "app/elementEdit/editEBS",
        "editFollow": "app/elementEdit/editFollow",
        "editShare": "app/elementEdit/editShare",
        "creatBaseElement": "app/elementEdit/creatBaseElement",
        "elementGroup": "app/elementEdit/elementGroup",
        "editFormBox": "app/elementEdit/editFormBox",
        "editHoverContainer":"app/elementEdit/editHoverContainer",
        "editNav1":"app/elementEdit/editNavtemplate/editNav1",
        "editNav2":"app/elementEdit/editNavtemplate/editNav2",
        "editNav3":"app/elementEdit/editNavtemplate/editNav3",
        /* -----弹窗编辑器开始----- */
        "popupEdit": "app/popupEdit/popupEdit",
        "popupEditNav": "app/popupEdit/popupEditNav",
        "popupEditSecondNav": "app/popupEdit/popupEditSecondNav",
        "popupDrag": "app/popupEdit/popupDrag",
        "popupFormEdit": "app/popupEdit/popupFormEdit",
        "popupFormBoxEdit": "app/popupEdit/popupFormBoxEdit",
        "popupCarouse": "app/popupEdit/popupCarouse",
        "popupCommon": "app/popupEdit/popupCommon",
        "popupFollow": "app/popupEdit/popupFollow",
        "popupImgEdit": "app/popupEdit/popupImgEdit",
        "popupTuce": "app/popupEdit/popupTuce",
        "popupContainer" : "app/popupEdit/popupContainer",
        "popupBase":"app/popupEdit/popupBase",
        /* -----弹窗编辑器结束----- */
        /* ---- article edit start ---- */
        "articleLists": "app/article/articleLists",
        /* ---- article edit end ---- */
        /* -----组件js开始----- */
        "wqdcarousel": "app/plugin/wqdcarousel",
        "wqdMapInit": "app/plugin/wqdMapInit",
        "wqdAnimation": "app/plugin/wqdAnimation",
        "wqdNavigate": "app/plugin/wqdNavigate",
        "wqdFalls": "app/plugin/wqdFalls",
        "wqdContainer" : "app/plugin/wqdContainer",

        "wqdNavElement" : "app/plugin/wqdNavElement",

        "navTemplate1" : "app/plugin/navTemplate1/navTemplate1",

        /* -----组件js结束----- */
        "createColorStyle": "app/insideEdit/createColorStyle",
        "adsorbGuides": "app/insideEdit/adsorbGuides",
        /* ---------- design--application 页面模块部分 start ---------- */
        "pageCommon":"design/application/pageCommon",
        "buildList":"design/application/buildList",
        "pageHeader":"design/application/pageHeader",
        "pageList":"design/application/pageList",
        "pageSet":"design/application/pageSet",
        "pageCatch":"design/application/pageCatch",
        "pageRuler":"design/application/pageRuler",
        "pageServices":"design/application/pageServices",
        /* ---------- design--application 页面模块部分 end ---------- */
        /* ---------- design--page 页面模块部分 start ---------- */
        "elemLoad":"design/page/elemLoad",
        "elemCtrl":"design/page/elemCtrl",
        "headerCtrl":"design/page/headerCtrl",
        "pageListCtrl":"design/page/pageListCtrl",
        "pageSetCtrl":"design/page/pageSetCtrl",
        "designInit":"design/designInit",
        "publish":"design/page/publish",
        /* ---------- design--page 页面模块部分 end ---------- */

        "templateIcon":LIBCTX+"/wqdElementTemplate/icon/icon",
        "templateText":LIBCTX+"/wqdElementTemplate/text/text",
        "templateButton":LIBCTX+"/wqdElementTemplate/button/button",
        "templateImage":LIBCTX+"/wqdElementTemplate/image/image",
        "templateShare":LIBCTX+"/wqdElementTemplate/share/share",
        "templateFollow":LIBCTX+"/wqdElementTemplate/follow/follow",
        "templateDrawing":LIBCTX+"/wqdElementTemplate/drawing/drawing",
        "numberprogress":"app/elementEdit/numberprogress",
        "progressBar":"app/elementEdit/progressBar",
        "progressCircle":"app/elementEdit/progressCircle",
        "editNavN": "app/elementEdit/editNavN"
    },
    shim: {
        // "jquery": {
        //     exports : "$"
        // },
        // "amplify": {
        //     exports : "amplify"
        // },
        // "ckeditor": {
        //     exports : "ckeditor"
        // }
    }
});

require([
'navCommon',
'elementInit',
'designInit',
'elementGroup',
'wqdNavigate',
'wqdContainer',
'articleLists',
'publish',
"editHoverContainer",
'wqdMapInit',
'wqdcarousel'], function (navCommon,elemInit,designInit,groupInit,wqdNavigate,wqdContainer,articleLists,publish,editHoverContainer){
    navCommon.init();
    elemInit.init();
    groupInit.init();
    wqdNavigate.init();
    wqdContainer.init();
    designInit.init();
    publish.init();
    articleLists.init();
    editHoverContainer.init();
});
