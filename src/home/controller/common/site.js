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
        const {siteId} = param;

        return this.json(this.readPage(siteId));
    }

    setCorsHeader() {
        this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
        this.header("Access-Control-Allow-Headers", "x-requested-with");
        this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE");
        this.header("Access-Control-Allow-Credentials", "true");
    }

    readPage(siteId) {
        let result ={
            "status" : 200,
            "data" : {
                "id" : 69793,
                "name" : "实盘炒股大赛",
                "userId" : 167569,
                "activeStatus" : "on",
                "pv" : 0,
                "pvWeek" : 0,
                "pvMonth" : 0,
                "groupId" : "0c53d297d41e4d59a9a0c2b44b32b52d",
                "closeTitle" : "您访问的网站不存在或已关闭！",
                "closeContent" : "●  自定义提示信息，您访问的网站不存在或已关闭！$●  确保 Web 地址 http://www.stbui.com 正确。$●  请过几分钟后刷新页面。",
                "header" : "<style type=\"text/css\" id=\"styleCss\" uw=\"1200\">.wqdView,.wqdAreaView .wqdSectiondiv{min-width:1200px;}.wqdAreaView .wqdBkEditos,.hoverCon-section .wqdBkEditos{width:1200px;}.fullscreen .bannerContainer{margin:0 auto;width:1200px!important;}</style><div class=\"wqdAreaView\"></div>",
                "footer" : "<div class=\"wqdAreaView\"></div>",
                "displayMode" : "pc",
                "domain" : "http://www.stbui.com",
                "bakDate" : "",
                "ebsCode" : "",
                "siteId" : 0,
                "supportFlag" : "",
                "favicon" : "",
                "disableStyle" : "style0",
                "type" : "multi",
                "systemIp" : "202.173.13.234",
                "boughtIp" : "",
                "pageId" : 0,
                "template" : false,
                "ebs" : false,
                "online" : false,
                "synchro" : false,
                "support" : true,
                "caseSite" : false,
                "release" : true
            },
            "msg" : ""
        };

        return result;
    }

}