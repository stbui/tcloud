export class TemplateModel {
    name: String;
    descn: String;
    author: String;
    order: Number;
    icon: String;
    type: String;
    categoryId: Number;
    categoryName: String;
    data: String;
    js: String;
    sectionId: String;
    domain: String;
    activeStatus: String;
    deleteStatus: String;
    version: Number;
    renderId: String;
    orderId: Number;
    serial: String;
    tagIds: String;
    online: Boolean;

    constructor(obj) {
        this.name = obj.name;
        this.descn = obj.descn;
        this.author = obj.author;
        this.order = obj.order;
        this.icon = obj.icon;
        this.type = obj.type;
        this.categoryId = obj.categoryId;
        this.categoryName = obj.categoryName;
        this.data = obj.data;
        this.js = obj.js;
        this.sectionId = obj.sectionId;
        this.domain = obj.domain;
        this.activeStatus = obj.activeStatus;
        this.deleteStatus = obj.deleteStatus;
        this.version = obj.version;
        this.renderId = obj.renderId;
        this.orderId = obj.orderId;
        this.serial = obj.serial;
        this.tagIds = obj.tagIds;
        this.online = obj.online;
    }
}