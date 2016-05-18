var y = require('yamvish');

y.env.login = function(context, credential, successCallback, navigateTo) {
	return y.c3po.protocols.login.post(credential)
		.then(function(s) {
			// s.data.userId = 2;
			console.log('login success !!! : ', s);
			context.env.set('session.token', s.data.token)
				.set('session.email', credential.email)
				.set('session.userId', s.data.userId);
			context.toAgora('logged:in')
			if (navigateTo)
				context.navigateTo(navigateTo);

			// should be in success callback
			context.env.setAsync('session.profile', y.c3po.get('profile::?owner=' + s.data.userId + '&first()'))
				.then(function(profile) {
					console.log('profile loaded : re-save session : ', profile);
					context.env.data.session.save();
				});
		})
		.catch(function(error) {
			console.error('error on login : ', error);
			throw error;
		});
};

function logout(context) {
	var session = context.env.data.session;
	session.reset();
	context.env.notify('set', 'session', session);
	// console.log('app logged out');
	context.toAgora('logged:out').navigateTo('/');
}

y.env.logout = function(context) {
	return y.c3po.protocols.logout.post()
		.then(function() {
			logout(context);
		})
		.catch(function(error) {
			if (error.status === 401) // maybe it's because accesToken has expired : so do as normal login
				logout(context);
			else {
				console.error('error while logout : ', error);
				throw error;
			}
		});
};

y.c3po.protocols.login = {
	post: function(credential, opt) {
		return y.axios.post(y.env.baseURI + '/login', credential);
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
