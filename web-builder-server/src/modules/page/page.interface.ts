import { Document } from 'mongoose';

export interface PageInterface extends Document {
    readonly name: string,
    readonly pageType: string,
    readonly pv: string
}