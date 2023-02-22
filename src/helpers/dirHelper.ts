import { promises as fs } from 'fs';
import { join } from 'path';

export async function getFilesInDirectory(
	directoryPath: string
): Promise<string[]> {
	try {
		const files = await fs.readdir(directoryPath);
		return files.map((file) => join(directoryPath, file));
	} catch (error: unknown) {
		if (error instanceof Error) {
			throw new Error(
				`Failed to read directory: ${directoryPath}. Error message: ${error.message}`
			);
		} else {
			throw error;
		}
	}
}
