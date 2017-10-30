import { Controller, Get, Post, Body } from '@nestjs/common';
import { SiteService } from './site.service';
import { SiteInterface } from './site.interface';
import { SiteModel } from './site.model';

@Controller('site')
export class SiteController {

    constructor(private readonly service: SiteService) {

    }

    @Get()
    query() {
        return {status: 200, message: null, data: null};
    }

    @Post()
    async create(@Body() body: SiteModel): Promise<SiteInterface> {
        return this.service.create(body);
    }

    @Get('read')
    read() {
        return {status: 200, message: null, data: null};
    }
}