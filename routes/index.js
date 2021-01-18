let express = require("express");
let router = express.Router();
let nodeFetch = require("node-fetch");
let moment = require('moment-timezone')

const logos = new Map([
  ["ATL","http://assets.stickpng.com/thumbs/58419be4a6515b1e0ad75a58.png"],
  ["BOS","http://assets.stickpng.com/thumbs/58419c6aa6515b1e0ad75a61.png"],
  ["BKN","http://assets.stickpng.com/thumbs/58419c7ba6515b1e0ad75a62.png"],
  ["CHA","http://assets.stickpng.com/thumbs/58419bd7a6515b1e0ad75a57.png"],
  ["CHI","http://assets.stickpng.com/thumbs/58419cf6a6515b1e0ad75a6b.png"],
  ["CLE","http://assets.stickpng.com/thumbs/58419c8da6515b1e0ad75a63.png"],
  ["DAL","http://assets.stickpng.com/thumbs/58419cd6a6515b1e0ad75a68.png"],
  ["DEN","http://assets.stickpng.com/thumbs/58419b70a6515b1e0ad75a50.png"],
  ["DET","http://assets.stickpng.com/thumbs/58419c4ca6515b1e0ad75a5f.png"],
  ["GSW","http://assets.stickpng.com/thumbs/58419ce2a6515b1e0ad75a69.png"],
  ["IND","http://assets.stickpng.com/thumbs/58419b8da6515b1e0ad75a52.png"],
  ["HOU","https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Houston_Rockets.svg/1200px-Houston_Rockets.svg.png"],
  ["LAC","http://assets.stickpng.com/thumbs/58419c59a6515b1e0ad75a60.png"],
  ["LAL","http://assets.stickpng.com/thumbs/58419d0aa6515b1e0ad75a6c.png"],
  ["MEM","http://assets.stickpng.com/thumbs/58419c00a6515b1e0ad75a5a.png"],
  ["MIA","https://toppng.com/uploads/preview/ba-logo-png-2014-download-logo-miami-heat-11563538465nkpfwmfmb2.png"],
  ["MIL","http://assets.stickpng.com/thumbs/58419ba7a6515b1e0ad75a54.png"],
  ["MIN","http://assets.stickpng.com/thumbs/58419bc5a6515b1e0ad75a56.png"],
  ["NOP","http://assets.stickpng.com/thumbs/58419b9ba6515b1e0ad75a53.png"],
  ["NYK","http://assets.stickpng.com/thumbs/58419cc8a6515b1e0ad75a67.png"],
  ["OKC","http://assets.stickpng.com/thumbs/58419c20a6515b1e0ad75a5c.png"],
  ["ORL","http://assets.stickpng.com/thumbs/58419b7da6515b1e0ad75a51.png"],
  ["PHI","http://assets.stickpng.com/thumbs/58419ca3a6515b1e0ad75a64.png"],
  ["PHX","http://assets.stickpng.com/thumbs/58419d52a6515b1e0ad75a6d.png"],
  ["POR","https://www.clipartmax.com/png/middle/255-2555105_blazers-thumb-portland-trail-blazers-logo-png.png"],
  ["SAS","http://assets.stickpng.com/thumbs/58419cbca6515b1e0ad75a66.png"],
  ["TOR","http://assets.stickpng.com/thumbs/58419bf3a6515b1e0ad75a59.png"],
  ["UTA","http://assets.stickpng.com/thumbs/58419bb6a6515b1e0ad75a55.png"],
  ["WAS","http://assets.stickpng.com/thumbs/58419c12a6515b1e0ad75a5b.png"],
  ["SAC","https://logos-download.com/wp-content/uploads/2016/04/Sacramento_Kings_logo_transparent_bg.png"]
])

router.get("/", (req, res) => {
  res.redirect("/scores")
});


//live scores, scores for today
router.get("/scores", (req, res) => {
  //add live games
  var today = moment().tz('America/Los_Angeles');
  today = today.format("YYYYMMDD")
  games = []
  nodeFetch(`http://data.nba.net/10s/prod/v1/${today}/scoreboard.json`).then(res => res.json())
    .then(data => {
      data.games.forEach(game => {
        let status = ""
        if(game.statusNum == 3){
          status = "Final"
        }else if (game.statusNum == 1){
          status = "Scheduled"
        }else if (game.statusNum == 2){
          status = "Live"
        }
        games.push({
          dateGameId: today + '/' + game.gameId,
          Home: game.hTeam.triCode,
          HomeLogo:logos.get(game.hTeam.triCode),
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

router.post("/", (req,res)=>{
  res.redirect("/scores")
})

//for calendar feature, past games
// router.get("/:date", (req, res) => {
//   var date = req.params.date
//   games = []
//   nodeFetch(`http://data.nba.net/10s/prod/v1/${date}/scoreboard.json`).then(res => res.json())
//     .then(data => {
//       data.games.forEach(game => {
//         games.push({
//           dateGameId: date + '/' + game.gameId,
//           Home: game.hTeam.triCode,
//           HomeLogo:logos.get(game.hTeam.triCode),
//           Away: game.vTeam.triCode,
//           AwayLogo: logos.get(game.vTeam.triCode),
//           HomeScore: game.hTeam.score,
//           AwayScore: game.vTeam.score,
//           status: "Final",
//           arena: game.arena.city + ", " + game.arena.name
//         })
//       })
//       res.render("index", {
//         games: games
//       })
//     });
// });


//box score for games on certain date and id
router.get("/:date/:id", (req, res) => {
  const date = req.params.date
  const gameId = req.params.id
  home = []
  away = []
  nodeFetch(`http://data.nba.net/json/cms/noseason/game/${date}/${gameId}/boxscore.json`).then(res => res.json())
    .then(data => {
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
          reb: parseInt(player.rebounds_offensive)+parseInt(player.rebounds_defensive),
          assists: player.assists,
          fouls: player.fouls,
          steals: player.steals,
          turnovers: player.turnovers,
          blocks: player.blocks
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
          reb: parseInt(player.rebounds_offensive)+parseInt(player.rebounds_defensive),
          assists: player.assists,
          fouls: player.fouls,
          steals: player.steals,
          turnovers: player.turnovers,
          blocks: player.blocks
        })
      })
      res.render("boxscore", {
        away: away,
        home: home
      })
    });

})

router.get("*", (req, res) => {
  res.send("Error");
});

module.exports = router;
