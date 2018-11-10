
// Display league game schedule function - limited to 10 games
function displayLeagueMatchupInfo(searchKey) {
  var searchKey = searchKey.replace(/\s/g, '-');
  // var queryURL = "https://api.seatgeek.com/2/events?performers.slug="+ searchKey +"&client_id=MTM4MjYzODl8MTU0MTUyOTc1NS42Mg";
  var queryURL = "https://api.seatgeek.com/2/events?taxonomies.name="+ searchKey +"&client_id=MTM4MjYzODl8MTU0MTUyOTc1NS42Mg";

  $.ajax({
    url: queryURL,
    method: "GET",
    error: function (err) {
      console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
    }
  })
  .done(function(response) {
    var results = response.events;

    $("#matchup-page").empty(); // Clear the page first before showing new data
    if (results == "") {
      $("#matchup-page").html(searchKey + ": There is nothing returned from SeatGeek");
    }
    
    var gameDate = "";
    for (var i=0; i < results.length; i++) {
      // Game date conversion
      var convertedDate = moment(results[i].datetime_local.substr(0,10), 'YYYY-MM-DD'); 
      // Table header construction for different game dates
      if (convertedDate.toString() != gameDate.toString()) {
        gameDate = convertedDate;
        var dTable = $("<table class='day-table'>");
        var sectionHeader = $(`<div class='section-header'>${gameDate.format("dddd, MMM D")}</div>`);
        var tHead = $("<thead>");
        var trRow = $("<tr>");
        var thMatchupCol = $("<th class='matchup-col-header'>Matchup</th>");
        var thTimeCol = $("<th class='time-col-header'>Time</th>");
        var thTicketsCol = $("<th class='tickets-col-header'>Tickets</th>");
        var tBody = $("<tbody>");

        trRow.append(thMatchupCol,thTimeCol,thTicketsCol);
        tHead.append(trRow);
        dTable.append(tHead);
        $("#matchup-page").append(sectionHeader, dTable);
      }
      
      var tRow = $("<tr class='league-schedule-row'>");
      var tD1 = $("<td class='matchup-teams'>");
      var spanTeamAway = $("<span class='matchup-team-away'>").text(results[i].performers[1].name);
      var spanAtSign = $("<span class='at-sign'>").text(" @ ");
      var spanTeamHome = $("<span class='matchup-team-home'>").text(results[i].performers[0].name);
      tD1.append(spanTeamAway,spanAtSign,spanTeamHome);
      var convertedTime = moment(results[i].datetime_local.substr(11,8), 'HH:mm:ss');
      var gameTime = convertedTime.format("LT");
      var tD2 = $(`<td><div class='matchup-time'>${gameTime} ET</div></td>`);
      var tD3 = $(`<td><a class="matchup-tickets" target='_blank' href=${results[i].url}>Buy Tickets</a></td>`);

      tRow.append(tD1,tD2,tD3);
      tBody.append(tRow);
      dTable.append(tBody);
    }

  });
}

// Display team game schedule function - limited to 10 games
function displayTeamMatchupInfo(searchKey) {
  var searchKey = searchKey.replace(/\s/g, '-');
  var queryURL = "https://api.seatgeek.com/2/events?performers.slug="+ searchKey +"&client_id=MTM4MjYzODl8MTU0MTUyOTc1NS42Mg";
  // var queryURL = "https://api.seatgeek.com/2/events?taxonomies.name="+ searchKey +"&client_id=MTM4MjYzODl8MTU0MTUyOTc1NS42Mg";

  $.ajax({
    url: queryURL,
    method: "GET",
    error: function (err) {
      console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
    }
  })
  .done(function(response) {
    var results = response.events;

    $("#matchup-page").empty(); // Clear the page first before showing new data
    if (results == "") {
      $("#matchup-page").html(searchKey + ": There is no such team returned from SeatGeek");
    }
    
    var gameDate = "";
    for (var i=0; i < results.length; i++) {
      // Game date conversion
      var convertedDate = moment(results[i].datetime_local.substr(0,10), 'YYYY-MM-DD'); 
      // Table header construction for different game dates
      if (convertedDate.toString() != gameDate.toString()) {
        gameDate = convertedDate;
        var dTable = $("<table class='day-table'>");
        var sectionHeader = $(`<div class='section-header'>${gameDate.format("dddd, MMM D")}</div>`);
        var tHead = $("<thead>");
        var trRow = $("<tr>");
        var thMatchupCol = $("<th class='matchup-col-header'>Matchup</th>");
        var thTimeCol = $("<th class='time-col-header'>Time</th>");
        var thTicketsCol = $("<th class='tickets-col-header'>Tickets</th>");
        var tBody = $("<tbody>");

        trRow.append(thMatchupCol,thTimeCol,thTicketsCol);
        tHead.append(trRow);
        dTable.append(tHead);
        $("#matchup-page").append(sectionHeader, dTable);
      }
      
      var tRow = $("<tr class='league-schedule-row'>");
      var tD1 = $("<td class='matchup-teams'>");
      var spanTeamAway = $("<span class='matchup-team-away'>").text(results[i].performers[1].name);
      var spanAtSign = $("<span class='at-sign'>").text(" @ ");
      var spanTeamHome = $("<span class='matchup-team-home'>").text(results[i].performers[0].name);
      tD1.append(spanTeamAway,spanAtSign,spanTeamHome);
      var convertedTime = moment(results[i].datetime_local.substr(11,8), 'HH:mm:ss');
      var gameTime = convertedTime.format("LT");
      var tD2 = $(`<td><div class='matchup-time'>${gameTime} ET</div></td>`);
      var tD3 = $(`<td><a target='_blank' href=${results[i].url}>Buy Tickets</a></td>`);

      tRow.append(tD1,tD2,tD3);
      tBody.append(tRow);
      dTable.append(tBody);
    }
    $('#search-input').val('');
  });
}

// League search
$(".main-btn").on("click", ".list-inline-item", function() {
  var league = $(this).attr("id");
  console.log ("League: " + league); //debug and testing
  displayLeagueMatchupInfo(league); 
});

// Team Search
$('#search-input').keypress(function (e) {
  if (e.which == '13') {
    var teamName = $('#search-input').val().trim();
    if (teamName != "") {
      displayTeamMatchupInfo(teamName);
    } else
    alert("You have to enter a team name for searching!");
  }
});