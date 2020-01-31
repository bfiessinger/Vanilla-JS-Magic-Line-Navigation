import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import { uglify } from "rollup-plugin-uglify";

// Default
export default [{
  input: 'src/js/main.js',
  output: {
    file: 'dist/js/magicline.js',
    format: 'iife',
    name: 'magicLine',
    banner: '/**\n\
 * Vanilla JS Magic Line Navigation\n\
 * Author: Bastian Fießinger\n\
 * Version: 1.0.1\n\
 */'
  },
  plugins: [
    eslint(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}, {
  input: 'src/js/main.js',
  output: {
    file: 'dist/js/magicline.min.js',
    format: 'iife',
    name: 'magicLine',
    banner: '/**\n\
 * Vanilla JS Magic Line Navigation\n\
 * Author: Bastian Fießinger\n\
 * Version: 1.0.0\n\
 */',
    compact: true
  },
  plugins: [
    eslint(),
    babel({
      exclude: 'node_modules/**'
    }),
    uglify({
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