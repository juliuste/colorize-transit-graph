#!/usr/bin/env node
'use strict'

const mri = require('mri')
const getStdin = require('get-stdin')

const pkg = require('./package.json')
const colorize = require('.')

const argv = mri(process.argv.slice(2), {
	boolean: ['help', 'h', 'version', 'v', 'invert-y', 'y']
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    colorize-transit-graph

Examples:
    cat graph.json | colorize-transit-graph > graph-colorized.json
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`colorize-transit-graph v${pkg.version}\n`)
	process.exit(0)
}

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const main = async () => {
	const stdin = await getStdin()
	const graph = JSON.parse(stdin)

	return colorize(graph)
}

main()
.then(graph => {process.stdout.write(JSON.stringify(graph))})
.catch(showError)
