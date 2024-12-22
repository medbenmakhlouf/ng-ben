import tseslint from 'typescript-eslint';
import rootConfig from '../../eslint.config.mjs';

export default tseslint.config(...rootConfig, {
  files: ['**/*.ts'],
  rules: { '@typescript-eslint/no-explicit-any': 'off' },
});
