<?php
	$time = time();
	$now = date("H:i:s", $time);

	$endTime = "13:50:00";

	$diff = strtotime($endTime) - strtotime($now);
	echo intval($diff * 1000 / 4608, 10);
?>
