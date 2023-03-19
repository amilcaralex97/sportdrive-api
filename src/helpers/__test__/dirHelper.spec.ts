import { getFilesInDirectory } from '../dirHelper';

describe('getFilesInDirectory', () => {
	test('returns an array of file names for a valid directory', async () => {
		const files = await getFilesInDirectory(
			`${__dirname}/../__test__/mocks/dirHelper`
		);
		expect(files).toEqual(
			expect.arrayContaining([
				'/home/amilcaralex/personalProjects/sp-api/src/helpers/__test__/mocks/dirHelper/file1.txt',
				'/home/amilcaralex/personalProjects/sp-api/src/helpers/__test__/mocks/dirHelper/file2.txt',
			])
		);
	});

	test('throws an error for an invalid directory', async () => {
		await expect(
			getFilesInDirectory('./invalid-directory')
		).rejects.toThrow();
	});

	test('throws a descriptive error message for an invalid directory', async () => {
		await expect(
			getFilesInDirectory('./invalid-directory')
		).rejects.toThrow(
			"ENOENT: no such file or directory, scandir './invalid-directory'"
		);
	});
});
