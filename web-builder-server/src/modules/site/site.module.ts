import { Module } from '@nestjs/common';
import { SiteController } from './site.controller';

@Module({
    modules: [],
    controllers: [SiteController]
})
export class SiteModule {
}