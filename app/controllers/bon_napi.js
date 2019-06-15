var _conn = require('../core/connection');
var _session = require('../core/create_session');
var _cart = require('../core/cart');

var _kamar = require('../models/model_kamar');
var _blok = require('../models/model_blok');
var _napi = require('../models/model_napi');
var _master_subag = require('../models/model_master_subag');

var current_user = JSON.parse(_session.this_user());

var bonNapiList = document.getElementById("bon-napi-list");

boot_bon_napi();

function boot_bon_napi() {

    create_napi_list()
    init_form_value_current_user(current_user)
}

function create_napi_list() {
    bonNapiList.querySelector("tbody").innerHTML = "";
    
    var list_napi_booking = JSON.parse(_cart.list());
    console.log(list_napi_booking.item)

    list_napi_booking.item.forEach(function (el, i) {
        console.log(el, i)

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
        btn.setAttribute("data-napi-id", i);
        btn.addEventListener("click", function () {
            var id = this.getAttribute("data-napi-id");
            _cart.delete(parseInt(id));
            create_napi_list();
        })
        btn.innerHTML = `<i class="fa fa-trash-alt"></i>`;
        action.appendChild(btn);
        tr.appendChild(action);

        bonNapiList.querySelector("tbody").appendChild(tr);

    })
}

function init_form_value_current_user(current_user) {
    document.getElementById("this_user_nama").value = current_user.nama;
    document.getElementById("this_user_subagian").value = current_user.subagian;
    document.getElementById("this_user_nip").value = current_user.nip;
}

