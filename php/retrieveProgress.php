<?php
/*
 * Author : Fabio Pinto <fabio@mandelbrot.co.za>
 *
 * Description : Simple PHP which really simply returns the data of progress.csv
 * 		 when pixels.js calls it.
 *
*/

if (file_exists("progress.csv") == true) {
	$file = fopen("progress.csv","r");
		while(!feof($file)) {
			echo fgets($file);
		}
	fclose($file);
	} else {
		echo 0;
	}
?>
