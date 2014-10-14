var hash = require('loader-utils').getHashDigest
var fs = require('fs')
var postcss = require('postcss')

var sheet = fs.readFileSync(__dirname + '/style.css', 'utf8')
var suffix = hash(sheet)
var shortName = true
var mod = require('path').basename(__dirname)
var reg = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g

function names(str) {
	var match,
		classNames = []
	reg.lastIndex = 0
	while (match = reg.exec(str)) 
		classNames.push(match[1])
	return classNames
}

function hashify(str) {
	var repl = (shortName ? ('._'+mod+'_$1') : ('.$1_'+suffix))
	reg.lastIndex = 0
	return str.replace(reg, repl)
}

function uniq(value, index, self) { 
    return self.indexOf(value) === index;
}

function concat(a, b) {
	return a.concat(b)
}

function transform(css, opts) {
	var classNames = []

	css.eachRule(function(r) {
		//push any new class names
		var uniques = r.selectors.map(names).reduce(concat)
		classNames = classNames.concat(uniques).filter(uniq)

		//modify class names
		r.selectors = r.selectors.map(hashify)
		r.selectors.forEach(function(c) {
			console.log(c)
		})
	})

	
	console.log()
}

var css = postcss()
		.use(transform)
		.process(sheet)
		.css

fs.writeFileSync(__dirname+'/out.css', css)

// var css = require('css')
// var plugin = require('./')

// var obj = css.parse(sheet)

// function filterExport(s) {
// 	return s.indexOf('export') === 0
// }

// function hasExport(selectors) {
// 	return selectors.some(filterExport)
// }

// var style = obj.stylesheet
// style.rules.filter(function(r) {
// 	return hasExport(r.selectors)
// }).forEach(function(r) {
// 	r.selectors = r.selectors.filter(filterExport)
// 	r.selectors[0].replace(/^export/, 'foo')
// 	console.log(r)
// })

// console.log(css.stringify(obj))