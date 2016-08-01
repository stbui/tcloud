'use strict';

import fs from 'fs';
import Base from '../base.js';

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
        let result =  {
            "totalCount": 18,
            "pageNo": 1,
            "pageSize": 12,
            "url": "",
            "parames": "",
            "data": [
                {
                    "id": 11328,
                    "icon": "http://img.wqdian.com/group4/M00/8C/B8/yq0KYFd_OqSAZK03AAAh_0iv77w347.png",
                    "categoryId": 0,
                    "type": "headerPC",
                    "descn": "前端-苗飞要求添加",
                    "author": "dora",
                    "name": "导航16",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1467956139848css",
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
                },
                {
                    "id": 11326,
                    "icon": "http://img.wqdian.com/group4/M00/85/BE/yq0KYFc9lG-ADCcxAACHO1g1Hac394.png",
                    "categoryId": 0,
                    "type": "headerPC",
                    "descn": "导航15-子菜单",
                    "author": "dora",
                    "name": "导航15-子菜单",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1463558848325css",
                    "domain": "http://08de2165d4a04077949bce5fb6d2af97.cn.wqdian.com/",
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
                    "id": 11267,
                    "icon": "http://img.wqdian.com/group4/M00/79/95/yq0KYVc5lcGAI__nAABU_yEpl3c841.png",
                    "categoryId": 0,
                    "type": "headerPC",
                    "descn": "导航14-子菜单",
                    "author": "dora",
                    "name": "导航14-子菜单",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1462771452028css",
                    "domain": "http://9eb55d44379e420c95753758cdd92684.cn.wqdian.com/",
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
                    "id": 11126,
                    "icon": "http://img.wqdian.com/group4/M00/19/05/yq0KYVcYsb6AYXf4AAAfJm-LSEs101.png",
                    "categoryId": 0,
                    "type": "headerPC",
                    "descn": "导航13",
                    "author": "dora",
                    "name": "导航13",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1461232553698css",
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
                    "id": 11047,
                    "icon": "http://img.wqdian.com/group4/M00/8C/18/yq0KYVcPEOOAG-ZvAADhv8bQxAY385.png",
                    "categoryId": 0,
                    "type": "headerPC",
                    "descn": "导航12-子菜单",
                    "author": "dora",
                    "name": "导航12-子菜单",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1460446717144css",
                    "domain": "http://7183b05a0d374623ae002bc5c6273ddd.cn.wqdian.com/",
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
                    "id": 11046,
                    "icon": "http://img.wqdian.com/group4/M00/8C/17/yq0KYVcPENCAekoRAAEaFW2nFKg354.png",
                    "categoryId": 0,
                    "type": "headerPC",
                    "descn": "导航11-子菜单",
                    "author": "dora",
                    "name": "导航11-子菜单",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1460446408575css",
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
                },
                {
                    "id": 11044,
                    "icon": "http://img.wqdian.com/group4/M00/97/C9/yq0KYFcPELGAHcc_AABIqHcPlY8993.png",
                    "categoryId": 0,
                    "type": "headerPC",
                    "descn": "子菜单导航",
                    "author": "dora",
                    "name": "导航10-子菜单",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1460197290889css",
                    "domain": "http://4a484618b2904e07a52c56ca78ac4320.cn.wqdian.com/",
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
                    "id": 10804,
                    "icon": "http://img.wqdian.com/group3/M00/58/FE/yq0KZFbnuFSAMv7XAAA6CaMFA4g937.jpg",
                    "categoryId": 0,
                    "type": "headerPC",
                    "descn": "运动",
                    "author": "dora",
                    "name": "导航9",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1457602657513css",
                    "domain": "http://3871a9996d5a4aad839023e9c180a8c9.cn.wqdian.com/",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 1,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                },
                {
                    "id": 10803,
                    "icon": "http://img.wqdian.com/group3/M00/58/FB/yq0KZFbnuEqAZenlAAAxzTQ55h4365.jpg",
                    "categoryId": 0,
                    "type": "headerPC",
                    "descn": "摄影",
                    "author": "dora",
                    "name": "导航8",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1457601971918css",
                    "domain": "http://87c5f2950d6b4198ae19dc68338100e5.cn.wqdian.com/",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 1,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                },
                {
                    "id": 10802,
                    "icon": "http://img.wqdian.com/group3/M00/6D/63/yq0KZVbntiaABLjDAABo197hDSs039.jpg",
                    "categoryId": 0,
                    "type": "headerPC",
                    "descn": "商务",
                    "author": "dora",
                    "name": "导航7",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1457596532786css",
                    "domain": "http://d4b659e9664a4f5588d4d92d0b3c45ff.cn.wqdian.com/",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 1,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                },
                {
                    "id": 10801,
                    "icon": "http://img.wqdian.com/group3/M00/6D/53/yq0KZVbntfGAGPPdAABt0y9lsnQ416.jpg",
                    "categoryId": 0,
                    "type": "headerPC",
                    "descn": "商务",
                    "author": "dora",
                    "name": "导航6",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1457595668085css",
                    "domain": "http://e28e2f52c67c410189318998c3c1c210.cn.wqdian.com/",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 1,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                },
                {
                    "id": 10800,
                    "icon": "http://img.wqdian.com/group3/M00/58/E2/yq0KZFbnt_yALcHhAAA-C-sOd7U553.jpg",
                    "categoryId": 0,
                    "type": "headerPC",
                    "descn": "美妆",
                    "author": "dora",
                    "name": "导航5",
                    "data": "",
                    "js": "",
                    "sectionId": "wqd1457595300754css",
                    "domain": "http://255a0d3881e441f5a823a50a0efb78ae.cn.wqdian.com/",
                    "activeStatus": "on",
                    "deleteStatus": "Normal",
                    "version": 2,
                    "renderId": "",
                    "orderId": 1,
                    "categoryName": "",
                    "serial": "",
                    "tagIds": "",
                    "online": false
                }
            ],
            "startRows": 0,
            "endRows": 12,
            "totalPages": 2,
            "hasPre": false,
            "prePage": 1,
            "hasNext": true,
            "nextPage": 2
        }


        result.data.forEach((v,k)=>{
            let filePath = `${think.ROOT_PATH}/template/${v.id}.html`;
            let fileData = fs.readFileSync(filePath, 'utf-8');

            result.data[k].data = fileData;
        });

        return result;
    }
}