#!/usr/bin/env node
require("@babel/register")
import("../src/index.js")
console.log('@makeRum')
process.title = 'makeRum';
