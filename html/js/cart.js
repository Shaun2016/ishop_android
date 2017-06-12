var total = 0;
//保存购物车列表
var cart;
mui.init();
var userId = null;
mui.plusReady(function() {
	showCart()
});

/*
 * 懒加载
 */
var lazyLoad = mui('#goodListUl').imageLazyload({
	placeholder: '../img/60x60.gif',
	autoDestroy: false
});

function showCart() {
	userId = plus.storage.getItem('userId');
	if(userId == null) {
		document.getElementById('goodListUl').innerHTML = "";
		return;
	}
	mui.getJSON(url + 'shopCar/myCart', { userId: userId }, function(data) {
		console.log(JSON.stringify(data));
		cart = data;
		var goodList = '';
		for(var i = 0; i < data.length; i++) {
			// 如果商品没有类别不显示
			var size = '';
			if(data[i].size != undefined) {
				size = data[i].size.name;
			}
			var goodItem = '<li id="' + data[i].id + '" class="mui-table-view-cell mui-media list">' +
				'<div class="checkbox mui-checkbox">' +
				'<input id="checkbox" name="checkbox" type="checkbox" value="'+i+'" style="position: initial; margin-left: 10px"/>' +
				'</div>' +
				'<div id="content" data-index="'+data[i].good.id+'" class="content">' +
				'<img class="mui-media-object mui-pull-left" data-lazyload="' + urlImg + data[i].good.pic + '">' +
				'<div class="mui-media-body cart"><div>' + data[i].good.info +
				'</div><div id="price" class="mui-ellipsis">' + size + '</br><font color="#FF5400">￥' + data[i].size.price + '</font></div><div id="cartNum">×' + data[i].num + '</div></div>' +
				'<div class="mui-media-body edit" hidden>' +
				'<div class="delete"><button type="button" class="mui-btn mui-btn-danger" style="height: 80px;" onclick="deleteCart(' + data[i].id + ')">删除</button></div>' +
				'<div class="num mui-numbox" data-numbox-min="1" data-numbox-max="' + data[i].good.warenum + '">' +
				'<button class="mui-btn mui-btn-numbox-minus" type="button">-</button>' +
				'<input id="test" class="mui-input-numbox" type="number" value="' + data[i].num + '" readonly/>' +
				'<button class="mui-btn mui-btn-numbox-plus" type="button">+</button></div>' +
				'</div></div></li>';
			goodList += goodItem;
		}
		if(goodList == '') {
			goodList = '<p>还没有任何收藏哟...</p>'
		}
		document.getElementById('goodListUl').innerHTML = goodList;
		mui('.mui-numbox').numbox();
		/*
		 * 启动懒加载
		 */
		lazyLoad.refresh(true);
		setPrice(0);
		total = 0;
	})
}

var flag = true;

document.getElementById('manage').addEventListener('tap', function() {
	if(flag) {
		h(this).html('完成');
		h('.cart').hide();
		h('.edit').show();
		flag = false;
	} else {
		h(this).html('管理');
		h('.edit').hide();
		h('.cart').show();
		flag = true;
		compareNumArray();
	}
})

function updateNumArray() {
	var a = document.getElementsByClassName('mui-input-numbox');
	console.log(a.length);
	var arr = [];
	for(var i = 0; i < a.length; i++) {
		arr.push(a[i].value);
	}
	console.log(arr);
	return arr;
}

function compareNumArray() {
	var newArr = updateNumArray();
	if(cart.length == newArr.length) {
		for(var i = 0; i < newArr.length; i++) {
			if(newArr[i] != cart[i].num) {
				console.log(JSON.stringify(cart[i]));
			}
		}
	}
}

function deleteCart(id) {
	var btnArray = ['否', '是'];
	mui.confirm('您是否要移除购物车？', 'iShop', btnArray, function(e) {
		if(e.index == 1) {
			mui.getJSON(url + "shopCar/remove", { id: id }, function(data) {
				console.log(JSON.stringify(data));
				if(data.code == 0 && data.data == 1) {
					h('#' + id).remove();
					mui.toast("移除成功");
					for(var i = 0; i < cart.length; i++) {
						if(cart[i].id = id) {
							for(var j = i; j < cart.length - 1; j++) {
								cart[j] = cart[j + 1];
							}
							break;
						}
					}
					updateNumArray();
				}
			})
		}
	})
}

function changeGoodNum() {

}

document.getElementById('settleBtn').addEventListener('tap', function() {
	mui.openWindow({
		url: 'order.html',
		id: 'order.html'
	})
})

mui('#goodListUl').on('tap','#checkbox',function(){
	console.log(this.checked);
	console.log(this.value)
	if(this.checked) {
		total -= cart[this.value].size.price;
	} else {
		total += cart[this.value].size.price;
	}
	setPrice(total);
	var checkList = document.getElementById('goodListUl').getElementsByClassName('mui-checkbox');
	var temp = 0;
	for(var i=0;i < checkList.length;i++) {
		console.log(checkList[i].firstChild.checked)
		if(checkList[i].firstChild.checked) {
			temp ++;
		}
	}
	console.log(temp);
	if(temp == 3) document.getElementById('selectAll').checked = true;
	else document.getElementById('selectAll').checked = false;
	
})

document.getElementById('selectAll').addEventListener('tap',function() {
	var checkList = document.getElementById('goodListUl').getElementsByClassName('mui-checkbox');
	if(this.checked) {
		for(var i=0;i < checkList.length;i++) {
			checkList[i].firstChild.checked = false;
			total = 0;
		}
	} else {
		for(var i=0;i < checkList.length;i++) {
			checkList[i].firstChild.checked = true;
			total += cart[i].size.price;
		}
	}
	setPrice(total);
})

mui('#goodListUl').on('tap','#content',function() {
	console.log(this.getAttribute('data-index'));
	goodDetail(this.getAttribute('data-index'));
})

function setPrice(price) {
	h('#settle_amount').html(price);
	h('#total_amount').html(price);
}
