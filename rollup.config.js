import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/translator.js',

  output: [
    {
      file: './dist/esm/translator.js',
      sourcemap: true,
      format: 'es',
    },
    {
      file: './dist/esm/translator.min.js',
      sourcemap: true,
      format: 'es',
      plugins: [terser()],
    },
    {
      file: './dist/cjs/translator.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'default',
    },
    {
      file: './dist/cjs/translator.min.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'default',
      plugins: [terser()],
    },
    {
      file: './dist/umd/translator.js',
      format: 'umd',
      sourcemap: true,
      name: 'Translator',
    },
    {
      file: './dist/umd/translator.min.js',
      format: 'umd',
      sourcemap: true,
      name: 'Translator',
      plugins: [terser()],
    },
  ],

  plugins: [
    babel({
      exclude: /(node_modules|dist)/,
      babelHelpers: 'bundled',
    }),
  ],
};
