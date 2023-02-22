import { promises as fs } from 'fs';

export async function getFilesInDirectory(
	directoryPath: string
): Promise<string[]> {
	try {
		const files = await fs.readdir(directoryPath);
		return files;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(
				`Failed to read directory: ${directoryPath}. Error message: ${error.message}`
			);
		} else {
			throw error;
		}
	}
}
