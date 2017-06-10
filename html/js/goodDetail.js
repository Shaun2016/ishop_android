mui.init();
var goodId = null;
var userId = null;
var isCollected = false;
var isTab = false;
var commentFirstPage = null;
var tab_num = 0;
var good_num = 1;
var tabArr = [];
//用于保存请求到的good对象传递给order页面
var good;

mui.plusReady(function() {
	goodId = plus.webview.currentWebview().goodId;
	userId = plus.storage.getItem("userId");
	mui.ajax(url + 'good/show', {
		data: {
			id: goodId
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(data) {
			console.log(JSON.stringify(data));
			showGoodDetail(data);
			good = data;
		},
		error: function(type) {
			console.log(type);
		}
	});
	mui.ajax(url + 'good/size', {
		data: {
			goodId: goodId
		},
		dataType: 'json',
		success: function(data) {
			console.log(JSON.stringify(data));
			tabArr = data;
			initTab(data);
		}
	})
	initComment(goodId);
	if(userId == null) return;
	checkCollected(userId);

})

var shopId = null;

function showGoodDetail(data) {
	shopId = data.shop.id;
	document.getElementById('title').innerHTML = data.name;
	document.getElementById('info').innerHTML = data.info;
	document.getElementById('deliveryFee').innerHTML = data.deliveryFee;
	document.getElementById('sellNum').innerHTML = data.sellnum;
	document.getElementById('address').innerHTML = data.shop.address;
	document.getElementById('shopName').innerHTML = data.shop.name;
	document.getElementById('shopInfo').innerHTML = data.shop.info;
	var price = data.price;
	document.getElementById('integer').innerHTML = parseInt(price);
	document.getElementById('decimal').innerHTML = (price - parseInt(price)) * 10;
	h('#goodPic').attr('src',urlImg+data.pic);
	var img = urlImg + data.shop.head;
	if(data.shop.head == null)
		img = '../img/shop_Logo.jpg';
	document.getElementById('shopHead').src = img;
}

document.getElementById("toHome").addEventListener('tap', function() {
	mui.back();
	var _search = plus.webview.getWebviewById('html/search.html');
	var search_sub = plus.webview.getWebviewById('html/search_sub.html');
	if(_search != null) {
		_search.close();
	}
	if(search_sub != null) {
		search_sub.close();
	}
})

document.getElementById('enter_shop').addEventListener('tap', enter_shop);

document.getElementById('a_enter_shop').addEventListener('tap', enter_shop);

function enter_shop() {
	if(shopId == null) return;
	mui.openWindow({
		url: 'shopDetail.html',
		id: 'shopDetail.html',
		extras: {
			shopId: shopId
		}
	})
}

document.getElementById("icon-star").addEventListener('tap', function() {
	userId = plus.storage.getItem('userId');
	if(userId == null) {
		mui.toast("您还未登录,请登录");
		goLogin();
		return;
	}
	if(isCollected) {
		mui.ajax(url + 'good/removeCollect', {
			data: {
				userId: userId,
				goodId: goodId
			},
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			success: function(data) {
				h('.mui-icon-star').removeClass('mui-icon-star-filled');
				h('#CollectP').html('收藏');
				isCollected = false;
			},
			error: function(error) {

			}
		})
	} else {
		mui.ajax(url + 'good/collect', {
			data: {
				userId: userId,
				goodId: goodId
			},
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			success: function(data) {
				isCollected = true;
				h('.mui-icon-star').addClass('mui-icon-star-filled');
				h('#CollectP').html('已收藏');
			},
			error: function(error) {

			}
		})
	}
})
/*
 * 添加购物车 
 */
document.getElementById('enter_cart').addEventListener('tap', function() {
	if(userId == null) {
		mui.toast("您还未登录,请登录");
		goLogin();
		return;
	}
	if(!isTab) {
		mui('#forward').popover('toggle');
		return;
	}
	mui.ajax(url + 'shopCar/addCart', {
		data: {
			userId: userId,
			goodId: goodId,
			num: good_num,
			sizeId: tabArr[tab_num].id
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.data)
				mui.toast('添加购物车成功');
			else
				mui.toast('已添加购物车');
		},
		error: function(type) {
			console.log(type);
		}
	})
});
/*
 * 是否收藏
 */
function checkCollected(userId) {
	userId = plus.storage.getItem('userId');
	mui.ajax(url + 'good/isCollected', {
		data: {
			userId: userId,
			goodId: goodId
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.data) {
				isCollected = true;
				h('.mui-icon-star').addClass('mui-icon-star-filled');
				h('#CollectP').html('已收藏');
			}
		},
		error: function(type) {
			console.log(type);
		}
	});
}
/*
 * 加载3条评论信息
 */
function initComment(goodId) {
	userId = plus.storage.getItem('userId');
	mui.ajax(url + 'good/showComment', {
		data: {
			goodId: goodId,
			page: 1
		},
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		success: function(date) {
			console.log(JSON.stringify(date));
			commentFirstPage = date;
			drawComment(date);
		},
		error: function(type) {
			console.log(type);
		}
	})
}
/*
 * 显示评论
 */
function drawComment(data) {
	var length = data.length;
	console.log(length);
	h('#commentNum').html(length);
	if(length == 0) {
		h('#commentList').html('<li class="mui-table-view-cell mui-media" style="padding-left: 10px;"><p>还没有人评论，快来抢沙发啊!</p></li>');
		return;
	}
	var commentList = '';
	var more = '';
	var star = '';
	var reply = '';
	if(length > 3) {
		length = 3;
		more = '<li class="mui-table-view-cell mui-media" style="padding-left: 10px;"><a href="javascript:toMore();"><p>--查看更多--</p></a></li>'
	}
	for(var i = 0; i < length; i++) {
		var j;
		for(j = 1; j <= data[i].star; j++) {
			star += '<i class="mui-icon mui-icon-star-filled"></i>'
		}
		for(var k = 0; k < 5 - data[i].star; k++) {
			star += '<i class="mui-icon mui-icon-star"></i>'
		}
		if(data[i].reply != null) {
			reply = '<li class="mui-table-view-cell mui-media" style="padding-left: 10px;"><span>店家回复：</span><p>' + data[i].reply.content + '</p></li>'
		}
		var commentItem = '<li class="mui-table-view-cell mui-media" style="padding-left: 10px;">' +
			'<img class="mui-media-object mui-pull-left" src="' + urlImg + data[i].user.head + '">' +
			'<div class="mui-media-body">' +
			data[i].user.nickname +
			'<br><p class="mui-ellipsis">' + data[i].content + '</p><div id="stars" class="icons mui-inline"  style="margin-left: 6px;">' +
			star +
			'</div></div>' +
			'</li>';
		commentList += (commentItem + reply);
		star = '';
		reply = '';
	}
	commentList += more;
	h('#commentList').html(commentList);
}

function toMore() {
	mui.openWindow({
		url: 'commentList.html',
		id: 'commentList.html',
		extras: {
			goodId: goodId,
			comment: commentFirstPage
		}
	})
}

function initTab(data) {
	if(data.length == 0) return;
	for(var i=0;i<data.length;i++) {
		var img = document.createElement('img');
		img.src=urlImg+data[i].img;
		h(img).addClass('tab_img');
		img.style.display = 'none';
		h(img).appendTo('#tab_img_block');
		var tab = document.createElement('div');
		h(tab).addClass('catogary');
		var button = '<button style="button" class="mui-btn" onclick="selectTab('+i+',this)">'+data[i].name+'</button>'
		tab.innerHTML = button;
		h(tab).appendTo('#tab_List');
	}
	h('#tab_List').find('button').first().addClass('mui-btn-warning');
	h('#tab_img_block').find('img').first().show();
	h('#tab_dollar').html(data[0].price);
	h('#tab_num').html(data[0].num);
	h('#tab_name').html(data[0].name);
	mui('#mui-numbox').numbox().setOption('max',data[0].num);
	tab_num = 0;
}
/*
 * 选择商品类型，改变选中的类型信息
 */
function selectTab(i,obj) {
	tab_num = i;
	h('#tab_List').find('.mui-btn-warning').removeClass('mui-btn-warning');
	h(obj).addClass('mui-btn-warning');
	h('#tab_img_block').find('img').hide();
	h('#tab_img_block').find('img').eq(i).show();
	h('#tab_dollar').html(tabArr[i].price);
	h('#tab_num').html(tabArr[i].num);
	h('#tab_name').html(tabArr[i].name);
	mui('#mui-numbox').numbox().setValue(1);
	mui('#mui-numbox').numbox().setOption('max',tabArr[i].num);
}

/*
 * 确认商品类型的点击事件
 */
document.getElementById('confirm_tab').addEventListener('tap',function() {
	mui('#forward').popover('toggle');
	good_num = h('#goodNum').val();
	h('#selectTab').html(tabArr[tab_num].name + ' x ' + good_num);
	isTab = true;
	console.log(tabArr[tab_num].id+','+good_num)
})

/*
 * 购买点击事件
 */
document.getElementById('buy').addEventListener('tap', function() {
	if(!isTab) {
		mui('#forward').popover('toggle');
		return;
	}
	var order = {
		good: good,
		num : good_num,
		tab : tabArr[tab_num]
	}
	console.log(JSON.stringify(order));
	mui.openWindow({
		url: 'order.html',
		id : 'order.html',
		extras: {
			order: order
		}
	})
})