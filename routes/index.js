let express = require("express");
let router = express.Router();
let nodeFetch = require("node-fetch");

router.get("/", (req, res) => {
  res.render("index.ejs");
});


router.get("/scores", (req, res) => {
  nodeFetch("https://api-nba-v1.p.rapidapi.com/games/live/", {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": "04be869764msh1173a225149d4f4p1b5c0fjsn2f218b338a38",
        "x-rapidapi-host": "api-nba-v1.p.rapidapi.com"
      }
    })
    .then(response => response.json())
    .then(data => {
      let games = []
      data.api.games.forEach(game => {
        games.push({
          Home: game.hTeam.fullName,
          HomeLogo: game.hTeam.logo,
          Away: game.vTeam.fullName,
          AwayLogo: game.vTeam.logo,
          HomeScore: game.hTeam.score.points,
          AwayScore: game.vTeam.score.points
        })
      })
      if (games.length > 0) {
        res.render("index", {
          games: games
        })
      } else {
        //If there are no live games, show games from today that ended
        var today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
        today = yyyy + "-" + mm + "-" + dd;
        nodeFetch(`https://api-nba-v1.p.rapidapi.com/games/date/${today}`, {
            "method": "GET",
            "headers": {
              "x-rapidapi-key": "04be869764msh1173a225149d4f4p1b5c0fjsn2f218b338a38",
              "x-rapidapi-host": "api-nba-v1.p.rapidapi.com"
            }
          })
          .then(res => res.json())
          .then(dat => {
            dat.api.games.forEach(game => {
              games.push({
                Home: game.hTeam.fullName,
                HomeLogo: game.hTeam.logo,
                Away: game.vTeam.fullName,
                AwayLogo: game.vTeam.logo,
                HomeScore: game.hTeam.score.points,
                AwayScore: game.vTeam.score.points
              })
            })
            res.render("index", {
              games: games
            })
          })

      }

    })



  // req.headers({
  // "x-rapidapi-key": "d060dde1cfmsh7a0dd2b1d3d141bp1e5c6bjsn20e2b979a0dc",
  // "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
  // "useQueryString": true
  // });
  //
  // let response = nodeFetch("https://api-nba-v1.p.rapidapi.com/games/live/");
  // response.then((rep) => {
  //   return rep.json();
  // }).then((rep_data) => {
  //   console.log(rep_data);
  // });
});

router.get("*", (req, res) => {
  res.send("Error");
});

module.exports = router;
