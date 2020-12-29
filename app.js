//Require
let express = require("express");
let ejs = require("ejs");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");


//Routes
let indexRoute = require("./routes/index.js");

// App set up
let app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


//Routes
app.use(indexRoute);

//Listen
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
