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
	const responseObj = {
		rankingLimit : localStorage.getItem('rankingLimit'),
		waitTime : localStorage.getItem('waitTime'),
		ssUrl : localStorage.getItem('ssUrl')
	}

	return responseObj;
};