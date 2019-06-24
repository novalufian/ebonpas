module.exports= {
	redirect : function (page) {
		loadPage(page)
	}
}

var _session = require('../core/create_session');

$(document).ready(function () {
	boot();
})

function boot() {
	$('#template-preloading').load("page/loader.html");
	$('#template-navbar-section').load("partials/navbar.html");

	setTimeout(function () {
		loadPage("page/home.html")
		$(".navigate-spa").each(function (i, e) {
			if (!Boolean(e.getAttribute("data-adding-event"))) {
				e.addEventListener("click", navigate_page);
				e.setAttribute("data-adding-event", "true");
			}
		})
	}, 550);

	$('#template-login-section').load("page/login.html");
}

function navigate_page() {
	var page = this.getAttribute("data-page");
	loadPage(page);
}

function loadPage(page) {
	preloading_show();
	setTimeout(function () {
		$('#template-content-section').load(page, function (res, status, xhr) {
		});
		preloading_hide();
	}, 500)
}

function preloading_show() {
	$('#template-preloading').css("top", "0px");
}

function preloading_hide() {
	$('#template-preloading').css("top", "-200vh");
}