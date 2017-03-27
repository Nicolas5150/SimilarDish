$(document).ready(function(){
  $('.modal').modal();

  $('.slider').slider({
   indicators:false,
   full_width: true,
   height:600,
   interval:5000
   });


  // http://stackoverflow.com/questions/24446281/passing-image-using-ajax-to-php
  $('#upload_img').click(function() {
    event.preventDefault();
    var form = new FormData(document.getElementById('img_form'));
    //append files
    var file = document.getElementById('img_name').files[0];
    if (file) {
      form.append('image', file);
    }
    $.ajax({
      type: "POST",
      url: "http://sulley.cah.ucf.edu/~ni927795/SimilarDish/php/upload.php",
      data: form,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data) {
        // Parse together the url for which the image has been uploaded to.
        // This will be given to the clarifi function as a parameter.
        var url = "http://sulley.cah.ucf.edu/~ni927795/SimilarDish/"+data.substring(3);
        clarifi(url);
      }
    });
  });

  // Clarafi API integration.
  // https://developer.clarifai.com/guide/
  function clarifi(url) {
    var app = new Clarifai.App(
      'oeGSK4nllNTS2ThY4JCsrk-6OjIxBg6cmEZpj0Er',
      'CyuNGr-FgpOfkRbyvkvkwYBvc9nwjAo1FZ3m4cLu'
    );

    // Food model.
    // https://developer.clarifai.com/models/bd367be194cf45149e75f01d59f77ba7
    app.models.predict("bd367be194cf45149e75f01d59f77ba7", "https://samples.clarifai.com/food.jpg").then(
      function(response) {
        console.log(response);
      },
      function(err) {
        alert(error);
      }
    );
  }


});
