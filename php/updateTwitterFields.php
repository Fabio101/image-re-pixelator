<?php
    $stringData = $_POST['twitter_feed']; 
    file_put_contents('twitterModeratedFields.json', $stringData);
?>