#!/usr/bin/env node

console.log('@make-rum')

require("@babel/register")({
  // This will override `node_modules` ignoring - you can alternatively pass
  // an array of strings to be explicitly matched or a regex / glob
  presets: [
    "@babel/preset-env"
  ],
  //plugins: ["@babel/plugin-transform-runtime"]
})
require('../src/index.js')
