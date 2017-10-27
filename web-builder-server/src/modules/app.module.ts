import { Module } from '@nestjs/common';
import { PageModule } from './page/page.module';
import { SiteController } from './site/site.controller';
import { AppController } from './app.controller';

@Module({
    modules: [PageModule, SiteController],
    controllers: [AppController]
})
export class ApplicationModule {
}