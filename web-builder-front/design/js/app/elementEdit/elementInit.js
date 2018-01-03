define([
        'elementInfo',
        'elementToolbar',
        'elementRotate',
        'editText',
        'editImg',
        'editButton',
        'editIcon',
        'editCarouse',
        'editForm',
        'wqdFalls',
        'creatBaseElement',
        'editNav',
        'editSvg',
        'editMap',
        'editEBS',
        'editFollow',
        'editShare',
        // 'elementCorrelation',
        'editVideo',
        'editTable',
        'popupEditNav',
        'popupEditSecondNav',
        'editFormBox',
        'app/newArticle/articleList',
        'app/newArticle/articleListEditor',
        // 'editArticle',
        // 'editArticleList',
        'popupTuce',
        'popupImgEdit',
        'popupContainer',
        'app/article/editArticleDetails',
        'app/article/editArticleLists',
        'app/elementEdit/editSection',
        'progressBar',
        'progressCircle',
        'app/elementEdit/numberprogress',
        'editNavN',
        'editNav1',
        'editNav2',
        'editNav3'
    ], function(elementInfo,
                elementToolbar,
                elementRotate,
                editText,
                editImg,
                editButton,
                editIcon,
                editCarouse,
                editForm,
                wqdFalls,
                creatBaseElement,
                editNav,
                editSvg,
                editMap,
                editEBS,
                editFollow,
                editShare,
                // elementCorrelation,
                editVideo,
                editTable,
                popupEditNav,
                popupEditSecondNav,
                editFormBox,
                newArticleList,
                newArticleListEditor,
                // editArticle,
                // editArticleList,
                popupTuce,
                popupImgEdit,
                popupContainer,
                articleDetails,
                editArticleLists,
                editSection,
                progressBar,
                progressCircle,
                numberprogress,
                editNavN,
                editNav1,
                editNav2,
                editNav3
                ) {

    return {
        init: function() {
            editSection.init();
            elementInfo.init();
            elementToolbar.init();
            elementRotate.init();
            editText.init();
            editImg.init();
            editButton.init();
            editIcon.init();
            editCarouse.init();
            editForm.init();
            wqdFalls.init();
            creatBaseElement.init();
            editNav.init();
            editSvg.init();
            editMap.init();
            editEBS.init();
            editFollow.init();
            editShare.init();
            // elementCorrelation.init();
            editVideo.init();
            editTable.init();

            popupEditNav.init();
            editFormBox.init();

            popupTuce.init();
            // editArticle.init();
            // editArticleList.init();

            popupContainer.init();
            articleDetails.init();
            editArticleLists.init();
            progressBar.init();
            progressCircle.init();
            numberprogress.init();
            editNavN.init();
            newArticleList.init();
            newArticleListEditor.init();

            editNav1.init();
            editNav2.init();
            editNav3.init();
        }
    }
});
