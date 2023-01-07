module.exports = {
    env: {
      browser: true,
      es6: true,
      jest: true,
    },
    extends: [
      'react-app',
      'airbnb',
      'plugin:@typescript-eslint/recommended',
      'prettier',
    ],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    plugins: ['react', 'import', 'jsx-a11y'],
    rules: {
      'react/jsx-filename-extension': [
        'error',
        {
          extensions: ['.tsx', '.jsx'],
        },
      ],
      'import/extensions': [
        'error',
        {
          'js': 'never',
          'ts': 'never',
          'jsx': 'never',
          'tsx': 'never',
          'css': 'always'
        }
      ],
      'arrow-body-style': 'off',
      'react/self-closing-comp': ["error", {
        "component": false,
        "html": false
      }],
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/prefer-default-export': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/adjacent-overload-signatures': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'grouped-accessor-pairs': 'off',
      'react/function-component-definition': 'off',
      'react/destructuring-assignment': 'off',
      'react/require-default-props': 'off',
      'no-underscore-dangle': 'off',
      'no-plusplus': 'off',
      'lines-between-class-members': 'off',
      'class-methods-use-this': 'off',
      'import/no-cycle': 'off',
      'no-bitwise': 'off',
      'no-param-reassign': 'off',
      'spaced-comment': 'off',
      'no-use-before-define': 'off',
      'prefer-arrow-callback': 'off',
      'no-useless-constructor': 'off',
      'no-debugger': 'off',
      'no-shadow': 'off',
      'prefer-destructuring': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/label-has-associated-control': 'off',
      'react/jsx-no-bind': 'off'
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        typescript: {},
      },
    }
  };