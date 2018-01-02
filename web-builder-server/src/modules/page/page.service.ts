import { Component, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { PageInterface } from './page.interface';
import { PageModel } from './page.model';

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

    create(where: PageModel): Promise<PageInterface> {
        const model = new this.pageModel(where);
        return model.save();
    }
}