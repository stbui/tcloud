import { Module } from '@nestjs/common';
import { SiteController } from './site.controller';
import { DatabaseModule } from '../database/database.module';
import { SiteService } from './site.service';
import { SiteProviders } from './site.providers';


@Module({
    modules: [DatabaseModule],
    controllers: [SiteController],
    components: [
        SiteService,
        ...SiteProviders
    ]
})
export class SiteModule {
}