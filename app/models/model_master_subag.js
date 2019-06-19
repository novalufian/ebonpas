module.exports = {
    get_all_subagian : function(con, cb ) {
        con.query(
            {
                sql : `
                    SELECT * FROM master_subagian WHERE published = 1
                `,
            },function (err, res, fields) {
                var r= resData("get data subagian ", err, res, fields);
                cb(r);
            }
        )
    },

    update_subagian : function(con, credentials, id, cb ) {
        con.query(
            {
                sql : `
                    UPDATE master_subagian SET ? WHERE ?
                `,
                values : [
                    {
                        'nama' : credentials.nama_subagian,
                        'bagian_warna' : credentials.warna_subagian,
                    },
                    {
                        'subagian_id' : id
                    }
                ]
            },function (err, res, fields) {
                var r= resData("uipdate  data subagian ", err, res, fields);
                cb(r);
            }
        )
    },

    get_one_subagian : function(con, id, cb ) {
        con.query(
            {
                sql : `
                    SELECT * FROM  master_subagian WHERE ?
                `,
                values : [
                    {
                        'subagian_id' : id
                    }
                ]
            },function (err, res, fields) {
                var r= resData("get one data subagian ", err, res, fields);
                cb(r);
            }
        )
    },

    save_subagian : function(con, credentials, cb ) {
        con.query(
            {
                sql : `
                    INSERT INTO master_subagian SET ?
                `,
                values : [
                    {
                        'nama' : credentials.nama_subagian,
                        'bagian_warna' : credentials.warna_subagian,
                    },
                ]
            },function (err, res, fields) {
                var r= resData("insert  data subagian ", err, res, fields);
                cb(r);
            }
        )
    },

    unpublished_subagian : function(con, id, cb ) {
        con.query(
            {
                sql : `
                    UPDATE master_subagian SET ? WHERE ?
                `,
                values : [
                    {
                        'published' : 0,
                    },
                    {
                        'subagian_id' : id
                    }
                ]
            },function (err, res, fields) {
                var r= resData("uipdate  data subagian ", err, res, fields);
                cb(r);
            }
        )
    },
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