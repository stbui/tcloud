import { Connection } from 'mongoose';
import { PageSchema } from './page.schema';

export const PageProviders = [
    {
        provide: 'PageModelToken',
        useFactory: (connection: Connection) => connection.model('template', PageSchema),
        inject: ['DbConnectionToken']
    }
];