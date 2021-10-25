import serve from 'rollup-plugin-serve';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import todosInfo from '@azizka/todos/package.json';

const mode = process.env.NODE_ENV || 'development';
const dev = mode === 'development';

export default {
  input: 'src/main.js',
  output: {
    file: `public/todos-${todosInfo.version}.js`,
    format: 'iife',
    sourcemap: dev,    
  },
  plugins: [
    serve('public'),
    nodeResolve()
  ]
};
