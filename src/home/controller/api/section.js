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

        const _post = this.post();

        //this.success(_post);
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
        return [{
            "id": 10321,
            "createDate": "2016-03-05 15:33:48",
            "updateDate": "2016-04-01 17:07:49",
            "orderId": 100,
            "deleteStatus": "Normal",
            "type": "SECTION",
            "value": "横幅广告",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "section",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10323,
            "createDate": "2016-03-05 15:33:48",
            "updateDate": "2016-04-01 17:08:06",
            "orderId": 80,
            "deleteStatus": "Normal",
            "type": "SECTION",
            "value": "图文介绍",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "section",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10322,
            "createDate": "2016-03-05 15:33:48",
            "updateDate": "2016-04-01 17:08:03",
            "orderId": 70,
            "deleteStatus": "Normal",
            "type": "SECTION",
            "value": "内容特点",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "section",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10324,
            "createDate": "2016-03-05 15:33:48",
            "updateDate": "2016-03-15 15:49:10",
            "orderId": 60,
            "deleteStatus": "Normal",
            "type": "SECTION",
            "value": "标题文字",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "section",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10327,
            "createDate": "2016-03-05 15:33:48",
            "updateDate": "2016-03-15 15:49:16",
            "orderId": 55,
            "deleteStatus": "Normal",
            "type": "SECTION",
            "value": "团队介绍",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "section",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10328,
            "createDate": "2016-03-05 15:33:48",
            "updateDate": "2016-03-15 15:49:21",
            "orderId": 50,
            "deleteStatus": "Normal",
            "type": "SECTION",
            "value": "定价方案",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "section",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10325,
            "createDate": "2016-03-05 15:33:48",
            "updateDate": "2016-04-27 11:54:44",
            "orderId": 40,
            "deleteStatus": "Normal",
            "type": "SECTION",
            "value": "用户评价",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "section",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10326,
            "createDate": "2016-03-05 15:33:48",
            "updateDate": "2016-04-27 11:54:51",
            "orderId": 38,
            "deleteStatus": "Normal",
            "type": "SECTION",
            "value": "客户案例",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "section",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10330,
            "createDate": "2016-03-05 15:33:48",
            "updateDate": "2016-04-27 11:54:57",
            "orderId": 35,
            "deleteStatus": "Normal",
            "type": "SECTION",
            "value": "报名&留言",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "section",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10329,
            "createDate": "2016-03-05 15:33:48",
            "updateDate": "2016-04-27 15:01:31",
            "orderId": 26,
            "deleteStatus": "Normal",
            "type": "SECTION",
            "value": "联系我们",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "section",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10331,
            "createDate": "2016-03-05 15:33:48",
            "updateDate": "2016-03-15 15:50:24",
            "orderId": 25,
            "deleteStatus": "Normal",
            "type": "SECTION",
            "value": "文章简介",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "section",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }, {
            "id": 10447,
            "createDate": "2016-03-15 14:20:53",
            "updateDate": "2016-03-15 15:49:44",
            "orderId": 0,
            "deleteStatus": "Normal",
            "type": "SECTION",
            "value": "空白栏目",
            "typeSon": 0,
            "showStatus": 1,
            "sectionType": "section",
            "listNews": [],
            "key": "com.wqdian.common.entity.tag.Tag-0"
        }]
    }
}