import * as mongoose from 'mongoose';

export const TemplateSchema = new mongoose.Schema({
    name: String,
    desc: String,
    author: String,
    order: Number,
    icon: String,
    type: String
});