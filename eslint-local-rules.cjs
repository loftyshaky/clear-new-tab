// no-return-assign-allow-instance-assignment: My rewrite of no-return-assign to allow 'return this.instance || (this.instance = new this());'.

const astUtils = require('./node_modules/eslint/lib/rules/utils/ast-utils');

const SENTINEL_TYPE =
    /^(?:[a-zA-Z]+?Statement|ArrowFunctionExpression|FunctionExpression|ClassExpression)$/u;

module.exports = {
    'no-return-assign-allow-instance-assignment': {
        meta: {
            type: 'suggestion',

            docs: {
                description: 'Disallow assignment operators in `return` statements',
                recommended: false,
                url: 'https://eslint.org/docs/latest/rules/no-return-assign',
            },

            schema: [
                {
                    enum: ['except-parens', 'always'],
                },
            ],

            messages: {
                returnAssignment: 'Return statement should not contain assignment.',
                arrowAssignment: 'Arrow function should not return assignment.',
            },
        },

        create(context) {
            const always = (context.options[0] || 'except-parens') !== 'except-parens';
            const { sourceCode } = context;

            return {
                AssignmentExpression(node) {
                    //> my code
                    const source_code = sourceCode.text;
                    const allowed_string = 'return this.instance || (this.instance = new this());';

                    // Check if the source code of the node contains the allowed string
                    if (source_code.includes(allowed_string)) {
                        return; // Do not report this specific string
                    }
                    //< my code

                    if (!always && astUtils.isParenthesised(sourceCode, node)) {
                        return;
                    }

                    let currentChild = node;
                    let { parent } = currentChild;

                    // Find ReturnStatement or ArrowFunctionExpression in ancestors.
                    while (parent && !SENTINEL_TYPE.test(parent.type)) {
                        currentChild = parent;
                        parent = parent.parent;
                    }

                    // Reports.
                    if (parent && parent.type === 'ReturnStatement') {
                        context.report({
                            node: parent,
                            messageId: 'returnAssignment',
                        });
                    } else if (
                        parent &&
                        parent.type === 'ArrowFunctionExpression' &&
                        parent.body === currentChild
                    ) {
                        context.report({
                            node: parent,
                            messageId: 'arrowAssignment',
                        });
                    }
                },
            };
        },
    },
};
