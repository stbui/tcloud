'use strict';

import fs from 'fs';
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

        const _post = this.post();

        const data = this.getData();
        this.json(data)
    }

    setCorsHeader() {
        this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
        this.header("Access-Control-Allow-Headers", "x-requested-with");
        this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE");
        this.header("Access-Control-Allow-Credentials", "true");
    }


    getData() {
        //const filePath = `${think.ROOT_PATH}/template/11266.html`;
        //
        //const fileData = fs.readFileSync(filePath, 'utf-8');

        let result = {
            "totalCount": 12,
            "pageNo": 1,
            "pageSize": 12,
            "url": "",
            "parames": "",
            "data": [
                {
                    "id": 11266,
                    "icon": "http://img.wqdian.com/group4/M00/78/D7/yq0KYVcxpEqANTKMAAFwsVc_9gA376.png",
                    "categoryId": 0,
                    "type": "footerPC",
                    "descn": "页脚12",
                    "author": "dora",
                    "name": "页脚12",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1462440888563css",
                    "domain": "http://fee35a6e720f4dcfa5454b13dc6bdab0.cn.wqdian.com",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 0,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                },
                {
                    "id": 11243,
                    "icon": "http://img.wqdian.com/group4/M00/83/D0/yq0KYFcqpbCAEH-IAABD8fI-E_c324.png",
                    "categoryId": 0,
                    "type": "footerPC",
                    "descn": "页脚11-表单",
                    "author": "dora",
                    "name": "页脚11-表单",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1462353100299css",
                    "domain": "http://7e7535c405ac42598fb57034218d4690.cn.wqdian.com/",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 0,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                },
                {
                    "id": 11179,
                    "icon": "http://img.wqdian.com/group4/M00/83/37/yq0KYFcivdGAV_gBAACxp5FFSg8014.png",
                    "categoryId": 0,
                    "type": "footerPC",
                    "descn": "页脚10",
                    "author": "dora",
                    "name": "页脚10",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1461729440278css",
                    "domain": "http://9dece84a05934a3191229bcfd7afd65b.cn.wqdian.com/",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 0,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                },
                {
                    "id": 11145,
                    "icon": "http://img.wqdian.com/group4/M00/7B/FE/yq0KYFce0PCAUgh1AAB5_k_5DcQ399.png",
                    "categoryId": 0,
                    "type": "footerPC",
                    "descn": "页脚9",
                    "author": "dora",
                    "name": "页脚9",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1461578668580css",
                    "domain": "http://27cc4cce9e0342459f73296286835257.cn.wqdian.com/",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 0,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                },
                {
                    "id": 11136,
                    "icon": "http://img.wqdian.com/group4/M00/70/4B/yq0KYVce0VSAOfx2AABGTsLNZys516.png",
                    "categoryId": 0,
                    "type": "footerPC",
                    "descn": "页脚8",
                    "author": "dora",
                    "name": "页脚8",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1461576085659css",
                    "domain": "http://059880f4ce124daeb475ed4a078ef401.cn.wqdian.com/",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 0,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                },
                {
                    "id": 11122,
                    "icon": "http://img.wqdian.com/group4/M00/19/07/yq0KYVcYsdiATf88AACo13TJpx4988.png",
                    "categoryId": 0,
                    "type": "footerPC",
                    "descn": "页脚7",
                    "author": "dora",
                    "name": "页脚7",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1461230642786css",
                    "domain": "http://db73aeadc7644db49ace9756525f157d.cn.wqdian.com/",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 0,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                },
                {
                    "id": 11095,
                    "icon": "http://img.wqdian.com/group4/M00/24/B9/yq0KYFcYsbaAYjT9AAAk2jaOXtU633.png",
                    "categoryId": 0,
                    "type": "footerPC",
                    "descn": "页脚6",
                    "author": "dora",
                    "name": "页脚6",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1461217627350css",
                    "domain": "http://30137866b60e40f6a866dc72a2b8bab6.cn.wqdian.com/",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 0,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                },
                {
                    "id": 10876,
                    "icon": "http://img.wqdian.com/group4/M00/9D/10/yq0KYFcDd_2AXYuLAABKX4WHoXE094.png",
                    "categoryId": 0,
                    "type": "footerPC",
                    "descn": "页脚5",
                    "author": "dora",
                    "name": "页脚5",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1459499576385css",
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
                },
                {
                    "id": 10621,
                    "icon": "http://img.wqdian.com/group1/M00/E5/C8/yq0KXVZW4sWAQl9jAAAPep9tBYI694.jpg",
                    "categoryId": 12,
                    "type": "footerPC",
                    "descn": "V2-PC-页脚4",
                    "author": "hk",
                    "name": "V2-PC-页脚4",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1448534959828css",
                    "domain": "",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 0,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                },
                {
                    "id": 10602,
                    "icon": "http://img.wqdian.com/group3/M00/38/32/yq0KZVZUJfaAbcfQAAAO26DCZHM224.jpg",
                    "categoryId": 12,
                    "type": "footerPC",
                    "descn": "V2-PC-页脚3",
                    "author": "hk",
                    "name": "V2-PC-页脚3",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1448355558525css",
                    "domain": "",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 0,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                },
                {
                    "id": 10595,
                    "icon": "http://img.wqdian.com/group3/M00/33/18/yq0KZVZTygCAREVZAAAVv3FpBoU588.jpg",
                    "categoryId": 12,
                    "type": "footerPC",
                    "descn": "V2-PC-页脚2",
                    "author": "hk",
                    "name": "V2-PC-页脚2",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1448331995644css",
                    "domain": "",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 0,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                },
                {
                    "id": 10549,
                    "icon": "http://img.wqdian.com/group2/M00/75/6E/yq0KX1ZLHReAOHFoAAAMGSUz4s4242.png",
                    "categoryId": 12,
                    "type": "footerPC",
                    "descn": "空白页脚",
                    "author": "hjj",
                    "name": "空白页脚",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1447765808456css",
                    "domain": "",
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
            "endRows": 12,
            "totalPages": 1,
            "hasPre": false,
            "prePage": 1,
            "hasNext": false,
            "nextPage": 1
        }


        result.data.forEach((v,k)=>{
            let filePath = `${think.ROOT_PATH}/template/${v.id}.html`;
            let fileData = fs.readFileSync(filePath, 'utf-8');

            result.data[k].data = fileData;
        });

        return result;
    }
}