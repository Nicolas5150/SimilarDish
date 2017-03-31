<?PHP
// Take the url created in the dish.js func spoonacularResults(indgredientURL).
$indgredientURL = $_POST["indgredientURL"];

// These code snippets use an open-source library. http://unirest.io/php
require_once 'Unirest.php';
$response = Unirest\Request::get($indgredientURL,
  array(
    "X-Mashape-Key" => "D6UUjKWZNMmshSIoQbjYfAgFSGTop1i9Iu2jsnuQ8xk7AmUwY5",
    "Accept" => "application/json"
  )
);

  // Return the json file to function spoonacularResults(indgredientURL);
  echo json_encode($response->body, JSON_UNESCAPED_SLASHES);

?>
