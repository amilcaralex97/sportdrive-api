import { Schema, model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface IRole {
	roleId?: string;
	roleName: string;
	userAccess: number;
	receiptAccess: number;
	createdAt?: Date;
	updatedAt?: Date;
}

export const roleSchema = new Schema(
	{
		userAccess: { type: Number, required: true, max: 8, min: 0 },
		receiptAccess: { type: Number, required: true, max: 8, min: 0 },
		roleName: { type: Number, required: true, unique: true },
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
