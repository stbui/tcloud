import { Controller, Get, Post, Body, Headers, Req, Query } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateInterface } from './template.interface';
import { TemplateModel } from './template.model';
//
import { TemplateDb } from './template.db';

@Controller('template')
export class TemplateController {

    constructor(private readonly service: TemplateService) {

    }

    @Get()
    async query() {
        const result = await this.service.select();
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

    @Get('/header')
    header() {
        return this.service.where({ type: 'headerPC' }).select();
    }

    @Get('/footer')
    async footer( @Query() q) {
        const { pageSize } = q;

        const result = await this.service.where({ type: 'footerPC' }).select();

        return {
            "totalCount": result.length,
            "pageNo": 1,
            pageSize,
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

    @Get('/section/list')
    async sectionList(@Query() q) {
        const { pageSize, cateid } = q;
        
        // const result = await this.service.where({ type: 'section' }).select();
        const result = TemplateDb.section1;
        return {
            "totalCount": result.length,
            "pageNo": 1,
            pageSize,
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

    @Get('/section')
    section() {
        return TemplateDb.section;
    }

    install() {
        const db = TemplateDb.footer;
        db.forEach((v, k) => {
            let model = new TemplateModel(v);
            this.service.create(model);
        });

        return { type: 'add'};
    }

    @Post()
    create( @Body() body: TemplateModel) {
        // this.service.create(body);
        return this.install();
    }

    @Post('/search')
    search( @Body() body) {
        return this.service.where(body).select();
    }

    comb(result) {
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

}