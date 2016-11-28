// ==UserScript==
// @name        CompareInventorysTradeoffer
// @namespace   KlappPc_CompareInventorysTradeoffer
// @include     https://steamcommunity.com/tradeoffer/new/*
// @version     1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       unsafeWindow
// ==/UserScript==
var ME = 'KlappPcBot3';
function httpGet(theUrl)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open('GET', theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return xmlHttp.responseText;
}
var badgeList = {
};
var badgeListReady = [
];
function parseBadgePage() {
  badgeList = {
  };
  badgeListReady = [
  ];
  var page = 1;
  var stringrequest = httpGet('https://steamcommunity.com/my/badges?l=english&p=' + page);
  var parser = new DOMParser()
  var doc = parser.parseFromString(stringrequest, 'text/html');
  var maxPage = 1;
  var as = doc.getElementsByClassName('pagelink');
  if (as.length >= 1) {
    var last_a = as[as.length - 1];
    var maxPage = last_a.href.substring(last_a.href.indexOf('p=', - 1) + 2);
  }
  while (page <= maxPage) {
    console.debug('Page ' + page);
    var badges = doc.getElementsByClassName('badge_row is_link');
    for (var index in badges) {
      var badge = badges[index];
      if (badge.tagName != 'DIV') {
        continue;
      }
      var row = badge.getElementsByClassName('badge_row_overlay');
      if (row.length == 0) {
        continue;
      }
      var steamLink = row[0].href;
      if (steamLink.includes('/?border=1')) {
        continue;
      }
      steamLink = steamLink.substring(0, steamLink.lastIndexOf('/'));
      steamLink = steamLink.substring(steamLink.lastIndexOf('/') + 1);
      row = badge.getElementsByClassName('badge_progress_info');
      if (row.length == 0) {
        continue;
      }
      var cardsstring = row[0].innerText.trim();
      if (cardsstring.includes('Ready')) {
        badgeListReady.push(steamLink);
        continue;
      }
      if (cardsstring.includes('tasks')) {
        continue;
      }
      var arr = cardsstring.split(' ');
      if (arr.length < 3) {
        continue;
      }
      if (arr[0] == 0) {
        continue;
      }
      badgeList[steamLink] = arr[2];
    }
    page = page + 1;
    if (page <= maxPage) {
      stringrequest = httpGet('https://steamcommunity.com/my/badges?l=english&p=' + page);
      parser = new DOMParser()
      doc = parser.parseFromString(stringrequest, 'text/html');
    }
    console.debug('Page ' + page + ' done.');
  }
  addedClassIds = [
  ];
  GM_setValue('g_badgeListReady', JSON.stringify(badgeListReady));
  GM_setValue('g_badgeList', JSON.stringify(badgeList));
  alert("Done");
}
var fullMap = {
};
var addedClassIds = [
];
function addItem(elem) {
  console.debug('start addItem');
  var owner = elem.element.innerHTML;
  owner = owner.substring(owner.indexOf('/', owner.indexOf('"') + 28) + 1);
  owner = owner.substring(0, owner.indexOf('/'));
  if (owner.includes('div><')) {
    return;
  }
  var item = elem.element.rgItem;
  var appId = item.appid;
  var realApp = item.app_data.appid;
  var classId = item.classid;
  var contextId = item.contextid;
  if (appId != 753 || contextId != '6') {
    return;
  }
  var tags = item.tags;
  
  var tag = tags[0];
  var i = 1;
  while (tag.category != 'item_class' && i<tags.length) {
    tag = tags[i];
    i++;
  }
  if (tag.internal_name != 'item_class_2') {
    return;
  }

  tag = tags[0];
  i = 1;
  while (tag.category != 'cardborder' && i<tags.length) {
    tag = tags[i];
    i++;
  }
  if (tag.internal_name != 'cardborder_0') {
    return;
  }
  
  if (badgeListReady.length != 0) {
    if (badgeListReady.indexOf(realApp) != - 1) {
      if (addedClassIds.indexOf(classId) == - 1) {
        addedClassIds.push(classId);
        if (realApp in badgeList) {
          badgeList[realApp] = badgeList[realApp] + 1;
        } else {
          badgeList[realApp] = 1;
        }
      }
    }
  }
    if (!(owner in fullMap)){
    fullMap[owner] = {
    };
  }
  if(!(realApp in badgeList) && badgeListReady.indexOf(realApp) == - 1){
	  return;
  }

  if (!(realApp in fullMap[owner])){
    fullMap[owner][realApp] = {
    };
  }
  if (classId in fullMap[owner][realApp]) {
    fullMap[owner][realApp][classId] = fullMap[owner][realApp][classId] + 1;
  } else {
    fullMap[owner][realApp][classId] = 1;
  }
  if (owner != ME) {
  if (!(ME in fullMap)){
      alert("possible wrong owner?" + owner);
    fullMap[ME] = {
    };
  }
    if (!(realApp in fullMap[ME])){
      fullMap[ME][realApp] = {
      };
    }
    if (!(classId in fullMap[ME][realApp])){
      fullMap[ME][realApp][classId] = 0;
    }
  }
  console.debug('emd addItem');
}
function getDifferent(inp) {
  return Object.keys(inp).length;
}
function getMinumum(inp) {
  var min = 100;
  var arr = Object.keys(inp).map(function (key) {
    return inp[key];
  });
  for (var i = 0; i < arr.length; i++) {
    if (min > arr[i]) {
      min = arr[i];
    }
  }
  return min;
}
function mygetSum(inp) {
  var sum = 0;
  var arr = Object.keys(inp).map(function (key) {
    return inp[key];
  });
  for (var i = 0; i < arr.length; i++) {
    sum = sum + arr[i];
  }
  return sum;
}
function doSubstract(inp, val) {
  var arr = Object.keys(inp).slice(0);
  for (var i = 0; i < arr.length; i++) {
    inp[arr[i]] = inp[arr[i]] - val;
  }
  return inp;
}
function removeFullSets() {
  var gameMap = fullMap[ME];
  var games = Object.keys(gameMap).slice(0);
  
  for (var i = 0; i < games.length; i++) {
    if (getDifferent(gameMap[games[i]]) == badgeList[games[i]]) {
      gameMap[games[i]] = doSubstract(gameMap[games[i]], getMinumum(gameMap[games[i]]));
    }
  }
}
function removeRestAndShiftSets() {
  var gameMap = fullMap[ME];
  var games = Object.keys(gameMap).slice(0);
  var remGames = [
  ];
  for (var i = 0; i < games.length; i++) {
    if (games[i] in badgeList) {
      var sets = mygetSum(gameMap[games[i]]) / badgeList[games[i]];
      if (sets < 1) {
        delete fullMap[ME][games[i]];
      } else {
        gameMap[games[i]] = doSubstract(gameMap[games[i]], Math.floor(sets));
      }
    }
  }
}
function mysort(a, b) {
  if (a > 0 && b < 0) {
    return 1;
  }
  if (a < 0 && b > 0) {
    return 1;
  }
  if (a > 0 && b > 0) {
    return b - a;
  }
  return a - b;
}
var arrTake = {
};
var arrGive={
};
function calculateTradeOffer() {
  var ownerME = ME,
  ownerOther;
  var names = Object.keys(fullMap);
  if (names[0] === ownerME) {
    ownerOther = names[1];
  } else {
    ownerOther = names[0];
  }
  var gameMapMe = fullMap[ownerME];
  var gameMapOther = fullMap[ownerOther];
  var games = Object.keys(gameMapMe).slice(0);
  for (var i = 0; i < games.length; i++) {
    var cards = Object.keys(gameMapMe[games[i]]).slice(0);
    cards.sort(function (a, b) {
      return mysort(gameMapMe[games[i]][a], gameMapMe[games[i]][b]);
    });
	// for some games it was not sorted here... like javascript, wtf...second call fixed it...
	cards.sort(function (a, b) {
      return mysort(gameMapMe[games[i]][a], gameMapMe[games[i]][b]);
    });
    var taken = 0;
    for (var j = 0; j < cards.length; j++) {
      var have = gameMapMe[games[i]][cards[j]];
      if (have < 0 && taken<100) {
        //take as much as needed if possible
        var max = 0;
		if(games[i] in gameMapOther && cards[j] in gameMapOther[games[i]]){
			max=gameMapOther[games[i]][cards[j]];
		}else{
		}
        var realTake = Math.min(Math.abs(have), max);
        arrTake[cards[j]]=realTake;
        taken=taken+realTake;
      }
      if (have > 0 && taken>0) {
        //now give as much as needed
        var realGive = Math.min(have, taken);
        arrGive[cards[j]]=realGive;
        taken=taken-realGive;
      }
    }
  }
}
function doTradeOffer(elem){
  var owner = elem.element.innerHTML;
  owner = owner.substring(owner.indexOf('/', owner.indexOf('"') + 28) + 1);
  owner = owner.substring(0, owner.indexOf('/'));
  if (owner.includes('div><')) {
    return;
  }
  var item = elem.element.rgItem;
  var appId = item.appid;
  var realApp = item.app_data.appid;
  var classId = item.classid;
  var contextId = item.contextid;
  if (appId != 753 || contextId != '6') {
    return;
  }
  var tags = item.tags;
  var tag = tags[0];
  var i = 1;
  while (tag.category != 'item_class') {
    tag = tags[i];
    i++;
  }
  if (tag.internal_name != 'item_class_2') {
    return;
  }
  if(owner==ME){
    if((classId in arrGive) && arrGive[classId]>0){
      unsafeWindow.MoveItemToTrade(elem.element);
      arrGive[classId]=arrGive[classId]-1;
    }
    
  }else{
    if((classId in arrTake) && arrTake[classId]>0){
      unsafeWindow.MoveItemToTrade(elem.element);
      arrTake[classId]=arrTake[classId]-1;
    }
  }
  
  
  
}
function main() {

  fullMap = {
  };
  if (typeof GM_getValue('g_badgeList') === 'undefined') {
    console.debug('not doing shit');
  } else {
    if (Object.keys(badgeList).length == 0) {
      badgeList = JSON.parse(GM_getValue('g_badgeList'));
    }
    if (badgeListReady.length == 0) {
      badgeListReady = JSON.parse(GM_getValue('g_badgeListReady'));
    }
  }
  var inv = unsafeWindow.Draggables.drags;
  for (var i = 0; i < inv.length; i++) {
    addItem(inv[i]);
  }
  badgeListReady = [
  ];
  if (Object.keys(fullMap).length != 2) {
    alert('Load both inventories first!');
    return;
  }
  if (!(ME in fullMap)) {
    alert('You need to be part of that tradeoffer. Given names are: ' + Object.keys(fullMap));
    return;
  }  // works until here. Just wanted to note that javascript sucks.
console.debug("Items read");

  removeFullSets();
  console.debug("fullsets removed");
  removeRestAndShiftSets();
  console.debug("rest removed");
  calculateTradeOffer();
  console.debug("Tradeoffer calculated");
  for (var i = 0; i < inv.length; i++) {
    doTradeOffer(inv[i]);
  }
  alert("Done");
  //  MoveItemToTrade(elem);
  //console.debug(fullMap); //.forEach(function (owner){owner.forEach(console.debug)});
}
var btn = document.createElement('BUTTON'); // Create a <button> element
var t = document.createTextNode('Compare'); // Create a text node
btn.appendChild(t);
btn.onclick = main;
parent = document.getElementById('mainContent'); // Append the text to <button>
parent.insertBefore(btn, document.getElementById('trade_escrow_header')); // Append <button> to <body>
var btn2 = document.createElement('BUTTON'); // Create a <button> element
var t2 = document.createTextNode('RefreshMaxCards'); // Create a text node
btn2.appendChild(t2);
btn2.onclick = parseBadgePage;
parent2 = document.getElementById('mainContent'); // Append the text to <button>
parent2.insertBefore(btn2, document.getElementById('trade_escrow_header')); // Append <button> to <body>
