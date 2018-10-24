console.log('@rumMaker index')

//import * as babel from '@babel/core'
import fs from 'fs'
const pkg = JSON.parse(fs.readFileSync('./package.json', "utf8"))
const DEFAULTS = {
  entry: './src/index.js',
}
const opts = Object.assign({}, DEFAULTS)
if (pkg.rum && pkg.rum.maker) Object.assign(opts, pkg.rum.maker)
//else throw "No rum.maker entry within package.json."

console.log(opts)

const filename = opts.entry

//const code = fs.readFileSync(filename, "utf8");

/*
babel.transform(
  code,
  {
    filename,
    presets: ["@babel/preset-env"],
    babelrc: false,
    configFile: false,
  },
  (err, result) => {
    console.log(
      result.code,
      result.map,
      result.ast
    )
  }
);
*/
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
//import "@babel/polyfill";


let external = []
if (pkg.devDependencies) external.push(...Object.keys(pkg.devDependencies))
if (pkg.dependencies) external.push(...Object.keys(pkg.dependencies))
const browser = !!pkg.browser
const main = !!pkg.main //cjs module
const module = !!pkg.module // esm module

import * as rollup from 'rollup'
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
          runtimeHelpers: true,
          sourceMaps: true
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
        sourcemapFile: pkg.main+'.map'
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
        sourcemapFile: pkg.module+'.map'
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
          runtimeHelpers: true,
          sourceMaps: true
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
        sourcemapFile: pkg.browser+'.map'
      }
    ]
  }

]



function build() {
  // create a bundle
  jobs.forEach((job) => {
    rollup.rollup(job.in).then(bundle=>{
      //console.log(bundle.imports); // an array of external dependencies
      //console.log(bundle.exports); // an array of names exported by the entry point
      //console.log(bundle.modules); // an array of module objects

        console.log(bundle)
      job.out.forEach((out) => {
        bundle.generate(out).then((gen)=>{
        //  console.log(gen)
          if (out.file) bundle.write(out);
        })
      })
    })
  })
    // generate code and a sourcemap
    //const { code, map } = await

  //})


  // or write the bundle to disk
  //await
}

build();


/*
//console.log(code)
// Load and compile file normally, but skip code generation.
const { ast } = babel.transformSync(code, { filename, ast: true,
presets: ["@babel/preset-env"], code: false });
console.log(ast)
// Minify the file in a second pass and generate the output code here.
const { code2, map } = babel.transformFromAstSync(ast, code, {
  filename,
  presets: ["@babel/preset-env"],
  babelrc: false,
  configFile: false,
});
console.log(code2)
*/
