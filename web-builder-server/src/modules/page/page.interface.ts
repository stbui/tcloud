import { Document } from 'mongoose';

export interface PageInterface extends Document {
    readonly name: string
}