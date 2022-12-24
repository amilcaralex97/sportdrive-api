import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface IRole {
	roleId: string;
	userAccess: number;
	receiptAccess: number;
}

const roleSchema = new Schema(
	{
		userAccess: { type: String, required: true },
		receiptAccess: { type: Number, required: true },
	},
	{
		_id: false,
		roleId: {
			type: String,
			default: uuidv4,
		},
	}
);

export const Role = model<IRole>('Role', roleSchema);
