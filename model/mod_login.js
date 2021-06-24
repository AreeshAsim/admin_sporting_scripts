var conn = require("../dbconnection/db")
var md5 = require('md5');

module.exports = {
    funcOne:async function(req){ 
        // return new Promise(async function(resolve, reject){
            console.log("model"); 
            var where = {'username' : req.username};
            var db  = await conn
            var result = await db.collection("users").find(where).limit(1).toArray()
            // console.log(result)
            if(result[0]['password'] == md5(req.password)){
                console.log("corect")
                return result;
            }
        // })
    },
}; //end export