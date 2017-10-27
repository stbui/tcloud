import { Module } from '@nestjs/common';
import { PageController } from './page.controller';

@Module({
    modules: [],
    controllers: [PageController]
})
export class PageModule {
}