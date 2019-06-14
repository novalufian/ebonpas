module.exports = {
	get_all_kamar : function (con, cb ) {
        con.query(
            {
                sql : `SELECT * FROM master_kamar 
                     INNER JOIN master_blok ON master_kamar.master_blok_id = master_blok.blok_master_id 
                     WHERE ?`,
                values : [{'master_kamar.kamar_published' : 1}]
            },function (err, res, fields) {
                var r= resData("get data kamar ", err, res, fields);
                cb(r);
            }
        )
    },

    get_one_kamar : function (con, id , cb) {
        con.query(
            {
                sql : `SELECT * FROM master_kamar WHERE ? AND ?`,
                values : [
                    {'kamar_published' : 1},
                    {'master_kamar_id' : id}
                ]
            },function (err, res, fields) {
                var r= resData(`get data kamar ${id}`, err, res, fields);
                cb(r);
            }
        )
    },

    get_kamar_by_blok : function (con, blokid, cb) {
         con.query(
            {
                sql : `SELECT * FROM master_kamar WHERE ? AND ?`,
                values : [
                    {'kamar_published' : 1},
                    {'master_blok_id' : blokid}
                ]
            },function (err, res, fields) {
                var r= resData(`get data kamar by blok ${blokid}`, err, res, fields);
                cb(r);
            }
        )
    },

    save_kamar : function (con, credentials, cb) {
       con.query(
            {
                sql : `INSERT INTO master_kamar SET ?`,
                values : [
                    {
                        'master_kamar_id' : credentials.master_kamar_id,
                        'master_blok_id' : credentials.master_blok_id,
                        'nama_kamar' : credentials.nama_kamar,
                    }
                ]
            },function (err, res, fields) {
                var r= resData(`insert master kamar`, err, res, fields);
                cb(r);
            }
        )
    }, 
    update_kamar : function (con, credentials, id, cb) {
         con.query(
            {
                sql : `UPDATE master_kamar SET ? WHERE ?`,
                values : [
                    {
                        'master_blok_id' : credentials.master_blok_id,
                        'nama_kamar' : credentials.nama_kamar,
                    },{
                        'master_kamar_id' : credentials.master_kamar_id,
                    }
                ]
            },function (err, res, fields) {
                var r= resData(`update data master kamar `, err, res, fields);
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