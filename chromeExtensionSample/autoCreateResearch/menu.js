function save() {
  var rankingLimit = document.getElementById('rankingLimit');
  var waitTime = document.getElementById('waitTime');
  var ssUrl = document.getElementById('ssUrl');
  localStorage.clear();
  localStorage.setItem('rankingLimit', rankingLimit.value );
  localStorage.setItem('waitTime', waitTime.value );
  localStorage.setItem('ssUrl', rankingLimit.value );


}
function setUp() {
  var rankingLimit = document.getElementById('rankingLimit');
  var waitTime = document.getElementById('waitTime');
  var ssUrl = document.getElementById('ssUrl');

  rankingLimit.value = localStorage.getItem('rankingLimit');
  waitTime.value = localStorage.getItem('waitTime');
  ssUrl.value = "aaaaa";
}

window.onload = function(){
  setUp();
}

document.getElementById('saveButton').onclick = function(){
  chrome.tabs.query({active:true}, function(tab) {
    chrome.tabs.sendMessage(tab[0].id, {text:''}, function(response) {
        url = tab[0].url;
        $('#place').text(response.title + ' ' + url);
     });
});
  save();
}
