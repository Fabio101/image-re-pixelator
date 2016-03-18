<?php

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
