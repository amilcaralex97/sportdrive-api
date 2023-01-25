import { Schema, model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../controller/UserController/UserControllerTypes';

export const userSchema = new Schema<IUser>(
	{
		userName: { type: String, required: true },
		name: { type: String, required: true },
		password: { type: String, required: true },
		roleId: { type: String, ref: 'Role' },
		userId: {
			type: String,
			default: uuidv4,
		},
	},
	{
		_id: false,
		timestamps: true,
	}
);
