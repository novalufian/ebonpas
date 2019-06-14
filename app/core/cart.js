var cartList = [];
localStorage.setItem("cart", JSON.stringify({
	"item" : cartList, 
	}
	));
// https://codepen.io/dcergo/pen/RawpJL

module.exports = {


	list : function () {
		return localStorage.getItem("cart");
	},

	add : function (data, cb) {
		var list = JSON.parse(this.list());
		var itemState = false;
		var idCart = null;
		var indexCart = null;
		list.item.forEach(function(e, i){
			if (e.code == data.code ) {
				itemState = true;
				idCart = e.idCart;
				indexCart = i;
			}
		})

		if (itemState) {
			this.update( 1 ,indexCart, "increase");
		}else{
			list.item.push(data);
			localStorage.setItem("cart", JSON.stringify({"item" : list.item}))
		}
	},
	update : function (value ,indexCart, method) {
		var list = JSON.parse(this.list());
		var item = list.item[indexCart];
		switch (method) {
			case "increase":
				item.qty += value;
				break;
			case "input":
			console.log(value, item.qty )
				item.qty = value;
			default:
				if (item.qty >= 1) {
					item.qty -= value;
				}
				break;
		}
		console.log("cart value "+value +" - "+ item.qty)
		item.total = item.qty * item.price;
		console.log(item)
		console.log(list)
		localStorage.setItem("cart", JSON.stringify({"item" : list.item}))
	},

	delete : function (index) {
		var list = JSON.parse(this.list());
		list.item.splice(index,1);
		localStorage.setItem("cart", JSON.stringify({"item" : list.item}))
	},

	destroy : function () {
		localStorage.setItem("cart", JSON.stringify({"item" : []}))
	},

	total : function () {
		var total = 0;
		var list = JSON.parse(this.list());
		list.item.forEach(function (el, i) {
			total += el.total;	
		})
		return total;
	}
}

