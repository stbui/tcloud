import * as mongoose from 'mongoose';
import { Stream } from 'stream';

export const TemplateSchema = new mongoose.Schema({
    id: Number,
    name: String,
    descn: String,
    author: String,
    order: Number,
    icon: String,
    type: String,
    categoryId: Number,
    categoryName: String,
    data: String,
    js: String,
    sectionId: String,
    domain: String,
    activeStatus: String,
    deleteStatus: String,
    version: Number,
    renderId: String,
    orderId: Number,
    serial: String,
    tagIds: String,
    online: Boolean
});