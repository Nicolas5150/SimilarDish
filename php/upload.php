<?php
$msg = "";
  // path to the image in the database.
  $target = '../images/'.basename($_FILES['image']['name']);

  // quick connection to db.
  $connection = mysqli_connect("sulley.cah.ucf.edu", "ni927795", "Iluvdeb13#", "ni927795");

  // get the image out of the form database
  $image = $_FILES['image']['name'];


  //construct execution of image upload to server.
  $sql = "INSERT INTO SimilarDish (image) VALUES ('$image')";
  mysqli_query($connection, $sql);

  // move the uploaded file to the images directory.
  // Report error if unsuccessful
  if (move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
    $msg = $target;
  }
  else {
    $msg = "Error on upload";
  }

  echo $target;
 ?>
