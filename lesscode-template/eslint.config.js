const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const eslintConfigPrettier = require('eslint-config-prettier');
const prettier = require('eslint-plugin-prettier');
const typescriptEslintParser = require('@typescript-eslint/parser');
const codecc = require('eslint-plugin-codecc');
const eslintVueParser = require('vue-eslint-parser');
const perfectionistNatural = require('eslint-plugin-perfectionist/configs/recommended-natural');
const eslintVuePlugin = require('eslint-plugin-vue');
const { rules: tencentEslintLegacyRules } = require('eslint-config-tencent/ts'); // Simplifying import
// Combining deprecated rules into one object to streamline code
const deprecateRules = Object.fromEntries(
  [
    'ban-ts-comment',
    'block-spacing',
    'brace-style',
    'comma-dangle',
    'comma-spacing',
    'func-call-spacing',
    'indent',
    'key-spacing',
    'keyword-spacing',
    'lines-around-comment',
    'lines-between-class-members',
    'member-delimiter-style',
    'no-extra-parens',
    'no-extra-semi',
    'padding-line-between-statements',
    'quotes',
    'semi',
    'space-before-blocks',
    'space-before-function-paren',
    'space-infix-ops',
    'type-annotation-spacing',
  ].map(rule => [`@typescript-eslint/${rule}`, 'off']),
);

module.exports = [
  {
    ignores: ['node_modules', 'dist', 'vue2/*', 'vue3/*'],
  },
  eslintConfigPrettier,
  perfectionistNatural,
  {
    rules: {
      'perfectionist/sort-vue-attributes': 'off',
    },
  },
  {
    plugins: { prettier },
    rules: {
      ...prettier.configs.recommended.rules,
    },
  },
  {
    files: ['src/**/*.ts', 'scripts/**/*.ts', 'playground/**/*.ts'],
    ignores: [],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        project: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      codecc,
    },
    rules: {
      'codecc/license': [
        'error',
        {
          license: `/*
* Tencent is pleased to support the open source community by making
* 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
*
* Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
*
* 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
*
* License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
*
* ---------------------------------------------------
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
* to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of
* the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
* THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
* CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
* IN THE SOFTWARE.
*/\n`,
          pattern: '.*Tencent is pleased to support the open source community.+',
        },
      ],
      ...typescriptEslint.configs.recommended.rules,
      ...tencentEslintLegacyRules,
      ...deprecateRules,
    },
  },
  ...eslintVuePlugin.configs['flat/recommended'].map(config =>
    config.files
      ? {
          ...config,
          files: ['src/**/*.vue', 'playground/**/*.vue'],
          languageOptions: {
            ...config.languageOptions,
            parser: eslintVueParser,
            parserOptions: {
              ...config.languageOptions.parserOptions,
              allowAutomaticSingleRunInference: false,
              ecmaFeatures: { jsx: true, legacyDecorators: true },
              ecmaVersion: 'latest',
              extraFileExtensions: ['.vue'],
              parser: { '<template>': 'espree', ts: typescriptEslintParser },
              project: true,
            },
          },
          plugins: {
            '@typescript-eslint': typescriptEslint,
            vue: eslintVuePlugin,
          },
          rules: {
            ...config.rules,
            ...tencentEslintLegacyRules,
            '@typescript-eslint/explicit-member-accessibility': 'off',
            'comma-dangle': ['error', 'always-multiline'],
            ...deprecateRules,
          },
        }
      : config,
  ),
];
