function goodDetail(id) {
	mui.openWindow({
		url: 'goodDetail.html',
		id: 'goodDetail.html',
		extras: {
			goodId: id
		}
	})
}

function shopDetail(id) {
	mui.openWindow({
		url: 'shopDetail.html',
		id: 'shopDetail.html',
		extras: {
			shopId: id
		}
	})
}