module.exports = {
    extends: 'loris/es6',
    env: {
        es6: true,
        node: true,
        mocha: true
    },
    globals: {
        assert: false,
        sinon: false
    },
    rules: {
        'no-invalid-this': 'off',
        'mocha/no-exclusive-tests': 'error',
        'mocha/no-global-tests': 'error',
        'mocha/no-identical-title': 'error',
        'mocha/no-pending-tests': 'error',
        'mocha/no-return-and-callback': 'error',
        'mocha/no-sibling-hooks': 'error',
//        'eslint-plugin-no-savescreenshot/no-savescreenshot': 2
    },
    plugins: [
        'mocha',
//        'eslint-plugin-no-savescreenshot'
    ]
};
