<?php
$msg = "";
// upload button pressed
if (isset($_POST['upload'])) {
  // path to the image in the database.
  $target = 'images/'.basename($_FILES['image']['name']);
  echo $target;

  // quick connection to db.
  $connection = mysqli_connect("sulley.cah.ucf.edu", "ni927795", "Iluvdeb13#", "ni927795");

  // get the image out of the form database
  $image = $_FILES['image']['name'];
  echo $image;

  // construct execution of image upload to server.
  $sql = "INSERT INTO SimilarDish (image) VALUES ('$image')";
  mysqli_query($connection, $sql);

  // move the uploaded file to the images directory.
  // Report error if unsuccessful
  if (move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
    $msg = "Image uploaded";
  }
  else {
    $msg = "Error on upload";
  }
  echo $msg;
}
 ?>

<!DOCTYPE html>
<html>
<head>
  <title> Similar Dish </title>
</head>
<body>
  <div id="content">
    <form method="post" action="index.php" enctype="multipart/form-data">
      <input type="hidden" name="size" value="100000">
      <div>
        <input type="file" name="image">
      </div>
      <div>
        <input type="submit" name="upload" value="Upload Image">
      </div>
    </form>
  </div>
</body>
</html>
