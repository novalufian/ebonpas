$(document).ready(function () {
        var serialize = require('form-serialize');

    var _conn = require('../core/connection');
    var _session = require('../core/create_session');
    var _cart = require('../core/cart');

    var _auth = require('../models/model_auth');
    var _pegawai = require('../models/model_pegawai');

    var current_user = JSON.parse(_session.this_user());

    var tableUser = document.querySelector(".table-user-data");
    var tablePegawai = document.querySelector(".table-pegawai");
    var btnDelete = document.querySelector("#btn-delete-user");
    var btnEdit = document.querySelector("#btn-edit-user");
    var btnAddUser = document.querySelector("#btn-add-user");
    var formInputUser = document.querySelector("#form-input-user");
    var formUpdateUser = document.querySelector("#form-update-user");

    boot_user_client();

    function boot_user_client() {
        show_user_data();
        generatePegawai();
        btnDelete.addEventListener("click", delete_user);
        btnEdit.addEventListener("click", edit_user);
        btnAddUser.addEventListener("click", save_new_user);
    }

    function show_user_data() {
        $('#template-preloading').css("top", "0px");
        $("#dataTable").dataTable().fnDestroy();
        tableUser.querySelector("tbody").innerHTML = "";
        _auth.get_all_user_by_role_user(_conn, 0 ,function (res) {
            console.log(res)
            if (res.success) {
                if (res.status == 200) {
                    res.data.forEach(function (el, i) {
                        generate_user_table(el, i);

                        if (i == (res.data.length - 1)) {
                            $('#template-preloading').css("top", "-200vh");
                        }
                    })
                }else{
                }
            }else{
                alert("error when load data")
            }
        })
    }

    function generate_user_table(data, i) {
        $("#dataTable").dataTable().fnDestroy();
        var target = tableUser.querySelector("tbody");

        var tr = document.createElement("tr");

        var no = document.createElement("td");
        no.textContent = i + 1;
        tr.appendChild(no);

        var nip_pegawai = document.createElement("td");
        nip_pegawai.textContent = data.nip_pegawai;
        tr.appendChild(nip_pegawai);

        var nama_pegawai = document.createElement("td");
        nama_pegawai.textContent = data.nama_pegawai;
        tr.appendChild(nama_pegawai);

        var username = document.createElement("td");
        username.textContent = data.username;
        tr.appendChild(username);

        var action = document.createElement("td");
        var btn = document.createElement("button");
        btn.setAttribute("class", "btn btn-danger");
        btn.setAttribute("data-user-id", data.login_id);
        btn.innerHTML = `<i class="fa fa-trash-alt"></i>`;
        btn.addEventListener("click", delete_user_popup )
        action.appendChild(btn);

        var edit = document.createElement("button");
        edit.setAttribute("class", "btn btn-success");
        edit.setAttribute("data-user-id", data.login_id);
        edit.innerHTML = `<i class="fa fa-edit"></i>`;
        edit.addEventListener("click", update_user_popup )
        action.appendChild(edit);

        tr.appendChild(action);

        target.appendChild(tr);
        $("#dataTable").dataTable()

    }

    function generatePegawai() {

        var target = tablePegawai.querySelector("tbody");
        _pegawai.get_all_pegawai(_conn, function (res) {
            console.log(res)
            res.data.forEach( function(el, i) {
                $("#dataTable2").dataTable().fnDestroy();
                var tr = document.createElement("tr");

                var nip_pegawai = document.createElement("td");
                nip_pegawai.textContent = el.nip_pegawai;
                tr.appendChild(nip_pegawai);

                var nama_pegawai = document.createElement("td");
                nama_pegawai.textContent = el.nama_pegawai;
                tr.appendChild(nama_pegawai);

                var user_id = document.createElement("td");
                var btn = document.createElement("button");
                btn.setAttribute("class", "btn btn-info");
                btn.setAttribute("data-pegawai-id", el.user_id);
                btn.setAttribute("data-dismiss", "modal");
                btn.textContent = "add to form";
                btn.addEventListener("click", add_to_form)
                user_id.appendChild(btn)
                tr.appendChild(user_id);

                target.appendChild(tr)
                $("#dataTable2").dataTable()
            });
        })

    }

    function add_to_form() {
        var id = this.getAttribute("data-pegawai-id");
        var target = formInputUser.querySelector("#inputPegawai");
        target.setAttribute("value",id);
    }

    function delete_user_popup() {
        var id = this.getAttribute("data-user-id");
        $('#modal_delete_user').modal('show');
        btnDelete.setAttribute("data-user-id", id);
    }

    function update_user_popup() {
        var id = this.getAttribute("data-user-id");
        $('#modal_edit_user').modal('show');
        btnEdit.setAttribute("data-user-id", id);

        _auth.get_one_published_by_login_id(_conn, id, function (res) {
            console.log(res)
            document.getElementById("edit_login_id").value = res.data[0].login_id
            document.getElementById("edit_user_id").value = res.data[0].login_id
            document.getElementById("edit_username").value = res.data[0].username
            document.getElementById("edit_password").value = res.data[0].password
            document.getElementById("edit_user_login_role").value = res.data[0].user_login_role
        })
    }

    function delete_user() {
        var id = btnDelete.getAttribute("data-user-id");
        btnDelete.textContent = "Loading........"
        console.log(id)
        _auth.delete_user(_conn, id, function (res) {
            if (res.success) {
                if (res.status == 200) {
                    $('#modal_delete_user').modal('hide');
                    btnDelete.textContent = "Ya, hapus user";
                    show_user_data();
                }
            }
        })
    }

    function edit_user() {

        btnEdit.textContent = "Loading........";

        var cred = serialize(formUpdateUser, {hash : true})
        console.log(cred);

        _auth.update_upas(_conn, cred, function (res) {
            if (res.success) {
                if (res.status == 200) {
                    $('#modal_delete_user').modal('hide');
                    btnEdit.textContent = "Ubah data user";
                    show_user_data();
                }else{
                    alert("gagal mengubah data");
                    btnEdit.textContent = "Ubah data user";
                }
            }else{
                alert("gagal mengubah data");
                btnEdit.textContent = "Ubah data user";
            }
        })
    }

    function save_new_user() {
        var serial = serialize(formInputUser, {hash : true});

        var cred = {
            'login_id' : 'LGN-'+ Date.now() + Math.floor(Math.random(100000, 1000000) * 1000000000) ,
            'user_id' : serial.user_id ,
            'username' : serial.username ,
            'password' : serial.password ,
            'user_login_role' : serial.user_login_role ,
        }

        _auth.simpan_data_login(_conn, cred, function (res) {
            console.log(res)
            btnAddUser.textContent = "Loading.....";
            if (res.success) {
                if (res.status == 200) {
                    $("#modal_tambah_user").modal("hide");
                    btnAddUser.textContent = "Tambah User Baru";
                    show_user_data();
                }
            }else{
                alert("gagal menambahkan user baru , cek koneksi anda ")
                btnAddUser.textContent = "Tambah User Baru";
            }
        })
    }
})