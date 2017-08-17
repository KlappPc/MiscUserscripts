// ==UserScript==
// @name        gogoExtract
// @namespace   KlappPc_gogoExtract
// @include     https://gogobundle.com/*
// @version     1
// @grant       none
// ==/UserScript==
function main() {
  var name = this.href.substr(this.href.lastIndexOf('/') + 1).replace('#', '');
  var links = document.getElementsByTagName('a');
  var ret = '';
  for (var i = 0; i < links.length; i++) {
    var link = links[i].href;
    if (link.startsWith('http://store.steampowered.com/app/')) {
      link = link.substring(34, link.length - 1);
      link = link.replace('/', ';');
      ret = ret + link + ';' + name + '\r\n';
    }
  }
  alert(ret);
}
var list = document.getElementsByClassName('g-logo');
list[0].href = '#';
list[0].onclick = main;
