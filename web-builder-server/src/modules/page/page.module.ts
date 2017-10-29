import { Module } from '@nestjs/common';
import { PageController } from './page.controller';
import { PageProviders } from './page.providers';
import { DatabaseModule } from '../database/database.module';
import { PageService } from './page.service';

@Module({
    modules: [DatabaseModule],
    controllers: [PageController],
    components: [
        PageService,
        ...PageProviders
    ]
})
export class PageModule {
}