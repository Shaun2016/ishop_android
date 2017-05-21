function pageInit() {
	plus.webview.getWebviewById('html/me.html').evalJS("isLogin();");
	var _good = plus.webview.getWebviewById('goodDetail.html');
	if(_good != null)
		_good.evalJS("initUserInfo();");
}