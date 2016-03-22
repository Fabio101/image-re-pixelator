$.getJSON("php/twitterFields.json", function(twitter_feed) {
    twitter_feed.forEach(function(entry, key){   	
    	$(".collection").append('<li id="' + key + '" class="collection-item avatar"><img src="' + entry.profile_image_url + '" alt="" class="circle"><span class="title">' + entry.user  + '</span>&nbsp&nbsp&nbsp<span class="screen_name">@' + entry.screen_name + '</span><br /><p>' + entry.text + '</p><div class="switch" id="switch' + key + '"><label>Off<input type="checkbox"><span class="lever"></span>On</label></div></li>');
    });

    $(".submit_tweets").click(function(e) {
		var items = $(".collection li");

		items.each(function(idx, li) {
		    var item = $(li);
		    var item_id = item[0].id;
			twitter_feed[item_id].moderated = $("#switch" + item_id + ".switch label input:checked").length;		    		    
		});

		$.ajax({
		    type: "POST",
		    url: "php/updateTwitterFields.php",
		    data: { "twitter_feed": JSON.stringify(twitter_feed) },
		    cache: false,
		    success: function()
		        {
		            alert("Saved");
		        }
		    });
	});
});