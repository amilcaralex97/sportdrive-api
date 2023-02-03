import { APIGatewayEvent } from 'aws-lambda';

export const eventParser = (event: APIGatewayEvent) => {
	return typeof event.body == 'object' ? event.body : JSON.parse(event.body);
};
