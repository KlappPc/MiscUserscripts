// ==UserScript==
// @name        EnchantASF
// @namespace   KlappPc_ASFlisting
// @include     https://asf.justarchi.net/STM
// @version     1
// @grant GM_xmlhttpRequest
// ==/UserScript==
var links = document.getElementsByTagName('a');
for (var i = 0, len = links.length; i < len; i++) {
  if (links[i].href.startsWith('http://www.steamtradematcher.com/tools/specscan/')) {
    links[i].href = links[i].href.replace('http://www.steamtradematcher.com/tools/specscan/', 'http://steamcommunity.com/profiles/');
  }
}
var myMap = new Map();
for (var i = 0, len = links.length; i < len; i++) {
  if (links[i].href.startsWith('http://steamcommunity.com/profiles/') && links[i].firstChild.attributes.getNamedItem('type').value == 'bot') {
    GM_xmlhttpRequest({
      synchronous: true,
      method: 'GET',
      url: links[i].href,
      onload: function (response) {
        var doc = document.implementation.createHTMLDocument('example');
        doc.documentElement.innerHTML = response.responseText;
        var links2 = doc.getElementsByTagName('a');
        for (var j = 0, len = links2.length; j < len; j++) {
          if (links2[j].href.startsWith('https://steamcommunity.com/tradeoffer/new/?partner=')) {
            myMap.set(this.url, links2[j].href);
          }
        }
      }
    });
  }
}
console.debug(myMap);
for (var i = 0, len = links.length; i < len; i++) {
  if (links[i].href.startsWith('http://steamcommunity.com/profiles/')) {
    var typ = document.createAttribute('type');
    if (typeof myMap.get(links[i].href) != 'undefined') {
      links[i].href = myMap.get(links[i].href);
      typ.value = 'bot';
      links[i].firstChild.attributes.setNamedItem(typ);
    } else {
      typ.value = 'user';
      links[i].firstChild.attributes.setNamedItem(typ);
    }
  }
}
