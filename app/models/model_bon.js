module.exports = {
    get_all_data : function(con, userid, cb) {
        var param = (userid !== null) ? 'WHERE ? ' : "";
        var val = (userid !== null ) ? [{'bon.bon_user' : userid}] : "";
        console.log(val)
        con.query(
            {
                sql : `
                    SELECT * FROM bon 
                    LEFT JOIN data_pegawai ON data_pegawai.user_id = bon.bon_user
                    LEFT JOIN master_subagian ON master_subagian.subagian_id = bon.bon_subagian
                    ${param}
                    ORDER BY bon.bon_created_at DESC 
                `,
                values : val
               
            },function (err, res, fields) {
                var r= resData(`get all data bon`, err, res, fields);
                cb(r);
            }
        )
    },

    save_bon_data : function (con, credentials, cb) {
        con.query(
            {
                sql : `INSERT INTO bon SET ?`,
                values : [
                    {
                        'bon_id' : credentials.bon_id ,
                        'bon_user' : credentials.bon_user ,
                        'bon_keterangan' : credentials.bon_keterangan ,
                        'bon_status' : credentials.bon_status ,
                        'bon_jam_masuk' : credentials.bon_jam_masuk ,
                        'bon_jam_keluar' : credentials.bon_jam_keluar ,
                        'bon_subagian' : credentials.bon_subagian  , 
                    }
                ]
               
            },function (err, res, fields) {
                var r= resData(`save data bon`, err, res, fields);
                cb(r);
            }
        )
    }, 
    get_all_data_by_user : function (con, userid, cb) {
        con.query(
            {
                sql : `
                    SELECT * FROM bon 
                    LEFT JOIN data_pegawai ON data_pegawai.user_id = bon.bon_user
                    LEFT JOIN master_subagian ON master_subagian.subagian_id = bon.bon_subagian
                    ORDER BY bon.bon_created_at DESC
                    WHERE ? 
                `,
                values : [{'bon.bon_user' : userid}]
               
            },function (err, res, fields) {
                var r= resData(`get all data bon by user -> ${userid}`, err, res, fields);
                cb(r);
            }
        )
    },

    // function get_all_by_subagian() {
    //  // body...
    // },

    get_by_id : function (con, bonid, cb) {
        con.query(
            {
                sql : `
                    SELECT * FROM bon 
                    LEFT JOIN data_pegawai ON data_pegawai.user_id = bon.bon_user
                    LEFT JOIN master_subagian ON master_subagian.subagian_id = bon.bon_subagian
                    WHERE ? 
                `,
                values : [{'bon.bon_id' : bonid}]
               
            },function (err, res, fields) {
                var r= resData(`get all data bon by user -> ${bonid}`, err, res, fields);
                cb(r);
            }
        )
    },

    update_bon_data : function (con, credentials, bonid, cb) {
        con.query(
            {
                sql : `UPDATE bon SET ? WHERE ?`,
                values : [
                    {
                        'bon_user' : credentials.bon_user ,
                        'bon_keterangan' : credentials.bon_keterangan ,
                        'bon_status' : credentials.bon_status ,
                        'bon_jam_masuk' : credentials.bon_jam_masuk ,
                        'bon_jam_keluar' : credentials.bon_jam_keluar ,
                        'bon_subagian' : credentials.bon_subagian  , 
                    },
                    {
                        'bon_id' : credentials.bon_id ,
                    }
                ]
               
            },function (err, res, fields) {
                var r= resData(`save data bon`, err, res, fields);
                cb(r);
            }
        )
    },
    update_bon_status : function (con, credentials, cb) {
        con.query(
            {
                sql : `UPDATE bon SET ? WHERE ?`,
                values : [
                    {
                        'bon_status' : credentials.bon_status  , 
                    },
                    {
                        'bon_id' : credentials.bon_id ,
                    }
                ]
               
            },function (err, res, fields) {
                var r= resData(`update status bon`, err, res, fields);
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