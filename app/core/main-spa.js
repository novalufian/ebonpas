$(document).ready(function () {
	boot();
})

function boot() {
	loadPage("loader.html #loader-align");
	$(".navigate-spa").each(function (i, e) {
		e.addEventListener("click", navigate_page)
	})
	$('#template-navbar-section').load("partials/navbar.html");
	console.log($("#btn-login"))
}

function navigate_page() {
	console.log('navigae');
	var page = this.getAttribute("data-page");
	loadPage(page)
}

function loadPage(page) {
	$('#template-content-section').load("loader.html");
	$('#template-login-section').load("login.html");
	setTimeout(function () {
		$('#template-content-section').load(page, function (res, status, xhr) {
		});
	}, 500)
}