const express=require('express');
const router=express.Router();

const mongoose = require('mongoose');

var session        = require('express-session');
var passport       = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var request        = require('request');
var handlebars     = require('handlebars');

const mysqlConnection = require('../database');


// Define our constants, you will change these with your own
const TWITCH_CLIENT_ID = 'vzk6a8r830g5mbtjn8lc43tlkmcshn';
const TWITCH_SECRET    = '6zkdl8jisjrriztlv9t2mqn8xo8w5n';
const CALLBACK_URL     = 'http://localhost:3000/auth/twitch/callback';  // You can run locally with - http://localhost:3000/auth/twitch/callback

//model mongodb
const users = mongoose.Schema({
    idtwitch: String,
    username: String
  });
  
  const UsersModel = mongoose.model('users', users);
  
//

// Override passport profile function to get user profile from Twitch API
OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
    var options = {
      url: 'https://api.twitch.tv/helix/users',
      method: 'GET',
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Authorization': 'Bearer ' + accessToken
      }
    };
  
    request(options, function (error, response, body) {
      if (response && response.statusCode == 200) {
        done(null, JSON.parse(body));
      } else {
        done(JSON.parse(body));
      }
    });
  }
  
  passport.serializeUser(function(user, done) {
      done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
      done(null, user);
  });
  
  passport.use('twitch', new OAuth2Strategy({
      authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
      tokenURL: 'https://id.twitch.tv/oauth2/token',
      clientID: TWITCH_CLIENT_ID,
      clientSecret: TWITCH_SECRET,
      callbackURL: CALLBACK_URL,
      state: true
    },
    function(accessToken, refreshToken, profile, done) {
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;
  
      // Securely store user profile in your DB
      //User.findOrCreate(..., function(err, user) {
      //  done(err, user);
      //});
  
      done(null, profile);
    }
  ));
  


//read all usuarios
router.get('/all',(req,res)=>{
    mysqlConnection.query('SELECT * FROM users',(err,rows,fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
});

//read usuario
router.get('/:id',(req,res)=>{
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM users WHERE id = ?',[id],
    (err,rows,fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
});


// Set route to start OAuth link, this is where you define scopes to request
router.get('/auth/twitch', passport.authenticate('twitch', { scope: 'user_read' }));
router.get('/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/' }));
//create usuario con twitch
router.get('/', function (req, res) {
    if(req.session && req.session.passport && req.session.passport.user) {
      const res2 = login(req.session.passport.user.data);
      //console.log(req.session.passport.user.data);
      res.json(res2);
    } else {
        res.redirect('/auth/twitch');
      //res.send('<html><head><title>Twitch Auth Sample</title></head><a href="/auth/twitch"><img src="http://ttv-api.s3.amazonaws.com/assets/connect_dark.png"></a></html>');
    }
  });

function login( data ){
    
    //console.log(data[0]);
    const {id,display_name} = data[0];
    const query = `
    INSERT INTO users (idtwitch,username) 
    VALUES (?,?);`;
    
    mysqlConnection.query(query,[id,display_name], (err,rows,fields) => {
        if(!err){
            res.json({Status: 'Create Success'});
            return {Status: 'Create Success'}; 
        }else{
            console.log(err);
        }
    });
}

//create usuario
router.post('/',(req,res) =>{
    
    const {idtwitch,username} = req.body;
    const query = `
    INSERT INTO users (idtwitch,username) 
    VALUES (?,?);`;

    mysqlConnection.query(query,[idtwitch,username], (err,rows,fields) => {
        if(!err){
            res.json({Status: 'Create Success'});
        }else{
            console.log(err);
        }
    });
});

//update usuario
router.put('/:id',(req,res) =>{
    const {idtwitch,username} = req.body;
    const {id} = req.params;
    const query = `
    UPDATE users 
    SET  idtwitch=?,username=?
    WHERE id=?;`;

    mysqlConnection.query(query,[idtwitch,username,id], (err,rows,fields) => {
        if(!err){
            res.json({Status: 'Update Success'});
        }else{
            console.log(err);
        }
    });
});

//delete usuario
router.delete('/:id',(req,res)=>{
    const {id} = req.params;
    mysqlConnection.query('DELETE FROM users WHERE id = ?',[id],
    (err,rows,fields) => {
        if(!err){
            res.json({Status: 'Delete Success'});
        }else{
            console.log(err);
        }
    })
});

//MONGO leer
router.get('/mongo/list',(req,res)=>{

    
      const showdata = async()=> {
          const usersvar = await UsersModel.find();
          res.json(usersvar);
      }
      //mongod y mongosh
      showdata();
      

});

module.exports = router;