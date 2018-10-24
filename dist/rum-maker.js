'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = _interopDefault(require('fs'));
var rollup = require('rollup');
var babel = _interopDefault(require('rollup-plugin-babel'));
var commonjs = _interopDefault(require('rollup-plugin-commonjs'));
var resolve = _interopDefault(require('rollup-plugin-node-resolve'));

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
  entry: 'src/index.js'
};
var opts = Object.assign({}, DEFAULTS);
if (pkg.rum && pkg.rum.maker) Object.assign(opts, pkg.rum.maker);
var filename = opts.entry;
var external = [];
if (pkg.devDependencies) external.push.apply(external, _toConsumableArray(Object.keys(pkg.devDependencies)));
if (pkg.dependencies) external.push.apply(external, _toConsumableArray(Object.keys(pkg.dependencies)));
var jobs = [{
  in: {
    input: filename,
    external: external,
    plugins: [babel({
      presets: ["@babel/preset-env"],
      babelrc: false,
      configFile: false,
      externalHelpers: false,
      runtimeHelpers: true
    }), resolve({
      preferBuiltins: true
    }), commonjs()]
  },
  out: [{
    file: pkg.main,
    format: 'cjs',
    sourcemap: true
  }, {
    file: pkg.module,
    format: 'es',
    sourcemap: true
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
      runtimeHelpers: true
    }), resolve({
      browser: true
    }), commonjs()]
  },
  out: [{
    file: pkg.browser,
    format: 'cjs',
    sourcemap: true
  }]
}];

function build() {
  jobs.forEach(function (job) {
    rollup.rollup(job.in).then(function (bundle) {
      job.out.forEach(function (out) {
        //console.log(bundle)
        if (out.file) bundle.write(out);
      });
    });
  });
}

build();
//# sourceMappingURL=rum-maker.js.map
