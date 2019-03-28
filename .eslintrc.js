module.exports = {
    rules: {
        camelcase: 0,
        'max-len': 0,
        'object-curly-newline': 0,
        'import/no-extraneous-dependencies': 0,
        'padded-blocks': 0,
        'spaced-comment': 0,
        'no-plusplus': 0,
        'import/prefer-default-export': 0,
        'no-alert': 0,
        'react/jsx-pascal-case': 0,
        'react/prop-types': 0,
        'jsx-a11y/label-has-associated-control': 0,
        'jsx-a11y/label-has-for': 0,
        'react/jsx-one-expression-per-line': 0,
        'react/no-multi-comp': 0,
        'jsx-a11y/anchor-has-content': 0,
        'jsx-a11y/anchor-is-valid': ['error',
            {
                components: ['Link']
            },
        ],
        'no-restricted-syntax': [
            'error',
            'ForInStatement',
            'LabeledStatement',
            'WithStatement'
        ],
        indent: [
            'error',
            4,
            {
                SwitchCase: 1,
            }
        ],
        'react/jsx-indent': [
            'error',
            4,
        ],
        'react/jsx-indent-props': [
            'error',
            4,
        ],
        'linebreak-style': [
            'error',
            'windows',
        ],
        'no-use-before-define': [
            'error',
            {
                variables: false,
            },
        ],
        'arrow-parens': [
            'error',
            'as-needed',
        ],
        radix: [
            'error',
            'as-needed',
        ],
        'no-underscore-dangle': [
            'error',
            {
                allow:
                    ['__'],
            },
        ],
    },

    globals: {
        window: false,
        document: false,
        MutationObserver: false,
        xcon: false,
        ed: false,
        ed: false,
        eda: false,
        err: false,
        t: false,
        er_obj: false,
        l: false,
        what_browser: false,
        browser: false,
        page: false,
        s: false,
        sa: false,
        sb: false,
        sab: false,
        set_default_settings: false,
    },

    settings: {
        'import/resolver':
        {
            webpack:
            {
                config: 'webpack.shared.js',
            },
        },
    },

    parser: 'babel-eslint',
    extends: 'airbnb',
    plugins: [
        'react',
        'jsx-a11y',
        'import'
    ],
};