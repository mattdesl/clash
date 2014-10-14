var insert = require('insert-css')

module.exports = function(css, hash) {
	insert(css)

	return function(name) {
		return name+hash
	}
}