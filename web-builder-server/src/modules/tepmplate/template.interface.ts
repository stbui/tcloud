import { Document } from 'mongoose';

export interface TemplateInterface extends Document {
    // readonly id: Number;
    readonly name: String;
    readonly descn: String;
    readonly author: String;
    readonly order: Number;
    readonly icon: String;
    readonly type: String;
    readonly categoryId: Number;
    readonly categoryName: String;
    readonly data: String;
    readonly js: String;
    readonly sectionId: String;
    readonly domain: String;
    readonly activeStatus: String;
    readonly deleteStatus: String;
    readonly version: Number;
    readonly renderId: String;
    readonly orderId: Number;
    readonly serial: String;
    readonly tagIds: String;
    readonly online: Boolean;
}