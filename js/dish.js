$(document).ready(function() {

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
    app.models.predict("bd367be194cf45149e75f01d59f77ba7", url).then(
      function(response) {

        // Obtain only the json responce ingredients that have a probability value
        // of .85% or more and add to an array - this will be passed to Spoonacular.
        var accuratePass = [];
        var currentItem;
        var indgredientURL = '';
        for (var i = 0; i < response.outputs[0].data.concepts.length; i++) {
          if (response.outputs[0].data.concepts[i].value >= .85) {
            // Strip any spaces from the passed ingredient name.
            currentItem = response.outputs[0].data.concepts[i].name;
            $( "#ingredients" ).append( "<span class=\'ingredient\'>"+currentItem+"</span>" );
            currentItem = currentItem.replace(/\s+/g, '');
            // append a % for the query string to all ingredients.
            currentItem += '%';
            indgredientURL += currentItem;
          }

          // We've gone to either the end or one past the last possible item to add.
          // Rempove the last % that was appended, then break the loop.
          else {
            indgredientURL = indgredientURL.substring(0, indgredientURL.length - 1);
            break;
          }
        }

        // Prep for the fucntion call passing in the query string that will
        // eventually make its way over to the Spoonacular API call.
        indgredientURL = 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=true&ingredients='+indgredientURL+'&limitLicense=false&number=5&ranking=1';
        spoonacularResults(indgredientURL);

      },

      function(err) {
        alert(error);
      }
    );
  }

  // https://market.mashape.com/spoonacular/recipe-food-nutrition
  // String together the url query (indgredientURL) that will be passed to php call.
  // There it will request a call to the API using the passed in query String
  // Will return the top 10 (if possible) recipes as a Json file.
  function spoonacularResults(indgredientURL) {
    // Smoths scroll to the results section that will be populated.
    $('html, body').animate({ scrollTop:$("#results").offset().top}, 500);
    // $.ajax({
    //   type: "POST",
    //   url: "http://sulley.cah.ucf.edu/~ni927795/SimilarDish/php/spoonacular.php",
    //   data: ({indgredientURL: indgredientURL}),
    //   success: function(data) {
    //     alert("its " +data);
    //
    //     // Parse the encoded data from the php call.
    //     var relatedMeals = jQuery.parseJSON(data);
    //     alert(relatedMeals[0].title);
    //     // With the valid data we can now append all the content to the screen.
    //
    //   }
    // });
  }


  $(".clickable").click(function() {
    var name =  $(this).attr("id");
    window.location = $(this).find("a").attr("href");
    alert(name);
  });

});
