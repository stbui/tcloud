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
        const db = TemplateDb.list;
        db.forEach((v, k) => {
            let model = new TemplateModel(v);
            // this.service.create(model);
        });

        return db;
    }

    @Post()
    create( @Body() body: TemplateModel) {
        this.service.create(body);
    }

    findAll() {
        return this.service.findAll();
    }

}