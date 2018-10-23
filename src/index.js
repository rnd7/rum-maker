console.log('@rum-maker')
//import * as babel from '@babel/core'
import fs from 'fs'
const pkg = JSON.parse(fs.readFileSync('./package.json', "utf8"))
const DEFAULTS = {
  tasks: [
    {
      entry: './src/index.js',
      target: {
        esm: true,
        umd: true,
        cjs: true
      }
    },
  ]
}
const opts = Object.assign({}, DEFAULTS)
if (pkg.rumMaker) Object.assign(opts, pkg.rumMaker)
console.log(opts)

const filename = opts.tasks[0].entry

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


import * as rollup from 'rollup'
const jobs = [
  {
    in:{
      input: filename,
      external: [].concat(Object.keys(pkg.dependencies), Object.keys(pkg.devDependencies)),
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
        sourceMap: true
      },
      {
        file: pkg.module,
        format: 'es',
        sourceMap: true
      }
    ]
  },
  {
    in:{
      input: filename,
      external: [].concat(Object.keys(pkg.dependencies), Object.keys(pkg.devDependencies)),
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
        sourceMap: true
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

      job.out.forEach((out) => {
        bundle.generate(out).then((gen)=>{
          console.log(gen)
          bundle.write(out);
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
