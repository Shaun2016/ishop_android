mui.init({
	pullRefresh: {
		container: "#refreshContainer",
		down: {
			height: 50,
			contentdown: "下拉可以刷新",
			contentover: "释放立即刷新",
			contentrefresh: "正在刷新...",
			callback: getGoodList
		},
		up: {
			height: 50,
			auto: false,
			contentrefresh: "正在加载...",
			contentnomore: '没有更多数据了',
			callback: getListByPage
		}
	}
})
mui.plusReady(function() {

})

var tempInput, tempOption;

function setValues(input, option) {
	tempInput = input;
	tempOption = option;
}
/*
 * 懒加载
 */
var lazyLoad = mui('#goodListUl').imageLazyload({
	placeholder: '../img/60x60.gif',
	autoDestroy: false
});
var page = 1;

function getGoodList() {
	page = 1;
	if(tempOption == 1) {
		mui.ajax(url + 'good/find', {
			data: {
				name: tempInput,
				page: page
			},
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			success: function(data) {
				console.log(JSON.stringify(data));
				document.getElementById('goodListUl').innerHTML = showGood(data);
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				page++;
				lazyLoad.refresh(true);
				//重置上拉
				mui('#refreshContainer').pullRefresh().refresh(true);
			},
			error: function(type, error) {
				console.log(JSON.stringify(type));
				mui.toast(JSON.stringify(error))
			}
		})
	} else {
		mui.ajax(url + 'shop/find', {
			data: {
				input: tempInput,
				page: page
			},
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			success: function(data) {
				console.log(JSON.stringify(data));
				document.getElementById('goodListUl').innerHTML = showShop(data);
				/*
				 * 启动懒加载
				 */
				lazyLoad.refresh(true);
				mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				page++;
				//重置上拉
				mui('#refreshContainer').pullRefresh().refresh(true);
			},
			error: function(type) {
				console.log(type);
			}
		})
	}
}
/*
 * 上拉加载时执行的获取数据的函数
 */
function getListByPage() {
	var _self = this;
	if(tempOption == 1) {
		mui.ajax(url + 'good/find', {
			data: {
				name: tempInput,
				page: page
			},
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			success: function(data) {
				/*
				 * 没有数据禁止用户再次上拉刷新发出请求
				 */
				if(data.length == 0) {
					_self.endPullupToRefresh(true);
					return false;
				}
				console.log(JSON.stringify(data));
				//document.getElementById('goodListUl').innerHTML = document.getElementById('goodListUl').innerHTML + showGood(data);
				document.getElementById('goodListUl').insertAdjacentHTML('beforeend',showGood(data));
				page++;
				lazyLoad.refresh(true);
				_self.endPullupToRefresh(false);
			},
			error: function(type) {
				console.log(type);
			}
		})
	} else {
		mui.ajax(url + 'shop/find', {
			data: {
				input: tempInput,
				page: page
			},
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			success: function(data) {
				if(data.length == 0) {
					_self.endPullupToRefresh(true);
					return false;
				}
				console.log(JSON.stringify(data));
				document.getElementById('goodListUl').innerHTML = document.getElementById('goodListUl').innerHTML + showShop(data);
				page++;
				lazyLoad.refresh(true);
				_self.endPullupToRefresh(false);
			},
			error: function(type) {
				console.log(type);
			}
		})
	}
}

function showGood(data) {
	var goodList = '';
	for(var i = 0; i < data.length; i++) {
		var goodItem = '<li class="mui-table-view-cell mui-media">' +
			'<a href="javascript:goodDetail(' + data[i].id + ');">' +
			'<img class="mui-media-object mui-pull-left pic" data-lazyload="' + urlImg + data[i].pic + '">' +
			'<div class="mui-media-body">' +
			data[i].name +
			'<p class="mui-ellipsis">' + data[i].info + '</br>' + data[i].shop.address + '</br>￥：<font color="#FF5400">' + data[i].price + '</font></br>本月销量：' + data[i].sellnum + '</p>' +
			'</div></a></li>';
		goodList += goodItem;
	}
	return goodList;
}

function showShop(data) {
	data = sort(data);
	var shopList = '';
	for(var i = 0; i < data.length; i++) {
		var shopItem = '<li class="mui-table-view-cell mui-media">' +
			'<a href="javascript:shopDetail(' + data[i].id + ');">' +
			'<img class="mui-media-object mui-pull-left pic" ' + url + data[i].head + '>' +
			'<div class="mui-media-body">' +
			data[i].name +
			'<p class="mui-ellipsis">' + data[i].info + '</br>' + data[i].address + '</br>' + data[i].tab + '</br>粉丝：' + data[i].fansnum + '</p>' +
			'</div></a></li>';
		shopList += shopItem;
	}
	return shopList;
}

function sort(data) {
	return data;
}