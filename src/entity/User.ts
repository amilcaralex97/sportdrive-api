import { Schema, model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IUser {
	userId?: string;
	username: string;
	name: string;
	password: string;
	roleId: Types.ObjectId;
}

const userSchema = new Schema(
	{
		username: { type: String, required: true },
		name: { type: String, required: true },
		password: { type: String, required: true },
		roleId: { type: Schema.Types.ObjectId, ref: 'Role' },
	},
	{
		_id: false,
		userId: {
			type: String,
			default: uuidv4,
		},
	}
);

export const User = model<IUser>('User', userSchema);
