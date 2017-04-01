$(document).ready(function() {

  $('.modal').modal();

  $('.slider').slider({
   indicators:false,
   full_width: true,
   height:600,
   interval:5000
   });

  // Click listner for when a user hits upload image to which the php function is called.
  // Here the image will go from the local machine to the php db which will be
  // eventually sent to the Clarifi API.
  // http://stackoverflow.com/questions/24446281/passing-image-using-ajax-to-php
  $('#upload_img').click(function() {
    // Prevent a page reload and remove any previous spoonacular results.
    event.preventDefault();
    $('#result_header').show();
    $('#results').show();
    $('.clickable').remove();
    $('.ingredient').remove();

    // Append files
    var form = new FormData(document.getElementById('img_form'));
    var file = document.getElementById('img_name').files[0];
    if (file) {
      form.append('image', file);
    }

    // Send over the image to be uploaded to the server for Clarifi to use url.
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
        spoonacularResults(response);
      },

      // Error handling.
      function(err) {
        alert(error);
      }
    );
  }

  // Spoonacular API integration.
  // https://market.mashape.com/spoonacular/recipe-food-nutrition
  function spoonacularResults(response) {
    // Obtain only the json responce ingredients that have a probability value
    // of .85% or more and add to an array - this will be passed to Spoonacular.
    var accuratePass = [];
    var currentItem;
    var ingredientURL = '';
    for (var i = 0; i < response.outputs[0].data.concepts.length; i++) {
      if (response.outputs[0].data.concepts[i].value >= .85) {
        // Strip any spaces from the passed ingredient name.
        currentItem = response.outputs[0].data.concepts[i].name;
        $( "#ingredients" ).append( "<span class=\'ingredient\'>"+currentItem+"</span>" );
        currentItem = currentItem.replace(/\s+/g, '');
        // append a % for the query string to all ingredients.
        currentItem += '%';
        ingredientURL += currentItem;
      }

      // We've gone to either the end or one past the last possible item to add.
      // Rempove the last % that was appended, then break the loop.
      else {
        ingredientURL = ingredientURL.substring(0, ingredientURL.length - 1);
        break;
      }
    }

    // Prep for the fucntion call passing in the query string that will
    // eventually make its way over to the Spoonacular API call.
    ingredientURL =
      'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com'+
      '/recipes/findByIngredients?fillIngredients=true&ingredients='+ingredientURL+
      '&limitLicense=false&number=20&ranking=1';


    // Smooth scroll to the results section that will be populated.
    $('html, body').animate({ scrollTop:$("#results").offset().top}, 500);

    // Will request a call to the API using the passed in query String and
    // return the top 10 (if possible) recipes as a Json file.
    $.ajax({
      type: "POST",
      url: "http://sulley.cah.ucf.edu/~ni927795/SimilarDish/php/spoonacular.php",
      data: ({ingredientURL: ingredientURL}),
      success: function(data) {

        // Parse the encoded data from the php call.
        var relatedMeals = jQuery.parseJSON(data);
        bulkRecipes(relatedMeals);
      }
    });
  }

  function bulkRecipes(relatedMeals) {
    // Create url that contains all the ids from the related meals JSON passed in
    var mealID;
    var ingredientURL = '';
    for (var i = 0; i < relatedMeals.length; i++) {
      // append a % for the query string to all ids.
      // also append 2C to the begining of all but first id.
      mealID = relatedMeals[i].id;
      mealID += '%';
      if (i != 0) {
        ingredientURL += '2C'+ mealID;
      }
      else {
        ingredientURL += mealID;
      }
    }
    ingredientURL = ingredientURL.substring(0, ingredientURL.length - 1);

    // With the relatedMeals, extract their ids to get a bulk (full description)
    // of all the items in that list.
    // Will use later to get the cooking instructions of that clicked meal.
    ingredientURL =
    'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com'+
    '/recipes/informationBulk?ids='+ingredientURL+
    '&includeNutrition=false';
    alert(ingredientURL);
    $.ajax({
      type: "POST",
      url: "http://sulley.cah.ucf.edu/~ni927795/SimilarDish/php/spoonacular.php",
      data: ({ingredientURL: ingredientURL}),
      success: function(data) {
        alert(data);
        // Parse the encoded data from the php call.
        var bulkRecipes = jQuery.parseJSON(data);
        SimilarDishes(relatedMeals, bulkRecipes);
      }
    });
  }

  function SimilarDishes(relatedMeals, bulkRecipes) {
    // With the valid data we can now append all the content to the screen.
    // On each loop add 1 to the id, this will keep track of what to populate
    // the modal with from the relatedMeals Json later on.
    for (var i = 0; i < relatedMeals.length; i++) {
      var item =
        '<div class=\"cards clickable\" id=\"click_'+i+'\">'+
          '<a href=\"#modal2\"> </a>'+
          '<div class=\"left_img\">'+
            '<img src=\"' +relatedMeals[i].image+ '\"alt=\"food\">'+
          '</div>'+
          '<div class=\"card_info\">'+
              '<p class=\"meal_titles\"><b>'+relatedMeals[i].title+'</b></p>'+
              '<p class=\"mobile_block\"> Time: '+bulkRecipes[i].readyInMinutes+' minutes</p>'+
              '<p class=\"mobile_block\"> Serves: ' +bulkRecipes[i].servings+'</p>'+
          '</div>'+
        '</div>';
      $("#results").append(item);
    }

    // Listen for a click from the clickable class
    $(".clickable").click(function() {

      // Get id of clicked anchor
      // which corresponds to the index pos in the Spoonacular JSON.
      var name =  $(this).attr("id");
      var splitID = name.split('_');
      var arrayPos = splitID[1];

      alert(arrayPos);

      // Insert the title and image of the selcted dish.
      var mealModal =
        '<div class="modal-content container">'+
          '<h4 class=\"center\">'+relatedMeals[arrayPos].title+'</h4>'+
          '<div class=\"centered_div\">'+
          '<img class=\"center_image\" src=\"' +relatedMeals[arrayPos].image+ '\"alt=\"food\">'+
        '</div>';

      // Clear any previous data in the modal and then replace with the new.
      $('#modal2').empty();
      $("#modal2").append(mealModal);

      // List off all ingredients in the dish.
      // First loop is for all ingredients that are missing.
      mealModal =
        '<div class=\"center ingredients_title\"><b>Ingredients:</b></div>'+
        '<div class=\"required_ingredients centered_div\">'+
        '<div>Needed -</div>';
      for (var i = 0; i < relatedMeals[arrayPos].missedIngredients.length; i++) {
        mealModal +=
          '<div>' +relatedMeals[arrayPos].missedIngredients[i].originalString+ '</div>';
      }
      mealModal +=
        '</div><br/>';
      $("#modal2").append(mealModal);

      // Second loop is for all ingredients that were in image.
      mealModal =
        '<div class=\"required_ingredients centered_div\">'+
        '<div>Similar -</div>';
      for (var i = 0; i < relatedMeals[arrayPos].usedIngredients.length; i++) {
        mealModal +=
          '<div>' +relatedMeals[arrayPos].usedIngredients[i].amount+
            ' ' +relatedMeals[arrayPos].usedIngredients[i].unitLong+
            ' of ' +relatedMeals[arrayPos].usedIngredients[i].name+
          '</div>';
      }
      mealModal +=
        '</div><br/><br/>';
      $("#modal2").append(mealModal);

      // Add the food prep instructions.
      //alert(bulkRecipes[0].analyzedInstructions[0].steps[0].step);
      // List off all ingredients in the dish.
      // First loop is for all ingredients that are missing.
      mealModal =
        '<div class=\"center ingredients_title\"><b>Steps:</b></div>'+
        '<div class=\"required_ingredients centered_div\">';
      if ('steps' in bulkRecipes[arrayPos].analyzedInstructions[0])
      for (var i = 0; i < bulkRecipes[arrayPos].analyzedInstructions[0].steps.length; i++) {
        mealModal +=
          '<div><span class=\"step_number\">'+(i+1)+'</span>' +bulkRecipes[arrayPos].analyzedInstructions[0].steps[i].step+ '</div>';
      }
      mealModal +=
        '</div><br/>';
      $("#modal2").append(mealModal);
    });
  }

});
