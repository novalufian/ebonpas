$(document).ready(function () {
	boot();
})

module.exports = {
	boot : function () {
		
	}
}

function boot() {
	loadPage("page/data-pegawai.html");
	$('#template-preloading').load("page/loader.html");
	$('#template-navbar-section').load("partials/navbar.html");

	setTimeout(function () {
		$(".navigate-spa").each(function (i, e) {
			e.addEventListener("click", navigate_page)
		})
	}, 550)
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