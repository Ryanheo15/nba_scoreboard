let express = require("express");
let router = express.Router();
let nodeFetch = require("node-fetch");

router.get("/", (req, res) => {
  res.redirect("/scores")
});

router.get("/scores", (req, res) => {
  //add live games
  nodeFetch("https://api-nba-v1.p.rapidapi.com/games/live/", {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": process.env.API_KEY,
        "x-rapidapi-host": "api-nba-v1.p.rapidapi.com"
      }
    })
    .then(response => response.json())
    .then(data => {
      let games = []
      let teams = []
      data.api.games.forEach(game => {
        console.log(game)
        const Home = game.hTeam.fullName;
        const Away = game.vTeam.fullName;
        games.push({
          Home: Home,
          HomeLogo: game.hTeam.logo,
          Away: Away,
          AwayLogo: game.vTeam.logo,
          HomeScore: game.hTeam.score.points,
          AwayScore: game.vTeam.score.points,
          status: "Live"
        })
        teams.push({
          Home: Home,
          Away: Away
        })
      })
      //add non live games
      var today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      const yyyy = today.getFullYear();
      today = yyyy + "-" + mm + "-" + dd;
      nodeFetch(`https://api-nba-v1.p.rapidapi.com/games/date/${today}`, {
          "method": "GET",
          "headers": {
            "x-rapidapi-key": process.env.API_KEY,
            "x-rapidapi-host": "api-nba-v1.p.rapidapi.com"
          }
        })
        .then(res => res.json())
        .then(dat => {
          dat.api.games.forEach(game => {
            const Home = game.hTeam.fullName;
            const Away = game.vTeam.fullName;
            const currTeam = {
              Home: Home,
              Away: Away
            }
            //check if game is live, already in games
            var isNotInArray = teams.find(function(el){ return el.Home === Home})== undefined;
            let status;
            if(game.statusGame === "Finished"){
              status = "Final"
            }else{
              status = "Scheduled"
            }
            if (isNotInArray) {
              games.push({
                Home: game.hTeam.fullName,
                HomeLogo: game.hTeam.logo,
                Away: game.vTeam.fullName,
                AwayLogo: game.vTeam.logo,
                HomeScore: game.hTeam.score.points,
                AwayScore: game.vTeam.score.points,
                status: status
              })
              teams.push(currTeam)
            }

          })
          res.render("index", {
            games: games
          })
        })



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
