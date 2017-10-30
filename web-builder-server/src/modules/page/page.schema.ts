import * as mongoose from 'mongoose';

export const PageSchema = new mongoose.Schema({
    name: String,
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'site'
    },
    pageType: {
        type: String,
        default: ''
    },
    pv: {
        type: String,
        default: ''
    }
});