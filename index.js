var staticModule = require('static-module')
var path = require('path')
var through = require('through2')
var escape = require('js-string-escape')
var fs = require('fs')
var hasher = require('./hasher')
var postcss = require('postcss')
var getHash = require('loader-utils').getHashDigest

module.exports = function (file, opts) {
    if (/\.json$/.test(file)) return through()
    if (module.exports.__emitter) return module.exports.__emitter(file, opts)

    if (!opts) opts = {}
    var vars = opts.vars || {
        __filename: file,
        __dirname: path.dirname(file)
    }

    var sm = staticModule(
        { 'clssify': clssify },
        { vars: vars }
    )
    return sm
    
    function clssify(file, opt) {
        if (!fs.statSync(file).isFile())
            throw new Error('clssify must point to a file: '+file)

    	opt = opt||{}


    	var content = fs.readFileSync(file, 'utf8')
    	var hash = opt.hash || ('_'+getHash(content))
    	var processor = hasher(hash)

		var css = postcss()
				.use(processor)
				.process(content)
				.css
		return "require('clssify/adapter')('"+escape(css)+"', '"+hash+"')"
    }
}