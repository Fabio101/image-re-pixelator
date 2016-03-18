<?php
	if ( $_POST["pixels"] ) {
		$file = fopen('progress.csv', 'w+');
		fputcsv($file, $_POST["pixels"], ',');
	}
?>
