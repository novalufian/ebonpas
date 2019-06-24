module.exports = {
	get_all_unread_admin : function (conn, cb) {
		con.query(
            {
                sql : `
                	SELECT * FROM notif 
                    WHERE ? AND ?
                    `,
                values : [
                	{'notif_user_role' : 1}
                	{'notif_status' : 1}
                ]
            },function (err, res, fields) {
                var r= resData("get all unread notif ", err, res, fields);
                cb(r);
            }
        )
		
	},

	get_all_unread_by_user : function (conn, cred , cb) {
		con.query(
            {
                sql : `
                	SELECT * FROM notif 
                	LEFT JOIN data_pegawai ON data_pegawai.user_id = notif.notif_user_id
                    WHERE ? AND ? AND ?
                    `,
                values : [
                	{'notif_user_role' : cred.notif_user_role}
                	{'notif_status' : 1}
                	{'notif_user_destiny' : cred.notif_user_destiny}
                ]
            },function (err, res, fields) {
                var r= resData("get all unread notif ", err, res, fields);
                cb(r);
            }
        )
	},

	get_all_read_by_user : function (conn, cred, cb) {
		con.query(
            {
                sql : `
                	SELECT * FROM notif 
                	LEFT JOIN data_pegawai ON data_pegawai.user_id = notif.notif_user_id
                    WHERE ? AND ? AND ?
                    `,
                values : [
                	{'notif_user_role' : cred.notif_user_role}
                	{'notif_status' : 0}
                	{'notif_user_destiny' : cred.notif_user_destiny}
                ]
            },function (err, res, fields) {
                var r= resData("get all read notif ", err, res, fields);
                cb(r);
            }
        )
	},

	update_notif_to_read_state : function (conn, cred, cb) {
		con.query(
            {
                sql : `
                	UPDATE notif SET ?
                    WHERE ? AND ? 
                    `,
                values : [
                	{'notif_status' : 0}
                	{'notif_user_role' : cred.notif_user_role}
                	{'notif_user_destiny' : cred.notif_user_destiny}
                ]
            },function (err, res, fields) {
                var r= resData("read notif ", err, res, fields);
                cb(r);
            }
        )
	}, 

	save : function () {
		
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