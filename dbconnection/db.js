
var MongoClient = require('mongodb').MongoClient;
function connectionDatabase() {
    return new Promise((resolve, reject) => {
        var url = 'mongodb+srv://root:95bcqr1Vizz@digiebot-bhelp.mongodb.net/test?authSource=admin&replicaSet=Digiebot-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true';
        // var url = 'mongodb+srv://root:95bcqr1Vizz@bam-bhelp.mongodb.net/test?authSource=admin&replicaSet=bam-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass%20Community&retryWrites=true&ssl=true';
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) {
                reject(err);
            } else {
                // const db = client.db('binance_data');
                const db = client.db('binance');
                resolve(db)
            }//End of  connection success
        });//End of Db Connection
    })//End of promise object
}//End of connectionDatabase

module.exports = connectionDatabase()
