import { Connection } from 'mongoose';
import { PageSchema } from './page.schema';

export const PageProviders = [
    {
        provide: 'PageModelToken',
        useFactory: (connection: Connection) => connection.model('pages', PageSchema),
        inject: ['DbConnectionToken']
    }
];