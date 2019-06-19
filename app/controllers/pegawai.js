var serialize = require('form-serialize');

var _conn = require('../core/connection');
var _session = require('../core/create_session');
var _cart = require('../core/cart');

var _auth = require('../models/model_auth');
var _pegawai = require('../models/model_pegawai');

var current_user = JSON.parse(_session.this_user());

var tablePegawai = document.querySelector(".table-list-pegawai");
var formTambahPegawai = document.querySelector("#form-tambah-pegawai");

var btnDelete = document.querySelector("#btn-delete-user");
var btnSimpan = document.querySelector("#btn-simpan-pegawai");


boot_pegawai();

function boot_pegawai() {
    create_table_pegawai();
    btnDelete.addEventListener("click", delete_pegawai)
    btnSimpan.addEventListener("click", simpan_data_pegawai)
}

function create_table_pegawai() {
    $("#dataTable").dataTable().fnDestroy();
     tablePegawai.querySelector("tbody").innerHTML = "";
    _pegawai.get_all_pegawai(_conn, function (res) {
        console.log(res)
        if (res.success) {
            if (res.status == 200) {
                res.data.forEach( function(el, i) {
                    generate_row_table_pegawai(el);
                });
            }
        }
    })
}

function generate_row_table_pegawai(data) {
    $("#dataTable").dataTable().fnDestroy();
    var target = tablePegawai.querySelector("tbody");

    var tr = document.createElement("tr");

    var nip_pegawai = document.createElement("td");
    nip_pegawai.textContent = data.nip_pegawai;
    tr.appendChild(nip_pegawai)

    var nama_pegawai = document.createElement("td");
    nama_pegawai.textContent = data.nama_pegawai;
    tr.appendChild(nama_pegawai)

    var nama = document.createElement("td");
    nama.innerHTML = `<div class="alert" style = 'margin: 0px; background : #${data.bagian_warna} ;'>${data.nama}</div>`;
    tr.appendChild(nama)

    var jenis_kelamin_pegawai = document.createElement("td");
    jenis_kelamin_pegawai.textContent = (data.jenis_kelamin_pegawai) ? "laki - laki" : "prempuan ";
    tr.appendChild(jenis_kelamin_pegawai)

    var action = document.createElement("td");
    var btnDelete = document.createElement("button");
    btnDelete.setAttribute("class", "btn btn-danger");
    btnDelete.setAttribute("data-pegawai-id",data.user_id);
    btnDelete.addEventListener("click", open_modal_delete)
    btnDelete.innerHTML = `<i class="fa fa-trash-alt"></i>`;
    action.appendChild(btnDelete);

    var edit = document.createElement("button");
    edit.setAttribute("data-pegawai-id",data.user_id);
    edit.setAttribute("class", "btn btn-success");
    edit.innerHTML = `<i class="fa fa-edit"></i>`;
    action.appendChild(edit);


    tr.appendChild(action)

    target.appendChild(tr)
    $("#dataTable").dataTable();
}

function open_modal_delete() {
    $("#modal_delete_user").modal("show");
    var id = this.getAttribute("data-pegawai-id");
    btnDelete.setAttribute("data-pegawai-id", id)
}

function delete_pegawai() {
    var id = this.getAttribute("data-pegawai-id");
    this.textContent = "Loading......";
    _pegawai.unpublish_data_pegawai(_conn, id, function (res) {
        console.log(res)
        if (res.success) {
            if (res.status == 200) {
                $("#modal_delete_user").modal("hide");
                this.textContent = "Ya, hapus user";
                create_table_pegawai() ;
            }
        }else{
            alert("tidak bisa mengahpus user, cek koneksi anda")
            this.textContent = "Ya, hapus user";
        }
    })
}

function simpan_data_pegawai() {
    var serial = serialize(formTambahPegawai, {hash : true})
    console.log(serial)
    var cred = {
        'user_id' : 'USR-'+ Date.now() + Math.floor(Math.random(100000, 1000000) * 1000000000),
        'nip_pegawai' : serial.nip_pegawai,
        'nama_pegawai' : serial.nama_pegawai,
        'subag_pegawai' : serial.subag_pegawai,
        'jenis_kelamin_pegawai' : serial.sex_pegawai,
        'ttd_pegawai' : "lorem",
    }

    _pegawai.save_pegawai(_conn, cred, function (res) {
        if (res.success) {
            if (res.status == 200) {
                create_table_pegawai();
                $("#modalTambahPegawai").modal("hide");
            }
        }else{
            alert("gagal menyimpan , cek koneksi data")
            $("#modalTambahPegawai").modal("hide");
        }
    })
}

