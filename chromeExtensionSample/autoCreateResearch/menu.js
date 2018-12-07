function save() {
  const rankingLimit = document.getElementById('rankingLimit');
  const waitTime = document.getElementById('waitTime');
  const ssUrl = document.getElementById('ssUrl');
  const BG = chrome.extension.getBackgroundPage();
  BG.saveConfig(rankingLimit.value, waitTime.value, ssUrl.value);
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
  rankingLimit.value = config;
  waitTime.value = "";
  ssUrl.value = "aaaaa";
}

window.onload = function(){
  setUp();
}

document.getElementById('saveButton').onclick = function(){
  save();
}
