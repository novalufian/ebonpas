module.exports = {
	getAllPenjualan : function(connection, cb) {
		connection.query(
		{
			sql : 'SELECT * FROM penjualan WHERE published = 1',
		}, 
		function (error, results, fields) {
			if (error) {
				var rs = {
					'success' 	: false,
					'message'	: error,
					'time'	: `grab data at ${Date()}`,
					'data'	: null,
					'status'	: 500
				}
			}else{
				if (results.length === 0) {
					var rs = {
						'success' 	: false,
						'message'	: `data not found`,
						'time'	: `grab data at ${Date()}`,
						'data'	: results,
						'status'	: 404
					}
				}else{
					var rs = {
						'success' 	: true,
						'message'	: `success grab data`,
						'time'	: `grab data at ${Date()}`,
						'data'	: results,
						'status'	: 200 
					}
				}
			}

			return cb(rs);
		});
	},
}