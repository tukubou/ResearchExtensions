chrome.runtime.onInstalled.addListener(function(details) {
    chrome.browserAction.onClicked.addListener(function(tab) {
        newurl = 'http://yahoo.co.jp';
        chrome.tabs.query({active:true}, function(tab) {
            tabno = tab[0].index+1;
            chrome.tabs.create({url:newurl, index:tabno},function(){});
        });
    });
});

chrome.runtime.onMessage.addListener(
	//script.jsからのリクエストのリスナー
    function(request, sender, sendResponse) {
		sendResponse(getConfig());
    });

var saveConfig = function(ranking,wait){
	localStorage.setItem('rankingLimit', ranking);
	localStorage.setItem('waitTime', wait);
};

var getConfig = function(){
	const rankingLimit = localStorage.getItem('rankingLimit');
	const waitTime = localStorage.getItem('waitTime');
	return rankingLimit;
};