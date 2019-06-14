module.exports = {
	get_all_master_subag : function(con, cb) {
		con.query(
			{
				sql : `SELECT * FROM data_pegawai INNER JOIN master_subagian ON data_pegawai.subag_pegawai = master_subagian.subagian_id WHERE ?`,
				values : [{'published' : 1}]
			},function (err, res, fields) {
				var r= resData("get data pegawai ", err, res, fields);
				cb(r);
			}
		)
	},
	get_one_pegwai : function(con, id, cb) {
		con.query(
			{
				sql : `SELECT * FROM data_pegawai INNER JOIN master_subagian ON data_pegawai.subag_pegawai = master_subagian.subagian_id WHERE ? AND ? `,
				values : [
					{'published' : 1},
					{'user_id' : id},
				]
			},function (err, res, fields) {
				var r= resData(`get data pegawai ${id} `, err, res, fields);
				cb(r);
			}
		)
	},

	save_pegawai : function(con, credentials, cb) {
		con.query(
			{
				sql : `INSERT INTO data_pegawai SET ?`,
				values : [
					{
						'user_id' : credentials.user_id,
						'nip_pegawai' : credentials.nip_pegawai,
						'nama_pegawai' : credentials.nama_pegawai,
						'subag_pegawai' : credentials.subag_pegawai,
						'jenis_kelamin_pegawai' : credentials.jenis_kelamin_pegawai,
						'ttd_pegawai' : credentials.ttd_pegawai,
					}
				]
			},function (err, res, fields) {
				var r= resData("insert data pegawai ", err, res, fields);
				cb(r);
			}
		)
	},

	update_data_pegawai : function(con, credentials, id, cb) {
		con.query(
			{
				sql : `UPDATE data_pegawai SET ? WHERE ?`,
				values : [
					{
						'nip_pegawai' : credentials.nip_pegawai,
						'nama_pegawai' : credentials.nama_pegawai,
						'subag_pegawai' : credentials.subag_pegawai,
						'jenis_kelamin_pegawai' : credentials.jenis_kelamin_pegawai,
						'ttd_pegawai' : credentials.ttd_pegawai,
					},{
						'user_id' : credentials.user_id,
					}
				]
			},function (err, res, fields) {
				var r= resData(`update data pegawai ${id} `, err, res, fields);
				cb(r);
			}
		)
	},

	unpublish_data_pegawai : function(con, id,  cb) {
		con.query(
			{
				sql : `UPDATE data_pegawai SET ? WHERE ?`,
				values : [
					{'upblished' : 0},
					{'user_id' : id}
				]
			},function (err, res, fields) {
				var r= resData(`update data pegawai ${id} `, err, res, fields);
				cb(r);
			}
		)
	}
}

function resData(msg , error, results, fields) {
	if (error) {
		var rs = {
			'success' 	: false,
			'message'	: error,
			'time'	: `${msg} at ${Date()}`,
			'data'	: null,
			'status'	: 500
		}
	}else{
		if (results.length === 0) {
			var rs = {
				'success' 	: true,
				'message'	: `${msg} not found`,
				'time'	: `${msg} at ${Date()}`,
				'data'	: results,
				'status'	: 404
			}
		}else{
			var rs = {
				'success' 	: true,
				'message'	: `success ${msg}`,
				'time'	: `${msg} at ${Date()}`,
				'data'	: results,
				'status'	: 200 
			}
		}
	}

	return rs;
}