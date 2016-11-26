// ==UserScript==
// @name        steamToolsExport
// @namespace   KlappPcSteamToolsExport
// @include     http://steam.tools/itemvalue/*
// @version     1
// @grant       none
// ==/UserScript==

var fullString="";

function addItem(ele){
  
  var counter=ele.getElementsByClassName("counter ng-binding")[0];
  var price=ele.getElementsByClassName("price ng-binding")[0];
  
  fullString += unescape(ele.href.substring(46)).replace('-',';');
  fullString += ";";
  fullString += counter.innerText.substring(1);
  fullString += ";";
  fullString += price.innerText.substring(0, price.innerText.length -1);
  fullString += "<br>";
}

function main(){
try{
var itemBox= document.getElementsByClassName("itemBox");
var items=itemBox[0].getElementsByTagName('a');
for (var i = 0; i < items.length; i++) {
  addItem(items[i]);
}
  document.body.innerHTML = fullString;
}catch(err){
  console.debug(err.message);
}
}
var btn = document.createElement("BUTTON");        
var t = document.createTextNode("CLICK ME");       
btn.appendChild(t);   
btn.onclick=main;
document.body.insertBefore(btn, document.getElementById("container"));   
