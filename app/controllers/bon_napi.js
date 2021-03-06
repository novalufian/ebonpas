$(document).ready(function () {
    var serialize = require('form-serialize');

    var _conn = require('../core/connection');
    var _session = require('../core/create_session');
    var _cart = require('../core/cart');
    var _nav = require('../core/main-spa');
    var _to_doc = require('../core/export-doc');

    var _kamar = require('../models/model_kamar');
    var _blok = require('../models/model_blok');
    var _napi = require('../models/model_napi');
    var _master_subag = require('../models/model_master_subag');
    var _bon = require('../models/model_bon');
    var _bon_detail = require('../models/model_bon_detail');
    var _notif = require('../models/model_notif');

    var data_detail_bon = [];

    var current_user = JSON.parse(_session.this_user());

    var bonNapiList = document.getElementById("bon-napi-list");
    var btnKirimBon = document.getElementById("btn-kirim-bon");
    var btnCetakDocx = document.getElementById("btn-cetak-docx");
    var formBonNapi = document.getElementById("form-bon-napi");

    boot_bon_napi();

    function boot_bon_napi() {
        var detail_bon_id = window.localStorage.getItem("detail_bon_id");
        setTimeout(function () {
            window.localStorage.setItem("detail_bon_id", null)
        },1000)
        init_form_value_current_user(current_user)

        if (detail_bon_id !== "null") {
            detail_from_riwayat(detail_bon_id)
            btnKirimBon.setAttribute("disabled", true)
            btnCetakDocx.setAttribute("enabled", true)
            btnCetakDocx.addEventListener("click", function () {
                _to_doc.export_docx(data_detail_bon)
            })
        }else{
            detail_from_bon()
            btnKirimBon.setAttribute("enabled", true)
            btnCetakDocx.setAttribute("disabled", true)
        }

        
    }

    function detail_from_riwayat(detail_bon_id) {
        console.log(detail_bon_id)
        _bon.get_by_id(_conn, detail_bon_id, function (res) {
            console.log(res)
            data_detail_bon['bon_jam_keluar'] = format_date(res.data[0].bon_jam_keluar)
            data_detail_bon['bon_jam_masuk'] = format_date(res.data[0].bon_jam_masuk)
            data_detail_bon['bon_keterangan'] = res.data[0].bon_keterangan
            data_detail_bon['nama'] = res.data[0].nama
            data_detail_bon['nama_pegawai'] = res.data[0].nama_pegawai
            data_detail_bon['nip_pegawai'] = res.data[0].nip_pegawai

            document.getElementById("this_user_nama").value = res.data[0].nama_pegawai
            document.getElementById("this_user_nip").value = res.data[0].nip_pegawai
            document.getElementById("this_user_subagian").value = res.data[0].nama
            document.getElementById("this_keperluan_bon").value = res.data[0].bon_keterangan
            document.getElementById("this_jam_keluar").value = format_date(res.data[0].bon_jam_keluar)
            document.getElementById("this_jam_masuh").value = format_date(res.data[0].bon_jam_masuk)

            console.log(data_detail_bon);
            get_detail_bon_napi(detail_bon_id);
        })
    }

    function get_detail_bon_napi(detail_bon_id) {
        _bon_detail.get_by_bon_id(_conn, detail_bon_id, function (res) {
            create_napi_list(res.data)
        })
    }

    function format_date(date_string) {
        var d = new Date(date_string);
        var nd = d.getDay()+ "-"+ d.getMonth()+"-"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes();
        return nd;
    }

    function detail_from_bon() {
        create_napi_list()
        btnKirimBon.addEventListener("click", kirim_bon);
    }

    function generate_data_export(data) {
        var cred = []
        data.forEach(function (el, i) {
            var a = {
                'napi_id' : el.napi_id,
                'napi_no_reg' : el.napi_no_reg,
                'napi_nama' : el.napi_nama,
                'blok_nama' : el.blok_nama + " / " + el.nama_kamar,
            }
            cred.push(a)
        })

        data_detail_bon['item'] = cred;

    }

    function create_napi_list(data) {
        bonNapiList.querySelector("tbody").innerHTML = "";
        
        var list_napi_booking = (data) ? data : JSON.parse(_cart.list()).item;
        if (data) {
            generate_data_export(data);
        }

        list_napi_booking.forEach(function (el, i) {
            var tr = document.createElement("tr");

            var napi_id = document.createElement("td");
            napi_id.textContent = el.napi_id;
            tr.appendChild(napi_id)

             var napi_no_reg = document.createElement("td");
            napi_no_reg.textContent = el.napi_no_reg;
            tr.appendChild(napi_no_reg)

            var napi_nama = document.createElement("td");
            napi_nama.textContent = el.napi_nama;
            tr.appendChild(napi_nama)

            var nama_kamar = document.createElement("td");
            nama_kamar.textContent = el.blok_nama + " / " + el.nama_kamar;
            tr.appendChild(nama_kamar);

            var action = document.createElement("td");
            var btn = document.createElement("button");
            btn.setAttribute("class", "btn btn-danger");
            btn.setAttribute("type", "button");
            btn.setAttribute("data-napi-index", i);
            btn.setAttribute("data-napi-id", el.napi_id);
            if (data) {
                btn.setAttribute("disabled", true);
            }
            btn.addEventListener("click", delete_cart)
            btn.innerHTML = `<i class="fa fa-trash-alt"></i>`;
            action.appendChild(btn);
            tr.appendChild(action);

            bonNapiList.querySelector("tbody").appendChild(tr);

        })
    }

    function delete_cart() {
        var id = this.getAttribute("data-napi-index");
        var napiid = this.getAttribute("data-napi-id");
        var cred = {
            'id' : napiid,
            'napi_booked' : 0,
            'napi_booked_by' : ''
        }
        _napi.book_napi(_conn, cred , function (res) {
            if (res.success) {
                if (res.status == 200) {
                    _cart.delete(parseInt(id));
                    create_napi_list();
                }
            }
        })
    }

    function init_form_value_current_user(current_user) {
        document.getElementById("this_user_nama").value = current_user.nama;
        document.getElementById("this_user_subagian").value = current_user.subagian;
        document.getElementById("this_user_nip").value = current_user.nip;
    }

    function kirim_bon() {
        btnKirimBon.querySelector(".text").textContent = "Loading....";
        var bonId = 'BON-'+ Date.now() + Math.floor(Math.random(100000, 1000000) * 1000000000);
        var serial = serialize(formBonNapi, {hash : true});
        var jm = serial.jam_masuk;
        var jk = serial.jam_keluar;
        var crendentials = {
            'bon_id' :  bonId,
            'bon_user' : current_user.user_id,
            'bon_keterangan' : serial.keperluan_bon,
            'bon_status' : 'menunggu' ,
            'bon_jam_masuk' : new Date(jm.split(" ")[0].split("-")[2], jm.split(" ")[0].split("-")[1], jm.split(" ")[0].split("-")[0], jm.split(" ")[1].split(":")[0], jm.split(" ")[1].split(":")[1]),
            'bon_jam_keluar' : new Date(jk.split(" ")[0].split("-")[2], jk.split(" ")[0].split("-")[1], jk.split(" ")[0].split("-")[0], jk.split(" ")[1].split(":")[0], jk.split(" ")[1].split(":")[1]),
            'bon_subagian' : current_user.subagian_id,
        }

        _bon.save_bon_data(_conn, crendentials, function (res) {
            if (res.success) {
                if (res.status == 200) {
                    kirim_bon_detail(bonId);
                    var cred = {
                        'notif_user_id' : current_user.user_id,
                        'notif_user_role' : 1,
                        'notif_msg' : `<strong>${current_user.nama}</strong> dari <p class="text-primary">${current_user.subagian}</p>  mengirimkan permintaan bon`,
                    }
                    _notif.save(_conn, cred, function (res) {
                        console.log(res)
                    })

                }else{

                }
            }else{
                alert("gagal mengirim bon, cek koneksi anda")
                btnKirimBon.querySelector(".text").textContent = "Kirim permintaan bon";
            }
        })
    }

    function kirim_bon_detail(bonId) {
        var items = JSON.parse(_cart.list()).item;
        items.forEach(function (el, i) {
            var cred = {
                'bon_detail_id' : 'BDT-'+ Date.now() + Math.floor(Math.random(100000, 1000000) * 1000000000),
                'bon_id' : bonId , 
                'napi_id' : el.napi_id 
            }       
             _bon_detail.save_detail_bon(_conn, cred, function (res) {
                
             })
        })

        _nav.redirect("../views/page/bon-riwayat.html");
        btnKirimBon.querySelector(".text").textContent = "Kirim permintaan bon";
        
    }


})