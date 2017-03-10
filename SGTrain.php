
<?php

if(isset($_POST['txt'])){
$txt= $_POST['txt'];
$arr=json_decode ( $txt, true);

if(!isset($arr['rgWishlist'])){
	echo 'rgWishlist not set';
	die();
}

if(!isset($arr['rgOwnedApps'])){
	echo 'rgOwnedApps not set';
	die();
}

$wishlist=$arr['rgWishlist'];
$owned=$arr['rgOwnedApps'];

$apps = array(1,2,3); // update with appIds

$wlcount=0;
$notownedcount=0;
$ownedcount=0;

foreach($apps AS $app) {
	if (in_array($app, $wishlist)){
		//echo "WL Match found for ". $app . "<br />";
		$wlcount=$wlcount+1;
		$notownedcount=$notownedcount+1;
	}
	else{
		if (in_array($app, $owned)){
			//echo "Owned Match found for ". $app. "<br />";
			$ownedcount=$ownedcount+1;
		}
		else{
			//echo "No Match not found for ". $app. "<br />";
			$notownedcount=$notownedcount+1;
		}
	}
}
echo "<html><body>";
if($wlcount>0){
	echo 'There are some games from your WISHLIST in this train (at least 1). <br />';
}else{
	echo 'No games on your wishlist. <br />';
}
if($notownedcount>0){
	echo 'There are some games you do NOT own in this train (at least 1). <br />';
}else{
	echo 'No games you do not already own. <br />';
}
if($ownedcount>0){
	echo 'There are some games you DO own in this train (at least 1). <br />';
}
echo "</body></html>";

  
}else{
	?>
	<html><body>
	<div align=center valign=center>
	<div align=center valign=center style="width:900px;">
	This page tells you if there are games in that train, that you do not own, that you do own or that are on your wishlist. <br />
	I tested it and it should work, but no guarantee. The sourcecode of this page can be found <a href="https://github.com/KlappPc/MiscUserscripts/blob/master/SGTrain.php">here</a>. <br />
	Usage:<br />
	1. While being logged into steam go <a href="http://store.steampowered.com/dynamicstore/userdata/">here</a>. <br />
	2. Copy the full text (strg+a is your friend).<br />
	3. Paste the full text below.<br />
	4. Click on "Send".<br /><br />
	There should be no personal data whatsoever inside that data and I neither store nor send it to anyone else. The text should only contain lists with appids. <br />
	There should be 8 lists: owned apps/packages, ignored apps/packages, wishlist, packages/apps in cart and recommended tags. <br />
	I do only use owned apps (rgOwnedApps) and wishlist (rgWishlist). Everything else can be removed. If you want to remove stuff or want to check whats inside please use an JSON editor like <a href="http://www.jsoneditoronline.org/">this</a>.<br /><br />
	<form action="#" method="post"><textarea name="txt" style="width:700px;"></textarea><br />  <button>Send</button></form><br /> <br /> 
	PS: I don't use a "normal" method like parsing your (public) profile or such, because I am lazy^^.
	</div></div>
	</body></html>
	<?
}

?>