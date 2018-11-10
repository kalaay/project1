$(function() {
  var apiKey_NHL = "2a2875c0-ee7b-48e4-b9b7-cd99f2";
  var apiKey_NFL = "b569ec72-8849-44ac-9f3d-6f515d";
  var apiKey_MLB = "733b2e56-34ff-4972-88db-8e49b0";
  var apiKey_NBA = "7bab1d20-fabe-4954-ac75-b73bae";
  var league = ["nhl", "nfl", "mlb", "nba"];
  var count = 0;
  var time = moment()
    .subtract(10, "days")
    .format("YYYYMMDD");

  function UrlExists(url) {
    try {
      var http = new XMLHttpRequest();
      http.open("HEAD", url, false);
      http.send();
      return http.status != 404;
    } catch (err) {
      return false;
    }
  }

  // function requestJSON(url, callback) {
  //   $.ajax({
  //     url: url,
  //     complete: function(xhr) {
  //       callback.call(null, xhr.responseJSON);
  //     }
  //   });
  // }
  // var requri="https://github.com/jimniels/teamcolors";

  // requestJSON(requri, function(json) {
  //   console.log(json);
  // });

  // get from API and add giphs and posters to the main screen
  function imageScreen(choice) {
    var j;

    var sportURL =
      "http://webhose.io/filterWebContent?token=bd9e16a2-fd23-4348-b787-ebea1c7e3aac&format=json&ts=1540846661784&sort=crawled&q=text%3A" +
      choice +
      "%20thread.country%3AUS%20site_category%3Asports%20site_type%3Anews";

    // $.ajax({
    //   url: sportURL,
    //   method: "GET"
    // }).then(function(response) {
    //   for (var i = 0; i < j; i++) {
    //     if (response.posts[i].thread.main_image != "") {
    //       if (response.posts[i].language == "english") {
    //         var news = $(
    //           '<div class="news-post-holder"><div class="news-post-widget"><img class="img-responsive" src="' +
    //             response.posts[i].thread.main_image +
    //             '" alt=""><div class="news-post-detail"><span class="date">' +
    //             moment(response.posts[i].thread.published).format(
    //               "MMM Do YYYY"
    //             ) +
    //             '</span><h2><a href="' +
    //             response.posts[i].thread.url +
    //             '">' +
    //             response.posts[i].thread.section_title +
    //             "</a></h2><p>" +
    //             response.posts[i].thread.title +
    //             "</p></div></div></div>"
    //         );

    // +++++++++++++++++++++++++++++++++++++++++++++++
    fetch(sportURL)
      .then(resp => resp.json())
      .then(function(response) {
        for (var rowAmount = 0; rowAmount < 2; rowAmount++) {
          j = 2;
          for (var colAmount = 0; colAmount < j; colAmount++) {
            if (response.posts[count].thread.main_image != "") {
              if (response.posts[count].language == "english") {
                if (response.posts[count].thread.section_title != "") {
                  var news = $(
                    '<div class="news-post-holder col-4"><img class="img-responsive" src="' +
                      response.posts[count].thread.main_image +
                      '" alt=""><div class="news-post-detail"><span class="date">' +
                      moment(response.posts[count].thread.published).format(
                        "MMM Do YYYY"
                      ) +
                      '</span><h2><a href="' +
                      response.posts[count].thread.url +
                      '">' +
                      response.posts[count].thread.section_title +
                      "</a></h2><p>" +
                      response.posts[count].thread.title +
                      "</p></div></div>"
                  );

                  $("#news").append(news);
                } else {
                  j++;
                }
              } else {
                j++;
              }
            } else {
              j++;
            }
            count++;
          }
        }
        // }
      });
  }

  setTimeout(imageScreen("nhl"), 1001);
  setTimeout(imageScreen("nfl"), 2001);
  setTimeout(imageScreen("mlb"), 3001);
  //   setTimeout(imageScreen("nba"), 5001);

  // when additional button pressed add new img
  //   $(document).on("click", "#nhl", function(e) {
  //     e.preventDefault();
  //     var choice = $(this).attr("data-nhl");
  //     var count = 0;
  //     for (var i = 0; i < 2; i++) {
  //       imageScreen(choice, count);
  //       count++;
  //     }
  //   });

  // +++=====================================================================

  // get from API and add giphs and posters to the main screen
  function scoreScreen(api, league) {
    // choice = choice.split(" ").join("-");

    var password = "tanakan13";
    var sportURL =
      "https://api.mysportsfeeds.com/v1.0/pull/" +
      league +
      "/2018-regular/scoreboard.json?fordate=" +
      time +
      "";

    $.ajax({
      url: sportURL,
      method: "GET",
      dataType: "json",
      async: false,
      headers: {
        Authorization: "Basic " + btoa(api + ":" + password)
      }
    }).then(function(response) {
      for (var i = 0; i < 5; i++) {
        
   
        var score =
        "<div id='block'><p class='pricing-title' id='date'>" +
          moment(response.scoreboard.gameScore[i].game.date).format("MMM Do") +
          "</p><p class='pricing-rate' ><span>" +
          response.scoreboard.gameScore[i].game.awayTeam.Abbreviation +
          "</span><br><span>" +
          response.scoreboard.gameScore[i].awayScore +
          "</span> VS<span>" +
          response.scoreboard.gameScore[i].homeScore +
          "</span><br><span>" +
          response.scoreboard.gameScore[i].game.homeTeam.Abbreviation +
          "</span></p></div>";
        

        $("#score").append(score);
      }
    });
    // ++++++++==========================================
  }
  //

  $(document).on("click", "#home", function(e) {
    e.preventDefault();
    $("#news").removeClass("hide");
    $('[data-tab="tab"]').addClass("hide");
  });

  $(document).on("click", "[data-league='league']", function(e) {
    e.preventDefault();
    $("#news").addClass("hide");
    $('[data-tab="tab"]').removeClass("hide");
  });

  $(document).on("click", '[data-tab="tab"]', function(e) {
    e.preventDefault();
    scoreScreen(apiKey_NBA, league[3]);
  });

  // when additional button pressed add new img
  //   $(document).on("click", "#nhl", function(e) {
  //     e.preventDefault();
  //     var choice = $(this).attr("data-nhl");
  //     var count = 0;
  //     // for (var i = 0; i < 2; i++) {
  //     // imageScreen(choice, count, apiKey_NHL, league[0]);
  //     // imageScreen(choice, count, apiKey_NFL, league[1]);
  //     // imageScreen(choice, count, apiKey_MLB, league[2]);
  //     scoreScreen(choice, count, apiKey_NBA, league[3]);
  //     count++;
  //     // }
  //   });
});
