$(document).ready(function () {
	boot();
})

module.exports = {
	boot : function () {
		
	}
}

function boot() {
	loadPage("page/bon-napi.html");
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
	$('#template-content-section').load("page/loader.html");
	setTimeout(function () {
		$('#template-content-section').load(page, function (res, status, xhr) {
		});
	}, 500)
}