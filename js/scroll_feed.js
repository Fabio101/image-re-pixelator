$.getJSON("php/twitterModeratedFields.json", function(twitter_feed) {
	var feed = "";
    twitter_feed.forEach(function(entry, key){ 
    	if (entry.moderated == 1) {
    		someText = entry.text.replace(/(\r\n|\n|\r)/gm,"");
    		feed += '<span class="tweet">' + someText + '&nbsp@' + entry.screen_name + '</span>&nbsp&nbsp&nbsp';
    	}
  	
    	if (twitter_feed.length-1 == key) {
    		$(".scroll-left p").html(feed);  		
    	}
    });
});