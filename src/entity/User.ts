import { Schema, model, Types } from 'mongoose';

interface IUser {
	username: string;
	name: string;
	password: string;
	roleId: Types.ObjectId;
}

export const userSchema = new Schema<IUser>({
	username: { type: String, required: true },
	name: { type: String, required: true },
	password: { type: String, required: true },
	roleId: { type: Schema.Types.ObjectId, required: true },
});
