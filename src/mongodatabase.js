const mongoose = require('mongoose');

const url = 'mongodb://localhost/teleperformance';

const conn = mongoose.connect(url,{

})
.then( ()=> console.log('MongoDB Connected') )
.catch((e) => console.log('error: '+e)) 

module.exports = conn;