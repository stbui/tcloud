import * as mongoose from 'mongoose';

export const MemberSchema = new mongoose.Schema({
    username: String,
    password: String,
});