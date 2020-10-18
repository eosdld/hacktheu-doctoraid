var express = require("express"),
	router = express.Router();

router.get("/", function(req, res){
	res.render("index");
});

// Render each page according to the route.
// The main should be the patients

module.exports = router;