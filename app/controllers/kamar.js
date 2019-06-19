var serialize = require('form-serialize');

var _conn = require('../core/connection');
var _session = require('../core/create_session');
var _cart = require('../core/cart');

var _blok = require('../models/model_blok');
var _kamar = require('../models/model_kamar');

var current_user = JSON.parse(_session.this_user());

var tablekamar = document.querySelector(".table-list-kamar");
var formTambahkamar = document.querySelector("#form-tambah-kamar");
var formEditkamar = document.querySelector("#form-edit-kamar");

var btnDelete = document.querySelector("#btn-delete-kamar");
var btnSimpan = document.querySelector("#btn-tambah-kamar");
var btnEdit = document.querySelector("#btn-edit-kamar");

boot_kamar();

function boot_kamar() {
    show_table_kamar();
    btnDelete.addEventListener("click", do_delete_kamar)
    btnSimpan.addEventListener("click", do_simpan_kamar)
    btnEdit.addEventListener("click", do_edit_kamar)
}

function show_table_kamar() {
    $("#dataTable").dataTable().fnDestroy();
    tablekamar.querySelector("tbody").innerHTML = "";

    _kamar.get_all_kamar(_conn, function (res) {
        res.data.forEach(function (el, i) {
            console.log(el)
            generate_kamar_table(el);  
        })
    })
}

function generate_kamar_table(data) {
    $("#dataTable").dataTable().fnDestroy();
    var target = tablekamar.querySelector("tbody");

    var tr = document.createElement("tr");

    var blok_nama = document.createElement("td")
    blok_nama.textContent = data.blok_nama;
    tr.appendChild(blok_nama)

    var nama_kamar = document.createElement("td")
    nama_kamar.textContent = data.nama_kamar
    tr.appendChild(nama_kamar)

    var action = document.createElement("td");

    var del = document.createElement("button");
    del.setAttribute("class","btn btn-danger");
    del.innerHTML = `<i class="fa fa-trash-alt"></i>`;
    del.setAttribute("data-kamar-id", data.kamar_id);
    del.addEventListener("click", delete_kamar);
    action.appendChild(del);

    var edit = document.createElement("button");
    edit.setAttribute("class","btn btn-success");
    edit.innerHTML = `<i class="fa fa-edit"></i>`;
    edit.setAttribute("data-kamar-id", data.kamar_id);
    edit.addEventListener("click", edit_kamar);
    action.appendChild(edit);

    tr.appendChild(action);

    target.appendChild(tr)

    $("#dataTable").dataTable()
}

function delete_kamar() {
    // body...
}

function edit_kamar() {
    // body...
}