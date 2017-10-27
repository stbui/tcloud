import { Controller, Get } from '@nestjs/common';

@Controller('site')
export class SiteController {

    @Get()
    query() {
        return {status: 200, message: null, data: null};
    }

    @Get('read')
    read() {
        return {status: 200, message: null, data: null};
    }
}