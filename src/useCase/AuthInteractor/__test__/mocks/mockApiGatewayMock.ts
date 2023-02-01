import { APIGatewayEvent } from 'aws-lambda';
import { faker } from '@faker-js/faker';

export type Options = {
	path?: string;
	httpMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	headers?: { [header: string]: string };
	multiValueHeaders?: { [header: string]: string[] };
	queryStringParameters?: { [parameter: string]: string };
	multiValueQueryStringParameters?: { [parameter: string]: string[] };
	pathParameters?: { [parameter: string]: string };
	stageVariables?: { [variable: string]: string };
	requestContext?: any;
	resource?: string;
	isBase64Encoded?: boolean;
	body?: string;
};

export const mockAPIGatewayEvent = (options: Options = {}): APIGatewayEvent => {
	const path = options.path || faker.internet.url();
	const httpMethod = options.httpMethod || 'GET';
	const headers = options.headers || {
		Accept: '*/*',
		'Accept-Encoding': 'gzip, deflate',
		Connection: 'keep-alive',
		Host: 'localhost:3000',
		'User-Agent': 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)',
	};
	const multiValueHeaders = options.multiValueHeaders || {};
	const queryStringParameters = options.queryStringParameters || {};
	const multiValueQueryStringParameters =
		options.multiValueQueryStringParameters || {};
	const pathParameters = options.pathParameters || {};
	const stageVariables = options.stageVariables || {};
	const requestContext = options.requestContext || {
		accountId: '123456789012',
		apiId: 'api-id',
		authorizer: {
			principalId: 'user|a1b2c3d4',
		},
		domainName: 'api-id.execute-api.us-east-1.amazonaws.com',
		domainPrefix: 'api-id',
		httpMethod: 'GET',
		identity: {
			accessKey: null,
			accountId: null,
			caller: null,
			cognitoAuthenticationProvider: null,
			cognitoAuthenticationType: null,
			cognitoIdentityId: null,
			cognitoIdentityPoolId: null,
			sourceIp: '127.0.0.1',
			user: null,
			userAgent: 'Custom User Agent String',
			userArn: null,
		},
		requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
		routeKey: '$default',
		stage: '$default',
		time: '09/Apr/2015:12:34:56 +0000',
		timeEpoch: 1428582896000,
	};
	const resource = options.resource || '/{proxy+}';
	const isBase64Encoded = options.isBase64Encoded || false;
	const body = options.body || null;

	return {
		path,
		httpMethod,
		headers,
		multiValueHeaders,
		queryStringParameters,
		multiValueQueryStringParameters,
		pathParameters,
		stageVariables,
		requestContext,
		resource,
		isBase64Encoded,
		body,
	};
};
