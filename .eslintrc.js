module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // to avoid line ending issues in windows & linux (LF vs CRLF)
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    // prefer template string over concat string
    'prefer-template': 'error',
    curly: ['error', 'all'],
    'no-trailing-spaces': 'error',
    'lines-between-class-members': 'error',
    'no-underscore-dangle': [
      'error',
      {
        allow: ['_id', '_default', '_payload'],
      },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-floating-promises': ['error'],
    // keep nestjs styles
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'no-useless-constructor': 'off',
    'class-methods-use-this': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-empty-function': 'warn',
    'import/no-unresolved': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-empty-function': ['error', { allow: ['constructors'] }],
    'max-classes-per-file': 'off', // disabled for schema & dto
  },
};
