import config     from './rollup.config';
import serve      from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default Object.assign(config, {
  plugins: config.plugins.concat([
    serve({
      contentBase: '.',
      port: 8081
    }),
    livereload('dist')
  ])
});
