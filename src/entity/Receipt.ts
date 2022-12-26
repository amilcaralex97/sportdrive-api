import { Schema, model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface IReceipt {
	receiptId: String;
	certificateId: Types.ObjectId;
	clientName: String;
	clientPhone: String;
	clientEmail: String;
	receiptDate: String;
	arriveTime: String;
	installationTime: String;
	vehicleBrand: String;
	vehicleModel: String;
	vehicleTransmission: String;
	vehicleType: String;
	gasType: String;
	gasTank: String;
	vehicleVin: String;
	vehicleYear: String;
	vehicleEngine: String;
	vehicleKm: String;
	vehicleCylinder: String;
	vehiclePlate: String;
	topSport: Boolean;
	topBoost: Boolean;
	topBoostPart: String;
	topBoostPro: Boolean;
	topBoostProPart: String;
	otherProduct: String;
	checkEngine: Boolean;
	epc: Boolean;
	abs: Boolean;
	asr: Boolean;
	airBag: Boolean;
	tirePressure: Boolean;
	antiTheft: Boolean;
	battery: Boolean;
	brakes: Boolean;
	reqService: Boolean;
	vehicleStatusDescription: String;
	scanBeforeDescription: String;
	reviewVehicleStart: String;
	reviewVehicleResponse: String;
	reviewFunctionality: String;
	reviewService: String;
	reviewTime: String;
	reviewRecommendation: String;
	receiptUrl: String;
	draft: Boolean;
}

const receiptSchema = new Schema(
	{
		clientName: {
			type: String,
		},
		clientPhone: {
			type: String,
		},
		clientEmail: {
			type: String,
		},
		receiptDate: {
			type: String,
		},
		arriveTime: {
			type: String,
		},
		installationTime: {
			type: String,
		},
		vehicleBrand: {
			type: String,
		},
		vehicleModel: {
			type: String,
		},
		vehicleTransmission: {
			type: String,
		},
		vehicleType: {
			type: String,
		},
		gasType: {
			type: String,
		},
		gasTank: {
			type: String,
		},
		vehicleVin: {
			type: String,
		},
		vehicleYear: {
			type: String,
		},
		vehicleEngine: {
			type: String,
		},
		vehicleKm: {
			type: String,
		},
		vehicleCylinder: {
			type: String,
		},
		vehiclePlate: {
			type: String,
		},
		topSport: {
			type: Boolean,
			default: false,
		},
		topBoost: {
			type: Boolean,
			default: false,
		},
		topBoostPart: {
			type: String,
		},
		topBoostPro: {
			type: Boolean,
			default: false,
		},
		topBoostProPart: {
			type: String,
		},
		otherProduct: {
			type: String,
		},
		checkEngine: {
			type: Boolean,
			default: false,
		},
		epc: {
			type: Boolean,
			default: false,
		},
		abs: {
			type: Boolean,
			default: false,
		},
		asr: {
			type: Boolean,
			default: false,
		},
		airBag: {
			type: Boolean,
			default: false,
		},
		tirePressure: {
			type: Boolean,
			default: false,
		},
		antiTheft: {
			type: Boolean,
			default: false,
		},
		battery: {
			type: Boolean,
			default: false,
		},
		brakes: {
			type: Boolean,
			default: false,
		},
		reqService: {
			type: Boolean,
			default: false,
		},
		vehicleStatusDescription: {
			type: String,
		},
		scanBeforeDescription: {
			type: String,
		},
		reviewVehicleStart: {
			type: String,
		},
		reviewVehicleResponse: {
			type: String,
		},
		reviewFunctionality: {
			type: String,
		},
		reviewService: {
			type: String,
		},
		reviewTime: {
			type: String,
		},
		reviewRecommendation: {
			type: String,
		},
		receiptUrl: {
			type: String,
		},
		draft: {
			type: Boolean,
			default: false,
		},
		certificateId: {
			type: Schema.Types.ObjectId,
			ref: 'Certificate',
		},
	},
	{
		_id: false,
		receiptId: {
			type: String,
			default: uuidv4,
		},
	}
);

export const Receipt = model<IReceipt>('Receipt', receiptSchema);
