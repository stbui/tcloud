import { Module } from '@nestjs/common';
import { PageController } from './page.controller';
import { DatabaseModule } from '../database/database.module';
import { PageService } from './page.service';
import { PageProviders } from './page.providers';


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