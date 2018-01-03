import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';
import { PageModule } from './page/page.module';
import { SiteModule } from './site/site.module';
import { TemplateModule } from './tepmplate/template.module';
import { AppController } from './app.controller';
import { CorsMiddleware } from './common/middleware/cors.middleware';

@Module({
    modules: [PageModule, SiteModule, TemplateModule],
    controllers: [AppController]
})
export class ApplicationModule implements NestModule {
    configure(consumer: MiddlewaresConsumer): void {
        consumer.apply(CorsMiddleware).with('ApplicationModule').forRoutes(
            { path: '/site/read', method: RequestMethod.GET },
            { path: '/site/info', method: RequestMethod.GET },
            { path: '/page/:id', method: RequestMethod.ALL },
            { path: '/page/all', method: RequestMethod.GET },
            { path: '/page', method: RequestMethod.GET },
            { path: '/page/*', method: RequestMethod.ALL },
            { path: '/template/*', method: RequestMethod.ALL },
        );
    }
}