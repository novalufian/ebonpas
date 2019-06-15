module.exports = {
    login : function(con, credentials, cb) {
        con.query(
            {
                sql : `
                    SELECT * FROM login
                    LEFT JOIN data_pegawai ON login.user_id = data_pegawai.user_id
                    LEFT JOIN master_subagian ON master_subagian.subagian_id = data_pegawai.subag_pegawai
                    WHERE ? AND ? AND ?`,
                values : [
                    {'username' : credentials.username},
                    {'password' : credentials.password},
                    {'user_login_role' : credentials.user_login_role},
                ]
            }, function (err, res, fields) {
                var r= resData("login user ", err, res, fields);
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