/*
 * Author : Fabio Pinto <fabio@mandelbrot.co.za>
 *
 * Description : Javascript which dynamically populates the specific resolution set in CSS with 'pixels' that are really just black images set to size.
 * 		 The pixels are faded to maximum opacity to create the illusion of them revealign the image behind them. 
 * 		 Persistency of the depixelation progress is persisted on server side with some simple PHP.
 *
*/

$(document).ready(function () {

	/*FORMULA for counts below: 

		horizontalResolution / sqaurePixelSize
		verticalResolution / sqaurePixelSize

		eg: 
			648 / 8 = 81
			576 / 8 = 71
	*/

	var countWidth = 81;
	var countHeight = 72;
	var count = countWidth * countHeight;

	//We make an AJAX call to the server to get back a CSV file of pixelIDs.
	var pixelIds = $.ajax({
        	type: "GET",
                async: false,
                url: "php/retrieveProgress.php",
                dataType: "text",
                success : function(data) {
                	return data;
                        }
	});
	
	//Here we check if we have any data returned by our pervios AJAX call.
	//We then either populate a new array with this data or start a fresh array.	
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

	var min = 0;
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
					 }
			});

		//If we have reached tthe total number of pixels we stop the loop
                } else if (ids.length > numPixels) {
                	clearInterval(pixelLoop);

			//We are done, remove the persisted data file
			$.ajax({
                                type: 'POST',
                                url: 'php/persistProgress.php',
                                data: {'done': true}
                        });

                       	//Used for dev and testing the regression of ids. Not for production!
                       	//checkDups();
                        return; 
                }	 

	},1);
}

//The main functions which adds our pixels
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
