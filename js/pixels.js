/*
 * Author : Fabio Pinto <fabio@mandelbrot.co.za>
 *
 * Description : Javascript which dynamically populates the specific resolution set in CSS with 'pixels' that are really just black images set to size.
 * 		 The pixels are faded to maximum opacity to create the illusion of them revealing the image behind them. 
 * 		 Persistency of the depixelation progress is persisted on server side with some simple PHP.
 *
*/

$(document).ready(function () {

	var interval = $.ajax({
        type: "GET",
        async: false,
        url: "php/timeKeeper.php",
        dataType: "text",
        success : function(data) {
            return data;
        }
    });

	console.log("Interval in milliseconds: " + interval.responseText);

	/*FORMULA for counts below: 

		horizontalResolution / sqaurePixelSize
		verticalResolution / sqaurePixelSize

		eg: 
			648 / 10 = 81
			576 / 10 = 71
	*/

	var countWidth = 72;
	var countHeight = 64;
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

	var pixelAvailableIds = $.ajax({
    	type: "GET",
        async: false,
        url: "php/retrieveProgress2.php",
        dataType: "text",
        success : function(data) {
        	return data;
        }
	});	

	//Here we check if we have any data returned by our pervios AJAX call.
	//We then either populate a new array with this data or start a fresh array.	
	if (pixelIds.responseText != '') {	

        var ids = pixelIds.responseText.split(',');
        var ids2 = pixelAvailableIds.responseText.split(',');

		for (a in ids) {
			ids[a] = parseInt(ids[a], 10);
		}

		for (b in ids2) {
			ids2[b] = parseInt(ids2[b], 10);
		}		

		createPixels(count, function() {
			persistProgress(function() {reveal(ids, interval.responseText, ids2) });

			function persistProgress(callback1) {
				for (x=0; x < ids.length; x++) {
                        		$('#' + ids[x]).css('opacity', 0).fadeTo(100, 0);
                        	}
                callback1();
			}
		});

	} else {

    	var ids = [];
		// Initalize and populate an extra array to keep track of unused pixels
		//var N = count; 
		//var ids2 = Array.apply(null, {length: N}).map(Number.call, Number);	
		var ids2 = range(0, count-1);	
console.log(count);
console.log(ids2.length);		
		ids2 = _.shuffle(ids2);
		createPixels(count, function () {reveal(ids, interval.responseText, ids2)} );

    }

	//Now load the hidden image from GET parameter...
	window.location.search.substr(1).split('&').forEach( function (image) {
		$('#main').attr('src', 'img/' + image);
	});
});

function reveal(ids, interval, ids2) {

	var min = 0;
	var numPixels = $('.pixel').length;
console.log('Total Number of Pixels = '+numPixels);
	//Main reveal loop
	var pixelLoop = setInterval( function() {

		//Get the random and unique (and never duplicated) id number of each pixel id 
		var random_int = ids2[0];//Math.floor(Math.random()*ids2.length);
		var pixelId = ids2[0];//Math.floor(Math.random() * ((numPixels-min)+1) + min);
	
		ids2.splice(0, 1);		

		//if the pixel id does not exist in our id array, we enter it into the array and fade to zero opacity o nthat pixel div

	    ids.push(pixelId);
	    $('#' + pixelId).css('opacity', 0).fadeTo(100, 0);

		//Lets save this data to the server...
		$.ajax({
			type: 'POST',
			url: 'php/persistProgress.php',
			data: {'pixels': ids, 'available_pixels': ids2},
			async: true,
			success: function(data, textStatus, jqXHR) {
					//console.log("Wrote Pixel Progress to Server: " + textStatus);
			},
			error: function(jqXHR, textStatus, errorThrown) {
					console.log("Something failed when writing Pixel Progress to Server: " + errorThrown);
			}
		});

		//If we have reached tthe total number of pixels we stop the loop
		
		if (ids.length > (numPixels)) {
console.log('ids total length = '+ids.length);
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

	}, 1);

}

//The main functions which adds our pixels
function createPixels(count, callback) {

	for (i=0; i < count; i++) {
        	var div = $('<img id='+ i +' class="pixel "src="img/black.jpg">');
                div.html();
                div.appendTo(document.body);

		if (i == count-1) {
			callback();
		} else {
			
		}
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

function range(start, end) {	
    var foo = [];
    for (var i = start; i <= end; i++) {
        foo.push(i);
    }
    return foo;

}