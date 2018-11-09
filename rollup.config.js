import typescript from 'rollup-plugin-typescript2'

export default {
  input: './index.tsx',
  output: [
    {
      file: './dist/index.js',
      format: 'cjs',
    },
    {
      file: './dist/index.es.js',
      format: 'es',
    },
  ],
  external: ['react'],
  plugins: [typescript()],
}
