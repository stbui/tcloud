import { Controller, Get, Post, Req, Body, Res, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
    @Post()
    index(@Body() b) {
        console.log(b);
        return [1, 2, 3, 4];
    }

    @Get()
    query() {
        return [1, 2, 3, 4];
    }
}