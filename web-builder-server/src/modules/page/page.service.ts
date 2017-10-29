import { Model } from 'mongoose';
import { Component, Inject } from '@nestjs/common';
import { PageInterface } from './page.interface';

@Component()
export class PageService {
    constructor(@Inject('PageModelToken') private readonly pageModel: Model<PageInterface>) {

    }

    async find(where): Promise<PageInterface[]> {
        return await this.pageModel.find(where);
    }

    async findAll(): Promise<PageInterface[]> {
        return await this.pageModel.find().exec();
    }

    async create(where):Promise<PageInterface> {
        const model = new this.pageModel(where);
        return await model.save();
    }
}