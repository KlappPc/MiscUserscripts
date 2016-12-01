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
var fullString = '';
function addItem(ele) {
  var counter = ele.getElementsByClassName('counter ng-binding') [0];
  var price = ele.getElementsByClassName('price ng-binding') [0];
  fullString += unescape(ele.href.substring(46)).replace('-', ';');
  fullString += ';';
  fullString += counter.innerText.substring(1);
  fullString += ';';
  fullString += price.innerText.substring(0, price.innerText.length).replace('.', '').replace(',', '').replace('$', '').replace('€', '');
  fullString += '\n';
}
function main1() {
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
var ME = 'KlappPcBot1';
var toSend = [
];
function doTradeOffer(elem) {
  var item = elem.element.rgItem;
  var markethash = item.market_hash_name;
  var index = toSend.indexOf(markethash);
  if (index > - 1) {
    console.debug('moveitem '+ markethash);
    unsafeWindow.MoveItemToTrade(elem.element);
    toSend.splice(index, 1);
  }else{
    console.debug('ignoreitem '+ markethash);
  }
}
function main() {
  if (typeof GM_getValue('g_inventoryPrices') === 'undefined') {
    console.debug('not doing shit');
    alert('loadPricesFirst');
  } else {
    toSend = [
    ];
    //var type = prompt('Please enter the type (0=value+above, 1= value, 2= value and below', '1');
    var minvalue = prompt('Please enter the value in cent', '10');
    var fullstring = GM_getValue('g_inventoryPrices');

    var arr = fullstring.split('\n');
    for (var i = 0; i < arr.length; i++) {
      var arr2 = arr[i].split(';');
      if (parseInt(arr2[3])>=parseInt(minvalue)) {
        for (var j = 0; j < parseInt(arr2[2]); j++) {
          toSend.push(arr2[0] + '-' + arr2[1]);
        }
      }else{
        console.debug('ignored'+ arr2[0] + '-' + arr2[1]+' ('+parseInt(arr2[3])+')');
      }
    }
    var inv = unsafeWindow.Draggables.drags;
    for (var i = 0; i < inv.length; i++) {
      doTradeOffer(inv[i]);
    }
    alert('Done');
    //  MoveItemToTrade(elem);
    //console.debug(fullMap); //.forEach(function (owner){owner.forEach(console.debug)});
  }
}
if (!document.URL.includes('community')) {
  var btn = document.createElement('BUTTON');
  var t = document.createTextNode('CLICK ME');
  btn.appendChild(t);
  btn.onclick = main1;
  document.body.insertBefore(btn, document.getElementById('container'));
} else {
  var btn = document.createElement('BUTTON'); // Create a <button> element
  var t = document.createTextNode('Add'); // Create a text node
  btn.appendChild(t);
  btn.onclick = main;
  parent = document.getElementById('mainContent'); // Append the text to <button>
  parent.insertBefore(btn, document.getElementById('trade_escrow_header')); // Append <button> to <body>
}
