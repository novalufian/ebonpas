module.exports = {
	get_all_napi_published : function (con, cb) {
		con.query(
			{
				sql : `SELECT * FROM data_napi 
					 LEFT JOIN master_kamar ON data_napi.napi_kamar = master_kamar.master_kamar_id 
					 LEFT JOIN master_blok ON master_kamar.master_blok_id = master_blok.blok_master_id 
					 LEFT JOIN master_subagian ON data_napi.napi_booked_by = master_subagian.subagian_id
					 WHERE ? AND ?`,
				values : [
					{'data_napi.napi_published' : 1},
					{'data_napi.napi_booked' : 0}
				]
			},function (err, res, fields) {
				var r= resData("get data pegawai ", err, res, fields);
				cb(r);
			}
		)
	},

	get_all_napi_by_kamarid : function (con, kamarid, cb) {
		con.query(
			{
				sql : `SELECT * FROM data_napi 
					 LEFT JOIN master_kamar ON data_napi.napi_kamar = master_kamar.master_kamar_id 
					 LEFT JOIN master_blok ON master_kamar.master_blok_id = master_blok.blok_master_id 
					 LEFT JOIN master_subagian ON data_napi.napi_booked_by = master_subagian.subagian_id
					 WHERE ? AND ? AND ?`,
				values : [
					{'data_napi.napi_published' : 1},
					{'data_napi.napi_booked' : 0},
					{'data_napi.napi_kamar' : kamarid},
				]
			},function (err, res, fields) {
				var r= resData(`get data pegawai ${kamarid} `, err, res, fields);
				cb(r);
			}
		)
	},

	get_one_napi : function (con, napiId, cb) {
		con.query(
			{
				sql : `SELECT * FROM data_napi 
					 LEFT JOIN master_kamar ON data_napi.napi_kamar = master_kamar.master_kamar_id 
					 LEFT JOIN master_blok ON master_kamar.master_blok_id = master_blok.blok_master_id 
					 LEFT JOIN master_subagian ON data_napi.napi_booked_by = master_subagian.subagian_id
					 WHERE ? AND ?`,
				values : [
					{'data_napi.napi_published' : 1},
					{'data_napi.napi_id' : napiId},
				]
			},function (err, res, fields) {
				var r= resData(`get data pegawai ${napiId} `, err, res, fields);
				cb(r);
			}
		)
	},

	save_napi : function (con, credentials, cb) {
		con.query(
			{
				sql : `INSERT INTO data_napi SET ?`,
				values : [
					{
						'napi_id' : credentials.napi_id,
						'napi_foto' : "lorem",
						'napi_no_reg' :  credentials.napi_no_reg,
						'napi_nama' :  credentials.napi_nama,
						'napi_kamar' :  credentials.napi_kamar,
						'napi_sex' : credentials.napi_sex,
					}
				]
			},function (err, res, fields) {
				var r= resData("insert data napi ", err, res, fields);
				cb(r);
			}
		)
	},

	book_napi : function (con, credentials, cb) {
		con.query(
			{
				sql : `UPDATE data_napi SET ? WHERE ?`,
				values : [
					{
						'napi_booked' : credentials.napi_booked,
						'napi_booked_by' : credentials.napi_booked_by,
					},{
						'napi_id' : credentials.id,
					}
				]
			},function (err, res, fields) {
				var r= resData(`booked napi ${credentials.id} `, err, res, fields);
				cb(r);
			}
		)
	},

	update_data_napi : function (con, credentials, id, cb) {
		con.query(
			{
				sql : `UPDATE data_napi SET ? WHERE ?`,
				values : [
					{
						'napi_foto' : credentials.napi_foto,
						'napi_no_reg' :  credentials.napi_no_reg,
						'napi_nama' :  credentials.napi_nama,
						'napi_kamar' :  credentials.napi_kamar,
						'napi_sex' : credentials.napi_sex,
					},{
						'napi_id' : credentials.id,
					}
				]
			},function (err, res, fields) {
				var r= resData(`update data pegawai ${id} `, err, res, fields);
				cb(r);
			}
		)
	},

	unpublish_data_napi : function (con, id,  cb) {
		con.query(
			{
				sql : `UPDATE data_napi SET ? WHERE ?`,
				values : [
					{'napi_published' : 0},
					{'napi_id' : id}
				]
			},function (err, res, fields) {
				var r= resData(`update data pegawai ${id} `, err, res, fields);
				cb(r);
			}
		)
	},

	count_all_napi_by_subag : function (con, subag, kamarid, cb) {
		var add_q = (kamarid !== null) ? 'AND ?' : '';
		var _values = [
			{'napi_published' : 1},
			{'napi_booked_by' : subag},
		]
		if (kamarid !== null) {
			_values = [
				{'napi_published' : 1},
				{'napi_booked_by' : subag},
				{'napi_kamar' : kamarid},
			]
		}
		con.query(
			{
				sql : `SELECT * FROM data_napi WHERE ? AND ? ${add_q}`,
				values : _values
			},function (err, res, fields) {
				var r= res.length;
				cb(r);
			}
		)
	},

	count_all_napi : function (con, kamarid ,cb) {
		var add_q = (kamarid !== null) ? 'AND ?' : '';
		var _values = [{'napi_published' : 1}]
		if (kamarid !== null) {
			_values = [
				{'napi_published' : 1},
				{'napi_kamar' : kamarid},
			]
		}
		con.query(
			{
				sql : `SELECT * FROM data_napi WHERE ? ${add_q}`,
				values : _values
			},function (err, res, fields) {
				var r= res.length;
				cb(r);
			}
		)
	},

	count_all_napi_unbooked : function (con, kamarid ,cb) {
		var add_q = (kamarid !== null) ? 'AND ?' : '';
		var _values = [
			{'napi_published' : 1},
			{'napi_booked' : 0}
		]
		if (kamarid !== null) {
			_values = [
				{'napi_published' : 1},
				{'napi_booked' : 0},
				{'napi_kamar' : kamarid},
			]
		}
		con.query(
			{
				sql : `SELECT * FROM data_napi WHERE ? AND ? ${add_q}`,
				values : _values
			},function (err, res, fields) {
				var r= res.length;
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