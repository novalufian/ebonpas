module.exports = {
	function get_all_napi_published(con, cb) {
		con.query(
			{
				sql : `SELECT * FROM data_napi 
					 LEFT JOIN master_kamar ON data_napi.napi_kamar = master_kamar.master_kamar_id 
					 LEFT JOIN master_blok ON master_kamar.master_blok_id = master_blok.blok_master_id 
					 LEFT JOIN master_subagian ON data_napi.napi_booked_by = master_subagian.subagian_id
					 WHERE ?`.
				values : [{'data_napi.napi_published' : 1}]
			},function (err, res, fields) {
				var r= resData("get data pegawai ", err, res, fileds);
				cb(r);
			}
		)
	},
	function get_all_napi_by_kamarid(con, kamarid, cb) {
		con.query(
			{
				sql : `SELECT * FROM data_napi 
					 LEFT JOIN master_kamar ON data_napi.napi_kamar = master_kamar.master_kamar_id 
					 LEFT JOIN master_blok ON master_kamar.master_blok_id = master_blok.blok_master_id 
					 LEFT JOIN master_subagian ON data_napi.napi_booked_by = master_subagian.subagian_id
					 WHERE ? AND ?`.
				values : [
					{'data_napi.napi_published' : 1},
					{'data_napi.napi_kamar' : kamarid},
				]
			},function (err, res, fields) {
				var r= resData(`get data pegawai ${kamarid} `, err, res, fileds);
				cb(r);
			}
		)
	},

	function get_one_napi(con, napiId, cb) {
		con.query(
			{
				sql : `SELECT * FROM data_napi 
					 LEFT JOIN master_kamar ON data_napi.napi_kamar = master_kamar.master_kamar_id 
					 LEFT JOIN master_blok ON master_kamar.master_blok_id = master_blok.blok_master_id 
					 LEFT JOIN master_subagian ON data_napi.napi_booked_by = master_subagian.subagian_id
					 WHERE ? AND ?`.
				values : [
					{'data_napi.napi_published' : 1},
					{'data_napi.napi_id' : napiId},
				]
			},function (err, res, fields) {
				var r= resData(`get data pegawai ${napiId} `, err, res, fileds);
				cb(r);
			}
		)
	},

	function save_pegawai(con, credentials, cb) {
		con.query(
			{
				sql : `INSERT INTO data_napi SET ?`.
				values : [
					{
						'napi_id' : credentials.napi_id,
						'napi_foto' : credentials.napi_foto,
						'napi_no_reg' :  credentials.napi_no_reg,
						'napi_nama' :  credentials.napi_nama,
						'napi_kamar' :  credentials.napi_kamar,
						'napi_sex' : credentials.napi_sex,
					}
				]
			},function (err, res, fields) {
				var r= resData("insert data napi ", err, res, fileds);
				cb(r);
			}
		)
	},

	function update_data_napi(con, credentials, id, cb) {
		con.query(
			{
				sql : `UPDATE data_napi SET ? WHERE ?`.
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
				var r= resData(`update data pegawai ${id} `, err, res, fileds);
				cb(r);
			}
		)
	},

	function unpublish_data_napi(con, id,  cb) {
		con.query(
			{
				sql : `UPDATE data_napi SET ? WHERE ?`.
				values : [
					{'napi_upblished' : 0},
					{'napi_id' : id}
				]
			},function (err, res, fields) {
				var r= resData(`update data pegawai ${id} `, err, res, fileds);
				cb(r);
			}
		)
	},

	function count_all_napi_by_subag(con, subag, kamarid, cb) {
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
				sql : `SELECT * FROM data_napi WHERE ? AND ? ${add_q}`.
				values : _values
			},function (err, res, fields) {
				var r= res.length;
				cb(r);
			}
		)
	},

	function count_all_napi(con, kamarid ,cb) {
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
				sql : `SELECT * FROM data_napi WHERE ? ${add_q}`.
				values : _values
			},function (err, res, fields) {
				var r= res.length;
				cb(r);
			}
		)
	},

	function count_all_napi_unbooked(con, kamarid ,cb) {
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
				sql : `SELECT * FROM data_napi WHERE ? AND ? ${add_q}`.
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