$(window).ready(function () {
	
	var _qs = require("query-string");

	var _conn = require('../core/connection');
	var _session = require('../core/create_session');
	var _cart = require('../core/cart');

	var _bon = require('../models/model_bon');
	var _notif = require('../models/model_notif');

    var current_user = JSON.parse(_session.this_user());

	var tableBonRiwayat = document.querySelector('.table-bon-riwayat');
	var btnTolak = document.getElementById("btn-tolak-bon");
	var btnSelesai = document.getElementById("btn-selesai-bon");
	var btnTerima = document.getElementById("btn-terima-bon");

	boot_bon_riwayat()

	function boot_bon_riwayat() {
		const parsed = _qs.parse(location.search);
		console.log(parsed);

		show_all_data();

		btnTolak.addEventListener("click", update_bon_status)
		btnTerima.addEventListener("click", update_bon_status)
		btnSelesai.addEventListener("click", update_bon_status)
	}

	function show_all_data() {
		$('#template-preloading').css("top", "0px");
		$("#dataTable").dataTable().fnDestroy();
		tableBonRiwayat.querySelector("tbody").innerHTML = "";

		var userid = (current_user.user_login_role == 1) ? null : current_user.user_id
		
		_bon.get_all_data(_conn, userid, function (res) {
			if (res.success) {
				if (res.status == 200) {
					res.data.forEach(function (el, i) {
						genearateTableBon(el, i)
						if (i == (res.data.length - 1)) {
							$('#template-preloading').css("top", "-200vh");
						}
					})
				}
			}

		})
	}

	function genearateTableBon(data, i) {
		$("#dataTable").dataTable().fnDestroy();

		var target = tableBonRiwayat.querySelector("tbody");

		var tr = document.createElement("tr");
		var no = document.createElement("td");
		no.textContent = i + 1;
		tr.appendChild(no);

		var bon_id = document.createElement("td");
		bon_id.textContent = data.bon_id;
		tr.appendChild(bon_id);

		var nama_pegawai = document.createElement("td");
		nama_pegawai.textContent = data.nama_pegawai;
		tr.appendChild(nama_pegawai);

		var nama = document.createElement("td");
		nama.innerHTML = `<div class="alert" style = "background : #${data.bagian_warna}; margin : 0px;">${data.nama}</div>`;
		tr.appendChild(nama);

		var bon_keterangan = document.createElement("td");
		bon_keterangan.textContent = data.bon_keterangan;
		tr.appendChild(bon_keterangan);

		var bon_status = document.createElement("td");
		bon_status.innetextContentrHTML = data.bon_status;
		tr.appendChild(bon_status);

		var actio = document.createElement("td");
		if (current_user.user_login_role == 1) {
			switch (data.bon_status) {
				case "menunggu":
					var btnTolak = document.createElement("button");
					btnTolak.setAttribute("class", "btn btn-danger");
					btnTolak.addEventListener("click", function () {
						$("#bon-tolak").modal("show");
						document.getElementById("btn-tolak-bon").setAttribute("data-bon-id", data.bon_id)
						document.getElementById("btn-tolak-bon").setAttribute("data-user-id", data.bon_user)
						document.getElementById("btn-tolak-bon").setAttribute("data-status", "tolak")
					})
					btnTolak.style.marginRight = '10px;'
					btnTolak.textContent = "tolak";
					actio.appendChild(btnTolak);

					var btnTerima = document.createElement("button");
					btnTerima.setAttribute("class", "btn btn-primary");
					btnTerima.addEventListener("click", function () {
						$("#bon-terima").modal("show");
						document.getElementById("btn-terima-bon").setAttribute("data-bon-id", data.bon_id)
						document.getElementById("btn-terima-bon").setAttribute("data-user-id", data.bon_user)
						document.getElementById("btn-terima-bon").setAttribute("data-status", "terima")
					})
					btnTerima.textContent = "terima";
					actio.appendChild(btnTerima);
					break;
				case  "terima":
					var btnSelesai = document.createElement("button");
					btnSelesai.setAttribute("class", "btn btn-success");
					btnSelesai.addEventListener("click", function () {
						$("#bon-selesai").modal("show");
						document.getElementById("btn-selesai-bon").setAttribute("data-bon-id", data.bon_id)
						document.getElementById("btn-selesai-bon").setAttribute("data-user-id", data.bon_user)
						document.getElementById("btn-selesai-bon").setAttribute("data-status", "arsip")
					})
					btnSelesai.textContent = "selesai";
					actio.appendChild(btnSelesai);
					break;
				case  "selesai":
					var btnSelesai = document.createElement("button");
					btnSelesai.setAttribute("class", "btn btn-disable");
					btnSelesai.textContent = "complate";
					actio.appendChild(btnSelesai);
					break;
				default:
					var btnAarsip = document.createElement("button");
					btnAarsip.setAttribute("class", "btn btn-disable");
					btnAarsip.textContent = "arsip";
					actio.appendChild(btnAarsip);
					break;
			}
		}
		
		var btnDetail = document.createElement("button");
		btnDetail.setAttribute("class", "btn btn-info");
		btnDetail.setAttribute("data-bon-id", data.bon_id);
		btnDetail.innerHTML = `<i class="fa fa-eye"></i>`;
		btnDetail.addEventListener("click", do_detail_bon)
		actio.appendChild(btnDetail);

		tr.appendChild(actio);

		target.appendChild(tr);

		$("#dataTable").dataTable({

			"columnDefs": [
			    { "width": "120px", "targets": 1 },
			    { "width": "30px", "targets": 2 }
			 ]
		});

	}

	function do_detail_bon() {
		var id = this.getAttribute("data-bon-id");
		alert(id)
		window.localStorage.setItem("detail_bon_id", id);
		$('#template-content-section').load("../views/page/bon-napi.html", function (res, status, xhr) {
		});
	}

	function update_bon_status() {
		console.log(this)
		var btn = this;
		var credentials = {
			"bon_status" : btn.getAttribute("data-status"),
			"bon_id": btn.getAttribute("data-bon-id")
		}

		_bon.update_bon_status(_conn, credentials, function (res) {
			console.log(res)
			if (res.success == true) {
				if (res.status == 200) {
					show_all_data();
					kirim_notif(btn.getAttribute("data-status"),btn.getAttribute("data-user-id"));
				}else{
					$("#moda-riwayat-error").modal("show");
				}
			}else{
				$("#moda-riwayat-error").modal("show");
			}
		})
	}

	function kirim_notif(status, id) {
		var msg = "";
		switch (status) {
			case "tolak":
				 msg = `<strong>admin ${current_user.nama}</strong> telah <p class="text-danger">menolak</p> permintaan bon`;
				break;

			case "terima":
				 msg = `<strong>admin ${current_user.nama}</strong> telah <p class="text-success">menerima</p> permintaan bon`;
				break;

			case "selesai":
				 msg = `permintaan bon anda sudah selesai`;
				break;
		}

		var cred = {
            'notif_user_id' : current_user.user_id,
            'notif_user_role' : 0,
            'notif_msg' : msg,
            'notif_user_destiny' : id
        }
        _notif.save(_conn, cred, function (res) {
            console.log(res)
        })
	}
})