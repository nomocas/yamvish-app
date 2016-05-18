var hasStorage = typeof(Storage) !== "undefined";

var session = {
	save: function() {
		if (hasStorage)
			localStorage.setItem("session", JSON.stringify(this));
		return this;
	},
	load: function() {
		if (hasStorage) {
			var tmp = JSON.parse(localStorage.getItem("session"));
			for (var i in tmp)
				this[i] = tmp[i];
		}
		return this;
	},
	reset: function() {
		for (var i in this) {
			if (i == 'save' || i == 'load' || i == 'reset')
				continue;
			delete this[i];
		}
		if (hasStorage)
			return this.save();
		return this;
	}
};

module.exports = session;
