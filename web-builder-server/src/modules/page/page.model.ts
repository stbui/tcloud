export class PageModel {
    id: Number;
    associateId: String;
    compressed: Number;
    data: String;
    deleteStatus: String;
    domain: String;
    name: String;
    pageType: String;
    phonePageType: String;
    pv: Number;
    renderId: String;
    seoDescn: String;
    seoKeyword: String;
    seoTitle: String;
    siteId: Number;
    sortId: Number;
    synchro: Boolean;
    userId: Number;
    viewWidth: Number;

    constructor(obj) {
        this.id = obj.id;
        this.associateId = obj.associateId;
        this.compressed = obj.compressed;
        this.data = obj.data;
        this.deleteStatus = obj.deleteStatus;
        this.domain = obj.domain;
        this.name = obj.name;
        this.pageType = obj.pageType;
        this.phonePageType = obj.phonePageType;
        this.pv = obj.pv;
        this.renderId = obj.renderId;
        this.seoDescn = obj.seoDescn;
        this.seoKeyword = obj.seoKeyword;
        this.seoTitle = obj.seoTitle;
        this.siteId = obj.siteId;
        this.sortId = obj.sortId;
        this.synchro = obj.synchro;
        this.userId = obj.userId;
        this.viewWidth = obj.viewWidth;
    }
}