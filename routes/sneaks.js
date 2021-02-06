const express = require("express");
const router = express.Router();
const nodeFetch = require("node-fetch");

router.get("/", async (req, res) => {
  let date = new Date()
  let month = date.getMonth();
  if (month < 10) {
    month = '0' + (month + 1);
  }
  let day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  let year = date.getFullYear();
  let dateString = year + "-" + month + "-" + day;
  let shoes = [];
  while (shoes.length < 20) {
    await nodeFetch(`https://api.thesneakerdatabase.com/v1/sneakers?limit=10&releaseDate=${dateString}`)
      .then(res => res.json())
      .then(json => {
        json.results.forEach(shoe => {
          shoes.push(shoe)
        })
        date.setDate(date.getDate() + 1);
        month = date.getMonth();
        if (month < 10) {
          month = '0' + (month + 1);
        }
        day = date.getDate();
        if (day < 10) {
          day = '0' + day;
        }
        year = date.getFullYear();
        dateString = year + "-" + month + "-" + day;
      })
  }
  res.render('sneaks', {
    shoes
  })

})

module.exports = router;
