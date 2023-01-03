import { Schema, model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface ICertificate {
	certificateId: string;
	certificateUrl: string;
	receiptId: Types.ObjectId;
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

export const Role = model<ICertificate>('Certificate', certificateSchema);
