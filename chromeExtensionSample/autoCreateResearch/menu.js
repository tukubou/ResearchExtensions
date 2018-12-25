function save() {
  const rankingLimit = document.getElementById('rankingLimit');
  const waitTime = document.getElementById('waitTime');
  const ssUrl = document.getElementById('ssUrl');
  const BG = chrome.extension.getBackgroundPage();
  const res = BG.saveConfig(rankingLimit.value, waitTime.value, ssUrl.value);
  document.getElementById('saveButton').textContent = res;
}
function setUp() {
  const BG = chrome.extension.getBackgroundPage();
  if(BG.getConfig() == null){
    BG.saveConfig(8000,5000,"https://www.google.co.jp/");
  }
  const config = BG.getConfig();
  const rankingLimit = document.getElementById('rankingLimit');
  const waitTime = document.getElementById('waitTime');
  const ssUrl = document.getElementById('ssUrl');
  rankingLimit.value = config.rankingLimit;
  waitTime.value = config.waitTime;
  ssUrl.value = config.ssUrl;
}

window.onload = function(){
  setUp();
}

document.getElementById('saveButton').onclick = function(){
  save();
}
