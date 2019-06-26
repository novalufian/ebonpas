$(document).ready(function() {

    var serialize = require('form-serialize');

    var _conn = require('../core/connection');
    var _session = require('../core/create_session');
    var _cart = require('../core/cart');

    var _blok = require('../models/model_blok');
    var _kamar = require('../models/model_kamar');
    var _napi = require('../models/model_napi');

    var current_user = JSON.parse(_session.this_user());

    var tableNapi = document.querySelector(".table-data-napi");
    var formTambahNapi = document.querySelector("#form-tambah-napi");
    var formEditNapi = document.querySelector("#form-edit-napi");

    var btnDelete = document.querySelector("#btn-delete-napi");
    var btnSimpan = document.querySelector("#btn-simpan-napi");
    var btnEdit = document.querySelector("#btn-edit-napi");


    boot_data_napi();

    function boot_data_napi() {
        crate_list_data_napi();
        generate_select_blok();
        generate_select_blok_edit();
        btnDelete.addEventListener("click", do_delete_napi)
        btnSimpan.addEventListener("click", do_simpan_napi)
        btnEdit.addEventListener("click", do_edit_napi)
    }

    function crate_list_data_napi() {
        $("#dataTable").dataTable().fnDestroy();
        tableNapi.querySelector("tbody").innerHTML = "";
        
        $('#template-preloading').css("top", "0px");

        _napi.get_all_napi_published(_conn, function (res) {
            if (res.success) {
                if (res.status == 200) {

                    res.data.forEach(function (el, i) {
                        generate_table_napi(el);

                        if (i == (res.data.length - 1)) {
                            $('#template-preloading').css("top", "-200vh");
                        }
                    })

                }else{
                    $("#dataTable").dataTable();
                    $('#template-preloading').css("top", "-200vh");
                }

            }else{
                tableNapi.querySelector("tbody").innerHTML = `
                    <tr>
                        <td colspan="5">error load data, cek koneksi anda</td>
                    </tr>
                `;
            }
        })
    }

    function generate_select_blok() {
        var target = document.getElementById("select_blok");
        _blok.get_all_blok(_conn, function (res) {
            res.data.forEach(function (el, i) {
                var op = document.createElement("option");
                op.setAttribute("value",el.blok_master_id);
                op.textContent = el.blok_nama;
                target.appendChild(op)  
            })
            genarateKamar(res.data[0].blok_master_id);
        })
        target.addEventListener("change", genarateKamar)
    }

    function generate_select_blok_edit() {
        var target = document.getElementById("select_blok_edit");
        _blok.get_all_blok(_conn, function (res) {
            res.data.forEach(function (el, i) {
                var op = document.createElement("option");
                op.setAttribute("value",el.blok_master_id);
                op.textContent = el.blok_nama;
                target.appendChild(op)  
            })
            genarateKamar_edit(res.data[0].blok_master_id);
        })
        target.addEventListener("change", genarateKamar_edit)
    }

    function genarateKamar(id) {
        var target = document.getElementById("napi_kamar_wrapper");
        target.innerHTML = "";
        var id = (typeof id !== "object") ? id : this.value;
        _kamar.get_kamar_by_blok(_conn, id, function (res) {
            res.data.forEach(function (el, i) {
                var op = document.createElement("option");
                op.setAttribute("value",el.master_kamar_id);
                op.textContent = el.nama_kamar;
                target.appendChild(op)  
            })
        })
    }

    function genarateKamar_edit(id) {
        var target = document.getElementById("napi_kamar_wrapper_edit");
        target.innerHTML = "";
        var id = (typeof id !== "object") ? id : this.value;
        _kamar.get_kamar_by_blok(_conn, id, function (res) {
            res.data.forEach(function (el, i) {
                var op = document.createElement("option");
                op.setAttribute("value",el.master_kamar_id);
                op.textContent = el.nama_kamar;
                target.appendChild(op)  
            })
        })
    }


    function generate_table_napi(data) {
        $("#dataTable").dataTable().fnDestroy();

        var target = tableNapi.querySelector("tbody");

        var tr = document.createElement("tr");
        var napi_id = document.createElement("td");
        napi_id.textContent = data.napi_id;
        tr.appendChild(napi_id);

        var napi_no_reg = document.createElement("td");
        napi_no_reg.textContent = data.napi_no_reg;
        tr.appendChild(napi_no_reg);

        var napi_nama = document.createElement("td");
        napi_nama.textContent = data.napi_nama;
        tr.appendChild(napi_nama);

        var blok_nama = document.createElement("td");
        blok_nama.textContent = data.blok_nama + " / "+data.nama_kamar;
        tr.appendChild(blok_nama);

        var action = document.createElement("td");

        var del = document.createElement("button");
        del.setAttribute("class","btn btn-danger");
        del.innerHTML = `<i class="fa fa-trash-alt"></i>`;
        del.setAttribute("data-napi-id", data.napi_id);
        del.addEventListener("click", delete_napi);
        action.appendChild(del);

        var edit = document.createElement("button");
        edit.setAttribute("class","btn btn-success");
        edit.innerHTML = `<i class="fa fa-edit"></i>`;
        edit.setAttribute("data-napi-id", data.napi_id);
        edit.addEventListener("click", edit_napi);
        action.appendChild(edit);

        tr.appendChild(action);

        target.appendChild(tr);

        $("#dataTable").dataTable();
    }

    function delete_napi() {
        var id = this.getAttribute("data-napi-id");
        btnDelete.setAttribute("data-napi-id", id);
        $("#modal_delete_napi").modal("show");
    }

    function edit_napi() {
        $("#modalEditNapi").modal("show");
        var id = this.getAttribute("data-napi-id");
        btnEdit.setAttribute("data-napi-id", id);

        _napi.get_one_napi(_conn, id, function (res) {
            var dt = res.data[0];
            document.getElementById("select_blok_edit").value = dt.blok_master_id
            document.getElementById("napi_kamar_wrapper_edit").value = dt.master_kamar_id
            document.getElementById("napi_nama_edit").value = dt.napi_nama
            document.getElementById("napi_no_reg_edit").value = dt.napi_no_reg
            if (Boolean(dt.napi_sex)) {
                document.getElementById("inline-radio1-edit").checked = true;
            }else{
                document.getElementById("inline-radio2-edit").checked = true;
            }
        })
    }

    function do_delete_napi() {
        var id = this.getAttribute("data-napi-id");
        this.textContent = "Loading.....";
        _napi.unpublish_data_napi(_conn, id, function (res) {
            if (res.success) {
                if (res.status == 200) {
                    $("#modal_delete_napi").modal("hide");
                    this.textContent = "Ya, hapus napi";
                    crate_list_data_napi();
                }
            }else{
                alert("gagal menghapus napi ")
                this.textContent = "Ya, hapus napi";
                $("#modal_delete_napi").modal("hide");
            }
        })
    }

    function do_simpan_napi() {
        this.textContent = "Loading......";
        var serial = serialize(formTambahNapi, {hash : true});
        var cred = {
            'napi_id' : 'NPI-'+ Date.now() + Math.floor(Math.random(100000, 1000000) * 1000000000),
            'napi_foto' : "lorem",
            'napi_no_reg' :  serial.napi_no_reg,
            'napi_nama' :  serial.napi_nama,
            'napi_kamar' :  serial.napi_kamar,
            'napi_sex' : Boolean(serial.napi_sex)
        }
        
        _napi.save_napi(_conn, cred, function (res) {
            if (res.success) {
                if (res.status == 200) {
                    $("#modalTambahNapi").modal("hide");
                    crate_list_data_napi();
                    this.textContent = "Simpan data";
                }
            }else{
                this.textContent = "Simpan data";
                alert("gagal menyimpan data, cek koneksi anda");
                $("#modalTambahNapi").modal("hide");
            }
        })
    }

    function do_edit_napi() {
        var btn = this;
        btn.textContent = "Loading......";
        var serial = serialize(formEditNapi, {hash : true});
        var cred = {
            'napi_foto' : "lorem",
            'napi_no_reg' :  serial.napi_no_reg,
            'napi_nama' :  serial.napi_nama,
            'napi_kamar' :  serial.napi_kamar,
            'napi_sex' : Boolean(serial.napi_sex)
        }
        var id = btn.getAttribute("data-napi-id");
        
        _napi.update_data_napi(_conn, cred, id, function (res) {
            if (res.success) {
                if (res.status == 200) {
                    btn.textContent = "Ubah Data";
                    $("#modalEditNapi").modal("hide");
                    crate_list_data_napi();
                }
            }else{
                btn.textContent = "Ubah Data";
                alert("gagal mengubah data, cek koneksi anda");
                $("#modalEditNapi").modal("hide");
            }
        })
    }
})