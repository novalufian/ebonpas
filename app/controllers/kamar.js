$(document).ready(function () {
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

    var blokList = document.querySelector("#blok_list");
    var editBlokList = document.querySelector("#edit_blok_list");

    boot_kamar();

    function boot_kamar() {
        show_table_kamar();
        btnDelete.addEventListener("click", do_delete_kamar)
        btnSimpan.addEventListener("click", do_simpan_kamar)
        btnEdit.addEventListener("click", do_edit_kamar)

        generate_blok_list()
    }

    function generate_blok_list() {
        blokList.innerHTML = "";
        editBlokList.innerHTML = "";
        _blok.get_all_blok(_conn, function (res) {
            res.data.forEach(function (el,i) {
                var op = document.createElement("option");
                op.textContent = el.blok_nama;
                op.setAttribute("value", el.blok_master_id) ;
                blokList.appendChild(op);
                editBlokList.appendChild(op);
            })
        })
    }

    function show_table_kamar() {
        $("#dataTable").dataTable().fnDestroy();
        tablekamar.querySelector("tbody").innerHTML = "";

        $('#template-preloading').css("top", "0px");

        _kamar.get_all_kamar(_conn, function (res) {
            if (res.success) {
                if (res.status == 200) {

                    res.data.forEach(function (el, i) {
                        generate_kamar_table(el, i);  
                        
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

    function generate_kamar_table(data, i) {
        $("#dataTable").dataTable().fnDestroy();
        var target = tablekamar.querySelector("tbody");

        var tr = document.createElement("tr");

        var no = document.createElement("td")
        no.textContent = i + 1;
        tr.appendChild(no)

        var blok_nama = document.createElement("td")
        blok_nama.textContent = data.blok_nama;
        tr.appendChild(blok_nama)

        var nama_kamar = document.createElement("td")
        nama_kamar.textContent = data.nama_kamar
        tr.appendChild(nama_kamar)

        var action = document.createElement("td");

        var edit = document.createElement("button");
        edit.setAttribute("class","btn btn-success");
        edit.innerHTML = `<i class="fa fa-edit"></i>`;
        edit.setAttribute("data-kamar-id", data.master_kamar_id);
        edit.addEventListener("click", edit_kamar);
        action.appendChild(edit);

        tr.appendChild(action);

        target.appendChild(tr)

        $("#dataTable").dataTable()
    }

    function delete_kamar() {
        var id = this.getAttribute("data-kamar-id");
        $("#modal_delete_kamar").modal("show");
        btnDelete.setAttribute("data-kamar-id", id);
    }

    function edit_kamar() {

        var id = this.getAttribute("data-kamar-id");

        _kamar.get_one_kamar(_conn, id, function (res) {
            console.log(res)
            if (res.success) {
                if (res.status == 200) {
                    document.getElementById("edit_nama_kamar").value = res.data[0].nama_kamar;
                    document.getElementById("edit_kamar_id").value = res.data[0].master_kamar_id;
                    document.getElementById("edit_blok_list").value = res.data[0].master_blok_id;

                    $("#modal_edit_kamar").modal("show")
                }
            }else{
                alert("gagal menambahkan kamar baru, coba cek koneksi anda")
            }
        })
    }

    function do_delete_kamar() {
        var btn = this;
        btn.textContent = "Loading...";

        var id = btn.getAttribute("data-kamar-id");

    }

    function do_edit_kamar() {
        var serial = serialize(formEditkamar, {hash : true})
        console.log(serial);

        var btn = this;
        btn.textContent = "loading update data...";

        _kamar.update_kamar(_conn, serial, function (res) {
            if (res.success) {
                if (res.status == 200) {
                    show_table_kamar();
                    btn.textContent = "Ubah kamar";
                    $("#modal_edit_kamar").modal("hide");
                }
            }else{
                alert("gagal menambahkan kamar baru, coba cek koneksi anda")
                btn.textContent = "Ubah kamar";
                $("#modal_edit_kamar").modal("hide");
            }
        })
    }

    function do_simpan_kamar() {
        var btn = this;
        btn.textContent = "loading to save ...."
        var serial = serialize(formTambahkamar, {hash : true});
        var cred = {
            'master_kamar_id' : "KMR-"+ Date.now() + Math.floor(Math.random(100000, 1000000) * 1000000000),
            'master_blok_id' : serial.master_blok_id,
            'nama_kamar' : serial.nama_kamar
        }

        _kamar.save_kamar(_conn, cred, function (res) {
            if (res.success) {
                if (res.status == 200) {
                    show_table_kamar();
                    btn.textContent = "Tambah kamar";
                    $("#modal_tambah_kamar").modal("hide");
                }
            }else{
                alert("gagal menambahkan kamar baru, coba cek koneksi anda")
                btn.textContent = "Tambah kamar";
                $("#modal_tambah_kamar").modal("hide");
            }
        })
    }
})