var serialize = require('form-serialize');

var _conn = require('../core/connection');
var _session = require('../core/create_session');
var _cart = require('../core/cart');
var _nav = require('../core/main-spa');

var _kamar = require('../models/model_kamar');
var _blok = require('../models/model_blok');
var _napi = require('../models/model_napi');
var _master_subag = require('../models/model_master_subag');
var _bon = require('../models/model_bon');
var _bon_detail = require('../models/model_bon_detail');

var current_user = JSON.parse(_session.this_user());

var bonNapiList = document.getElementById("bon-napi-list");
var btnKirimBon = document.getElementById("btn-kirim-bon");
var formBonNapi = document.getElementById("form-bon-napi");

boot_bon_napi();

function boot_bon_napi() {

    create_napi_list()
    init_form_value_current_user(current_user)
    btnKirimBon.addEventListener("click", kirim_bon);
}

function create_napi_list() {
    bonNapiList.querySelector("tbody").innerHTML = "";
    
    var list_napi_booking = JSON.parse(_cart.list());

    list_napi_booking.item.forEach(function (el, i) {
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
            }else{

            }
        }else{

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

