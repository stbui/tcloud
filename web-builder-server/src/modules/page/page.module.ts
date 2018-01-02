import { Module } from '@nestjs/common';
import { PageController } from './page.controller';
import { DatabaseModule } from '../database/database.module';
import { PageService } from './page.service';
import { PageProviders } from './page.providers';

import { SiteModule } from '../site/site.module';
import { TemplateModule } from '../tepmplate/template.module';


@Module({
    modules: [DatabaseModule, SiteModule, TemplateModule],
    controllers: [PageController],
    components: [
        PageService,
        ...PageProviders
    ]
})
export class PageModule {
}