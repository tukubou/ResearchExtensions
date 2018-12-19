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
  const config = BG.getConfig(config => {
    const rankingLimit = document.getElementById('rankingLimit');
    const waitTime = document.getElementById('waitTime');
    const ssUrl = document.getElementById('ssUrl');
    rankingLimit.value = config.rankingLimit;
    waitTime.value = config.waitTime;
    ssUrl.value = config.ssUrl;
  });
}

window.onload = () => {
  setUp();
}

document.getElementById('saveButton').onclick = () => {
  save();
}
