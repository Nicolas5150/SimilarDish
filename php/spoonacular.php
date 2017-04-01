<?PHP
  // Take the url created in the dish.js func spoonacularResults(ingredientURL).
  $ingredientURL = $_POST["ingredientURL"];
  // echo $ingredientURL;

  // These code snippets use an open-source library. http://unirest.io/php
  require_once 'Unirest.php';
  $response = Unirest\Request::get($ingredientURL,
    array(
      "X-Mashape-Key" => "D6UUjKWZNMmshSIoQbjYfAgFSGTop1i9Iu2jsnuQ8xk7AmUwY5",
      "Accept" => "application/json"
    )
  );

  // Return the json file to function spoonacularResults(ingredientURL);
  echo json_encode($response->body, JSON_UNESCAPED_SLASHES);
?>
