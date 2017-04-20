function isLogin() {
	var userId = plus.storage.getItem('userId');
	if(userId == null) {
		mui.toast('您还未登录');
	}
}

function goLogin() {
	mui.openWindow({
		url: 'login/temp_login.html',
		id : 'login/temp_login.html'
	})
}
