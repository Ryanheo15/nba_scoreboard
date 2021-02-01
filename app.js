//Require
let express = require("express");
let ejs = require("ejs");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let fetch = require("node-fetch");
require('dotenv').config()

//Routes
let indexRoute = require("./routes/index.js");
let sneaksRoute = require("./routes/sneaks.js")

// App set up
let app = express();
app.use(express.static("public"));
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req,res)=>{
  res.redirect("about")
})
app.get("/about", (req, res) => {
  res.render("about")
})

app.get("/contact", (req, res) => {
  res.render("contact")
})

//Routes
app.use('/index', indexRoute);
app.use('/sneaks', sneaksRoute)

//Listen
let port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
