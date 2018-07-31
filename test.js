'use strict'

const tape = require('tape')
const colorize = require('./index')
const isHex = require('is-hexcolor')
const uniq = require('lodash.uniq')

const input = require('./test-graph.json')

tape('colorize-transit-graph', (t) => {
	const colorized = colorize(input)
	t.ok(Array.isArray(colorized.lines) && colorized.lines.length > 0)
	let colors = []
	for (let line of colorized.lines) {
		t.ok(line.color && isHex(line.color))
		if (line.id === 'U2') line.color === '#2af'
		if (line.id === 'U55') line.color === '#f00'
		colors.push(line.color)
	}

	t.ok(uniq(colors).length === colorized.lines.length - 1)

	const u1 = colorized.lines.find(x => x.id === 'U1')
	const u3 = colorized.lines.find(x => x.id === 'U3')
	t.ok(u1.color === u3.color)

	t.end()
})
