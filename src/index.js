console.log('@rumMaker index')

//import * as babel from '@babel/core'
import fs from 'fs'
import * as rollup from 'rollup'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

const pkg = JSON.parse(fs.readFileSync('./package.json', "utf8"))
const DEFAULTS = {
  entry: 'src/index.js',
}
const opts = Object.assign({}, DEFAULTS)
if (pkg.rum && pkg.rum.maker) Object.assign(opts, pkg.rum.maker)
const filename = opts.entry

let external = []
if (pkg.devDependencies) external.push(...Object.keys(pkg.devDependencies))
if (pkg.dependencies) external.push(...Object.keys(pkg.dependencies))
const jobs = [
  {
    in:{
      input: filename,
      external,
      plugins: [
        babel({
          presets: [
            "@babel/preset-env"
          ],
          babelrc: false,
          configFile: false,
          externalHelpers: false,
          runtimeHelpers: true
        }),
        resolve({
          preferBuiltins: true
        }),
        commonjs()
      ]
    },
    out: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      }
    ]
  },
  {
    in:{
      input: filename,
      external: external,
      plugins: [
        babel({
          presets: [
            "@babel/preset-env"
          ],
          babelrc: false,
          configFile: false,
          externalHelpers: false,
          runtimeHelpers: true
        }),
        resolve({
          browser: true
        }),
        commonjs()
      ]
    },
    out: [
      {
        file: pkg.browser,
        format: 'cjs',
        sourcemap: true,
      }
    ]
  }
]

function build() {
  jobs.forEach((job) => {
    rollup.rollup(job.in).then(bundle=>{
      job.out.forEach((out) => {
        //console.log(bundle)
        if (out.file) bundle.write(out)
      })
    })
  })
}

build();
