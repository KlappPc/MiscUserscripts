# MiscUserscripts
Just a bunch of little Scripts I wrote for personal use, maybe someone enjoys.
All Scripts depend on the pages I build them for and can break as soon as sitelayout gets changed.
I take no responsibility for anything you do with it.
I will push always the version I use here and will post a warning if it does not work anymore.

# CompareInventorysTradeoffer (should not be able to permanantly break anything, only just stops working or does shit, which influences only the current tradewindow.)
Adds a "Compare" and a "Update" Button on the top of every tradeoffer. Update uses your BadgePage and calculates how much cards for each set are needed. 
This is stored between different pages. You need to update manually each time you get cards of games where you had 0 cards before (and want to match these).
Furthermore you need to manually load both inventorys (unti you see the cards in your and in the other inventory (steam-community fully loaded).
If you then press "Compare"You will get all cards from the other party which you need (added to the tradeoffer) and the same amount per game from your cards. 
Thereby the maximum account of possible sets (you can achive) is calculated and only the cards you do not need for that are given away (starting with the card you have the most times).
It is assumed that the opponent does not care for sets at all (accepting any 1v1 same set trade)!

After that tradeoffer has to be confirmed and send manually. (Wether you check it before, is your buissnes.) Maximum cards per trade is 100. If you reached 100, wait until tradeoffer is accepted and start a new one.


#RevealIGgifts (Only the second Button can permanantly break stuff. Take care.)
Adds 3 buttons to an Bundle gift page from indiegala (if you got gifted a whole bundle).

First one disables (or enables) the confirm Dialog (this can be copied to any other page and will work always). 
Basically just execute "window.confirm=function(){return true;};" in the javascipt console and you autoaccept confirmations for that page.

The second one will reveal all codes. THIS CAN BREAK STUFF. It depends on the site layout and clicks buttons! So if IG adds a new Button "Permanently delete game" infront of the current "reveal key" this will delete all you keys...
All keys will be revealed (with a 3 second delay between each "click"). The 3 seconds are sometimes to less (you can not reveal 2 keys at the same time) and one key remains hidden.
Do only press once after each page refresh. Multiple times might result in unwanted behaivior.

The third button collects all revealed keys (all keys that were revealed on pageload alread, so refresh page after revealing keys) and output them as a plain Text list, seperated with "," to copy and paste into ASF.
