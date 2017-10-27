'use strict';

import Base from '../base.js';
import fs from 'fs';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    indexAction() {
        let method = this.http.method.toLowerCase();
        if (method === "options") {
            this.setCorsHeader();
            this.end();
            return;
        }
        this.setCorsHeader();

        const _get = this.get();
        if (_get.cateid == 10342) {
            return this.json(this.getCate());
        } else {

        }
        this.json(this.getData());
    }

    addAction() {
        let method = this.http.method.toLowerCase();
        if (method === "options") {
            this.setCorsHeader();
            this.end();
            return;
        }
        this.setCorsHeader();

        const param = this.param();
        const {id} = param;

        return this.json(this.addPage(id));
    }

    readAction() {
        let method = this.http.method.toLowerCase();
        if (method === "options") {
            this.setCorsHeader();
            this.end();
            return;
        }
        this.setCorsHeader();


        const param = this.param();
        const {pageId} = param;

        return this.json(this.readPage(11304));
    }

    setCorsHeader() {
        this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
        this.header("Access-Control-Allow-Headers", "x-requested-with");
        this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE");
        this.header("Access-Control-Allow-Credentials", "true");
    }

    getData() {
        return [{
            "id": 10342,
            "createDate": "2016-03-05 16:08:30",
            "updateDate": "2016-03-05 16:08:30",
            "orderId": 20,
            "deleteStatus": "Normal",
            "type": "PAGE",
            "value": "首页",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "pagePC",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10344,
            "createDate": "2016-03-05 16:09:09",
            "updateDate": "2016-03-05 16:09:09",
            "orderId": 19,
            "deleteStatus": "Normal",
            "type": "PAGE",
            "value": "产品介绍",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "pagePC",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10345,
            "createDate": "2016-03-05 16:09:32",
            "updateDate": "2016-03-05 16:09:32",
            "orderId": 17,
            "deleteStatus": "Normal",
            "type": "PAGE",
            "value": "团队介绍",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "pagePC",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10354,
            "createDate": "2016-03-05 17:20:44",
            "updateDate": "2016-03-05 17:20:44",
            "orderId": 16,
            "deleteStatus": "Normal",
            "type": "PAGE",
            "value": "图册",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "pagePC",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10346,
            "createDate": "2016-03-05 16:09:42",
            "updateDate": "2016-03-05 16:09:42",
            "orderId": 15,
            "deleteStatus": "Normal",
            "type": "PAGE",
            "value": "服务介绍",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "pagePC",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10343,
            "createDate": "2016-03-05 16:08:48",
            "updateDate": "2016-03-05 16:38:00",
            "orderId": 14,
            "deleteStatus": "Normal",
            "type": "PAGE",
            "value": "关于我们",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "pagePC",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10657,
            "createDate": "2016-03-29 13:55:27",
            "updateDate": "2016-05-05 17:21:34",
            "orderId": 7,
            "deleteStatus": "Normal",
            "type": "PAGE",
            "value": "在线留言",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "pagePC",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10683,
            "createDate": "2016-03-29 18:27:34",
            "updateDate": "2016-03-29 18:28:03",
            "orderId": 5,
            "deleteStatus": "Normal",
            "type": "PAGE",
            "value": "产品定价",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "pagePC",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10356,
            "createDate": "2016-03-05 17:28:23",
            "updateDate": "2016-03-29 18:28:16",
            "orderId": 4,
            "deleteStatus": "Normal",
            "type": "PAGE",
            "value": "新闻动态",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "pagePC",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10347,
            "createDate": "2016-03-05 16:10:09",
            "updateDate": "2016-03-29 18:28:12",
            "orderId": 3,
            "deleteStatus": "Normal",
            "type": "PAGE",
            "value": "联系我们",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "pagePC",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10448,
            "createDate": "2016-03-15 14:24:51",
            "updateDate": "2016-03-29 13:55:31",
            "orderId": 0,
            "deleteStatus": "Normal",
            "type": "PAGE",
            "value": "空白页面",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "pagePC",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }]
    }

    getCate() {
        let result = {
            "totalCount": 13,
            "pageNo": 1,
            "pageSize": 12,
            "url": "",
            "parames": "",
            "data": [{
                "id": 11309,
                "icon": "http://img.wqdian.com/group4/M00/85/63/yq0KYFc63kuANTWQAAYYNy_WrNs406.png",
                "categoryId": 0,
                "type": "pagePC",
                "descn": "首页-旅游网站",
                "author": "dora",
                "name": "旅游网站",
                "data": "",
                "js": "",
                "sectionId": "wqd1463388697281css",
                "domain": "http://3ba7bcb4def94ec1a763221708aa5a89.cn.wqdian.com/",
                "activeStatus": "on",
                "deleteStatus": "Normal",
                "version": 2,
                "renderId": "",
                "orderId": 0,
                "categoryName": "",
                "serial": "",
                "tagIds": "",
                "online": false
            }, {
                "id": 11304,
                "icon": "http://img.wqdian.com/group4/M00/79/B1/yq0KYVc63qeAZZWNAAV1QkQZTAs113.png",
                "categoryId": 0,
                "type": "pagePC",
                "descn": "首页-互联网",
                "author": "dora",
                "name": "互联网",
                "data": "",
                "js": "",
                "sectionId": "wqd1463385841117css",
                "domain": "http://62f5733edd804a29bc05ed482e2d222b.cn.wqdian.com/",
                "activeStatus": "on",
                "deleteStatus": "Normal",
                "version": 2,
                "renderId": "",
                "orderId": 0,
                "categoryName": "",
                "serial": "",
                "tagIds": "",
                "online": false
            }, {
                "id": 11300,
                "icon": "http://img.wqdian.com/group4/M00/85/63/yq0KYFc63fWAFQo5AAaB8lQw438412.png",
                "categoryId": 0,
                "type": "pagePC",
                "descn": "首页-家具官网",
                "author": "dora",
                "name": "家具官网",
                "data": "",
                "js": "",
                "sectionId": "wqd1463381206640css",
                "domain": "http://63080b4875584731ae2d6fda401f145d.cn.wqdian.com/home.html",
                "activeStatus": "on",
                "deleteStatus": "Normal",
                "version": 2,
                "renderId": "",
                "orderId": 0,
                "categoryName": "",
                "serial": "",
                "tagIds": "",
                "online": false
            }, {
                "id": 11259,
                "icon": "http://img.wqdian.com/group4/M00/78/D7/yq0KYVcxpYmATFtnAAhSn8MSM8Y006.png",
                "categoryId": 0,
                "type": "pagePC",
                "descn": "首页-餐饮类",
                "author": "dora",
                "name": "餐饮类首页",
                "data": "",
                "js": "",
                "sectionId": "wqd1462439488459css",
                "domain": "http://fee35a6e720f4dcfa5454b13dc6bdab0.cn.wqdian.com/home.html",
                "activeStatus": "on",
                "deleteStatus": "Normal",
                "version": 2,
                "renderId": "",
                "orderId": 0,
                "categoryName": "",
                "serial": "",
                "tagIds": "",
                "online": false
            }, {
                "id": 11165,
                "icon": "http://img.wqdian.com/group4/M00/82/C7/yq0KYFcgYRKAJwicAASA26LGBZA818.png",
                "categoryId": 0,
                "type": "pagePC",
                "descn": "首页-旅游",
                "author": "dora",
                "name": "首页",
                "data": "",
                "js": "",
                "sectionId": "wqd1461642383750css",
                "domain": "http://e013188d36994710a45ad8fe65109110.cn.wqdian.com/home.html",
                "activeStatus": "on",
                "deleteStatus": "Normal",
                "version": 2,
                "renderId": "",
                "orderId": 0,
                "categoryName": "",
                "serial": "",
                "tagIds": "",
                "online": false
            }, {
                "id": 10862,
                "icon": "http://img.wqdian.com/group4/M00/B4/A8/yq0KYVb7jueAKXBMAAW2Rh4kBGM809.png",
                "categoryId": 0,
                "type": "pagePC",
                "descn": "首页",
                "author": "dora",
                "name": "商务",
                "data": "",
                "js": "",
                "sectionId": "wqd1459326678686css",
                "domain": "http://4fb4c8dd44814408b85923730c0a7dc4.cn.wqdian.com/http://4fb4c8dd44814408b85923730c0a7dc4.cn.wqdian.com/",
                "activeStatus": "on",
                "deleteStatus": "Normal",
                "version": 2,
                "renderId": "",
                "orderId": 0,
                "categoryName": "",
                "serial": "",
                "tagIds": "",
                "online": false
            }, {
                "id": 10852,
                "icon": "http://img.wqdian.com/group4/M00/B4/64/yq0KYVb7je2ARHymAAeIkHCO8v0591.png",
                "categoryId": 0,
                "type": "pagePC",
                "descn": "首页",
                "author": "dora",
                "name": "工具",
                "data": "",
                "js": "",
                "sectionId": "wqd1459242965680css",
                "domain": "http://1fab6dbe3a3c487da03325514fe6db73.cn.wqdian.com/",
                "activeStatus": "on",
                "deleteStatus": "Normal",
                "version": 2,
                "renderId": "",
                "orderId": 0,
                "categoryName": "",
                "serial": "",
                "tagIds": "",
                "online": false
            }, {
                "id": 10786,
                "icon": "http://img.wqdian.com/group3/M00/CE/C8/yq0KZVbarRSASskoAAQH5KyTJTA471.png",
                "categoryId": 0,
                "type": "pagePC",
                "descn": "1",
                "author": "dora",
                "name": "旅游",
                "data": "",
                "js": "",
                "sectionId": "wqd1457172249615css",
                "domain": "http://c1bd97347e6a4d3ba2694e4be51e39f5.cn.wqdian.com/home.html",
                "activeStatus": "on",
                "deleteStatus": "Normal",
                "version": 2,
                "renderId": "",
                "orderId": 400,
                "categoryName": "",
                "serial": "",
                "tagIds": "",
                "online": false
            }, {
                "id": 10785,
                "icon": "http://img.wqdian.com/group3/M00/CE/C1/yq0KZVbarNaAepRxAASR6BassOg779.png",
                "categoryId": 0,
                "type": "pagePC",
                "descn": "1",
                "author": "dora",
                "name": "商务服务2",
                "data": "",
                "js": "",
                "sectionId": "wqd1457172187732css",
                "domain": "http://e28e2f52c67c410189318998c3c1c210.cn.wqdian.com/",
                "activeStatus": "on",
                "deleteStatus": "Normal",
                "version": 2,
                "renderId": "",
                "orderId": 400,
                "categoryName": "",
                "serial": "",
                "tagIds": "",
                "online": false
            }, {
                "id": 10784,
                "icon": "http://img.wqdian.com/group3/M00/BF/48/yq0KZFbariiAJVjhAARC8quKwgA967.png",
                "categoryId": 0,
                "type": "pagePC",
                "descn": "1",
                "author": "dora",
                "name": "婚庆",
                "data": "",
                "js": "",
                "sectionId": "wqd1457172125696css",
                "domain": "http://0a69d4fc0de546c49bc4ee9219dd256a.cn.wqdian.com/",
                "activeStatus": "on",
                "deleteStatus": "Normal",
                "version": 2,
                "renderId": "",
                "orderId": 400,
                "categoryName": "",
                "serial": "",
                "tagIds": "",
                "online": false
            }, {
                "id": 10783,
                "icon": "http://img.wqdian.com/group3/M00/BF/3C/yq0KZFbardeAICneAAKl98z0j28550.png",
                "categoryId": 0,
                "type": "pagePC",
                "descn": "1",
                "author": "dora",
                "name": "商务服务1",
                "data": "",
                "js": "",
                "sectionId": "wqd1457172004739css",
                "domain": "http://39052ccde6a345669105b2a7e74178a6.cn.wqdian.com/home.html#wqd1447833062248serial",
                "activeStatus": "on",
                "deleteStatus": "Normal",
                "version": 2,
                "renderId": "",
                "orderId": 400,
                "categoryName": "",
                "serial": "",
                "tagIds": "",
                "online": false
            }, {
                "id": 10782,
                "icon": "http://img.wqdian.com/group3/M00/CE/A2/yq0KZVbaq-eAay1iAALVzB6JUC0815.png",
                "categoryId": 0,
                "type": "pagePC",
                "descn": "1",
                "author": "dora",
                "name": "美妆",
                "data": "",
                "js": "",
                "sectionId": "wqd1457171924734css",
                "domain": "http://255a0d3881e441f5a823a50a0efb78ae.cn.wqdian.com/",
                "activeStatus": "on",
                "deleteStatus": "Normal",
                "version": 2,
                "renderId": "",
                "orderId": 400,
                "categoryName": "",
                "serial": "",
                "tagIds": "",
                "online": false
            }],
            "startRows": 0,
            "endRows": 12,
            "totalPages": 2,
            "hasPre": false,
            "prePage": 1,
            "hasNext": true,
            "nextPage": 2
        }

        //result.data.forEach((v,k)=>{
        //    let filePath = `${think.ROOT_PATH}/template/${v.id}.html`;
        //    let fileConternt  = v.data;
        //    fs.writeFileSync(filePath, fileConternt, 'utf-8');
        //});

        result.data.forEach((v, k)=> {
            let filePath = `${think.ROOT_PATH}/template/${v.id}.html`;
            let fileData = fs.readFileSync(filePath, 'utf-8');

            result.data[k].data = fileData;
        });

        return result;
    }

    addPage(templateId) {
        let result = {
            "status": 200,
            "data": {
                "id": templateId,
                "deleteStatus": "Normal",
                "seoTitle": "",
                "seoDescn": "",
                "siteId": 69793,
                "userId": 167569,
                "name": "页面",
                "seoKeyword": "",
                "domain": "/" + templateId + ".html",
                "pv": 0,
                "data": "",
                "pageType": "normal",
                "sortId": 5,
                "renderId": "",
                "associateId": "ab6631511338414c9d9c1847faedf074",
                "viewWidth": 1200,
                "compressed": 1,
                "phonePageType": "normal",
                "synchro": false
            },
            "msg": "根据模板创建页面成功."
        }

        //result.data.forEach((v,k)=>{
        //    let filePath = `${think.ROOT_PATH}/template/${v.id}.html`;
        //    let fileConternt  = v.data;
        //    fs.writeFileSync(filePath, fileConternt, 'utf-8');
        //});

        //result.data.forEach((v,k)=>{
        //    let filePath = `${think.ROOT_PATH}/template/${v.id}.html`;
        //    let fileData = fs.readFileSync(filePath, 'utf-8');
        //
        //    result.data[k].data = fileData;
        //});

        //let filePath = `${think.ROOT_PATH}/template/${templateId}.html`;
        //let fileData = fs.readFileSync(filePath, 'utf-8');
        //
        //result.data.data = fileData;


        return result;
    }

    readPage(pageId) {
        let result = {
            "id": 228996,
            "deleteStatus": "Normal",
            "seoTitle": "",
            "seoDescn": "",
            "siteId": 69793,
            "userId": 167569,
            "name": "test",
            "seoKeyword": "",
            "domain": "/606b9a54a551415c85541546f27a17b1.html",
            "pv": 0,
            "data": "",
            "pageType": "normal",
            "sortId": 1,
            "renderId": "",
            "associateId": "71040641e3a04374984acfad5de07d95",
            "viewWidth": 1200,
            "compressed": 2,
            "phonePageType": "normal",
            "synchro": false
        };


        let filePath = `${think.ROOT_PATH}/template/${pageId}.html`;
        let fileData = fs.readFileSync(filePath, 'utf-8');

        result.data = fileData;

        return result;
    }
}