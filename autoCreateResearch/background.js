chrome.runtime.onMessage.addListener(
	//script.jsからのリクエストのリスナー
    function(request, sender, sendResponse) {
		sendResponse(getConfig());
    });

var saveConfig = function(ranking,wait,ssUrl){
	localStorage.setItem('rankingLimit', ranking);
	localStorage.setItem('waitTime', wait);
	localStorage.setItem('ssUrl', ssUrl);
	return 'success';
};

var getConfig = function(){
	const defaultSSUrl = "https://script.google.com/macros/s/AKfycbxO08pz9Fu0oUfiJS-GhNK6PeQNoHPpn5ni5H1cY4ZwCxTLaf8/exec";
	const responseObj = {
		rankingLimit : (!localStorage.getItem('rankingLimit')) ? 8000 : localStorage.getItem('rankingLimit'),
		waitTime : (!localStorage.getItem('waitTime')) ? 5000 : localStorage.getItem('waitTime'),
		ssUrl : (!localStorage.getItem('ssUrl')) ? defaultSSUrl : localStorage.getItem('ssUrl')
	}

	return responseObj;
};