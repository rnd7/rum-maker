'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var babel = _interopDefault(require('rollup-plugin-babel'));
var commonjs = _interopDefault(require('rollup-plugin-commonjs'));
var resolve = _interopDefault(require('rollup-plugin-node-resolve'));
var rollup = require('rollup');

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

console.log('@rumMaker index'); //import * as babel from '@babel/core'
var pkg = JSON.parse(fs.readFileSync('./package.json', "utf8"));
var DEFAULTS = {
  tasks: [{
    entry: './src/index.js',
    target: {
      esm: true,
      umd: true,
      cjs: true
    }
  }]
};
var opts = Object.assign({}, DEFAULTS);
if (pkg.rum && pkg.rum.maker) Object.assign(opts, pkg.rum.maker); //else throw "No rum.maker entry within package.json."

console.log(opts);
var filename = opts.tasks[0].entry; //const code = fs.readFileSync(filename, "utf8");

var external = [];
if (pkg.devDependencies) external.push.apply(external, _toConsumableArray(Object.keys(pkg.devDependencies)));
if (pkg.dependencies) external.push.apply(external, _toConsumableArray(Object.keys(pkg.dependencies)));
var browser = !!pkg.browser;
var main = !!pkg.main; //cjs module

var module$1 = !!pkg.module; // esm module
var jobs = [{
  in: {
    input: filename,
    external: external,
    plugins: [babel({
      presets: ["@babel/preset-env"],
      babelrc: false,
      configFile: false,
      externalHelpers: false,
      runtimeHelpers: true,
      sourceMaps: true
    }), resolve({
      preferBuiltins: true
    }), commonjs()]
  },
  out: [{
    file: pkg.main,
    format: 'cjs',
    sourcemap: true,
    sourcemapFile: pkg.main + '.map'
  }, {
    file: pkg.module,
    format: 'es',
    sourcemap: true,
    sourcemapFile: pkg.module + '.map'
  }]
}, {
  in: {
    input: filename,
    external: external,
    plugins: [babel({
      presets: ["@babel/preset-env"],
      babelrc: false,
      configFile: false,
      externalHelpers: false,
      runtimeHelpers: true,
      sourceMaps: true
    }), resolve({
      browser: true
    }), commonjs()]
  },
  out: [{
    file: pkg.browser,
    format: 'cjs',
    sourcemap: true,
    sourcemapFile: pkg.browser + '.map'
  }]
}];

function build() {
  // create a bundle
  jobs.forEach(function (job) {
    rollup.rollup(job.in).then(function (bundle) {
      //console.log(bundle.imports); // an array of external dependencies
      //console.log(bundle.exports); // an array of names exported by the entry point
      //console.log(bundle.modules); // an array of module objects
      console.log(bundle);
      job.out.forEach(function (out) {
        bundle.generate(out).then(function (gen) {
          //  console.log(gen)
          if (out.file) bundle.write(out);
        });
      });
    });
  }); // generate code and a sourcemap
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
//# sourceMappingURL=rum-maker.js.map
