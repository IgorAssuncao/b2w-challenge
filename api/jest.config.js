module.exports = {
  clearMocks: true,
  verbose: true,
  testEnvironment: 'node',
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
};
