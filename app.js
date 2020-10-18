var express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    // cookieSession = require('cookie-session'),
    Intern = require("./models/intern"),
    Submission = require("./models/submission"),
    Manager = require("./models/manager"),
    mongoose = require("mongoose"),
    { GoogleSpreadsheet } = require('google-spreadsheet'),
    async = require('async'),
    keys = require('./keys'),
    schedule = require('node-schedule');

var gsheetAPIs 	= require("./apis/gsheetAPIs"),
	stats 		= require("./apis/stats"),
	crons 		= require("./apis/crons");

//requring routes
var internRoutes    = require("./routes/interns"),
    managerRoutes 	= require("./routes/managers"),
    authRoutes     = require("./routes/auth");


// mongoose.connect("mongodb://localhost/wsportal");
mongoose.connect(keys.mongodb.mongoURL)
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'achieving-extraordinary',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// PASSPORT CONFIGURATION
passport.use(new GoogleStrategy({
	clientID: keys.google.clientID,
	clientSecret: keys.google.clientSecret,
	callbackURL: "/auth/google/callback"
	},
	function(accessToken, refreshToken, profile, done){
		// console.log(profile);
		process.nextTick(function(){
			var absoluteEmail = profile.emails[0].value,
	    		imgPath = profile.photos[0].value;
		    app.set('absoluteEmail', absoluteEmail);
			Intern.findOne({email: absoluteEmail}, function(err, foundIntern){
				if(err) {
					return done(err);
				} else if(foundIntern == null){
					Manager.findOne({email: absoluteEmail}, function(err, foundManager){
						if(err) {
							return done(err);
						} else if (foundManager == null) {
							return done(null);
						} else {
							return done(null, foundManager);
						}
					});
				} else {
					foundIntern.set({imagePath: imgPath});
					foundIntern.save(function(err, updatedIntern){
						if(err){
							return done(err);
						} else {
							return done(null, updatedIntern);
						}
					});			
				}
			});
		});
	}
));

app.use(authRoutes);
app.use(managerRoutes);
app.use(internRoutes);

// crons.consolidateInternsDBs();
// crons.consolidateManagersDBs();
// crons.pushCards();
// crons.pushAvailablePayPeriods();

app.listen(process.env.PORT, () => {
    console.log('Server is running on Heroku');
});

// app.listen(5000, () => {
//     console.log('Server is running on port 5000');
// });