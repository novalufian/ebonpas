$(document).ready(function () {

    var serialize = require('form-serialize');

    var _conn = require('../core/connection');
    var _session = require('../core/create_session');
    var _cart = require('../core/cart');

    var _master_subag = require('../models/model_master_subag');
    var _pegawai = require('../models/model_pegawai');

    var current_user = JSON.parse(_session.this_user());

    var tableSubagian = document.querySelector(".table-list-subagian");
    var formTambahSubagian = document.querySelector("#form-tambah-subagian");
    var formEditSubagian = document.querySelector("#form-edit-subagian");

    var btnDelete = document.querySelector("#btn-delete-subagian");
    var btnSimpan = document.querySelector("#btn-tambah-subagian");
    var btnEdit = document.querySelector("#btn-edit-subagian");

    boot_subagian();

    function boot_subagian() {
        show_table_subagian();
        btnDelete.addEventListener("click", do_delete_subagian)
        btnSimpan.addEventListener("click", do_simpan_subagian)
        btnEdit.addEventListener("click", do_edit_subagian)
    }

    function show_table_subagian() {
        $("#dataTable").dataTable().fnDestroy();
        tableSubagian.querySelector("tbody").innerHTML = "";

        $('#template-preloading').css("top", "0px");

        _master_subag.get_all_blok(_conn, function (res) {
            if (res.success) {
                if (res.status == 200) {
                    res.data.forEach(function (el, i) {
                        
                        generate_subagian_table(el);  
                        
                        if (i == (res.data.length - 1)) {
                            $('#template-preloading').css("top", "-200vh");
                        }else{
                            $("#dataTable").dataTable();
                            $('#template-preloading').css("top", "-200vh");
                        }

                    })

                }else{
                    $("#dataTable").dataTable();
                    $('#template-preloading').css("top", "-200vh");
                }
            }else{
                tableSubagian.querySelector("tbody").innerHTML = `
                    <tr>
                        <td colspan="3">error load data, cek koneksi anda</td>
                    </tr>
                `;
            }
        })
    }

    function generate_subagian_table(data) {
        $("#dataTable").dataTable().fnDestroy();
        var target = tableSubagian.querySelector("tbody");

        var tr = document.createElement("tr");

        var nama = document.createElement("td")
        nama.textContent = data.nama
        tr.appendChild(nama)

        var bagian_warna = document.createElement("td")
        bagian_warna.innerHTML = `<span style = 'background : #${data.bagian_warna}; padding : 5px; color:#000;'>${data.bagian_warna}</span>`
        tr.appendChild(bagian_warna)

        var action = document.createElement("td");

        var del = document.createElement("button");
        del.setAttribute("class","btn btn-danger");
        del.innerHTML = `<i class="fa fa-trash-alt"></i>`;
        del.setAttribute("data-subagian-id", data.subagian_id);
        del.addEventListener("click", delete_subagian);
        action.appendChild(del);

        var edit = document.createElement("button");
        edit.setAttribute("class","btn btn-success");
        edit.innerHTML = `<i class="fa fa-edit"></i>`;
        edit.setAttribute("data-subagian-id", data.subagian_id);
        edit.addEventListener("click", edit_subagian);
        action.appendChild(edit);

        tr.appendChild(action);

        target.appendChild(tr)

        $("#dataTable").dataTable()
    }

    function delete_subagian() {
        var id = this.getAttribute("data-subagian-id");
        $("#modal_delete_subagian").modal("show");
        btnDelete.setAttribute("data-subagian-id", id);
    }

    function edit_subagian() {
        var id = this.getAttribute("data-subagian-id");
        $("#modal_edit_subagian").modal("show");
        btnEdit.setAttribute("data-subagian-id", id);

        _master_subag.get_one_subagian(_conn, id, function (res) {
            document.getElementById("nama_subagian_edit").value = res.data[0].subagian_id
            document.getElementById("warna_subagian_edit").value = res.data[0].bagian_warna
        })
    }

    function do_delete_subagian() {
        var btn = this;
        var id = this.getAttribute("data-subagian-id");
        btn.textContent = "Loading....";
        _master_subag.unpublished_subagian(_conn, id, function (res) {
            if (res.success) {
                if (res.status == 200) {
                    $("#modal_delete_subagian").modal("hide");
                    btn.textContent = "Ya, hapus subagian";
                    show_table_subagian();
                }
            }else{
                $("#modal_delete_subagian").modal("hide");
                btn.textContent = "Ya, hapus subagian";
                alert("gagal menghapus , cek koneksi anda ")
            }
        })
    }

    function do_simpan_subagian() {
        var btn = this;

        var serial = serialize(formTambahSubagian, {hash : true});
        console.log(serial)
        btn.textContent = "Loading....";
        _master_subag.save_subagian(_conn, serial, function (res) {
            console.log(res)
            if (res.success) {
                if (res.status == 200) {
                    $("#modal_tambah_subagian").modal("hide");
                    btn.textContent = "Tambah bagian";
                    show_table_subagian();
                }
            }else{
                $("#modal_tambah_subagian").modal("hide");
                btn.textContent = "Tambah bagian";
                alert("gagal menambahkan , cek koneksi anda ")
            }
        })
    }

    function do_edit_subagian() {
        var btn = this;

        var serial = serialize(formEditSubagian, {hash : true});
        var id = btn.getAttribute("data-subagian-id");
        console.log(serial)
        btn.textContent = "Loading....";
        _master_subag.update_subagian(_conn, serial,id, function (res) {
            console.log(res)
            if (res.success) {
                if (res.status == 200) {
                    $("#modal_edit_subagian").modal("hide");
                    btn.textContent = "Ubah bagian";
                    show_table_subagian();
                }
            }else{
                $("#modal_edit_subagian").modal("hide");
                btn.textContent = "Ubah bagian";
                alert("gagal menambahkan , cek koneksi anda ")
            }
        })
    }
})