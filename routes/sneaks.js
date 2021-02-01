const express = require("express");
const router = express.Router();
const nodeFetch = require("node-fetch");


router.get("/", (req, res) => {
  let date = new Date()
  let month = date.getMonth();
  if (month < 10) {
    month = '0' + month;
  }
  let day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  let year = date.getFullYear();
  date = year + "-" + month + "-" + day;

  nodeFetch(`https://api.thesneakerdatabase.com/v1/sneakers?limit=10&releaseDate=${date}`)
    .then(res => res.json())
    .then(json => {
      let shoes = []
      json.results.forEach(shoe=>{
        shoes.push(shoe)
      })
      res.render('sneaks', {shoes})
    })
})

module.exports = router;
