module.exports = {
    get_all_blok : function(con, cb ) {
        con.query(
            {
                sql : `
                    SELECT * FROM master_subagian 
                `,
            },function (err, res, fields) {
                var r= resData("get data subagian ", err, res, fields);
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