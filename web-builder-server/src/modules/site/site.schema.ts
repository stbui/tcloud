import * as mongoose from 'mongoose';

export const SiteSchema = new mongoose.Schema({
    name: String,
    domain: String
});