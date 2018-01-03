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
    async newPage( @Param() p, @Query() q) {
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
            "domain": `?userId=${id}`,
            "pv": 0,
            "data": null,
            pageType,
            "sortId": 5,
            "renderId": "",
            "associateId": "ab6631511338414c9d9c1847faedf074",
            "viewWidth": 1200,
            "compressed": 1,
            "phonePageType": "normal",
            "synchro": false
        };

        // 查询模板
        // 校验 siteId userid
        const t = await this.templateService.where({ id }).find();
        a.data = t.data;
        const n = await this.service.thenAdd(a, { id });

        return { "status": 200, "data": n.data, "msg": "根据模板创建页面成功." };
    }

    @Post('/seo')
    seo( @Body() b) {
        const { pageId, name, domain, title, keywords, description } = b;

        return b;
    }

    @Post('/delete')
    delete( @Body() b) {
        const { pageId } = b;
        return { status: 200 };
    }

    all(q) {
        const { siteId } = q;

        let b = {
            "id": 1,
            "deleteStatus": 1,
            "seoTitle": 1,
            "seoDescn": 1,
            "siteId": 1,
            "userId": 1,
            "name": 1,
            "seoKeyword": 1,
            "domain": 1,
            "pv": 1,
            "pageType": 1,
            "sortId": 1,
            "renderId": 1,
            "associateId": 1,
            "viewWidth": 1,
            "synchro": 1
        }

        return this.service.field(b).order({ sortId: 1 }).select();
    }


    @Get('/:id')
    findById( @Param() p, @Query() q) {
        const { id } = p;

        if (id == 'all') {
            return this.all(q);
        }

        // if( id == 'seo') {
        //     return this.seo(q);
        // }

        return this.service.where({ id }).find();
    }
}