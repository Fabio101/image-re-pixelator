<?php
	$time = time();
	$now = date("H:i:s", $time);

	$endTime = "20:25:00";

	$diff = strtotime($endTime) - strtotime($now);
	
	echo intval($diff * 1000 / 4608, 10) - 60;
?>
