import { Schema, model, Types } from 'mongoose';

interface IUser {
	userId: string;
	username: string;
	name: string;
	password: string;
	roleId: Types.ObjectId;
}

const userSchema = new Schema<IUser>({
	username: { type: String, required: true },
	name: { type: String, required: true },
	password: { type: String, required: true },
	roleId: { type: Schema.Types.ObjectId, required: true },
});

export const User = model('User', userSchema);
