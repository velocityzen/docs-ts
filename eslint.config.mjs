// @ts-check
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['lib/*'] },
  {
    files: ['*.config.ts', 'src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      {
        rules: {
          '@typescript-eslint/array-type': 'off',
          '@typescript-eslint/no-invalid-void-type': 'off',
          '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }]
        }
      }
    ]
  }
)
