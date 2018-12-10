// @ts-check
// ==UserScript==
// @name     Amazon自動操作
// @version      1.0
// @description Amazon自動操作
// @author       anonymouse
// @match        https://www.amazon.co.jp/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

/**
@matchのページに遷移したら動作
**/
(async() => {
    const rankingLimit = 8000; 　//　リサーチ管理表に追加するランキングの上限
    const waitTime = 8000;　　　//　待ち時間　通信速度に依存
    const gasWebApplicationUrl = "https://script.google.com/macros/s/AKfycbwfO3qjSZaU3A9Rf_vwmOyO6hnZEw4xIcq7tzr9yg/exec";　// 参照するスプレッドシートのwebアプリケーションURL
    const href = location.href;
    await wait(0.7);
     if (href.includes("https://www.amazon.co.jp/s/")) {
         // 検索結果画面
        localStorage.clear();
        const divInfoBar = /** @type {HTMLElement} */ (document.querySelector("[id=s-result-info-bar-content]"));
        let bTag = document.createElement('button');
        bTag.textContent = "リサーチ管理表作成実行";
        bTag.onclick = function() {
            if(confirm("作成実行")) {
                chrome.runtime.sendMessage({},
                function(response) {
                    console.log(response.rankingLimit);
                    console.log(response.waitTime);
                    getHtmlData(response.waitTime);
                });
            };
        }
        divInfoBar.appendChild(bTag);
    }else {
        // その他の画面
        for(const key in localStorage) {
            // 検索結果で保存したASINで遷移先を判断
            if(href.includes(localStorage.getItem(key))) {
                // ランキング読み込みのためwaitは長め
                chrome.runtime.sendMessage({},
                    function(response) {
                        await wait(response.waitTime);
                        getSelerData(key,response.rankingLimit, response.ssUrl);
                        localStorage.removeItem(key);
                        await wait(1000);
                        window.close();
                        break;
                });
            }
        }
    }
    /**
     商品リストページの情報取得
    @param : waitTime 1商品を読み込む毎の待ち時間
    **/
    function getHtmlData(waitTime){
        let index = 0;
        bTag.textContent = "リサーチ管理表作成中";
        const liResult = /** @type {HTMLElement} */ (document.querySelectorAll("li[id*='result_']"));
        const intervalId = setInterval(function() {
             bTag.textContent = "リサーチ管理表作成中    :    " + (index+1) + "件目";
            if(liResult[index].getElementsByTagName("h5").length === 0) {
                // スポンサープロダクトの表示がない場合
                const asin = liResult[index].getAttribute("data-asin");
                localStorage.setItem(index,asin);
                const spacingBase = liResult[index].getElementsByClassName("a-spacing-base");
                const aTag = spacingBase[0].getElementsByTagName("a");
                aTag[0].click();
            }
            index++;
            if(index >= liResult.length) {
                bTag.textContent = "リサーチ管理表作成中    完了";
                clearInterval(intervalId);
            }
        }, waitTime);
    }

    /**
     商品詳細ページの情報取得
    @param : index 何個目の商品か
    @param : rankingLimit リサーチ管理表に記載するランキングの上限
    @param : gasUrl post先のURL
    **/
    function getSelerData(index, rankingLimit, gasUrl) {
        const divOrganizations = /** @type {HTMLElement} */ (document.querySelector("[class='organizationInfo_description']"));
        const aBrand = /** @type {HTMLElement} */ (document.querySelector("[id='bylineInfo']"));
        const spanPrice = /** @type {HTMLElement} */ (document.querySelector("[id='priceblock_ourprice']"));
        const divEnrichContainer = /** @type {HTMLElement} */ (document.querySelector("[class='enrich-container']"));
        const divEnrichResult = divEnrichContainer.getElementsByTagName("div");
        const spanEnrichResult = divEnrichResult[0].getElementsByTagName("span");
        const category = spanEnrichResult[0].textContent;
        const ranking = spanEnrichResult[1].textContent.replace( /位/g , "" ).replace( /,/g , "" );
        const image = /** @type {HTMLElement} */ (document.querySelector("[id='landingImage']"));
        let price = spanPrice.textContent.replace( /￥/g , "" ).replace( /,/g , "" );
        if ( price.match(/ -  /)　) {
            const low = price.split(" -  ")[0];
            const high = price.split(" -  ")[1];
            price = (Number(low)　+　Number(high))　/　2
        }　else {
            price = Number(price);
        }

        // すべてのカスタマーレビューを表示するページに遷移するのが面倒なので全レビュー×割合でgood/badレビューを算出する
        let map = new Map([
            ['total-review-count', 0],
            ['1star', null], ['2star', null], ['3star', null],
            ['4star', null], ['5star', null]
        ]);
        for (const [key, value] of map) {
            if(key === 'total-review-count') {
                let countRaw = /** @type {HTMLElement} */ (document.querySelector(`h2[data-hook='${key}']`) );
                map.set(key,(!countRaw) ? 0 : Number(countRaw.textContent.replace(/件のカスタマーレビュー/g , "")) );
            } else {
                let countRaw = /** @type {HTMLElement} */ (document.querySelector(`a[class*='a-size-base a-link-normal ${key} histogram-review-count']`) );
                map.set(key, (!countRaw) ? 0 : Number(countRaw.textContent.slice( 0, -1 )));
            }
        }
        const reviewGood = Math.round((map.get('4star') + map.get('5star')) * map.get('total-review-count') / 100);
        const reviewBad = Math.round(( map.get('1star') + map.get('2star') + map.get('3star')) * map.get('total-review-count') / 100);

        // windows だと ¥" でエスケープ　macだと \" でエスケープ
        const params = [
            `{\"index\": ${index}`,
            `\"brand\": \"${aBrand.textContent}\"`,
            `\"price\": ${ price}`,
            `\"category\": \"${ category}\"`,
            `\"ranking\": ${ranking}`,
            `\"rankingLimit\": ${rankingLimit}`,
            `\"url\": \"${href}\"`,
            `\"image\": \"${image.src}\"`,
            `\"review\": {\"good\": ${reviewGood}`,
            `\"bad\": ${reviewBad} }}`
        ].join(', ');
        post(params, gasUrl);
    }
    /**
     GAS側に投げるリクエストの作成&送信
    @param : params クエリパラメータ
    @param : gasUrl post先のURL
    **/
    function post(params, gasUrl) {
        GM_xmlhttpRequest( {
            method: "POST",
            url: gasUrl,
            data: params,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            onload: function(response) {
            }
        });
    }
    function wait(ms) {
        return new Promise(r => setTimeout(r, ms));
    }
})();
