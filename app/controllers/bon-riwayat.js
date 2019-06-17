var _conn = require('../core/connection');
var _session = require('../core/create_session');
var _cart = require('../core/cart');

var _bon = require('../models/model_bon');

var tableBonRiwayat = document.querySelector('.table-bon-riwayat');

boot_bon_riwayat()

function boot_bon_riwayat() {
	show_all_data();	
}

function show_all_data() {
	_bon.get_all_data(_conn, function (res) {
		if (res.success) {
			if (res.status == 200) {
				res.data.forEach(function (el, i) {
					genearateTableBon(el)
				})
			}
		}
		console.log(res)
	})
}

function genearateTableBon(data) {
	$("#dataTable").dataTable().fnDestroy();

	var target = tableBonRiwayat.querySelector("tbody");

	var tr = document.createElement("tr");
	var bon_id = document.createElement("td");
	bon_id.textContent = data.bon_id;
	tr.appendChild(bon_id);

	var nama_pegawai = document.createElement("td");
	nama_pegawai.textContent = data.nama_pegawai;
	tr.appendChild(nama_pegawai);

	var nama = document.createElement("td");
	nama.textContent = data.nama;
	tr.appendChild(nama);

	var bon_keterangan = document.createElement("td");
	bon_keterangan.textContent = data.bon_keterangan;
	tr.appendChild(bon_keterangan);

	var bon_status = document.createElement("td");
	bon_status.textContent = data.bon_status;
	tr.appendChild(bon_status);

	var actio = document.createElement("td");
	switch (data.bon_status) {
		case "menunggu":
			var btnTolak = document.createElement("button");
			btnTolak.setAttribute("class", "btn btn-danger");
			btnTolak.addEventListener("click", function () {
				$("#bon-tolak").modal("show");	
			})
			btnTolak.style.marginRight = '10px;'
			btnTolak.textContent = "tolak";
			actio.appendChild(btnTolak);

			var btnTerima = document.createElement("button");
			btnTerima.setAttribute("class", "btn btn-primary");
			btnTerima.setAttribute("data-toggle", "modal");
			btnTerima.setAttribute("modal-target", "#bon-terima");
			btnTerima.textContent = "terima";
			actio.appendChild(btnTerima);
			break;
		case  "selesai":
			var btnSelesai = document.createElement("button");
			btnSelesai.setAttribute("class", "btn btn-success");
			btnSelesai.setAttribute("data-toggle", "modal");
			btnSelesai.setAttribute("modal-target", "#bon-selesai");
			btnSelesai.textContent = "selesai";
			actio.appendChild(btnSelesai);
			break;
		default:
			var btnAarsip = document.createElement("button");
			btnAarsip.setAttribute("class", "btn btn-disable");
			btnAarsip.textContent = "arsip";
			actio.appendChild(btnAarsip);
			break;
	}
	var btnDetail = document.createElement("button");
	btnDetail.setAttribute("class", "btn btn-info");
	btnDetail.innerHTML = `<i class="fa fa-eye"></i>`;
	actio.appendChild(btnDetail);

	tr.appendChild(actio);

	target.appendChild(tr);

	$("#dataTable").dataTable();
}