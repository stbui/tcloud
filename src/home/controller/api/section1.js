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

        if(_get.cateid==10447) {
            return this.json(this.getEmptyColumData());
        }

        this.json(this.getData())
    }

    setCorsHeader() {
        this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
        this.header("Access-Control-Allow-Headers", "x-requested-with");
        this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE");
        this.header("Access-Control-Allow-Credentials", "true");
    }

    getData() {
        let result =  {
            "totalCount": 19,
            "pageNo": 1,
            "pageSize": 12,
            "url": "",
            "parames": "",
            "data": [{
                "id": 11314,
                "icon": "http://img.wqdian.com/group4/M00/7A/0C/yq0KYVc9lG-ASA0kAAKIDYSM-Tc281.png",
                "categoryId": 0,
                "type": "section",
                "descn": "横幅广告20-轮播图",
                "author": "dora",
                "name": "横幅广告20-轮播图",
                "data": "",
                "js": "",
                "sectionId": "wqd1463397176660css",
                "domain": "http://2bcd5f5f11da4142b0e2b79a6536e8f8.cn.wqdian.com/home.html",
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
                "id": 11297,
                "icon": "http://img.wqdian.com/group4/M00/85/63/yq0KYFc622yAW1e9AAOxnRMzWZY829.png",
                "categoryId": 0,
                "type": "section",
                "descn": "横幅广告19-动画效果",
                "author": "dora",
                "name": "横幅广告19-动画效果",
                "data": "",
                "js": "",
                "sectionId": "wqd1463380670031css",
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
                "id": 11285,
                "icon": "http://img.wqdian.com/group4/M00/85/68/yq0KYFc6__SAOFUNAAKCtGSMjjk095.png",
                "categoryId": 0,
                "type": "section",
                "descn": "横幅广告18",
                "author": "dora",
                "name": "横幅广告18-轮播图",
                "data": "",
                "js": "",
                "sectionId": "wqd1463125356910css",
                "domain": "http://5ae8343d92bb4543803f4a66e9e0071d.cn.wqdian.com/",
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
                "id": 11255,
                "icon": "http://img.wqdian.com/group4/M00/78/D7/yq0KYVcxo9-AA2qRAAIPLObGdrQ805.png",
                "categoryId": 0,
                "type": "section",
                "descn": "横幅广告17",
                "author": "dora",
                "name": "横幅广告17",
                "data": "",
                "js": "",
                "sectionId": "wqd1462438824567css",
                "domain": "http://fee35a6e720f4dcfa5454b13dc6bdab0.cn.wqdian.com/",
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
                "id": 11248,
                "icon": "http://img.wqdian.com/group4/M00/78/D6/yq0KYVcxo5aAMnicAAM5IkPc1EM509.png",
                "categoryId": 0,
                "type": "section",
                "descn": "横幅广告16-app",
                "author": "dora",
                "name": "横幅广告16-app",
                "data": "",
                "js": "",
                "sectionId": "wqd1462414597594css",
                "domain": "http://1979d2940bc24c04a4aec3870cb3897b.cn.wqdian.com/",
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
                "id": 11205,
                "icon": "http://img.wqdian.com/group4/M00/83/9D/yq0KYFcoSLaAdIskAAHAxVnnXg0070.png",
                "categoryId": 0,
                "type": "section",
                "descn": "横幅广告15-轮播图",
                "author": "dora",
                "name": "横幅广告15-轮播图",
                "data": "",
                "js": "",
                "sectionId": "wqd1461827845428css",
                "domain": "http://4286929f03344d58b4488ae5ac55f0a5.cn.wqdian.com/",
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
                "id": 11196,
                "icon": "http://img.wqdian.com/group4/M00/77/EB/yq0KYVcoSNqAGhqEAAKGAa6Ivzo451.png",
                "categoryId": 0,
                "type": "section",
                "descn": "横幅广告14-轮播图",
                "author": "dora",
                "name": "横幅广告14-轮播图",
                "data": "",
                "js": "",
                "sectionId": "wqd1461813238400css",
                "domain": "http://2d1ce2c379c247518e4b54e1ea7ac101.cn.wqdian.com/",
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
                "id": 10960,
                "icon": "http://img.wqdian.com/group4/M00/8B/97/yq0KYVcPCgOAOK-9AAEXnF-_fkE528.png",
                "categoryId": 0,
                "type": "section",
                "descn": "pc端-横幅广告13-轮播图",
                "author": "dora",
                "name": "横幅广告13-轮播图",
                "data": "",
                "js": "",
                "sectionId": "wqd1459913991645css",
                "domain": "http://6859665241694f96ada0ed1fe64bf0dc.cn.wqdian.com/",
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
                "id": 10900,
                "icon": "http://img.wqdian.com/group4/M00/16/C6/yq0KYVcHPSWAOwqbAAI7H65qesE812.png",
                "categoryId": 0,
                "type": "section",
                "descn": "pc端横幅广告12",
                "author": "dora",
                "name": "横幅广告12",
                "data": "",
                "js": "",
                "sectionId": "wqd1459855765625css",
                "domain": "http://7ca3435232d7491eb2f0f59bd4e3ab47.cn.wqdian.com/",
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
                "id": 10872,
                "icon": "http://img.wqdian.com/group4/M00/9C/CE/yq0KYFcDdvKAeDoAAADP2aTqHXU684.png",
                "categoryId": 0,
                "type": "section",
                "descn": "横幅广告11",
                "author": "dora",
                "name": "横幅广告11",
                "data": "",
                "js": "",
                "sectionId": "wqd1459495047099css",
                "domain": "http://08855e71f36446439066b7021768f30a.cn.wqdian.com/",
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
                "id": 10854,
                "icon": "http://img.wqdian.com/group4/M00/B4/E6/yq0KYVb7j8aAIZB6AAJuJb6xl5o481.png",
                "categoryId": 0,
                "type": "section",
                "descn": "轮播banner",
                "author": "dora",
                "name": "横幅广告10",
                "data": "",
                "js": "",
                "sectionId": "wqd1459248229477css",
                "domain": "http://4fb4c8dd44814408b85923730c0a7dc4.cn.wqdian.com/",
                "activeStatus": "on",
                "deleteStatus": "Normal",
                "version": 2,
                "renderId": "",
                "orderId": 1,
                "categoryName": "",
                "serial": "",
                "tagIds": "",
                "online": false
            }, {
                "id": 10622,
                "icon": "http://img.wqdian.com/group1/M00/E9/81/yq0KXFZXw3OAQkijAABMQLS_3cc958.jpg",
                "categoryId": 0,
                "type": "section",
                "descn": "V2-PC-横幅9",
                "author": "hk",
                "name": "PC-横幅9",
                "data": "",
                "js": "",
                "sectionId": "wqd1448592383072css",
                "domain": "1",
                "activeStatus": "on",
                "deleteStatus": "Normal",
                "version": 2,
                "renderId": "",
                "orderId": 0,
                "categoryName": "",
                "serial": "",
                "tagIds": "",
                "online": false
            }],
            "startRows": 0,
            "endRows": 12,
            "totalPages": 2,
            "hasNext": true,
            "nextPage": 2,
            "hasPre": false,
            "prePage": 1
        }

        //result.data.forEach((v,k)=>{
        //    let filePath = `${think.ROOT_PATH}/template/${v.id}.html`;
        //    let fileConternt  = v.data;
        //    fs.writeFileSync(filePath, fileConternt, 'utf-8');
        //});

        result.data.forEach((v,k)=>{
            let filePath = `${think.ROOT_PATH}/template/${v.id}.html`;
            let fileData = fs.readFileSync(filePath, 'utf-8');

            result.data[k].data = fileData;
        });

        return result;
    }

    getEmptyColumData() {
        return {
            "totalCount": 1,
            "pageNo": 1,
            "pageSize": 12,
            "url": "",
            "parames": "",
            "data": [
                {
                    "id": 10542,
                    "icon": "http://img.wqdian.com/group2/M00/75/6E/yq0KX1ZLHReAOHFoAAAMGSUz4s4242.png",
                    "categoryId": 0,
                    "type": "section",
                    "descn": "空白栏目",
                    "author": "hjj",
                    "name": "空白栏目-PC",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1445504393013css",
                    "domain": "1",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 0,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                }
            ],
            "startRows": 0,
            "endRows": 1,
            "totalPages": 1,
            "hasPre": false,
            "prePage": 1,
            "hasNext": false,
            "nextPage": 1
        }
    }
}