var y = require('yamvish');

y.env.login = function(credential, context) {
	context = context = y.mainContext;
	return y.c3po.protocols.login.post(credential)
		.then(function(s) {
			console.log('login success !!! : ', s);
			context.env.set('session.token', s.data.token)
				.set('session.email', credential.email)
				.set('session.userId', s.data.userId);
		})
		.logError('error on login')
};

function logout(context) {
	var session = context.env.data.session;
	session.reset();
	context.env.notify('set', 'session', session);
	context.env.set('session.useId', null);
}

y.env.logout = function(context) {
	context = context || y.mainContext;
	return y.c3po.protocols.logout.post()
		.then(function() {
			logout(context);
			return true;
		})
		.catch(function(error) {
			if (error.status === 401) { // maybe it's because accesToken has expired : so do as normal login
				logout(context);
				return true;
			} else {
				console.error('error while logout : ', error);
				throw error;
			}
		});
};

y.c3po.protocols.login = {
	post: function(credential, opt) {
		return y.axios.post(y.env.baseURI + '/login', credential).logError('proto login through axios post : ', credential);
	}
};

y.c3po.protocols.logout = {
	post: function(obj, opt) {
		return y.axios.post(y.env.baseURI + '/logout', {}, {
			headers: {
				Authorization: y.env.session.token
			}
		});
	}
};

y.c3po.protocols.user = {
	get: function(req, opt) {
		return y.axios.get(y.env.baseURI + '/api/User/' + req);
	},
	post: function(credential, opt) {
		return y.axios.post(y.env.baseURI + '/api/users', credential);
	}
};
