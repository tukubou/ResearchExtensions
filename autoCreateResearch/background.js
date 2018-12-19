chrome.runtime.onMessage.addListener(
	//script.jsからのリクエストのリスナー
	(request, sender, sendResponse) => {
		getConfig(config => {
			sendResponse(config);
		})
		return true;
	}
);

function saveConfig(ranking, wait, ssUrl) {
	localStorage.setItem('rankingLimit', ranking);
	localStorage.setItem('waitTime', wait);
	localStorage.setItem('ssUrl', ssUrl);
	return 'success';
};

function getConfig(action) {
	const file = 'defaultConfig.json';
	const xhr = new XMLHttpRequest();
	xhr.open('GET', chrome.extension.getURL(file), true);
	xhr.onreadystatechange = () => {
		if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
			config = JSON.parse(xhr.responseText);
			const responseObj = {
				rankingLimit: (!localStorage.getItem('rankingLimit')) ? config.rankingLimit : localStorage.getItem('rankingLimit'),
				waitTime: (!localStorage.getItem('waitTime')) ? config.waitTime : localStorage.getItem('waitTime'),
				ssUrl: (!localStorage.getItem('ssUrl')) ? config.ssUrl : localStorage.getItem('ssUrl')
			}
			action(responseObj);
		}
	};
	xhr.send();
};