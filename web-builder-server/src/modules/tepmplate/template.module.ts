import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TemplateService } from './template.service';
import { TemplateProviders } from './template.providers';
import { TemplateController } from './template.controller';

@Module({
    modules: [DatabaseModule],
    controllers: [TemplateController],
    components: [
        TemplateService,
        ...TemplateProviders
    ],
    exports: [TemplateService]
})
export class TemplateModule {
}