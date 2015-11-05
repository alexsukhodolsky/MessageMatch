var WORDNIK_BASE_URL = "http://api.wordnik.com:80/v4/words.json/wordOfTheDay?";
var ERROR_MESSAGE = "Unable to retrieve word of the day. Please try again.";

exports.getWordOfTheDay = function(callback) {
	var today = new Date();

	// I normally wouldn't hardcode the api key but I went ahead and hardcoded in the interest of saving time
	var url = WORDNIK_BASE_URL + "date=" + today.yyyymmdd() + "&api_key=4383989b032f74892e00d05d3ca0b4ef81e2f4b55e1f6818c";
	
	Titanium.Yahoo.yql('SELECT word FROM json WHERE url = "'+ url +'"', function(e) {
		
		if(e && e.data && e.data.json){
			callback(e.data.json.word);
		} else {
			callback(null);
		}
    });
};

