var express = require('express'),
    app = express(),
    bodyParser = require("body-parser"),
    passport = require('passport'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    admin = require('firebase-admin'),
    keys = require('./keys');
    
//requring routes
var doctorRoutes = require("./routes/doctors");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  secret: 'achieving-extraordinary',
  resave: false,
  saveUninitialized: false
}));

app.use(doctorRoutes);

// admin.initializeApp({
//   credential: admin.credential.cert(keys.firebase),
//   databaseURL: "https://doctoraid-187fe.firebaseio.com"
// });

// app.listen(process.env.PORT, () => {
//     console.log('Server is running on Heroku');
// });

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});