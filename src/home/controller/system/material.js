'use strict';

import Base from '../base.js';

export default class extends Base {

    indexAction() {
        let method = this.http.method.toLowerCase();
        if (method === "options") {
            this.setCorsHeader();
            this.end();
            return;
        }
        this.setCorsHeader();


        let result = {
            "totalCount" : 175,
            "pageNo" : 1,
            "pageSize" : 50,
            "url" : "",
            "parames" : "",
            "data" : [ {
                "id" : 224375,
                "createDate" : "2016-05-11 16:42:59",
                "updateDate" : "2016-05-11 16:42:59",
                "name" : "人物系140.jpg",
                "userId" : 10527,
                "path" : "upload/group/01/yq0KYVcy8GqAcOg6ABmFTHAj6MY000.png",
                "categoryId" : 2,
                "categoryName" : "人物",
                "thumbnail" : "upload/group/01/yq0KYVcy8GqAcOg6ABmFTHAj6MY000.png",
                "width" : 0,
                "height" : 0,
                "fileSize" : 208058,
                "sortId" : 0,
                "deleteStatus" : "Normal",
                "fileType" : "pic",
                "key" : "com.wqdian.common.entity.system.Material-224375"
            }, {
                "id" : 224376,
                "createDate" : "2016-05-11 16:42:59",
                "updateDate" : "2016-05-11 16:42:59",
                "name" : "16dx4t1xxg.jpg",
                "userId" : 10527,
                "path" : "upload/group/01/16dx4t1xxg.jpg",
                "categoryId" : 2,
                "categoryName" : "人物",
                "thumbnail" : "upload/group/01/16dx4t1xxg.jpg",
                "width" : 0,
                "height" : 0,
                "fileSize" : 484126,
                "sortId" : 0,
                "deleteStatus" : "Normal",
                "fileType" : "pic",
                "key" : "com.wqdian.common.entity.system.Material-224376"
            }, {
                "id" : 224361,
                "createDate" : "2016-05-11 16:42:56",
                "updateDate" : "2016-05-11 16:42:56",
                "name" : "人物系126.jpg",
                "userId" : 10527,
                "path" : "upload/group/01/yq0KYVcy8GqAcOg6ABmFTHAj6MY000.png",
                "categoryId" : 2,
                "categoryName" : "人物",
                "thumbnail" : "upload/group/01/yq0KYVcy8GqAcOg6ABmFTHAj6MY000.png",
                "width" : 0,
                "height" : 0,
                "fileSize" : 507149,
                "sortId" : 0,
                "deleteStatus" : "Normal",
                "fileType" : "pic",
                "key" : "com.wqdian.common.entity.system.Material-224361"
            }, {
                "id" : 224328,
                "createDate" : "2016-05-11 16:42:48",
                "updateDate" : "2016-05-11 16:42:48",
                "name" : "人物系92.jpg",
                "userId" : 10527,
                "path" : "upload/group/01/yq0KYVcy8GqAcOg6ABmFTHAj6MY000.png",
                "categoryId" : 2,
                "categoryName" : "人物",
                "thumbnail" : "upload/group/01/yq0KYVcy8GqAcOg6ABmFTHAj6MY000.png",
                "width" : 0,
                "height" : 0,
                "fileSize" : 322497,
                "sortId" : 0,
                "deleteStatus" : "Normal",
                "fileType" : "pic",
                "key" : "com.wqdian.common.entity.system.Material-224328"
            } ],
            "startRows" : 0,
            "endRows" : 50,
            "totalPages" : 4,
            "hasPre" : false,
            "prePage" : 1,
            "hasNext" : true,
            "nextPage" : 2
        }

        this.json(result);
    }

    categoriesAction() {
        let method = this.http.method.toLowerCase();
        if (method === "options") {
            this.setCorsHeader();
            this.end();
            return;
        }
        this.setCorsHeader();

        let result = [{
            "id": 1,
            "name": "风景",
            "sortId": 0,
            "userId": 1,
            "fileType": "pic"
        }, {
            "id": 2,
            "name": "人物",
            "sortId": 0,
            "userId": 1,
            "fileType": "pic"
        }, {
            "id": 3,
            "name": "建筑",
            "sortId": 0,
            "userId": 1,
            "fileType": "pic"
        }, {
            "id": 4,
            "name": "动物",
            "sortId": 0,
            "userId": 1,
            "fileType": "pic"
        }, {
            "id": 5,
            "name": "商务",
            "sortId": 0,
            "userId": 1,
            "fileType": "pic"
        }, {
            "id": 6,
            "name": "室内",
            "sortId": 0,
            "userId": 1,
            "fileType": "pic"
        }, {
            "id": 7,
            "name": "纹理",
            "sortId": 0,
            "userId": 1,
            "fileType": "pic"
        }, {
            "id": 8,
            "name": "美食",
            "sortId": 0,
            "userId": 1,
            "fileType": "pic"
        }, {
            "id": 9,
            "name": "其他",
            "sortId": 0,
            "userId": 1,
            "fileType": "pic"
        }, {
            "id": 16567,
            "name": "新分类",
            "sortId": 0,
            "userId": 1,
            "fileType": "pic"
        }, {
            "id": 16574,
            "name": "未命名分类",
            "sortId": 0,
            "userId": 1,
            "fileType": "pic"
        }, {
            "id": 16575,
            "name": "未命名分类",
            "sortId": 0,
            "userId": 1,
            "fileType": "pic"
        }, {
            "id": 16576,
            "name": "未命名分类",
            "sortId": 0,
            "userId": 1,
            "fileType": "pic"
        }, {
            "id": 16577,
            "name": "未命名分类",
            "sortId": 0,
            "userId": 1,
            "fileType": "pic"
        }, {
            "id": 16583,
            "name": "新分类",
            "sortId": 0,
            "userId": 1,
            "fileType": "pic"
        }];

        return result;
    }

    setCorsHeader() {
        this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
        this.header("Access-Control-Allow-Headers", "x-requested-with");
        this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE");
        this.header("Access-Control-Allow-Credentials", "true");
    }
}