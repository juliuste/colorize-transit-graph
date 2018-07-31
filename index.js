'use strict'

const colors = require('css-named-colors').default
const round = require('lodash.round')
const groupBy = require('lodash.groupby')
const sortBy = require('lodash.sortby')
const hexRgb = require('hex-rgb')
const distance = require('euclidean-distance')

const clone = x => JSON.parse(JSON.stringify(x))

const colorDistance = (cssColor1, cssColor2) => {
    const rgb1 = hexRgb(colors.find(c => c.name === cssColor1).hex, {format: 'array'})
    const rgb2 = hexRgb(colors.find(c => c.name === cssColor2).hex, {format: 'array'})
    const dist = distance(rgb1, rgb2)
    return round(dist, 5)
}

const hexByName = n => colors.find(c => c.name === n).hex

// filter colors too similar to white
const validColors = colors.filter(c => colorDistance(c.name, 'white') >= 100).map(c => c.name)
const preferredColors = [
    'crimson',
    'navy',
    'limegreen',
    'gold',
    'fuchsia',
    'orange',
    'cornflowerblue',
    'mediumseagreen',
    'darkviolet',
    'maroon',
    'cadetblue'
]

const getLineColor = (alreadyUsedColors) => {
    const unusedPreferredColors = preferredColors.filter(x => !alreadyUsedColors.includes(x))
    if (unusedPreferredColors.length > 0) {
        const color = unusedPreferredColors[0]
        alreadyUsedColors.push(color)
        return hexByName(color)
    } else {
        const unusedColors = validColors.filter(x => !alreadyUsedColors.includes(x))
        if (unusedColors.length > 1) {
            const sortedColors = sortBy(unusedColors, c => {
                const distancesToUsed = alreadyUsedColors.map(u => colorDistance(u, c))
                return (-1)*Math.min(...distancesToUsed)
            })
            const color = sortedColors[0]
            alreadyUsedColors.push(color)
            return hexByName(color)
        } else {
            const color = unusedColors[0]
            alreadyUsedColors.length = 0
            return hexByName(color)
        }
    }
}

const colorizeTransitGraph = (inputGraph) => {
    const graph = clone(inputGraph)
    if (!graph || !Array.isArray(graph.lines)) throw new Error('Invalid input graph.')

    const alreadyUsedColors = []

    const linesByGroup = groupBy(graph.lines.filter(l => l.group), 'group')
    for (let group of Object.keys(linesByGroup)) {
        const alreadyColoredLine = linesByGroup[group].find(l => l.color)
        if (alreadyColoredLine) {
            linesByGroup[group].forEach(l => {
                l.color = alreadyColoredLine.color
            })
        } else {
            const groupColor = getLineColor(alreadyUsedColors)
            linesByGroup[group].forEach(l => {
                l.color = groupColor
            })
        }
    }

    const linesWithoutGroup = graph.lines.filter(l => !l.group && !l.color)
    for (let line of linesWithoutGroup) {
        const lineColor = getLineColor(alreadyUsedColors)
        line.color = lineColor
    }

    return graph
}

module.exports = colorizeTransitGraph
