import { Document } from 'mongoose';

export interface PageInterface extends Document {
    readonly name: string,
    readonly url: string,
    readonly site: string,
    readonly user: string,
    readonly order: number,
    readonly pageType: string,
    readonly pv: string,
    readonly viewWidth: number,
    readonly createDate: string,
    readonly updateDate: string,
}