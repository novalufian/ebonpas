
var _conn = require('../core/connection');
var _session = require('../core/create_session');
var _cart = require('../core/cart');

var _kamar = require('../models/model_kamar');
var _blok = require('../models/model_blok');
var _napi = require('../models/model_napi');
var _master_subag = require('../models/model_master_subag');

var current_user = JSON.parse(_session.this_user());

var selectKamar = document.getElementById("napi_kamar_wrapper");
var selectBlok = document.getElementById("select_blok");
var tableListNapi = document.querySelector(".table-list-napi");
var tableDiagramNapi = document.querySelector(".table-update-diagram-napi");

var globalDataNapi = [];

console.log('this is from blok lapas')

boot_blok_lapas();

function boot_blok_lapas() {
    get_blok_list();
    get_all_napi_list();
    selectBlok.addEventListener("change", get_kamar_list);
    selectKamar.addEventListener("change", get_data_napi);
}

function get_all_napi_list() {
    globalDataNapi = [];
    _napi.get_all_napi_published(_conn, function (res) {
        console.log(res.data)
        res.data.forEach(function (el, i) {
            create_napi_table_list(el)
            globalDataNapi[el.napi_id] = el
        })
    })
    console.log(globalDataNapi)

    update_diagram_napi(null);
}


function get_blok_list() {

    _blok.get_all_blok(_conn, function (res) {
        res.data.forEach(function (el, i) {
            var option = document.createElement("option");
            option.setAttribute("value", el.blok_master_id);
            option.textContent = el.blok_nama;
            selectBlok.appendChild(option)
        })
    })

}


function get_kamar_list() {
    selectKamar.innerHTML = `<option value="undefined">select</option>`;
    selectKamar.value = undefined;

    var blokID = this.value;
    _kamar.get_kamar_by_blok(_conn, blokID, function (res) {
        res.data.forEach(function (el, i) {
            var option = document.createElement("option");
            option.setAttribute("value", el.master_kamar_id);
            option.textContent = el.nama_kamar;
            selectKamar.appendChild(option)
        })
    })


}

function get_data_napi(e) {
    globalDataNapi = [];

    var kamarId = this.value;
    $("#dataTable").dataTable().fnDestroy();
    var target = tableListNapi.querySelector("tbody");
    target.innerHTML = "";

    _napi.get_all_napi_by_kamarid(_conn, kamarId, function (res) {
        if (res.status == 200) {
            res.data.forEach(function (el , i) {
                create_napi_table_list(el);  
                globalDataNapi[el.napi_id] = el
            })
        }else{
            var target = tableListNapi.querySelector("tbody");
            target.innerHTML = "";
            $("#dataTable").dataTable();
        }
    })

    console.log(globalDataNapi)

    update_diagram_napi(kamarId);

    e.preventDefault()
}

function create_napi_table_list(data_napi) {
    $("#dataTable").dataTable().fnDestroy();
    var target = tableListNapi.querySelector("tbody");

    var tr = document.createElement("tr");

    var napi_id = document.createElement("td");
    napi_id.textContent = data_napi.napi_id;
    tr.appendChild(napi_id);

    var napi_no_reg = document.createElement("td");
    napi_no_reg.textContent = data_napi.napi_no_reg;
    tr.appendChild(napi_no_reg);

    var napi_nama = document.createElement("td");
    napi_nama.textContent = data_napi.napi_nama;
    tr.appendChild(napi_nama);

    var blok_nama = document.createElement("td");
    blok_nama.textContent = data_napi.blok_nama + " / " +data_napi.nama_kamar;
    tr.appendChild(blok_nama);

    var action = document.createElement("td");
    var add = document.createElement("button");
    add.setAttribute("class", "btn btn-primary");
    add.setAttribute("data-napi-id", data_napi.napi_id);
    add.textContent = "bon napi"
    add.addEventListener("click", add_napi_to_cart);
    action.appendChild(add);
    tr.appendChild(action);


    target.appendChild(tr);

    $("#dataTable").dataTable();

    // call update napi

}

function add_napi_to_cart() {
    this.setAttribute("class", "btn btn-light");
    this.textContent = "batalkan";
    var napiid = this.getAttribute("data-napi-id");
    var data = globalDataNapi[napiid];
    _cart.add(data)
}


function update_diagram_napi(kamarId) {
    console.log(tableDiagramNapi)

    tableDiagramNapi.innerHTML = "";

    _napi.count_all_napi(_conn,kamarId,  function (res) {
        console.log(res)

        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        td1.textContent = "total napi";
        tr.appendChild(td1)

        var td2 = document.createElement("td");
        td2.textContent = ":";
        tr.appendChild(td2)

        var td3 = document.createElement("td");
        td3.textContent = res;
        tr.appendChild(td3)
        tableDiagramNapi.appendChild(tr);

    })

    _napi.count_all_napi_unbooked(_conn,kamarId,  function (res) {
        console.log(res)

        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        td1.textContent = "jumlah napi unbooked";
        tr.appendChild(td1)

        var td2 = document.createElement("td");
        td2.textContent = ":";
        tr.appendChild(td2)

        var td3 = document.createElement("td");
        td3.textContent = res;
        tr.appendChild(td3)
        tableDiagramNapi.appendChild(tr);

    })

    generate_diagram_napi_by_subag(kamarId);

}

function generate_diagram_napi_by_subag(kamarId) {
    _master_subag.get_all_blok(_conn, function (res) {
        res.data.forEach(function (el, i) {
            _napi.count_all_napi_by_subag(_conn, el.subagian_id, kamarId, function (res) {
                console.log(res);
                var tr = document.createElement("tr");
                var td1 = document.createElement("td");
                td1.textContent = el.nama;
                tr.appendChild(td1)

                var td2 = document.createElement("td");
                td2.textContent = ":";
                tr.appendChild(td2)

                var td3 = document.createElement("td");
                td3.textContent = res;
                tr.appendChild(td3)
                tableDiagramNapi.appendChild(tr);
            })
        })
    })
}


$(".navigate-spa").each(function (i, e) {
    e.addEventListener("click", navigate_page)
})

function navigate_page() {
    var page = this.getAttribute("data-page");
    loadPage(page);
}


function loadPage(page) {
    $('#template-content-section').load("page/loader.html");
    setTimeout(function () {
        $('#template-content-section').load(page, function (res, status, xhr) {
        });
    }, 500)
}