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

        const _get = this.get();


        this.json({});
    }

    setCorsHeader() {
        this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
        this.header("Access-Control-Allow-Headers", "x-requested-with");
        this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE");
        this.header("Access-Control-Allow-Credentials", "true");
    }

    getData(pageId) {
        let result = {
            "id": 513836,
            "deleteStatus": "Normal",
            "seoTitle": "",
            "seoDescn": "",
            "siteId": 69793,
            "userId": 167569,
            "name": "直播大赛",
            "seoKeyword": "",
            "domain": "/992e7c2fc65348f796ef4d0404a25895.html",
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
        }

        //let filePath = `${think.ROOT_PATH}/template/${result.id}.html`;
        let filePath = `${think.ROOT_PATH}/template/${pageId}.html`;
        let fileData = fs.readFileSync(filePath, 'utf-8');

        result.data = fileData;

        return result;
    }
}