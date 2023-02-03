import { authMocks } from '../../useCase/AuthInteractor/__test__/mocks';
import { eventParser } from '../jsonHelper';

describe('jsonHelper', () => {
	const event = authMocks.mockAPIGatewayEvent({
		body: '{"result":true, "count":42}',
	});

	it('Should parse event string to json', () => {
		const jsonRequest = eventParser(event);
		expect(jsonRequest).toEqual({
			count: 42,
			result: true,
		});
	});
});
