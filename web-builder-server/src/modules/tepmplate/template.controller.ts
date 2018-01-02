import { Controller, Get, Post, Body, Headers, Req } from '@nestjs/common';
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
        const result = await this.findAll();
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

    install() {
        const db = TemplateDb.pages;
        db.forEach((v, k) => {
            let model = new TemplateModel(v);
            this.service.create(model);
        });

        return db;
    }

    @Post()
    create( @Body() body: TemplateModel) {
        // this.service.create(body);
        return this.install();
    }

    findAll() {
        return this.service.findAll();
    }

    @Post('/search')
    search(@Body() body) {
        return this.find(body);
    }

    find(where) {
        return this.service.find(where);
    }

    @Get('/header')
    header() {
        const where = {type: 'headerPC'};
        return this.find(where);
    }

    @Get('/footer')
    footer() {
        const where = {type: 'footerPC'};
        return this.find(where);
    }

}