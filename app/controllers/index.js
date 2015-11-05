var moment = require('alloy/moment');
var wordnik = require('wordnik');

var os = Ti.Platform.name;
// iOS requires permission to show notifications
if (os === 'iPhone OS' && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
    Ti.App.iOS.registerUserNotificationSettings({
	    types: [
            Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND,
            Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
        ]
    });
}
var today = new Date();

// populate the screen with the last message
if(Ti.App.Properties.hasProperty('message')){
	$.message.value = Ti.App.Properties.getString('message');
	$.messageCountDisplay.text = "Matches: " + Ti.App.Properties.getString('matchCount');
}

// grab word of the day only if haven't saved it yet
if(!Ti.App.Properties.hasProperty('lastChecked') || today.yyyymmdd() !== Ti.App.Properties.getString('lastChecked')){
	wordnik.getWordOfTheDay(function(word){
    	if(word){
    		Ti.App.Properties.setString('lastChecked', today.yyyymmdd());
    		Ti.App.Properties.setString('wordOfTheDay', word);
			$.wordOfTheDay.text = word;
   			checkMessageForWord(word, $.message.value);
    	} else {
			$.wordOfTheDay.text = "Error retrieving the word. Please exit and try again.";
    		// alert('Unable to get the word of the day. Please restart and try again.');
    	}
	});
} else {
	$.wordOfTheDay.text = Ti.App.Properties.getString('wordOfTheDay');
}

function saveMessage(e) {
	today = new Date();
   	Ti.App.Properties.setString('message', $.message.value);
   	checkMessageForWord(Ti.App.Properties.getString('wordOfTheDay'), $.message.value);
};

function checkMessageForWord(word, message){
	var matchCount = 0;
	
	if(message){
		matchCount = (message.match(new RegExp("(^|\\s)" + word + "(\\s|$)", "g")) || []).length;
	}
	
	$.messageCountDisplay.text = "Matches: " + matchCount.toString();
    Ti.App.Properties.setString('matchCount', matchCount.toString());
	
	// update/display notification
	if(os === 'android') {
		Titanium.Android.createNotification({
							number: matchCount,
							when: today
						});
	} else if(os === 'iPhone OS'){
		var notification = Ti.App.iOS.scheduleLocalNotification ({
							badge: matchCount
						});
	}
	Ti.Media.vibrate([0, 250]);
};

$.index.open();
