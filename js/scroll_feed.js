var cache_nuker = Math.floor((Math.random() * 1000) + 1);

$.getJSON("php/twitterModeratedFields.json?" + cache_nuker, function(twitter_feed) {
	var cached_tweet = (Cookies.get("current_tweet") == undefined ? 0 : Cookies.get("current_tweet"));	
	someText = twitter_feed[cached_tweet].text.replace(/(\r\n|\n|\r)/gm,"");
	$(".scroll-left p").html('<span class="tweet" id="' + cached_tweet + '">' + someText + '&nbsp@' + twitter_feed[cached_tweet] + '</span>&nbsp&nbsp&nbsp');

    setInterval(changeItem, 3000);

	function changeItem() {
		var current_tweet = parseInt($(".scroll-left p span").prop('id'));
		if (current_tweet == twitter_feed.length-1) {
			current_tweet = -1;
		}
		
		var next_tweet = current_tweet + 1;

		someText = twitter_feed[next_tweet].text.replace(/(\r\n|\n|\r)/gm,"");
		$(".scroll-left p").fadeOut();
		$(".scroll-left p").html('<span class="tweet" id="' + next_tweet + '">' + someText + '&nbsp@' + twitter_feed[next_tweet] + '</span>&nbsp&nbsp&nbsp');
		$(".scroll-left p").fadeIn();
		Cookies.set("current_tweet", next_tweet+1, { expires: 7 });
	}    
});