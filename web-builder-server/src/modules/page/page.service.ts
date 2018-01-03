import { Component, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { PageInterface } from './page.interface';
import { PageModel } from './page.model';

@Component()
export class PageService {
    options;

    constructor( @Inject('PageModelToken') private readonly pageModel: Model<PageInterface>) {
        this.options = {};
    }

    // async find(where, options?): Promise<PageInterface[]> {
    //     return await this.pageModel.find(where, options);
    // }

    async findAll(): Promise<PageInterface[]> {
        return await this.pageModel.find().exec();
    }

    create(where: PageModel): Promise<PageInterface> {
        const model = new this.pageModel(where);
        return model.save();
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

        return this.pageModel.findOne(options);
    }

    add(data, options?) {
        const model = new this.pageModel(data);
        return model.save();
    }

    async thenAdd(data, where) {
        const findData = await this.where(where).find();
        if (findData !== null) {
            return { type: 'exist', data: findData }
        }
        const insertId = await this.add(data);
        return { type: 'add', data: insertId };
    }

    select(options?) {
        const model = this.pageModel;
        let result = model.find();

        if (this.options.field) {
            result = model.find({}, this.options.field);
        }

        if (this.options.order) {
            return result.sort(this.options.order);
        }

        return result;
    }
}