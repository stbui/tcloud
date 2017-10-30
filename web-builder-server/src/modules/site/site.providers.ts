import { Connection } from 'mongoose';
import { SiteSchema } from './site.schema';

export const SiteProviders = [
    {
        provide: 'SiteModelToken',
        useFactory: (connection: Connection) => connection.model('site', SiteSchema),
        inject: ['DbConnectionToken']
    }
];