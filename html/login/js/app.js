function setStorage(data) {
	console.log(JSON.stringify(data));
	plus.storage.setItem('userId',data.data.id+'');
	plus.storage.setItem('nickname',data.data.nickname);
	plus.storage.setItem('head',url+data.data.head);
	plus.storage.setItem('phone',data.data.phone);
}
