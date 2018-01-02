import { Controller, Get, Post, Body, Headers, Req } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteInterface } from './site.interface';
import { SiteModel } from './site.model';

import { SiteDb } from './site.db';

@Controller('site')
export class SiteController {

    constructor(private readonly service: SiteService) {

    }

    @Get()
    query() {
        let result ={
            "id" : 11400,
            "createDate" : "2016-02-19 17:12:24",
            "updateDate" : "",
            "code" : "<a target=\"_blank\" href=\"http://wpa.qq.com/msgrd?v=3&uin=123340012345&site=qq&menu=yes\"><img border=\"0\" src=\"http://img.wqdian.com/group1/M00/F0/79/yq0KXVYFEkqAC7eWAAASKQ7VabQ251.png\" alt=\"点击这里给我发消息\" title=\"点击这里给我发消息\"/></a>",
            "openIcon" : "#fff",
            "openTitle" : "#fff",
            "groupId" : "0c53d297d41e4d59a9a0c2b44b32b52d",
            "remark" : "在线时间：<br>周一到周五<br>早9:00~18:00<br>周六周日休息",
            "openBg" : "#504f55",
            "userId" : 167569,
            "defaultBg" : "#676669",
            "openContent" : "#999",
            "defaultIcon" : "#fff",
            "deleteStatus" : "Normal",
            "activeStatus" : "off",
            "key" : "com.wqdian.common.entity.site.CustomerService-11400"
        }

        return result;
        // return {status: 220, message: null, data: null};
    }

    @Post()
    async create(@Body() body: SiteModel): Promise<SiteInterface> {
        return this.service.create(body);
    }

    @Get('read')
    read(@Headers() header, @Req() req) {
        
        return SiteDb.read;
    }

    @Get('info')
    info() {
        return SiteDb.info;
    }
}