import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import unicorn from "eslint-plugin-unicorn";
import importX from "eslint-plugin-import-x";
import wixEditor from "eslint-plugin-wix-editor";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sortClassMembers from "eslint-plugin-sort-class-members";
import promise from "eslint-plugin-promise";
import sonarjs from "eslint-plugin-sonarjs";
import reactHooks from "eslint-plugin-react-hooks";
import react from "eslint-plugin-react";
import regexp from "eslint-plugin-regexp";
import { createRequire } from "node:module";
import globals from "globals";

const require = createRequire(import.meta.url);
const wdio = require("eslint-plugin-wdio");
const eslintPluginEtc = require("eslint-plugin-etc");
const eslintPluginTotalFunctions = require("eslint-plugin-total-functions");
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "**/.husky",
    "**/.vscode",
    "**/bl",
    "**/coverage",
    "**/dist",
    "**/e2e",
    "**/hermione",
    "**/images",
    "**/init",
    "**/my",
    "**/node_modules",
    "**/stylelint.config.js",
    "**/dist",
    "**/webpack.config.js",
    "**/*conf.js",
    "**/*.d.ts",
    "**/*.spec.ts",
    "src/test.ts",
    "src/assets",
]), {
    extends: [
        ...fixupConfigRules(compat.extends(
            "eslint:recommended",
            "plugin:@typescript-eslint/recommended",
            "plugin:@typescript-eslint/recommended-requiring-type-checking",
            "plugin:promise/recommended",
            "plugin:etc/recommended",
            "plugin:total-functions/recommended",
        )),
        regexp.configs.recommended,
        importX.flatConfigs.recommended,
        unicorn.configs.recommended,
        sonarjs.configs.recommended,
    ],

    plugins: {
        etc: fixupPluginRules(eslintPluginEtc),
        "total-functions": fixupPluginRules(eslintPluginTotalFunctions),
        "wix-editor": wixEditor,
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        "simple-import-sort": simpleImportSort,
        "sort-class-members": sortClassMembers,
        promise: fixupPluginRules(promise),
        "react-hooks": fixupPluginRules(reactHooks),
        react: fixupPluginRules(react),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            __DEV__: true,
            ClipboardItem: true,
            navigator: true,
            _environmentRaw: true,
            global: true,
        },

        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",

        parserOptions: {
            project: "tsconfig.json",

            ecmaFeatures: {
                jsx: true,
            },

            useJSXTextNode: true,
        },
    },

    settings: {
        react: {
            pragma: "React",
            version: "18.0",
        },
    },

    rules: {
        indent: "off",
        semi: [2, "always"],

        "semi-spacing": [2, {
            before: false,
            after: true,
        }],

        "wrap-iife": [2, "inside"],
        "no-caller": 2,
        "no-cond-assign": [2, "except-parens"],
        "no-constant-condition": 2,
        "no-debugger": 2,
        "no-dupe-args": 2,
        "no-dupe-keys": 2,
        "no-duplicate-case": 2,

        "no-empty": [2, {
            allowEmptyCatch: true,
        }],

        "no-extra-boolean-cast": 2,
        "no-extra-semi": 2,
        "no-func-assign": 2,
        "no-new": 2,
        "no-sparse-arrays": 2,
        "no-undef": 2,
        "no-unexpected-multiline": 2,
        "no-unreachable": 2,
        "no-unused-vars": "off",
        strict: 2,
        "max-params": [2, 5],
        "max-depth": [1, 4],
        "no-eq-null": 0,
        "no-unused-expressions": 2,
        "dot-notation": 2,
        "use-isnan": 2,
        "block-scoped-var": 2,
        complexity: [0, 11],
        curly: [2, "all"],

        eqeqeq: [2, "always", {
            null: "ignore",
        }],

        "no-else-return": 2,
        "no-extra-bind": 2,

        "no-implicit-coercion": [2, {
            allow: ["!!"],
        }],

        "no-return-assign": 0,
        "no-sequences": 2,
        yoda: 2,
        "no-restricted-globals": [2, "fdescribe", "fit"],
        "no-var": 1,
        "arrow-parens": [2, "as-needed"],
        "array-bracket-spacing": [2, "never"],

        "brace-style": [2, "1tbs", {
            allowSingleLine: true,
        }],

        camelcase: [1, {
            properties: "never",
            ignoreDestructuring: true,
        }],

        "comma-dangle": ["error", "never"],

        "comma-spacing": [2, {
            before: false,
            after: true,
        }],

        "eol-last": 2,
        "func-call-spacing": [2, "never"],
        "block-spacing": 2,

        "keyword-spacing": [2, {
            before: true,
            after: true,
        }],

        "max-len": [2, {
            code: 120,
            ignoreUrls: true,
            ignoreComments: false,
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignorePattern: "require",
        }],

        "no-lonely-if": 2,
        "no-mixed-spaces-and-tabs": 2,
        "no-multi-spaces": 2,

        "no-multiple-empty-lines": [2, {
            max: 1,
            maxBOF: 0,
            maxEOF: 0,
        }],

        "no-trailing-spaces": 2,
        "no-unneeded-ternary": 2,
        "no-nested-ternary": 2,
        "object-curly-spacing": [2, "always"],
        "one-var-declaration-per-line": [2, "initializations"],

        "one-var": [2, {
            let: "never",
            const: "never",
        }],

        "operator-linebreak": "off",
        "padded-blocks": [2, "never"],

        "quote-props": [2, "as-needed", {
            numbers: true,
        }],

        quotes: [2, "single", {
            avoidEscape: true,
        }],

        "space-before-blocks": [2, "always"],

        "space-before-function-paren": [2, {
            asyncArrow: "always",
            anonymous: "always",
            named: "never",
        }],

        "space-in-parens": 2,

        "no-console": [2, {
            allow: ["assert", "error", "warn"],
        }],

        "key-spacing": [2, {
            beforeColon: false,
            afterColon: true,
            mode: "strict",
        }],

        "space-infix-ops": 2,
        "newline-before-return": "error",

        "lines-between-class-members": ["error", "always", {
            exceptAfterSingleLine: true,
        }],

        "padding-line-between-statements": ["error", {
            blankLine: "always",
            prev: "class",
            next: "*",
        }, {
            blankLine: "always",
            prev: "*",
            next: "class",
        }],

        "no-restricted-imports": ["error", {
            paths: [{
                name: "react",

                importNames: [
                    "MouseEvent",
                    "TouchEvent",
                    "KeyboardEvent",
                    "AnimationEvent",
                    "ClipboardEvent",
                    "CompositionEvent",
                    "DragEvent",
                    "FocusEvent",
                    "FormEvent",
                    "TransitionEvent",
                    "UIEvent",
                    "WheelEvent",
                ],

                message: "Importing global types from \"react\" is forbidden. Use global types or React.MouseEvent, React.KeyboardEvent, etc.",
            }, {
                name: "@mui/material",
                importNames: ["Button"],
                message: "Use custom Button from 'components/Button/Button' instead of MUI Button.",
            }, {
                name: "@mui/material",
                importNames: ["IconButton"],
                message: "Use custom IconButton from 'components/IconButton/IconButton' instead of MUI IconButton.",
            }],
        }],

        "no-restricted-syntax": ["error", {
            selector: "MemberExpression[object.name='React']",
            message: "Using \"React.\" is forbidden. Use direct imports instead.",
        }, {
            selector: "TSQualifiedName[left.name='React'][right.name!='MouseEvent'][right.name!='TouchEvent'][right.name!='KeyboardEvent'][right.name!='AnimationEvent'][right.name!='ClipboardEvent'][right.name!='CompositionEvent'][right.name!='DragEvent'][right.name!='FocusEvent'][right.name!='FormEvent'][right.name!='TransitionEvent'][right.name!='UIEvent'][right.name!='WheelEvent']",
            message: "Using \"React.\" in types is forbidden, except for events that overlap with global types. Use direct imports instead.",
        }, {
            selector: "CallExpression[callee.type='MemberExpression'][callee.object.name='Array'][callee.property.name='isArray']",
            message: "Используйте isArray из services/util/typeGuards/isArray вместо Array.isArray (корректное сужение типов).",
        }],

        "jsx-quotes": [2, "prefer-single"],
        "react/jsx-boolean-value": 2,
        "react/display-name": 0,
        "react/jsx-closing-tag-location": 2,
        "react/jsx-equals-spacing": 2,
        "react/jsx-tag-spacing": [2, {
            beforeClosing: "never",
            beforeSelfClosing: "always",
        }],
        "react/jsx-first-prop-new-line": [2, "multiline"],
        "react/jsx-handler-names": 0,
        "react/jsx-key": 2,
        "react/jsx-no-bind": 2,
        "react/jsx-no-duplicate-props": 2,
        "react/jsx-no-literals": 0,
        "react/jsx-no-undef": 2,
        "react/jsx-sort-props": 0,

        "react/jsx-uses-react": 2,
        "react/jsx-uses-vars": 2,
        "react/no-find-dom-node": 2,
        "react/no-multi-comp": 0,
        "react/no-set-state": 0,
        "react/react-in-jsx-scope": 2,
        "react/require-optimization": 0,
        "react/self-closing-comp": 2,
        "react/style-prop-object": 2,
        "react/void-dom-elements-no-children": 2,
        "@typescript-eslint/consistent-type-assertions": 2,

        "@typescript-eslint/consistent-type-imports": ["error", {
            prefer: "type-imports",
            fixStyle: "inline-type-imports",
            disallowTypeAnnotations: false,
        }],

        "@typescript-eslint/method-signature-style": ["error", "method"],
        "@typescript-eslint/no-empty-interface": 2,

        "@typescript-eslint/no-unused-vars": [2, {
            args: "after-used",
            argsIgnorePattern: "^_",
            ignoreRestSiblings: true,
            vars: "all",
            varsIgnorePattern: "^_",
        }],

        "@typescript-eslint/explicit-module-boundary-types": ["error", {
            allowedNames: [
                "render",
                "componentDidMount",
                "componentDidUpdate",
                "componentWillUnmount",
                "ngOnInit",
                "ngOnChanges",
                "ngAfterViewInit",
                "ngOnDestroy",
            ],
        }],

        "@typescript-eslint/unbound-method": "off",

        "@typescript-eslint/no-misused-promises": ["error", {
            checksConditionals: false,
            checksVoidReturn: false,
        }],

        "@typescript-eslint/no-empty-function": ["error", {
            allow: ["private-constructors"],
        }],

        "@typescript-eslint/no-unsafe-enum-comparison": "off",
        "react-hooks/rules-of-hooks": 2,
        "react-hooks/exhaustive-deps": 1,

        "sonarjs/cognitive-complexity": 1,
        "sonarjs/no-clear-text-protocols": "off",
        "sonarjs/deprecation": "off",
        "sonarjs/function-return-type": "off",
        "sonarjs/todo-tag": "off",
        "sonarjs/different-types-comparison": "off",
        "sonarjs/pseudo-random": "off",

        "regexp/no-obscure-range": ["error", {
            allowed: ["alphanumeric", "а-я", "А-Я", "А-я"],
        }],

        "regexp/strict": "off",
        "import-x/no-unresolved": "off",
        "promise/always-return": "off",

        "total-functions/require-strict-mode": "off",
        "total-functions/no-unsafe-type-assertion": "off",
        "total-functions/no-unsafe-readonly-mutable-assignment": "off",
        "total-functions/no-partial-division": "off",
        "total-functions/no-enums": "off",
        "total-functions/no-partial-url-constructor": "off",

        "unicorn/filename-case": "off",
        "unicorn/prevent-abbreviations": "off",
        "unicorn/no-null": "off",
        "unicorn/no-array-reduce": "off",
        "unicorn/no-array-for-each": "off",
        "unicorn/explicit-length-check": "off",
        "unicorn/no-array-callback-reference": "off",
        "unicorn/number-literal-case": "off",
        "unicorn/new-for-builtins": "off",
        "unicorn/prefer-top-level-await": "off",
        "unicorn/prefer-module": "off",
        "unicorn/prefer-global-this": "off",

        "simple-import-sort/imports": ["error", {
            groups: [[
                "^node:",
                "^",
                "^react$",
                "^react-dom",
                "^mobx",
                "^@mui/material$",
                "^@mui/",
                "^@?\\w",
                "^\\u0000[^.]",
            ], ["^\\.(?!.*\\.css$)"], ["^\\u0000\\.", "^\\..*\\.css$"]],
        }],
    },
}, {
    files: ["**/*.test.{ts,tsx}"],

    languageOptions: {
        globals: {
            ...globals.jest,
        },
    },
}, {
    files: ["tests/**/*.{ts,tsx}"],
    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.browser,
            WebdriverIO: "readonly",
            browser: "readonly",
            expect: "readonly",
            $$: "readonly",
            $: "readonly",
            process: "readonly",
            testOrganizationIndex: "readonly",
        },
        parserOptions: {
            project: "./tests/tsconfig.json",
        },
    },
    rules: {
        "unicorn/prefer-dom-node-dataset": 0,
        "unicorn/prefer-node-protocol": 0,
        "regexp/no-super-linear-backtracking": "off",
        "sonarjs/no-hardcoded-ip": "off",
        "sonarjs/no-hardcoded-passwords": "off",
    },
}, {
    files: ["tests/_harness/**/*.{ts,tsx}"],
    ...wdio.configs["flat/recommended"],
    rules: {
        ...wdio.configs["flat/recommended"].rules,
        "wdio/no-pause": "off",
        "regexp/no-super-linear-backtracking": "off",
    },
}, {
    files: [
        "**/*.component.ts",
        "**/*.service.ts",
        "**/*.guard.ts",
        "**/*.interceptor.ts",
        "**/*.directive.ts",
        "**/*.pipe.ts",
        "**/*.handler.ts",
        "**/services.ts",
        "**/*.module.ts",
    ],

    rules: {
        "@typescript-eslint/consistent-type-imports": "off",
    },
}, {
    files: ["**/*.js"],

    rules: {
        strict: 0,
    },
}]);