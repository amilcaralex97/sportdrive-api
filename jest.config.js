module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/src'],
	testRegex: '.spec.ts$',
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	moduleFileExtensions: ['ts', 'js', 'json'],
	testTimeout: 10000,
};
