$(document).ready(function () {

	/*FORMULA for counts below: 

		horizontalResolution / sqaurePixelSize
		verticalResolution / sqaurePixelSize

		eg: 
			648 / 6 = 108
			576 / 6 = 96
	*/

	var countWidth = 108;
	var countHeight = 96;
	var count = countWidth * countHeight;

	//Echo the number of 'pixels' to console incase you need this value later
	console.log(count);

	var pixelIds = $.ajax({
        	type: "GET",
                async: false,
                url: "php/retrieveProgress.php",
                dataType: "text",
                success : function(data) {
                	return data;
                        }
	});
		
	if (pixelIds.responseText != 0) {
                var ids = pixelIds.responseText.split(',');
		createPixels(count)

                for (x=0; x < ids.length; x++) {
                	$('#' + ids[x]).css('opacity', 0).fadeTo(100, 0);
                }

	} else {
        	var ids = [];
		createPixels(count);
        }

	//Now load the hidden image from GET parameter...
	window.location.search.substr(1).split('&').forEach( function (image) {
		$('#main').attr('src', 'img/' + image);
	});
	reveal(ids);
});

function reveal(ids) {

	var min = 1;
	var numPixels = $('.pixel').length;

	//Main reveal loop
        var pixelLoop = setInterval( function() {

		//Get the random and unique (and never duplicated) id number of each pixel id 
                var pixelId = Math.floor(Math.random() * ((numPixels-min)+1) + min);

		//if the pixel id does not exist in our id array, we enter it into the array and fade to zero opacity o nthat pixel div
                if (ids.indexOf(pixelId) == -1) {
                	ids.push(pixelId);
                        $('#' + pixelId).css('opacity', 0).fadeTo(100, 0);

			//Lets save this data to the server...
			$.ajax({
				type: 'POST',
				url: 'php/persistProgress.php',
				data: {'pixels': ids},
				success: function(data, textStatus, jqXHR) {
						console.log("Wrote Pixel Progress to Server: " + data);
					 },
				error: function(jqXHR, textStatus, errorThrown) {
						console.log("Something failed when writing Pixel Progress to Server: " + errorThrown);
					 },
			});

		//If we have reached tthe total number of pixels we stop the loop
                } else if (ids.length == numPixels) {
                	clearInterval(pixelLoop);
                       	//Used for dev and testing the regression of ids. Not for production!
                       	//checkDups();
                        return; 
                }	 

	},10);
}

function createPixels(count) {
	for (i=0; i < count; i++) {
        	var div = $('<img id='+ i +' class="pixel "src="img/black.jpg">');
                div.html();
                div.appendTo(document.body);
        }
}

//NOT FOR PRODUCTION!
function checkDups() {

	var sorted_ids = ids.slice().sort();
        var results = [];
		
	//Used this funciton during dev to verify that no duplicate pixels were duplicated in our reveal function.
        for (var i = 0; i < ids.length - 1; i++) {
        	if (sorted_ids[i + 1] == sorted_ids[i]) {
                	results.push(sorted_ids[i]);
                }
        }
        alert(results);
}
