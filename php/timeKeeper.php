<?php
	$time = time();
	$now = date("H:i:s", $time);

	$endTime = "00:15:00";

	$diff = strtotime($endTime) - strtotime($now);
	
	if ($diff <= '0') {
		echo '0';
	} else {
		echo intval($diff * 1000 / 4608, 10);
	}
?>
