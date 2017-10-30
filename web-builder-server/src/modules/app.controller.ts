import { Controller, Get, Post, Req, Body, Res, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
    @Post()
    index(@Body() b) {
        return {status: 200, message: null, data: null};
    }

    @Get()
    query() {
        return {status: 200, message: null, data: null};
    }
}