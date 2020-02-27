import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import { terser } from 'rollup-plugin-terser';

const prettier = require('rollup-plugin-prettier');

const banner = '/**\n\
* Vanilla JS Magic Line Navigation\n\
* Author: Bastian Fießinger\n\
* Version: 1.0.4\n\
*/';

// Default
export default [{
  input: 'src/js/main.js',
  output: {
    file: 'dist/js/magicline.js',
    format: 'iife',
    name: 'magicLine',
    banner: banner
  },
  plugins: [
    eslint(),
    babel({
      exclude: 'node_modules/**'
    }),
    prettier({
      printWidth: 80,
      tabWidth: 2,
      tabs: true,
      trailingComma: 'es5',
      parser: 'babel'
    }),
  ]
}, {
  input: 'src/js/main.js',
  output: {
    file: 'dist/js/magicline.min.js',
    format: 'iife',
    name: 'magicLine',
    banner: banner
  },
  plugins: [
    eslint(),
    babel({
      exclude: 'node_modules/**'
    }),
    prettier({
      printWidth: 80,
      tabWidth: 2,
      tabs: true,
      trailingComma: 'es5',
      parser: 'babel'
    }),
    terser({
      output: {
        comments: function (node, comment) {
          if (comment.type === "comment2") {
            // multiline comment
            return /Vanilla JS Magic Line Navigation/i.test(comment.value);
          }
          return false;
        }
      }
    })
  ]
}];