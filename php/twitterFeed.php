<?php
require_once('../lib/twitter-api-php/TwitterAPIExchange.php');

$settings = array(
    'oauth_access_token' => "712160414667284480-QqfoNH1b0Vp7nzQ6R0UvVYD0jaoDPk9",
    'oauth_access_token_secret' => "9wdOACqTdHJnibc0IWgp0T8FFqWavBEflTn3R7Bn8PM7W",
    'consumer_key' => "5KRqCkW3itGOWsrYmV2l3Cngt",
    'consumer_secret' => "H8D4axG4eST3qlfvpRRqye6Y8HRIdpSISWMA2kQBobYnkKayxB"
);

$url = "https://api.twitter.com/1.1/search/tweets.json";
$requestMethod = 'GET';
$getfield = '?q=#baseball&result_type=recent';

$twitter = new TwitterAPIExchange($settings);
echo $twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest();

?>
