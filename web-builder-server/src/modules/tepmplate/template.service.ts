import { Component, Inject, Options } from '@nestjs/common';
import { Model } from 'mongoose';
import { TemplateInterface } from './template.interface';
import { TemplateModel } from './template.model';

@Component()
export class TemplateService {
    constructor( @Inject('TemplateModelToken') private readonly templateModel: Model<TemplateInterface>) {

    }

    async create(where: TemplateModel): Promise<TemplateInterface> {
        const model = new this.templateModel(where);
        return await model.save();
    }

    find(where) {
        return this.templateModel.find(where);
    }

    findAll(): Promise<TemplateInterface[]> {
        return this.templateModel.find().exec();
    }

    add(data: object, options: object) {

    }

    thenAdd(data, where) {

    }

    where(query: object) {

    }

    limit(offset:number, length:number) {

    }

    page(page: number, pageSize: number) {

    }

    field() {

    }

    order() {

    }

    delete() {

    }

    update() {

    }

    thenUpdate() {
        
    }
}