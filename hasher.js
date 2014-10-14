function hashify(selector, hash) {
	var reg = /\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g
	return selector.replace(reg, '.$1'+hash)
}

module.exports = function(hash) {
	return function(css) {
		css.eachRule(function(r) {
			r.selectors = r.selectors.map(function(s) {
				return hashify(s, hash)
			})
		})
	}
}

// function getClassNames(str) {
// 	var match,
// 		classNames = []
// 	reg.lastIndex = 0
// 	while (match = reg.exec(str)) 
// 		classNames.push(match[1])
// 	return classNames
// }

// function uniq(value, index, self) { 
//     return self.indexOf(value) === index;
// }

// function concat(a, b) {
// 	return a.concat(b)
// }
