describe('jsonHelper', () => {
	it('Should parse event string to json', () => {
		const jsonRequest = eventParser(event);
		expect(jsonRequest).toEqual({});
	});
});
