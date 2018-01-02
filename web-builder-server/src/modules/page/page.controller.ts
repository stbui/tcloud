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

    // @Get()
    // async query(): Promise<PageInterface[]> {
    //     return await this.service.findAll();
    // }

    // @Get(':name')
    // async find(@Param() param): Promise<PageInterface[]> {
    //     return await this.service.find({"name": param.name});
    // }

    @Post()
    create( @Body() body: PageModel) {
        return this.service.create(body);
    }

    @Get('all')
    all() {
        return PageDb.all;
    }
}