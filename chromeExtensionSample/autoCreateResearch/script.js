(async() => {
    const href = location.href;
    const wait = ( /** @type {number} */ second) => new Promise((resolve) => setTimeout(() => resolve(), second * 1000))
    await wait(0.7);
    if(href === "https://qiita.com/organizations"){
        const div_header = /** @type {HTMLElement} */ (document.querySelector("[class='organizations_header']"));
        // 自動作成実行ボタン追加
        let bTag = document.createElement('button');
        // 押した時の処理
        bTag.onclick= function(){
            //backgroundにリクエスト
            chrome.runtime.sendMessage({},
                function(response) {
                    console.log(response);
                });
            const div_organizations = /** @type {HTMLElement} */ (document.querySelector("[class='list-unstyled organizationsList']"));
            const li_organizations = div_organizations.getElementsByTagName('li');
             let index = 0;
            const intervalId = setInterval(function(){
                const div_column = li_organizations[index].getElementsByClassName('organizationsList_profileColumn');
                const h2_orgName = div_column[0].getElementsByTagName('h2');
                const a_link = h2_orgName[0].getElementsByTagName('a');
                // 遷移先のURLをローカルストレージに保存
                localStorage.setItem(index,a_link[0].href);
                // 新しいタブで開くオプション
                a_link[0].setAttribute("target", "_blank");
                a_link[0].click();
                index++;
                if(index > 0){ // 一旦5商品
                    clearInterval(intervalId);
                }
            }, 2000);
        };
        const submit = document.createTextNode("自動作成実行");
        bTag.appendChild(submit);
        div_header.appendChild(bTag)
    }else {
        await wait(2);
        // ローカルストレージに保存されているURLと一致した場合のみ動作
        for(var j = 0; j < localStorage.length; j++ ){
            const key = localStorage.key(j);
            console.log(href + "  " + localStorage.getItem(key));
            if(href == localStorage.getItem(key)){
                ce(key);
                await wait(2);
                localStorage.removeItem(key);
                // window.close();
                break;
            }
        }

    }

    function ce(key) {
        const div_keyVisual = /** @type {HMLElement} */ (document.querySelector("[class='organizationInfo_keyVisual']"));
        const img_keyVisual = div_keyVisual.getElementsByTagName('img');
        // GASに送るJsonを作成
        const params =`{\"index\": 1,\"brand\":\"ぶらんど\",\"price\": 1500 ,
        \"category\":\"かてごり\",\"ranking\": 2000 ,\"rankingLimit\": 8000 ,\"url\":\"hogehoge\",\"image\":\"fugafuga\",\"review\":{\"good\": 500 ,\"bad\": 200 }}`;
        console.log(params);
        post(params);
    }
    function post(params) {

        var url = "https://script.google.com/macros/s/AKfycbyobyQg64Zt0qIBjnm46kwZzRCTiOqEe23h_yLyu1t-q1VCyEbP/exec"; // リクエスト先URL
        var data; // 送信データ ('param=value&...')
        var request = new XMLHttpRequest();
        request.open('POST', url);
        request.onreadystatechange = function () {
            if (request.readyState != 4) {
                // リクエスト中
            } else if (request.status != 200) {
                // 失敗
            } else {
                // 送信成功
                // var result = request.responseText;
            }
        };
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.send(params);
    }
})();