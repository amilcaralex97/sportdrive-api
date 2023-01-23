import { Schema, model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface ICertificate {
	certificateId: string;
	certificateUrl: string;
	receiptId: string;
}

const certificateSchema = new Schema(
	{
		certificateUrl: { type: String, required: true },
		receiptId: { type: Schema.Types.ObjectId, ref: 'Receipt' },
	},
	{
		_id: false,
		certificateId: {
			type: String,
			default: uuidv4,
		},
		timestamps: true,
	}
);

export const Certificate = model<ICertificate>(
	'Certificate',
	certificateSchema
);
