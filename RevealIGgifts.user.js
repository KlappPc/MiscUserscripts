// ==UserScript==
// @name        RevealIGgifts
// @namespace   KlappPc_RevealIGgifts
// @include     https://www.indiegala.com/gift?gift_id*
// @version     1
// @grant       none
// ==/UserScript==

var needsConfirmDialog=true;
var realConfirm;
function switchConfirmDialog(){
	if(needsConfirmDialog){
		realConfirm=window.confirm;
		window.confirm=function(){
			return true;
		};
		needsConfirmDialog=false;
		textConfirm.data="Enable Confirms";
	}else{
		textConfirm.data="Disable Confirms";
		needsConfirmDialog=true;
		window.confirm=realConfirm;
	}
}

function Reveal(){
	if(needsConfirmDialog){switchConfirmDialog();}
	try{
		var internalI=0;
  var nodes=document.getElementsByClassName("span-key steam-btn");
  for(i=0;i<nodes.length;i++){
    if(nodes[i].childElementCount==1){
      
    }
    if(nodes[i].childElementCount==8){
      setTimeout(function(i){nodes[i].getElementsByTagName('a')[1].click();},internalI*3000,i);
	  internalI++;
    }
  }
  }catch(err){alert(err.message);}
}

function Gather(){
		try{
	var string="";
  var nodes=document.getElementsByClassName("span-key steam-btn");
  for(i=0;i<nodes.length;i++){
    if(nodes[i].childElementCount==1){
		var node=nodes[i].getElementsByTagName('input');
		if(node.length==1){
      string= string+ nodes[i].getElementsByTagName('input')[0].value+",";
		}
    }
    if(nodes[i].childElementCount==8){
    }
  }
  string=string.substring(0, string.length-1);
  alert(string);
    }catch(err){alert(err.message);}
}

var textSpace = document.createTextNode('  |  ');
var textSpace2 = document.createTextNode('  |  ');

var btnConfirm = document.createElement('BUTTON'); // Create a <button> element
var textConfirm = document.createTextNode('Disable Confirms'); // Create a text node
btnConfirm.appendChild(textConfirm);
btnConfirm.onclick = switchConfirmDialog;

var btnReveal = document.createElement('BUTTON'); // Create a <button> element
var textReveal = document.createTextNode('Reveal all codes'); // Create a text node
btnReveal.appendChild(textReveal);
btnReveal.onclick = Reveal;

var btnGather = document.createElement('BUTTON'); // Create a <button> element
var textGather = document.createTextNode('Gather all codes'); // Create a text node
btnGather.appendChild(textGather);
btnGather.onclick = Gather;


parent2 = document.getElementById('library-contain'); // Append the text to <button>
after=parent2.children[0];
parent2.insertBefore(btnConfirm, after); // Append <button> to <body>
parent2.insertBefore(textSpace, after); // Append <button> to <body>
parent2.insertBefore(btnReveal, after); // Append <button> to <body>
parent2.insertBefore(textSpace2, after); // Append <button> to <body>
parent2.insertBefore(btnGather, after); // Append <button> to <body>