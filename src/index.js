const express      = require('express');
var session        = require('express-session');
var passport       = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var request        = require('request');
var handlebars     = require('handlebars');

//mongoose
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/teleperformance';

const con = mongoose.connect(url,{

})
.then( ()=> console.log('MongoDB Connected') )
.catch((e) => console.log('error: '+e)) 
//


const SESSION_SECRET   = 'xygh57knec07sgfv8u7gd7bzlhculp';


const app = express();
app.use(session({secret: SESSION_SECRET, resave: false, saveUninitialized: false}));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());


//config
app.set('port', process.env.PORT || 3000);

//middleware
app.use(express.json());

//routes
app.use(require('./routes/users'));
//start
app.listen(app.get('port'), () => {
    console.log('Server on Port ',app.get('port'));
});
