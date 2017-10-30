import { Document } from 'mongoose';

export interface SiteInterface extends Document {
    readonly name: string,
    readonly domain: string
}