module.exports = {
	create : function (data) {
        window.localStorage.setItem("this_user", JSON.stringify(data))
	},

	this_user : function () {
		var thisuser = window.localStorage.getItem("this_user");
		return thisuser;
	},

	destroy : function () {
		window.localStorage.removeItem("this_user");
	}
}