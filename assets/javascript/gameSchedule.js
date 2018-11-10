$(function() {
  var leg = {
    nhl: "2a2875c0-ee7b-48e4-b9b7-cd99f2",
    nfl: "b569ec72-8849-44ac-9f3d-6f515d",
    mlb: "733b2e56-34ff-4972-88db-8e49b0",
    nba: "7bab1d20-fabe-4954-ac75-b73bae"
  };

  var count = 0;
  var news=$("#news");
  var time = "20181104";
  // moment().subtract(1, "days").format("YYYYMMDD");
  function imageScreen(choice,where) {
    var j;

    var sportURL =
      "http://webhose.io/filterWebContent?token=bd9e16a2-fd23-4348-b787-ebea1c7e3aac&format=json&ts=1540846661784&sort=crawled&q=text%3A" +
      choice +
      "%20thread.country%3AUS%20site_category%3Asports%20site_type%3Anews";
    fetch(sportURL)
      .then(resp => resp.json())
      .then(function(response) {
        for (var rowAmount = 0; rowAmount < 2; rowAmount++) {
          j = 3;
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

                  $(where).append(news);
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

  setTimeout(imageScreen("nhl",news), 1001);
  setTimeout(imageScreen("nfl",news), 1001);
  // setTimeout(imageScreen("mlb"), 3001);
  setTimeout(imageScreen("nba",news), 1001);
  // scoreboard=============================================================
  function scoreScreen(api, league) {
    j = 2;
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
      for (var i = 0; i < j; i++) {
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

  // Display league game schedule function - limited to 10 games
  function displayLeagueMatchupInfo(searchKey) {
    var searchKey = searchKey.replace(/\s/g, "-");
    // var queryURL = "https://api.seatgeek.com/2/events?performers.slug="+ searchKey +"&client_id=MTM4MjYzODl8MTU0MTUyOTc1NS42Mg";
    var queryURL =
      "https://api.seatgeek.com/2/events?taxonomies.name=" +
      searchKey +
      "&client_id=MTM4MjYzODl8MTU0MTUyOTc1NS42Mg";

    $.ajax({
      url: queryURL,
      method: "GET",
      error: function(err) {
        console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
      }
    }).done(function(response) {
      var results = response.events;

      $("#matchup-page").empty(); // Clear the page first before showing new data
      if (results == "") {
        $("#matchup-page").html(
          searchKey + ": There is nothing returned from SeatGeek"
        );
      }

      var gameDate = "";
      for (var i = 0; i < results.length; i++) {
        // Game date conversion
        var convertedDate = moment(
          results[i].datetime_local.substr(0, 10),
          "YYYY-MM-DD"
        );
        // Table header construction for different game dates
        if (convertedDate.toString() != gameDate.toString()) {
          gameDate = convertedDate;
          var dTable = $("<table class='day-table'>");
          var sectionHeader = $(
            `<div class='section-header'>${gameDate.format(
              "dddd, MMM D"
            )}</div>`
          );
          var tHead = $("<thead>");
          var trRow = $("<tr>");
          var thMatchupCol = $("<th class='matchup-col-header'>Matchup</th>");
          var thTimeCol = $("<th class='time-col-header'>Time</th>");
          var thTicketsCol = $("<th class='tickets-col-header'>Tickets</th>");
          var tBody = $("<tbody>");

          trRow.append(thMatchupCol, thTimeCol, thTicketsCol);
          tHead.append(trRow);
          dTable.append(tHead);
          $("#matchup-page").append(sectionHeader, dTable);
        }

        var tRow = $("<tr class='league-schedule-row'>");
        var tD1 = $("<td class='matchup-teams'>");
        var spanTeamAway = $("<span class='matchup-team-away'>").text(
          results[i].performers[1].name
        );
        var spanAtSign = $("<span class='at-sign'>").text(" @ ");
        var spanTeamHome = $("<span class='matchup-team-home'>").text(
          results[i].performers[0].name
        );
        tD1.append(spanTeamAway, spanAtSign, spanTeamHome);
        var convertedTime = moment(
          results[i].datetime_local.substr(11, 8),
          "HH:mm:ss"
        );
        var gameTime = convertedTime.format("LT");
        var tD2 = $(`<td><div class='matchup-time'>${gameTime} ET</div></td>`);
        var tD3 = $(
          `<td><a class="matchup-tickets" target='_blank' href=${
            results[i].url
          }>Buy Tickets</a></td>`
        );

        tRow.append(tD1, tD2, tD3);
        tBody.append(tRow);
        dTable.append(tBody);
      }
    });
  }

  // Display team game schedule function - limited to 10 games
  function displayTeamMatchupInfo(searchKey) {
    var searchKey = searchKey.replace(/\s/g, "-");
    var queryURL =
      "https://api.seatgeek.com/2/events?performers.slug=" +
      searchKey +
      "&client_id=MTM4MjYzODl8MTU0MTUyOTc1NS42Mg";
    // var queryURL = "https://api.seatgeek.com/2/events?taxonomies.name="+ searchKey +"&client_id=MTM4MjYzODl8MTU0MTUyOTc1NS42Mg";

    $.ajax({
      url: queryURL,
      method: "GET",
      error: function(err) {
        console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
      }
    }).done(function(response) {
      var results = response.events;

      $("#matchup-page").empty(); // Clear the page first before showing new data
      if (results == "") {
        $("#matchup-page").html(
          searchKey + ": There is no such team returned from SeatGeek"
        );
      }

      var gameDate = "";
      for (var i = 0; i < results.length; i++) {
        // Game date conversion
        var convertedDate = moment(
          results[i].datetime_local.substr(0, 10),
          "YYYY-MM-DD"
        );
        // Table header construction for different game dates
        if (convertedDate.toString() != gameDate.toString()) {
          gameDate = convertedDate;
          var dTable = $("<table class='day-table'>");
          var sectionHeader = $(
            `<div class='section-header'>${gameDate.format(
              "dddd, MMM D"
            )}</div>`
          );
          var tHead = $("<thead>");
          var trRow = $("<tr>");
          var thMatchupCol = $("<th class='matchup-col-header'>Matchup</th>");
          var thTimeCol = $("<th class='time-col-header'>Time</th>");
          var thTicketsCol = $("<th class='tickets-col-header'>Tickets</th>");
          var tBody = $("<tbody>");

          trRow.append(thMatchupCol, thTimeCol, thTicketsCol);
          tHead.append(trRow);
          dTable.append(tHead);
          $("#matchup-page").append(sectionHeader, dTable);
        }

        var tRow = $("<tr class='league-schedule-row'>");
        var tD1 = $("<td class='matchup-teams'>");
        var spanTeamAway = $("<span class='matchup-team-away'>").text(
          results[i].performers[1].name
        );
        var spanAtSign = $("<span class='at-sign'>").text(" @ ");
        var spanTeamHome = $("<span class='matchup-team-home'>").text(
          results[i].performers[0].name
        );
        tD1.append(spanTeamAway, spanAtSign, spanTeamHome);
        var convertedTime = moment(
          results[i].datetime_local.substr(11, 8),
          "HH:mm:ss"
        );
        var gameTime = convertedTime.format("LT");
        var tD2 = $(`<td><div class='matchup-time'>${gameTime} ET</div></td>`);
        var tD3 = $(
          `<td><a target='_blank' href=${results[i].url}>Buy Tickets</a></td>`
        );

        tRow.append(tD1, tD2, tD3);
        tBody.append(tRow);
        dTable.append(tBody);
      }
      $("#search-input").val("");
    });
  }

  // League search
  $(".main-btn").on("click", "[data-league='league']", function() {
    var league = $(this).attr("id");
    var where=$("#leagueNews");

    console.log("League: " + league); //debug and testing

    $("#news").addClass("hide");
    $("[data-tab='tabSchedule']").removeClass("hide");
    $("[data-tab='tabScore']").removeClass("hide");
    $("[data-tab='tabNews']").removeClass("hide");
    $("#searchedPages").removeClass("hide");
    $("#score").addClass("hide");
    $("#leagueNews").empty();
    $("#leagueNews").addClass("hide");
    
    $("#score").empty();
    displayLeagueMatchupInfo(league);
    scoreScreen(leg[league], league);
    setTimeout(imageScreen(league,where),2000);
  });

  $(document).on("click", "#home", function(e) {
    e.preventDefault();
    $("#news").removeClass("hide");
    $("[data-tab='tabSchedule']").addClass("hide");
    $("[data-tab='tabScore']").addClass("hide");
    $("#searchedPages").addClass("hide");
    $("#score").empty();
    $("#leagueNews").empty();
  });

  $(document).on("click", '[data-tab="tabScore"]', function(e) {
    e.preventDefault();
    $("#searchedPages").addClass("hide");
    $("#score").removeClass("hide");
    $("#leagueNews").addClass("hide");
  });
  $(document).on("click", '[data-tab="tabSchedule"]', function(e) {
    e.preventDefault();
    $("#score").addClass("hide");
    $("#searchedPages").removeClass("hide");
    $("#leagueNews").addClass("hide");
  });
  $(document).on("click", '[data-tab="tabNews"]', function(e) {
    e.preventDefault();
    $("#score").addClass("hide");
    $("#searchedPages").addClass("hide");
    $("#leagueNews").removeClass("hide");
  });

  // Team Search by clicking enter
  $("#search-input").keypress(function(e) {
    if (e.which == "13") {
      var teamName = $("#search-input")
        .val()
        .trim();
      if (teamName != "") {
        displayTeamMatchupInfo(teamName);
      } else alert("You have to enter a team name for searching!");
    }
  });

  // Team search by clicking submit
  $("#search-submit").on("click", function() {
    var teamName = $("#search-input")
      .val()
      .trim();
    if (teamName != "") {
      displayTeamMatchupInfo(teamName);
    } else alert("You have to enter a team name for searching!");
  });
});
