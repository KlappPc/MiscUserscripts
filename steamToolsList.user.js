// ==UserScript==
// @name        steamToolsExport
// @namespace   KlappPcSteamToolsExport
// @include     http://steam.tools/itemvalue/*
// @include     https://steamcommunity.com/tradeoffer/new/*
// @version     1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// ==/UserScript==
var priceFees['blub']=0;
var priceWoFees['blub']=0;
var numberOfCards['blub']=0;
var numberOfSets['blub']=0;
function addItem(ele) {
  var counter = ele.getElementsByClassName('counter ng-binding') [0];
  var price = ele.getElementsByClassName('price ng-binding') [0];
  var id = unescape(ele.href.substring(46)).split('-');
  price=price.innerText.substring(0, price.innerText.length).replace('.', '').replace(',', '').replace('$', '').replace('€', '');
  priceFees[id]= (priceFees[id]==='undefined' ? 0 : priceFees[id])+parseInt(price);
  priceWoFees[id]= (priceWoFees[id]==='undefined' ? 0 : priceWoFees[id])+parseInt(price)-2;
  numberOfCards[id]= (numberOfCards[id]==='undefined' ? 0 : numberOfCards[id])+1;
  numberOfSets[id]= Math.min((numberOfSets[id]==='undefined' ? 100 : numberOfSets[id]),parseInt(counter.innerText.substring(1)));

}
function main2() {
  try {
    var itemBox = document.getElementsByClassName('itemBox');
    var items = itemBox[0].getElementsByTagName('a');
    for (var i = 0; i < items.length; i++) {
      addItem(items[i]);
    }
    GM_setValue('g_inventoryPrices', fullString);
    console.debug('prices set');
  } catch (err) {
    console.debug(err.message);
  }
}

var btn = document.createElement('BUTTON');
var t = document.createTextNode('Create List');
btn.appendChild(t);
btn.onclick = main2;
document.body.insertBefore(btn, document.getElementById('container'));

