import * as mongoose from 'mongoose';

export const SiteSchema = new mongoose.Schema({
    name: String,
    domain: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member'
    },
    pv: Number,
    displayMode: String,
    favicon: String,
    release: Boolean
});