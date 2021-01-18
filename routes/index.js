let express = require("express");
let router = express.Router();
let nodeFetch = require("node-fetch");
let moment = require('moment-timezone')

const logos = new Map([
  ["ATL", "/logos/ATL.png"],
  ["BOS", "/logos/BOS.png"],
  ["BKN", "logos/BKN.png"],
  ["CHA", "/logos/CHA.png"],
  ["CHI", "/logos/CHI.png"],
  ["CLE", "/logos/CLE.png"],
  ["DAL", "/logos/DAL.png"],
  ["DEN", "/logos/DEN.png"],
  ["DET", "/logos/DET.png"],
  ["GSW", "/logos/GSW.png"],
  ["IND", "/logos/IND.png"],
  ["HOU", "/logos/HOU.png"],
  ["LAC", "/logos/LAC.png"],
  ["LAL", "/logos/LAL.png"],
  ["MEM", "/logos/MEM.png"],
  ["MIA", "/logos/MIA.png"],
  ["MIL", "/logos/MIL.png"],
  ["MIN", "/logos/MIN.png"],
  ["NOP", "/logos/NOP.png"],
  ["NYK", "/logos/NYK.png"],
  ["OKC", "/logos/OKC.png"],
  ["ORL", "/logos/ORL.png"],
  ["PHI", "/logos/PHI.png"],
  ["PHX", "/logos/PHX.png"],
  ["POR", "/logos/POR.png"],
  ["SAS", "/logos/SAS.png"],
  ["TOR", "/logos/TOR.png"],
  ["UTA", "/logos/UTA.png"],
  ["WAS", "/logos/WAS.png"],
  ["SAC", "/logos/SAC.png"]
])

router.get("/", (req, res) => {
  res.redirect("/scores")
});

router.get("/about", (req, res) => {
  res.render("about")
})

router.get("/contact", (req, res) => {
  res.render("contact")
})

//live scores, scores for today
router.get("/scores", (req, res) => {
  //add live games
  var today = moment().tz('America/Los_Angeles');
  res.redirect(`/calendar/${today}`)
  // games = []
  // var yesterday = today.subtract(1, 'days')
  // var tomorrow = today.add(1, 'days')
  // yesterday = yesterday.format("YYYYMMDD")
  // tomorrow= tomorrow.format("YYYYMMDD")
  // today = today.format("YYYYMMDD")
  // nodeFetch(`http://data.nba.net/10s/prod/v1/${today}/scoreboard.json`).then(res => res.json())
  //   .then(data => {
  //     data.games.forEach(game => {
  //       let status = ""
  //       if (game.statusNum == 3) {
  //         status = "Final"
  //       } else if (game.statusNum == 1) {
  //         status = "Scheduled"
  //       } else if (game.statusNum == 2) {
  //         status = "Live"
  //       }
  //       games.push({
  //         date: today,
  //         dateGameId: today + '/' + game.gameId,
  //         yday: "/calendar/"+yesterday,
  //         tomo: "/calendar/"+tomorrow,
  //         Home: game.hTeam.triCode,
  //         HomeLogo: logos.get(game.hTeam.triCode),
  //         Away: game.vTeam.triCode,
  //         AwayLogo: logos.get(game.vTeam.triCode),
  //         HomeScore: game.hTeam.score,
  //         AwayScore: game.vTeam.score,
  //         status: status,
  //         arena: game.arena.city + ", " + game.arena.name
  //       })
  //     })
  //     res.render("index", {
  //       games: games
  //     })
  //
  //   });
});

//for calendar feature, past games
router.get("/calendar/:date", (req, res) => {
  var date = moment(req.params.date);
  games = []
  const yesterday = date.subtract(1, 'days').format("YYYYMMDD")
  const tomorrow = date.add(2, 'days').format("YYYYMMDD")
  date = req.params.date
  nodeFetch(`http://data.nba.net/10s/prod/v1/${date}/scoreboard.json`).then(res => res.json())
    .then(data => {
      data.games.forEach(game => {
        let status = ""
        if (game.statusNum == 3) {
          status = "Final"
        } else if (game.statusNum == 1) {
          status = "Scheduled"
        } else if (game.statusNum == 2) {
          status = "Live"
        }
        games.push({
          date:date,
          dateGameId: date + '/' + game.gameId,
          yday: "/calendar/"+yesterday,
          tomo: "/calendar/"+tomorrow,
          Home: game.hTeam.triCode,
          HomeLogo: logos.get(game.hTeam.triCode),
          Away: game.vTeam.triCode,
          AwayLogo: logos.get(game.vTeam.triCode),
          HomeScore: game.hTeam.score,
          AwayScore: game.vTeam.score,
          status: status,
          arena: game.arena.city + ", " + game.arena.name
        })
      })
      res.render("index", {
        games: games
      })
    });
});


//box score for games on certain date and id
router.get("/:date/:id", (req, res) => {
  const date = req.params.date
  const gameId = req.params.id
  home = []
  away = []

  nodeFetch(`http://data.nba.net/json/cms/noseason/game/${date}/${gameId}/boxscore.json`).then(res => res.json())
    .then(data => {
      if(data.sports_content.game.period_time.period_value == ""){
        res.render("invalid")
      }
      else{
        gameInfo = {
          quarter: "Quarter " + data.sports_content.game.period_time.period_value,
          qStatus: data.sports_content.game.period_time.period_status,
          date: date,
          gameId: gameId,
          home:{
            name: data.sports_content.game.home.abbreviation,
            score: data.sports_content.game.home.score,
            first: data.sports_content.game.home.linescores.period[0].score,
            second: data.sports_content.game.home.linescores.period[1].score,
            third: data.sports_content.game.home.linescores.period[2].score,
            fourth: data.sports_content.game.home.linescores.period[3].score,
            Dreb:data.sports_content.game.home.stats.rebounds_defensive,
            Oreb: data.sports_content.game.home.stats.rebounds_offensive,
            stls: data.sports_content.game.home.stats.steals,
            blks:data.sports_content.game.home.stats.blocks,
            TOs:data.sports_content.game.home.stats.turnovers,
            ast:data.sports_content.game.home.stats.assists,
            fgp: data.sports_content.game.home.stats.field_goals_percentage+'%',
            three: data.sports_content.game.home.stats.three_pointers_percentage+'%'
          },
          away :{
            name: data.sports_content.game.visitor.abbreviation,
            score: data.sports_content.game.visitor.score,
            first: data.sports_content.game.visitor.linescores.period[0].score,
            second: data.sports_content.game.visitor.linescores.period[1].score,
            third: data.sports_content.game.visitor.linescores.period[2].score,
            fourth: data.sports_content.game.visitor.linescores.period[3].score,
            Dreb:data.sports_content.game.visitor.stats.rebounds_defensive,
            Oreb: data.sports_content.game.visitor.stats.rebounds_offensive,
            stls: data.sports_content.game.visitor.stats.steals,
            blks:data.sports_content.game.visitor.stats.blocks,
            TOs:data.sports_content.game.visitor.stats.turnovers,
            ast:data.sports_content.game.visitor.stats.assists,
            fgp: data.sports_content.game.visitor.stats.field_goals_percentage+'%',
            three: data.sports_content.game.visitor.stats.three_pointers_percentage+'%'
          }


        }
        data.sports_content.game.home.players.player.forEach(player => {
          home.push({
            first_name: player.first_name,
            last_name: player.last_name,
            name: player.first_name + ' ' + player.last_name,
            jersey_number: player.jersey_number,
            position: player.position_short,
            minutes: player.minutes,
            seconds: player.seconds,
            points: player.points,
            assists: player.assists,
            Oreb: player.rebounds_offensive,
            Dreb: player.rebounds_defensive,
            reb: parseInt(player.rebounds_offensive) + parseInt(player.rebounds_defensive),
            assists: player.assists,
            fouls: player.fouls,
            steals: player.steals,
            turnovers: player.turnovers,
            blocks: player.blocks,
            fg: player.field_goals_made,
            fga: player.field_goals_attempted,
            ft: player.free_throws_made,
            fta: player.free_throws_attempted,
            three: player.three_pointers_made,
            athree: player.three_pointers_attempted,
            plusminus: player.plus_minus
          })
        })
        data.sports_content.game.visitor.players.player.forEach(player => {
          away.push({
            first_name: player.first_name,
            last_name: player.last_name,
            name: player.first_name + ' ' + player.last_name,
            jersey_number: player.jersey_number,
            position: player.position_short,
            minutes: player.minutes,
            seconds: player.seconds,
            points: player.points,
            assists: player.assists,
            Oreb: player.rebounds_offensive,
            Dreb: player.rebounds_defensive,
            reb: parseInt(player.rebounds_offensive) + parseInt(player.rebounds_defensive),
            assists: player.assists,
            fouls: player.fouls,
            steals: player.steals,
            turnovers: player.turnovers,
            blocks: player.blocks,
            fg: player.field_goals_made,
            fga: player.field_goals_attempted,
            ft: player.free_throws_made,
            fta: player.free_throws_attempted,
            three: player.three_pointers_made,
            athree: player.three_pointers_attempted,
            plusminus: player.plus_minus
          })
        })
        res.render("boxscore", {
          away: away,
          home: home,
          gameInfo: gameInfo
        })
      }
    });

})

router.get("*", (req, res) => {
  res.send("Error");
});

module.exports = router;
