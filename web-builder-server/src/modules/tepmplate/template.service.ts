import { Component, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { TemplateInterface } from './template.interface';
import { TemplateModel } from './template.model';

@Component()
export class TemplateService {
    constructor(@Inject('TemplateModelToken') private readonly templateModel: Model<TemplateInterface>) {

    }

    async create(where: TemplateModel): Promise<TemplateInterface> {
        const model = new this.templateModel(where);
        return await model.save();
    }

    findAll(): Promise<TemplateInterface[]> {
        return this.templateModel.find().exec();
    }
}