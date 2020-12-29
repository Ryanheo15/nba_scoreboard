let express = require("express");
let router = express.Router();

router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.get("*", () => {
  
});

module.exports = router;
