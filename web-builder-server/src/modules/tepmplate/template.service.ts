import { Component, Inject, Options } from '@nestjs/common';
import { Model } from 'mongoose';
import { TemplateInterface } from './template.interface';
import { TemplateModel } from './template.model';

@Component()
export class TemplateService {

    options;

    constructor( @Inject('TemplateModelToken') private readonly templateModel: Model<TemplateInterface>) {
        this.options = {};
    }

    async create(where: TemplateModel): Promise<TemplateInterface> {
        const model = new this.templateModel(where);
        return await model.save();
    }

    // find(where) {
    //     return this.templateModel.find(where);
    // }

    findAll(): Promise<TemplateInterface[]> {
        return this.templateModel.find().exec();
    }

    add(data: object, options: object) {

    }

    thenAdd(data, where) {

    }

    limit(offset: number, length: number) {

    }

    page(page: number, pageSize: number) {

    }

    delete() {

    }

    update() {

    }

    thenUpdate() {

    }

    field(options) {
        this.options.field = options;
        return this;
    }

    order(options) {
        this.options.order = options;
        return this;
    }

    where(options) {
        this.options.where = options;
        return this;
    }


    find(options?) {
        if (this.options.where) options = this.options.where;

        return this.templateModel.findOne(options);
    }

    select(options?) {
        const model = this.templateModel;
        let result = model.find();

        if (this.options.field) {
            result = model.find({}, this.options.field);
        }

        if (this.options.where) {
            console.log(this.options.where)
            return result.find(this.options.where);
        }

        if (this.options.order) {
            return result.sort(this.options.order);
        }

        return result;
    }
}