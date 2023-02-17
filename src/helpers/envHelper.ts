import { promises as fs } from 'fs';

export interface Dictionary {
	[key: string]: string;
}

export async function parseEnv(path?: string): Promise<Dictionary> {
	const envDictionary: Dictionary = {};

	// Try to read environment variables from process.env
	for (const [key, value] of Object.entries(process.env)) {
		if (key && value) {
			envDictionary[key] = value;
		}
	}

	// If process.env is empty or missing values, try to read from a .env file
	if (Object.keys(envDictionary).length === 0 && path) {
		try {
			const envFile = await fs.readFile(path, 'utf8');
			const envLines = envFile.split('\n');

			for (const line of envLines) {
				const trimmedLine = line.trim();

				if (!trimmedLine || trimmedLine.startsWith('#')) {
					continue;
				}

				const [key, value] = trimmedLine.split('=');

				if (key && value) {
					envDictionary[key] = value;
				}
			}
		} catch (error) {
			console.error('Error reading .env file:', error);
		}
	}

	return envDictionary;
}
