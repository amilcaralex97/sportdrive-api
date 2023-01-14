import { Schema, model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IRole {
	roleId?: string;
	userAccess: number;
	receiptAccess: number;
	users?: string[];
}

const roleSchema = new Schema(
	{
		userAccess: { type: Number, required: true, max: 8, min: 0 },
		receiptAccess: { type: Number, required: true, max: 8, min: 0 },
		users: [
			{
				type: String,
				ref: 'User',
			},
		],
	},
	{
		_id: false,
		roleId: {
			type: String,
			default: uuidv4,
		},
		timestamps: true,
	}
);

export const Role = model<IRole>('Role', roleSchema);
