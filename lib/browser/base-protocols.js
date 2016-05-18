var y = require('yamvish'),
	c3po = y.c3po,
	axios = require('axios'),
	// hack address with port 8088 when live server (which run on 8080 and don't run API server code)
	port = (location.port === '8080' ? '8088' : location.port),
	baseURI = y.env.baseURI = location.protocol + '//' + location.hostname + ':' + port;

y.axios = axios;

console.log('base uri : ', baseURI);

/*var instance = axios.create({
	baseURL: baseURI + '/api/',
	timeout: 1000
		headers: {
			Authorization: y.env.session.token
		}
});*/

//______________________________ FILES RESSOURCES PROTOCOL

var templateCache = {};

function parseTemplate(input, req) {
	try {
		var r = y.html.parse(input);
		templateCache[req] = r;
		return r;
	} catch (e) {
		console.error('"template" protocol parser fail : ', e, ' - for request : ', req);
		return y().p('template parser fail for uri : ' + req + '.').p('error : ' + e.toString());
	}
}

c3po.protocols.template = {
	get: function(req, opt) {
		if (templateCache[req])
			return templateCache[req];
		opt = opt || {};
		return axios.get(baseURI + req)
			.then(function(s) {
				return parseTemplate(s.data, req)
			});
	}
};

c3po.protocols.json = {
	get: function(req, opt) {
		return axios.get(baseURI + req)
			.then(function(s) {
				return JSON.parse(s.data);
			});
	}
};

c3po.protocols.html = {
	get: function(req, opt) {
		return axios.get(baseURI + req)
			.then(function(s) {
				return s.data;
			});;
	}
};
