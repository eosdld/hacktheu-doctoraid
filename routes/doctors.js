var express = require("express"),
	router = express.Router(),
	keys = require('../keys'),
	admin = require("firebase-admin");


admin.initializeApp({
  credential: admin.credential.cert(keys.firebase),
  databaseURL: "https://doctoraid-187fe.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("server/patients-data");

router.get("/", function(req, res){
	res.render("patients");
});

router.get("/dire", function(req, res){
	res.render("index_dire");
});

router.get("/chestxray", function(req, res){
	res.render("index_xray");
});

router.get("/covid19", function(req, res){
	res.render("index_covid");
});

router.post("/createpatient", function(req, res){
	console.log(req.body);
	console.log(db.ref("server/patients-data/users"));
	const 	name = req.body.name,
			email = req.body.email;
	
	var usersRef = ref.child("users");
	usersRef.child(name).set({
	    email: email,
	    name: name,
	    dire_diagnosis: '',
	    xray_diagnosis: '',
	    covid19: ''
	});

	res.redirect("/")
});

router.post("/reportdire", function(req, res){
	console.log(req.body);
	console.log(ref.child("users"));
	const 	name = req.body.name,
			email = req.body.email,
			dire_diagnosis = req.body.diagnosis;
	
	var usersRef = ref.child("users");
	usersRef.child(name).update({
	    dire_diagnosis: diagnosis
	});

	res.redirect("/dire")
});

router.post("/reportxray", function(req, res){
	console.log(req.body);
	const 	name = req.body.name,
			email = req.body.email,
			dire_diagnosis = req.body.diagnosis;
	
	var usersRef = ref.child("users");
	usersRef.child(name).update({
	    xray_diagnosis: diagnosis
	});

	res.redirect("/index_xray")
});

router.post("/reportcovid", function(req, res){
	console.log(req.body);
	const 	name = req.body.name,
			email = req.body.email,
			covid_diagnosis = req.body.diagnosis;
	
	var usersRef = ref.child("users");
	usersRef.child(name).update({
	    covid19: covid_diagnosis
	});

	res.redirect("/index_covid")
});

// Render each page according to the route.
// The main should be the patients

module.exports = router;