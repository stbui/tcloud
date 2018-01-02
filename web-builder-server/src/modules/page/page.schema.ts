import * as mongoose from 'mongoose';

export const PageSchema = new mongoose.Schema({

    // name: String,
    // site: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'site'
    // },
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'member'
    // },
    // pageType: {
    //     type: String,
    //     default: ''
    // },
    // pv: Number,
    // createDate: {
    //     type: Date,
    //     default: Date.now
    // },
    // updateDate: {
    //     type: Date,
    //     default: Date.now
    // },
    // order: Number,
    // url: String,
    // viewWidth: Number

    id: Number,
    associateId: String,
    compressed: Number,
    data: String,
    deleteStatus: String,
    domain: String,
    name: String,
    pageType:String,
    phonePageType: String,
    pv: Number,
    renderId: String,
    seoDescn: String,
    seoKeyword: String,
    seoTitle: String,
    siteId: Number,
    sortId: Number,
    synchro: Boolean,
    userId: Number,
    viewWidth: Number
});