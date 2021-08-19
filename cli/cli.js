#! /usr/bin/env node

const yargs = require('yargs')

yargs.argv._.lenght?
require("./options/index.js.js")
:require("./welcome/index.js")