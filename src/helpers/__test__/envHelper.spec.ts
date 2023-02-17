import { promises as fs } from 'fs';
import { parseEnv } from '../envHelper';

describe('parseEnv', () => {
	beforeEach(() => {
		// Clear the process environment variables before each test
		process.env = {};
	});

	it('should return an empty object when no environment variables are set', async () => {
		const envDictionary = await parseEnv();

		expect(envDictionary).toEqual({});
	});

	it('should read environment variables from process.env', async () => {
		process.env.API_KEY = 'abc123';
		process.env.PORT = '3000';

		const envDictionary = await parseEnv();

		expect(envDictionary).toEqual({
			API_KEY: 'abc123',
			PORT: '3000',
		});
	});

	it('should read environment variables from .env file', async () => {
		const envContents = `API_KEY=abc123
PORT=3000`;

		// Create a temporary .env file for testing
		await fs.writeFile('.env', envContents, 'utf8');

		const envDictionary = await parseEnv('.env');

		expect(envDictionary).toEqual({
			API_KEY: 'abc123',
			PORT: '3000',
		});

		// Delete the temporary .env file after testing
		await fs.unlink('.env');
	});

	it('should handle errors when reading .env file', async () => {
		const envDictionary = await parseEnv('.missing-env-file');

		expect(envDictionary).toEqual({});

		// TODO: Test the error handling more thoroughly
	});
});
