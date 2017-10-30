import * as mongoose from 'mongoose';

export const PageSchema = new mongoose.Schema({
    name: String,
    site: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'site'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member'
    },
    pageType: {
        type: String,
        default: ''
    },
    pv: Number,
    createDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    order: Number,
    url: String,
    viewWidth: Number
});