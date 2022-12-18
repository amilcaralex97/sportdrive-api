import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

let conn = null;

const uri = `mongodb+srv://${process.env.AWS_ACCESS_KEY}:${process.env.AWS_SECRET_KEY}@sportdrive-dev-cluster.dkvgtfh.mongodb.net/?authSource=%24external&authMechanism=MONGODB-AWS&retryWrites=true&w=majority`;

async function handler(event: any, context: any) {
	context.callbackWaitsForEmptyEventLoop = false;

	if ((conn = null)) {
		conn = mongoose
			.connect(uri, {
				serverSelectionTimeoutMS: 5000,
			})
			.then(() => mongoose);
	}

	return conn;
}

export { handler };
