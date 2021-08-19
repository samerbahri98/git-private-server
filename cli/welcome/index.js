const colors = require('colors');
const Table = require('cli-table')

const header = []
header.push('Usage:')
header.push('gitserver')
header.push('[options]')
header.push('<command>')
header.push('[args]')

console.log(header.join(' '))