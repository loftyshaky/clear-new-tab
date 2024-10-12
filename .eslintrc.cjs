const _ = require('lodash');
const restrictedGlobals = require('confusing-browser-globals');

const rules = {
    js: {
        //> javascript
        'prettier/prettier': 'error',
        'local-rules/no-return-assign-allow-instance-assignment': ['error', 'always'],
        'import/no-cycle': 'off',
        'import/named': 'off',
        'import/prefer-default-export': 'off',
        'no-return-assign': 'off',
        'prefer-arrow-callback': 'off',
        'func-names': 'off',
        'no-param-reassign': 'off',
        'class-methods-use-this': 'off',
        'linebreak-style': 'off',
        'import/no-unresolved': [2, { ignore: ['@ioc:'] }],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        camelcase: 'off',
        quotes: [2, 'single', { avoidEscape: true }],
        'max-len': [
            'error',
            100,
            2,
            {
                ignoreUrls: true,
                ignoreComments: true,
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            },
        ],
        'max-depth': ['error', 4],
        'max-nested-callbacks': ['error', 8],
        'no-negated-condition': 'error',
        'object-curly-newline': ['error', { consistent: true }],
        'padding-line-between-statements': [
            'error',
            {
                blankLine: 'always',
                prev: '*',
                next: 'return',
            },
        ],
        curly: ['error', 'all'],
        'spaced-comment': [
            'error',
            'always',
            {
                line: {
                    markers: ['>', '<'],
                },
                block: {
                    markers: ['*'],
                    balanced: true,
                },
            },
        ],
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: [
                    'js/*',
                    'js/*/**',
                    'rollup.config.js',
                    'webpack.config.js',
                    'webpack.dev.js',
                    'webpack.prod.js',
                ],
            },
        ],
        'no-restricted-globals': [
            'error',
            {
                name: 'isFinite',
                message:
                    'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite',
            },
            {
                name: 'isNaN',
                message:
                    'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan',
            },
        ].concat(restrictedGlobals.filter((restricted_global) => restricted_global !== 'self')),
        //< javascript
        //> react
        'react/no-array-index-key': 'off',
        'jsx-quotes': ['error', 'prefer-single'],
        'react/function-component-definition': [
            'error',
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
        //< react
    },
    ts: {
        //> typescript
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'brace-style': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/prefer-includes': 'error',
        //< typescript

        //> react
        'react/prefer-stateless-function': 'off',
        'react/jsx-filename-extension': 'off',
        'react/static-property-placement': 'off',
        'react/jsx-indent-props': ['error', 4],
        //< react
    },
};

module.exports = {
    extends: ['eslint:recommended', 'airbnb', 'airbnb/hooks', 'prettier'],
    plugins: ['react', 'prettier', 'local-rules'],
    parser: '@babel/eslint-parser',
    parserOptions: { requireConfigFile: false },
    rules: rules.js,
    overrides: [
        {
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
                'airbnb',
                'prettier',
            ],
            plugins: ['@typescript-eslint'],
            parser: '@typescript-eslint/parser',
            files: ['*.ts', '*.tsx'],
            parserOptions: {
                // requered for some rules to work, like for example: '@typescript-eslint/prefer-includes': 'error'
                project: 'tsconfig.json',
                tsconfigRootDir: __dirname,
            },
            settings: {
                'import/resolver': {
                    typescript: {},
                },
            },
            rules: _.merge(
                { 'no-use-before-define': 'off', 'no-undef': 'off', 'no-unused-vars': 'off' },
                rules.js,
                rules.ts,
            ),
        },
    ],
    globals: {
        env: false,
        l: false,
        n: false,
        nn: false,
        s: false,
        sa: false,
        sb: false,
        sab: false,
        we: false,
        page: false,
        show_err_ribbon: false,
        show_flash: false,
        show_notification: false,
        show_unable_to_access_settings_error: false,
        err: false,
        err_async: false,
        throw_err: false,
        throw_err_obj: false,
        err_obj: false,
    },
};
