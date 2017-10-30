import { Component, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { SiteInterface } from './site.interface';
import { SiteModel } from './site.model';

@Component()
export class SiteService {
    constructor(@Inject('SiteModelToken') private readonly siteModel: Model<SiteInterface>) {

    }

    async create(where: SiteModel): Promise<SiteInterface> {
        const mode = new this.siteModel(where);
        return await mode.save();
    }
}