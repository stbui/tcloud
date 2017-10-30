import { Module } from '@nestjs/common';
import { PageModule } from './page/page.module';
import { SiteModule } from './site/site.module';
import { AppController } from './app.controller';

@Module({
    modules: [PageModule, SiteModule],
    controllers: [AppController]
})
export class ApplicationModule {
}