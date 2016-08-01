'use strict';

import Base from '../base.js';
import fs from 'fs';

export default class extends Base {
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

        return this.json(this.readPage(pageId));
    }

    setCorsHeader() {
        this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
        this.header("Access-Control-Allow-Headers", "x-requested-with");
        this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE");
        this.header("Access-Control-Allow-Credentials", "true");
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

    allPage(siteId) {
        let result =[];

        return result;
    }
}