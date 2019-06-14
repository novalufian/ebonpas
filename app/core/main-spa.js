loadPage("loader.html #loader-align");
$(".navigate-spa").each(function (i, e) {
	e.addEventListener("click", navigate_page)
})

function navigate_page() {
	console.log('navigae');
	var page = this.getAttribute("data-page");
	loadPage(page)
}

function loadPage(page) {
	$('#loader-area').load("loader.html");
	setTimeout(function () {
		$('#loader-area').load(page, function (res, status, xhr) {
		});
	}, 500)
}