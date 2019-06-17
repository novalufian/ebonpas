module.exports = {
    get_all_user_by_role_user : function(con, role_user, cb) {
        con.query(
            {
                sql : `
                    SELECT * FROM login 
                    LEFT JOIN data_pegawai ON data_pegawai.user_id = login.user_id
                    WHERE ? AND ?
                `,
                values : [
                    {'login.user_login_role' : role_user},
                    {'login.published' : 1},
                ]
               
            },function (err, res, fields) {
                var r= resData(`get all data user by level `, err, res, fields);
                cb(r);
            }
        )
    },

    get_one_published_by_role_user : function(con, role_user, id, cb) {
        con.query(
            {
                sql : `
                    SELECT * FROM login 
                    LEFT JOIN data_pegawai ON data_pegawai.user_id = login.user_id
                    WHERE ? AND ?
                `,
                values : [
                    {'login.user_login_role' : role_user},
                    {'login.published' : 1},
                ]
               
            },function (err, res, fields) {
                var r= resData(`get all data user by level `, err, res, fields);
                cb(r);
            }
        )
    },

    delete_user : function(con, loginid, cb) {
        con.query(
            {
                sql : `
                    UPDATE login SET ? WHERE ? 
                `,
                values : [
                    {'published' : 0},
                    {'login_id' :loginid},
                ]
               
            },function (err, res, fields) {
                var r= resData(`disable user ${loginid} `, err, res, fields);
                cb(r);
            }
        )
    }, 

    simpan_data_login : function(con, credentials, cb) {
        con.query(
            {
                sql : `
                    INSERT INTO login SET ? 
                `,
                values : [
                    {
                        'login_id' : credentials.login_id ,
                        'user_id' : credentials.user_id ,
                        'username' : credentials.username ,
                        'password' : credentials.password ,
                        'user_login_role' : credentials.user_login_role ,
                    }
                ]
               
            },function (err, res, fields) {
                var r= resData(`insert new user `, err, res, fields);
                cb(r);
            }
        )
    }, 

    update_upas : function(con, credentials, cb) {
        con.query(
            {
                sql : `
                    UPDATE login SET ? WHERE ?
                `,
                values : [
                    {
                        'user_id' : credentials.user_id ,
                        'username' : credentials.username ,
                        'password' : credentials.password ,
                    },
                    {
                        'login_id' : credentials.login_id,
                    }
                ]
               
            },function (err, res, fields) {
                var r= resData(`insert new user `, err, res, fields);
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