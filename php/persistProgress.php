<?php
	if ( $_POST["pixels"] ) {
		$file = fopen('progress.csv', 'w+');
		fwrite($file, implode(',', $_POST["pixels"]));
		fclose($file);
	}
?>
