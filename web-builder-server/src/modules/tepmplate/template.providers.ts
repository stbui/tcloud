import { Connection } from 'mongoose';
import { TemplateSchema } from './template.schema';

export const TemplateProviders = [
    {
        provide: 'TemplateModelToken',
        useFactory: (connection: Connection) => connection.model('templates', TemplateSchema),
        inject: ['DbConnectionToken']
    }
];