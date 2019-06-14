const mysql = require('mysql');

const _conn = require('./app/core/connection');
const _napi_ = require('./app/models/model_napi');
const _master_subag_ = require('./app/models/model_master_subag');

console.log('all is well')

// _napi_.get_all_napi_published(_conn , function (res) {
//     console.log(res)
// });

_master_subag_.get_all_blok(_conn, function (res) {
    console.log(res)
})