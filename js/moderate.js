var cache_nuker = Math.floor((Math.random() * 1000) + 1);

$.getJSON("php/twitterFields.json?" + cache_nuker, function(twitter_feed) {
    twitter_feed.forEach(function(entry, key){   	
    	$(".collection").append('<li id="' + key + '" class="collection-item avatar"><img src="' + entry.profile_image_url + '" alt="" class="circle"><span class="title">' + entry.user  + '</span>&nbsp&nbsp&nbsp<span class="screen_name">@' + entry.screen_name + '</span><br /><p>' + entry.text + '</p><div class="switch" id="switch' + key + '"><label>Off<input type="checkbox"><span class="lever"></span>On</label></div></li>');
    });

    $(".submit_tweets").click(function(e) {
		var items = $(".collection li");

		var moderated_feed = new Array();
		items.each(function(idx, li) {
		    var item = $(li);
		    var item_id = item[0].id;
			twitter_feed[item_id].moderated = $("#switch" + item_id + ".switch label input:checked").length;
			if (twitter_feed[item_id].moderated == 1) {
				moderated_feed.push(twitter_feed[item_id]);
			}
		});

		$.ajax({
		    type: "POST",
		    url: "php/updateTwitterFields.php",
		    data: { "twitter_feed": JSON.stringify(moderated_feed) },
		    cache: false,
		    success: function()
		        {
		            alert("Saved");
		        }
		    });
	});
});