//Require
let express = require("express");
let ejs = require("ejs");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let fetch = require("node-fetch");
require('dotenv').config()

//Routes
let indexRoute = require("./routes/index.js");

// App set up
let app = express();
app.use(express.static("public"));
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}));



//Routes
app.use(indexRoute);

//Listen
let port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
