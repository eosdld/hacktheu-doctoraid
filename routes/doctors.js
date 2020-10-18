var express = require("express"),
	router = express.Router();

router.get("/dire", function(req, res){
	res.render("index_dire");
});

router.get("/chestxray", function(req, res){
	res.render("index_xray");
});

router.get("/covid19", function(req, res){
	res.render("index_covid");
});

// Render each page according to the route.
// The main should be the patients

module.exports = router;