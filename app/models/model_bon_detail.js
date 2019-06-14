module.exports = {
    save_detail_bon : function (con, credentials, cb) {
        con.query(
            {
                sql : `INSERT INTO bon_detail SET ?`,
                values : [
                    {
                        'bon_detail_id' : credentials.bon_detail_id,
                        'bon_id' : credentials.bon_id , 
                        'napi_id' : credentials.napi_id , 
                    }
                ]
            },function (err, res, fields) {
                var r= resData(`insert data detail bon`, err, res, fields);
                cb(r);
            }
        )
    },

    get_by_bon_id : function (con, id, cb) {
        con.query(
            {
                sql : `SELECT * FROM bon_detail 
                     INNER JOIN data_napi ON data_napi.napi_id = bon_detail.napi_id 
                     INNER JOIN master_kamar ON data_napi.napi_kamar = master_kamar.master_kamar_id 
                     INNER JOIN master_blok ON master_kamar.master_blok_id = master_blok.blok_master_id 
                     WHERE ?`,
                values : [{'bon_detail.bon_id' : id}]
            },function (err, res, fields) {
                var r= resData("get data detail bon ", err, res, fields);
                cb(r);
            }
        )
    }
}

function resData(msg , error, results, fields) {
    if (error) {
        var rs = {
            'success'   : false,
            'message'   : error,
            'time'  : `${msg} at ${Date()}`,
            'data'  : null,
            'status'    : 500
        }
    }else{
        if (results.length === 0) {
            var rs = {
                'success'   : true,
                'message'   : `${msg} not found`,
                'time'  : `${msg} at ${Date()}`,
                'data'  : results,
                'status'    : 404
            }
        }else{
            var rs = {
                'success'   : true,
                'message'   : `success ${msg}`,
                'time'  : `${msg} at ${Date()}`,
                'data'  : results,
                'status'    : 200 
            }
        }
    }

    return rs;
}