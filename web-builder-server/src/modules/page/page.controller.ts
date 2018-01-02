import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { PageService } from './page.service';
import { PageInterface } from './page.interface';
import { PageModel } from './page.model';

import { SiteService } from '../site/site.service';
import { TemplateService } from '../tepmplate/template.service';
import { PageDb } from './page.db';

@Controller('page')
export class PageController {

    constructor(private readonly service: PageService, private siteService: SiteService, private templateService: TemplateService) {

    }

    async queryTemplateList() {
        const result = await this.templateService.findAll();
        return {
            "totalCount": 13,
            "pageNo": 1,
            "pageSize": 12,
            "url": "",
            "parames": "",
            "startRows": 0,
            "endRows": 12,
            "totalPages": 2,
            "hasPre": false,
            "prePage": 1,
            "hasNext": true,
            "nextPage": 2,
            "data": result
        };
    }


    @Get()
    query( @Query() q) {

        if (q.cateid) {
            return this.queryTemplateList();
        }

        return PageDb.pages;
    }


    @Post()
    create( @Body() body: PageModel) {
        return this.service.create(body);
    }

    @Get('/newPage/:id')
    newPage( @Param() p, @Query() q) {
        const { siteId, pageType } = q;
        const { id } = p;

        let a = {
            id,
            "deleteStatus": "Normal",
            "seoTitle": "",
            "seoDescn": "",
            siteId,
            "userId": 167569,
            "name": "页面",
            "seoKeyword": "",
            "domain": "/11309.html",
            "pv": 0,
            // "data": "",
            pageType,
            "sortId": 5,
            "renderId": "",
            "associateId": "ab6631511338414c9d9c1847faedf074",
            "viewWidth": 1200, "compressed": 1, "phonePageType": "normal", "synchro": false
        };


        // 查询模板
        // 校验 siteId userid
        const t = this.templateService.find({ id }).then(d => {
            a['data'] = d[0].data;
            let c = d[0];
            return { "status": 200, "data": a, "msg": "根据模板创建页面成功." }
        });

        // this.service.create(t);

        // 写入数据库


        return t;

        // const g = this.templateService.find({ id });
        // return { "status": 200, "data": g, "msg": "根据模板创建页面成功." };
    }

    @Get('/:id')
    findById( @Param() p) {
        if (p.id == 'all') {
            return PageDb.all;
        }

        return this.service.find({ id: p.id }).then(d => {
            console.log(d)
            if (d.length == 0) return {};
            return d.pop();
        });
    }

}