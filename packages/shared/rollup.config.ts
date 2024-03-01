import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import excludeDependenciesFromBundle from 'rollup-plugin-exclude-dependencies-from-bundle'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.mjs',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [
      excludeDependenciesFromBundle(),
      typescript(),
      terser({
        mangle: {
          properties: {
            regex: /^_[^_]*$/,
          },
        },
      }),
    ],
  },
]
