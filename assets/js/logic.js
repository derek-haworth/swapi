var movieTitles = [],
      scrawlArray = [];

  $(function() {

    $.ajax({
      url: 'https://swapi.co/api/films',
      method: "GET",
      dataType: "json"
    }).done(function(response) {
        console.log("The force is strong with this API");
        console.log(response.results);
        populateSwapi(response.results);

    }).fail(function(response) {
        console.log("There's a disturbance in the force");
        if (response.statusText === 'error') {
          $('#api-message').removeClass('api-message-error');
        }
    })


    function populateSwapi(results) {
      var $cards = $('#cards');

      results.forEach(function(movie, index, arr) {
        // Add every 2 cards to own container
        if( index % 2 === 0 ) {
          $div = $('<div />', {
            class: 'col-md-4'
          }).appendTo($cards);

          $div2 = $('<div />', {
            class: 'card-container'
          }).appendTo($div);

        }
        // add each movie title into array
        movieTitles.push(movie.title);

        //take movie titles and remove spaces to use for image paths
        var spacedTitle = movie.title;
        var closedTitle = spacedTitle.replace(/\s/g, '');
        $imageDiv = $('<div />', {
          class: 'movie-poster',
        }).appendTo($div2);

        $('<img />', {
          src: "assets/images/" + closedTitle.toLowerCase() + ".jpg"
        }).appendTo($imageDiv);

        $('<div />', {
          class: 'movie-title',
          text: movie.title
        }).appendTo($div2);

        $('<div />', {
          class: 'movie-director',
          text: "Director: " + movie.director
        }).appendTo($div2);

        var words = countWords(movie.opening_crawl);
        scrawlArray.push(words);


        for (var i = 0; i < movie.characters.length; i++) {
          // get only first 3 character links for each film 
          if( i <= 2 ) {
            // prints out the people list of first 3 characters in film > character array
            // console.log(movie.characters[i]);
            $.getJSON(movie.characters[i], function(data) {
              // prints out the character NAME of first 3 characters people list objects
              // console.log(data.name);
              // Grab names from each json response of characters api and create 
              // a list and append list of 3 to each movie 
            });
          }
        }
      });

      // Add each card in it's own div inside the main card container
      var singleDivs = $("#cards > div > div > div");
      for(var i = 0; i < singleDivs.length; i+=3) {
        singleDivs.slice(i, i+3).wrapAll("<div class='single-card'></div>");
      }

      openingScrawl(movieTitles)

    }

  });


  // Creates chart with movie titles and scrawl count
  function openingScrawl(movieTitles) {
    var ctx = document.getElementById("scrawlChart").getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: movieTitles,
          datasets: [{
              data: scrawlArray,
              backgroundColor: getRandomColor()
          }]
      },
      options: {
        title: {
            display: true,
            text: 'Opening Scrawl Lengths'
        },
        legend: { 
          display: false 
        },
        scales: {
          xAxes: [{
            ticks: {
              autoSkip: false
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Scrawl Length'
            }
          }]
        }
      }
    });
  }

  // Generate random colors for each bar in graph
  // pass function in the openingScrawl backgroundcolor in data options
  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split(''),
        colorArray = [];

    for (var i = 0; i < 7; i++) {
      var color = '#';
      for (var j = 0; j < 6; j++ ) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      colorArray.push(color);
    }
    return colorArray
  }

  function countWords(words) {
    return words.trim().split(/\s+/).length;
  }