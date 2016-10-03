import babel from 'rollup-plugin-babel';
import css from 'rollup-plugin-css-only';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  format: 'iife',
  moduleName: 'TICKER',
  entry:  'src/components/App.jsx',
  dest: 'dist/App.js',
  sourceMap: false,
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    css({
      output: 'dist/main.css'
    }),
    babel()
  ]
};
