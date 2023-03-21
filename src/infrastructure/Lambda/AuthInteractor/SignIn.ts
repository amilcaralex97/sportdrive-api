import {
	APIGatewayProxyEvent,
	APIGatewayProxyResult,
	Context,
} from 'aws-lambda';
import { AuthInteractor } from '../../../useCase/AuthInteractor/AuthInteractor';
import { dbConnection } from '../../connection';

async function handler(
	event: APIGatewayProxyEvent,
	context: Context
): Promise<APIGatewayProxyResult> {
	let authRes;
	try {
		const db = await dbConnection();
		const authInteractor = new AuthInteractor(event, db);
		authRes = await authInteractor.signIn();
	} catch (error: any) {
		if (authRes?.status && authRes.status >= 400) {
			return {
				statusCode: authRes.status,
				body: authRes.message,
			};
		}
	}

	return {
		statusCode: 200,
		body: JSON.stringify(authRes),
	};
}

export { handler };
