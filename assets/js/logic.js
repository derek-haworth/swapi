  var people = {};
  var peopleArr = [];

  // Anonymous function to trigger our requests
  $(function() {
      for (var i = 1; i < 10; i++) {
        (function(alpha) {
          var j = alpha;
          $.ajax({
            url: 'https://swapi.co/api/people/?page=' + j,
            method: "GET",
            async: true,
            dataType: "json"
          }).done(function(response) {
              for (var k = 0; k < response.results.length; k++) {
                (function(beta) {
                  var str = response.results[beta].url; 
                  var res = str.slice(28, 31);
                  var x = parseInt(res);
                  people[x] = response.results[beta].name;
                })(k);
              }
          }).fail(function(response) {
              console.log("There's a disturbance in the force");
              if (response.statusText === 'error') {
                $('#api-message').removeClass('api-message-error');
              }
          })
        })(i);
      }
      peopleArr.push(people);
      console.log(people);

      $.ajax({
        url: 'https://swapi.co/api/films',
        method: "GET",
        async: true,
        dataType: "json"
      }).done(function(response) {
          console.log("The force is strong with this API");
          console.log(response.results);
          theForce.populateSwapi(response.results);
      }).fail(function(response) {
          console.log("There's a disturbance in the force");
          if (response.statusText === 'error') {
            $('#api-message').removeClass('api-message-error');
          }
      })
  });

  // Main Object with methods to create movie cards and populate graph
  var theForce = {

    movieTitles: [],
    scrawlArray: [],
    populateSwapi: function(results) {
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
        theForce.movieTitles.push(movie.title);

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
      
        // Pass the opening_crawl into the countWords function and push into array
        var words = theForce.countWords(movie.opening_crawl);
        theForce.scrawlArray.push(words);

        // Loop through the characters array in each movie and take slice out the ending number and create to create a unique Id
        for (var i = 0; i < movie.characters.length; i++) {
            (function(omega) {
              var charUrl = movie.characters[omega]; 
              var result = charUrl.slice(28, 31);
              var charId = parseInt(result);
            })(i);
        }
        compare charId to the people object keys gathered from people api request in the people object

      });

      // Add each card in it's own div inside the main card container
      var singleDivs = $("#cards > div > div > div");
      for(var i = 0; i < singleDivs.length; i+=3) {
        singleDivs.slice(i, i+3).wrapAll("<div class='single-card'></div>");
      }

      this.openingScrawl(theForce.movieTitles, theForce.scrawlArray, theForce.getRandomColor())

    },

    // Creates chart with movie titles and scrawl count
    openingScrawl: function(movieTitles, openingWords, colorGraph) {
      var ctx = document.getElementById("scrawlChart").getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: movieTitles,
            datasets: [{
                data: openingWords,
                backgroundColor: colorGraph
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
    },

    // Generate random colors for each bar in graph
    // pass function in the openingScrawl backgroundcolor in data options
    getRandomColor: function() {
      var letters = '0123456789ABCDEF'.split(''),
          colorArray = [];

      for (var i = 0; i < 7; i++) {
        var color = '#';
        for (var j = 0; j < 6; j++ ) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        colorArray.push(color);
      }
      return colorArray;
    }, 

    // Function to use for scrawl count
    countWords: function(words) {
      return words.trim().split(/\s+/).length;
    }

  }
