<?php

/*
 * Author : Fabio Pinto <fabio@mandelbrot.co.za>
 *
 * Description : Simple PHP to handle POST data sent from pixels.js
 * 		 We either create a new file and enter the data to that file
 *		 OR we simple create a new empty file when we are done.
 *
*/

session_start();

//Write to a local file in a simple comma delimited format.
if ( $_POST["pixels"] ) {
	$_SESSION['ids'] = implode(',', $_POST["pixels"]);
}

//When you get this, we remove the CSV file so that we can start again.
if ( $_POST["done"] == true) {
	$_SESSION['ids'] = '';
}
?>
