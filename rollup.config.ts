import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
const pkg = require('./package.json');

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
};

const external = [
  'react',
  'react-dom',
  'prop-types',
];

export default {
  input: `react-janus-videoroom.tsx`,
  output: [
    {
      name: 'react-janus-videoroom', 
      file: pkg.browser,
      format: 'umd',
      sourcemap: false,
      globals
    },
    {
      name: 'react-janus-videoroom', 
      file: pkg.main,
      format: 'cjs',
      sourcemap: false,
      globals
    },
    {
      name: 'react-janus-videoroom', 
      file: pkg.module,
      format: 'es',
      sourcemap: false,
      globals
    }
  ],
  external,
  plugins: [
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs(),
    resolve({
      browser: true
    }),
    sourceMaps()
  ]
}
