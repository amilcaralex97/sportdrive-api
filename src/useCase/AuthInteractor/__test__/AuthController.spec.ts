import { authMocks } from './mocks';
import { Options } from './mocks/mockApiGatewayMock';

describe('AuthController', () => {
	const gatewayEvent = (options: Options = {}) =>
		authMocks.mockAPIGatewayEvent(options);
	describe('signIn', () => {
		it('Should return auth token when user is sign in', () => {});
		it('Should throw an error when user fails to sign in', () => {});
	});
});
