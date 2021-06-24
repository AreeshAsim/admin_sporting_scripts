var express           = require('express');
var router            =   express.Router();
const MongoClient     =   require('mongodb').MongoClient;
const objectId        =   require('mongodb').ObjectID;
var modle             =   require("../model/dbModle");
var conn              =   require("../dbconnection/db");
const fetch           =   require('node-fetch');
const request         =   require("request");
var helpers           =   require("helpers");
const model           =   require('../model/mod_login');
const helper          =   require('../helper/commonHelper');
const { UnorderedCollection } = require('http-errors');
const ISODate         =   require("isodate");
const KrakenClient    =   require('kraken-api');
const db              =   require('../dbconnection/db');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const Binance         =   require('node-binance-api');
const okex            =   require('okex-rest');
const unique          =   require('array-unique');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Expres Router'});
});

router.post('/postdata', function(req, res, next) {
  console.log(req.body.find.admin_id)
});

router.get('/getdata', async function(req, res, next) {
  //start request function
  var payload = {
    username : 'vizzdeveloper', 
    password : 'YaAllah1',
  };
  var options = {
    method: 'POST',
    url: 'https://admin.digiebot.com/admin/Api_calls/login_validation',
    headers: 
    {
      'Postman-Token': '34a36f0e-88f4-4d46-8d2b-c0f5e620d71d',
      'cache-control': 'no-cache',
      Authorization: 'Basic ZGlnaWVib3QuY29tOllhQWxsYWg=',
      'Content-Type': 'application/json' 
    },
    body: payload,
    json: true 
  };
  request(options, function (error, response, body){
    if (error) throw new Error(error);
    var dataResponse = {
      user_id: '5c0915befc9aadaac61dd1b8',
      username: 'vizzdeveloper',
      email: 'vizzdevelopertest@gmail.com',
      profile_image: 'https://app.digiebot.com/assets/profile_images/b436249df7251bb573e120dca272280f.jpg',
      message: 'username and Password corrected'
    };
    for(const [key, value] of Object.entries(body)) {
      console.log(`${key}: ${value}`);
    }

    var convertIntoArray = Object.keys(body);
    console.log(convertIntoArray);
    // convertIntoArray.forEach(
    //   element => console.log(element)
    // );

  }); //end request function
}); //end function

router.get('/getdata/:d', function(req, res, next) {
  console.log(req.params.d, "===> last after slash");
});
module.exports = router;

router.get('/testing', async function(req, res, next) {
  var db = await conn
  var buy = await db.collection("buy_orders").find().limit(1).toArray()
  console.log(buy);
  res.send(buy)
});

// login valodation post request for mobile
router.post('/loginValidation',async function(req, res, next){
  // console.log(req.headers['content-type'])
  // console.log(req.headers.authorization)
  let data = await model.funcOne(req.body)
  if(data){
    var responseArray = {
      'user_id'  : data[0]['_id'],
      'username' : data[0]['username'],
      'email'    : data[0]['email_address'],
      'profile_image' : 'https://app.digiebot.com/assets/profile_images/'+data[0]['profile_image'],
      'message'  : 'username and Password corrected',
    };
    res.status(200).send(responseArray);
  }else{
    var responseArray = 'Some thing went wrong';
    res.status(404).send(responseArray);
  }  
});

router.get('/helperTesting', async function(req, res, next){
  var response = await helper.sumFunction()
  console.log(response);
});

router.post('/saveReturnCronSetting', async function(req, res, next){
  console.log('testing')
  var postdata = await req.body;
  var db = await conn;
  var userId  = postdata.adminId;
  var cronId  = postdata.cronId;
  var pageNum = postdata.pageNum;
  var cronPreority = postdata.prioritySetting;

  if(userId!='' && cronId != ''){
    var pageNum = 1;
    var payload = {
        'priority_setting' : cronPreority,
        'admin_id'         : userId,
    }; 
    var whereCron = {'_id': new objectId(cronId) };
    db.collection('cronjob_execution_logs').updateOne(whereCron, {$set : payload});
    var limit =  8;
    if(pageNum != 0){
        var page = (pageNum-1) * limit;
    }
    var lookup = [
      {
        "$match":
        {
          "$or":
          [
            {"admin_id": userId},
            {"admin_id":{"$ne": userId}},
            {"admin_id":{"$exists":false}}
          ]
        }
      },
      {
        "$project":
        {
          "_id":{"$toString":"$_id"},
          "name":"$name",
          "cron_summary":"$cron_summary",
          "priority_setting":"$priority_setting",
          "cron_duration":"$cron_duration",
          "last_run":"$cron_duration"
        }
      },
      // {"$skip":page},
      // {"$limit": limit}
    ]
    await db.collection('cronjob_execution_logs').aggregate(lookup).toArray((err, data)=>{  //calback function
      if(err){
        throw err; 
      }else{
        data = {'data': data};
        res.status(200).send(data);
      }
    });
  }else if(userId !='' && pageNum!=''){
    var limit =  8;
    if(pageNum != 0){
        var page = (pageNum-1) * limit;
    }
    var lookup = [
      {
        "$match":
        {
          "$or":
          [
            {"admin_id":12},
            {"admin_id":{"$ne":12}},
            {"admin_id":{"$exists":false}}
          ]
        }
      },
      {
        "$project":
        {
          "_id":{"$toString":"$_id"},
          "name":"$name",
          "cron_summary":"$cron_summary",
          "priority_setting":"$priority_setting",
          "cron_duration":"$cron_duration",
          "last_run":"$cron_duration"
        }
      },
      // {"$skip":1},
      // {"$limit":2}
    ]
    await db.collection('cronjob_execution_logs').aggregate(lookup).toArray((err, data)=>{  //calback function
      if(err){
        throw err; 
      }else{
        data = {'data': data};
        res.status(200).send(data);
      }
    });
  }
});

router.get('/fetchNodeTesting', async function(req, res, next){
  
 var payload = {
    username : 'vizzdeveloper', 
    password : 'YaAllah1',
  };

  fetch('https://admin.digiebot.com/admin/Api_calls/login_validation', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 
        'Postman-Token': '34a36f0e-88f4-4d46-8d2b-c0f5e620d71d',
        'cache-control': 'no-cache',
        Authorization: 'Basic ZGlnaWVib3QuY29tOllhQWxsYWg=',
        'Content-Type': 'application/json'  
      }
  }).then(res => res.json())
    // .then(json => console.log(json.user_id))
    .then(json => {
    console.log("First user in the array:");
      console.log("aaaaaaaaaaaaaaaaa--->>>>",json);
      console.log("assssssssssssssssssssssss======>>>>>",json);
    })
    .catch(err =>  console.log(err))

});

router.get('/getUserBalance', async function(req, res, next){
  let where = {};
  where = {'api_secret' : {$exists : true}};
  where = {'api_key' : {$exists : true}};

  where = {'api_key' : {$ne: null}};
  where = {'api_key' : {$ne : null}};

  var db = await conn;
  var buy = await db.collection("users").find(where).limit(100).toArray();
  // console.log(buy.length);
  buy.forEach(function(entry) {

    // $balance_arr = $this->binance_api->get_account_balance((string)$userId);
    
    console.log("securet ==>> : ", entry.api_secret);
    console.log("api key===>: ", entry.api_key);
});

});

router.get('/fractionSubmittedOrderFixed', async function(req, res, next){
  let where = {};
  where = {'is_sell_order' :  'sold'};
  where = {'status' : 'fraction_submitted_sell'};

  where = {'trading_status' : 'complete'};
  where = {'market_sold_price' : {$exists: true, $ne: []}};   

  var db = await conn;
  var buy = await db.collection("buy_orders").find(where).limit(10000000).toArray();
  console.log(buy.length);
  
  let stats = {'status' : 'new'};
  let stats1 = {'status' : 'FILLED'};
  // buy.forEach(async function(entry) {
    // let whereSell = {'buy_order_id' : objectId(entry._id) };



    // var buy = await db.collection("buy_orders").updateOne(where,  {$set: stats1});
    // var sellBuy = await db.collection("orders").updateOne(whereSell,  {$set: stats});

  // });

  console.log('done');
});

router.get('/orderStatusChange', async function(req, res, next){

  // let search = {"application_mode" : "live", "is_sell_order" : "sold", "status" : "FILLED"};

  let search12 = {}
  search12['application_mode'] = 'live';
  search12['is_sell_order']    =  'sold'
  search12['status']           =  'FILLED'

  console.log(search12)
  var db  = await conn;
  var buy = await db.collection("sold_buy_orders").find(search12).limit(10).toArray();
  console.log(buy.length)

});

router.get('/moveOrdersIntoSOld', async function(req, res, next){
});

router.get('/userProfileHealthBinance', async function(req, res, next){

  let krakenCredentialCollectionName  =   'kraken_credentials';
  let bamCredentialCollectionName     =   'bam_credentials';
  let ATGkrakenCollection             =   'auto_trade_settings_kraken';
  let ATGbamCollection                =   'auto_trade_settings_bam';
  let ATGbinanceCollection            =   'auto_trade_settings';
  let buyCollectionName               =   'buy_orders';
  let soldCollectionName              =   'sold_buy_orders'; 
  let userWalletCollection            =   'user_wallet';
  let userProfileHealthCollection     =   'user_profile_health';
  let exchangeName                    =   'binance';
  let userWalletCollectionKraken      =   'user_wallet_kraken';
  let userWalletCollectionBam         =   'user_wallet_bam';


  let currentTime = new Date();
  let addedHours  = new Date(currentTime.setHours(currentTime.getHours() - 6));
  let db = await conn;

 let lookUp = 
  [
    {
      "$match":{
        "$or":[
          {"healthReportModify":{"$lte": addedHours}},
          {"healthReportModify":{"$exists":false}}
        ],
        "application_mode":{"$in":["both","live"]},
      }
    },
    {
      "$sort":{"created_date":-1}
    },
    {"$limit":2}
  ]
  var user =  await db.collection('users').aggregate(lookUp).toArray();

  if(user.length > 0){
    user.forEach(async function(userIteration){
      var getLastOrderSellTime = [
        {
          "$match": {
            "application_mode"    :  "live",
            "admin_id"            :  (userIteration["_id"]).toString(),
            "is_sell_order"       :  "sold",
            "status"              :  "FILLED",
            "resume_status"       :  {"$exists" : false},
            "cost_avg"            :  {"$exists" : false},
            "cavg_parent"         :  {"$exists" : false}
          },
        },
        {
          "$sort" : {"sell_date" : -1}
        },
        {"$limit" : 1}
      ];

      var getLastOrderBuyTime = [
        {
          "$match" : {
            "application_mode"   :  "live",
            "admin_id"           :  (userIteration["_id"]).toString(),
            "is_sell_order"      :  "yes",
            "status"             :  {"$in" : ['LTH','FILLED']},
            "resume_status"      :  {"$exists" : false},
            "cost_avg"           :  {"$exists" : false},
            "cavg_parent"        :  {"$exists" : false}
          },
        },
        {
          "$sort" : {"buy_date" : -1}
        },
        {"$limit" : 1}
      ];
      var resultSold =  await db.collection(soldCollectionName).aggregate(getLastOrderSellTime).toArray();

      var resultBuy = await db.collection(buyCollectionName).aggregate(getLastOrderBuyTime).toArray();
      if(resultSold.length > 0){
        var sellDate = resultSold[0]["sell_date"];
      }
      if(resultBuy.length > 0){
        var buyDate = resultBuy[0]["buy_date"];
      }

      let insertArray = {
        'username'            : userIteration['username'],
        'firstName'           : userIteration['first_name'],
        'lastName'            : userIteration['last_name'],
        'adminId'             : (userIteration['_id']).toString(),
        'lastLoginTime'       : userIteration['last_login_datetime'],
        'joinedTime'          : userIteration['created_date'],
        'profilePic'          : userIteration['profile_image'],
        'application_mode'    : userIteration['application_mode'],
        'emailAdress'         : userIteration['email_address'],
        'tradingIp'           : userIteration['trading_ip'],
        'tradingStatus'       : userIteration['trading_status'],
        'app_enable'          : userIteration['app_enable'],
        'lastTradeBuyTime'    : buyDate,
        'lastTradeSoldTime'   : sellDate,
      }
      if(userIteration['default_exchange'] !== undefined){
        insertArray['default_exchange'] = userIteration['default_exchange'];
      }else{
        insertArray['default_exchange'] = 'binance';
      }

      if(userIteration['google_auth'] == "yes" && userIteration['google_auth'] !== undefined){
        insertArray['google_auth'] = true;
      }else{
        insertArray['google_auth'] = false;
      }

      //check binance exchange is enabled or not 
      if(userIteration['api_key'] !== undefined && userIteration['api_secret'] !== undefined){
        insertArray['binanceExchange'] = true;

        let whereATG = {};
          whereATG['user_id']           =  userIteration['_id'].toString();
          whereATG['application_mode']  = 'live';
        let atgResponse = await db.collection(ATGbinanceCollection).countDocuments(whereATG);
        if(atgResponse > 0){
          insertArray['atgBinance'] = true;
        }else{
          insertArray['atgBinance'] = false;
        }

        // get binance balance
        let where_balance = {};
        where_balance['user_id'] = (userIteration['_id']).toString();
        where_balance['coin_symbol'] = {"$in" : ["BTC", "BTCUSDT"]};
      
        var userWallet = await db.collection(userWalletCollection).find(where_balance).toArray();

        const btcBalance = userWallet.find(obj => obj["coin_symbol"] == "BTC");
        const usdtBalance = userWallet.find(obj =>obj["coin_symbol"]  == "BTCUSDT")

        insertArray['btcUserWalletBalance']      = btcBalance['coin_balance'];
        insertArray['btcusdtUserWalletBalance']  = usdtBalance['coin_balance'];

      }else{
        insertArray['binanceExchange'] = false;
      }

      //check kraken exchange is enabled or not 
      let where_credentialKraken = {};
        where_credentialKraken['user_id'] = (userIteration['_id']).toString();
      let krakenUserMatch         = await db.collection(krakenCredentialCollectionName).countDocuments(where_credentialKraken);
      if(krakenUserMatch > 0){
        insertArray['krakenExchange'] = true;
         //atg check enabled or not 
        let whereATG = {};
          whereATG['user_id']           =  userIteration['_id'].toString();
          whereATG['application_mode']  = 'live';
        let atgResponse = await db.collection(ATGkrakenCollection).countDocuments(whereATG);
        if(atgResponse > 0){
          insertArray['atgKraken'] = true;
        }else{
          insertArray['atgKraken'] = false;
        }

        //get kraken exchange balance
        let where_balance_kraken = {};
            where_balance_kraken['user_id']       = (userIteration['_id']).toString();
            where_balance_kraken['coin_symbol']   = {"$in" : ["BTC", "USDT"]};

        var userWalletKraken = await db.collection(userWalletCollectionKraken).find(where_balance_kraken).toArray();

        const btcBalanceKraken  = userWalletKraken.find(obj => obj["coin_symbol"] == "BTC");
        const usdtBalanceKraken = userWalletKraken.find(obj =>obj["coin_symbol"]  == "USDT");

        insertArray["btcKrakenAvaliableBalance"]    = btcBalanceKraken["available"];
        insertArray["usdtKrakenAvaliableBalance"]   = usdtBalanceKraken["available"]

      }else{
        insertArray['krakenExchange'] = false;
      }

      //check bam exchange is enabled or not 
      let where_credentialBam = {};
        where_credentialBam['user_id'] = (userIteration['_id']).toString();
      let bamUserMatch         = await db.collection(bamCredentialCollectionName).countDocuments(where_credentialBam);
      if(bamUserMatch > 0){
        insertArray['bamExchange'] = true;

        let whereATG = {};
          whereATG['user_id']           =  userIteration['_id'].toString();
          whereATG['application_mode']  = 'live';
        let atgResponse = await db.collection(ATGbamCollection).countDocuments(whereATG);
        if(atgResponse > 0){
          insertArray['atgBam'] = true;
        }else{
          insertArray['atgBam'] = false;
        }

         //get Bam exchange balance
        let where_balance_bam = {};
            where_balance_bam['user_id']       = (userIteration['_id']).toString();
            where_balance_bam['coin_symbol']   = {"$in" : ["BTC", "USDT"]};

        var userWalletBam = await db.collection(userWalletCollectionBam).find(where_balance_bam).toArray();

        const btcBalanceBam  = userWalletBam.find(obj => obj["coin_symbol"] == "BTC");
        const usdtBalanceBam = userWalletBam.find(obj =>obj["coin_symbol"]  == "USDT");

        insertArray["btcBamAvaliableBalance"]    = btcBalanceBam["coin_balance"];
        insertArray["usdtBamAvaliableBalance"]   = usdtBalanceBam["coin_balance"]

      }else{
        insertArray['bamExchange'] = false;
      }

      var payload = {
        user_id : (userIteration['_id']).toString(),
      };

      await fetch('https://users.digiebot.com/cronjob/GetUserTotalPoints', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 
          'Postman-Token' : '34a36f0e-88f4-4d46-8d2b-c0f5e620d71d',
          'cache-control' : 'no-cache',
          Authorization   : 'Basic cG9pbnRTdXBwbHk6NGU0NmQ5OWFjMjJhNGIwYWJlNTc2OGE3OGVlODdiOGM=',
          'Content-Type'  : 'application/json',
          'postman-token' :  'b5711a89-ed67-92ba-25a8-685cfdcee2ec' 
        }
      }).then(res => res.json())
        .then(json => insertArray['userPoints'] = parseFloat(json.points))  
        .catch(err =>  console.log(err))

         //get user pakage details 
        var handshake = await helper.GetRandomAPIaccessToken();

        let parameter = {
          handshake  :  handshake,
          user_id    : (userIteration['_id']).toString(),
        };


      await fetch('https://users.digiebot.com/cronjob/GetUserSubscriptionDetails', {
        method: 'POST',
        body: JSON.stringify(parameter),
        headers: { 
          'Postman-Token' : '34a36f0e-88f4-4d46-8d2b-c0f5e620d71d',
          'cache-control' : 'no-cache',
          Authorization   : 'Basic cG9pbnRTdXBwbHk6NGU0NmQ5OWFjMjJhNGIwYWJlNTc2OGE3OGVlODdiOGM=',
          'Content-Type'  : 'application/json',
          'postman-token' :  'b5711a89-ed67-92ba-25a8-685cfdcee2ec' 
        }
      }).then(res => res.json())
        .then(json => insertArray['userPkg'] = parseFloat(json.trade_limit))
        .catch(err =>  console.log(err))

      //update user time under user collection
      let updateUserTimeModify = {"_id" : new objectId((userIteration["_id"]).toString())}

      await db.collection('users').updateOne(updateUserTimeModify, {"$set": {"healthReportModify" : new Date()}}, function (err, response) {
          if(err) {
            console.log(err)
          }
          console.log("response.modifiedCount",response.modifiedCount);
        }
      );

      let userID = { "adminId" : (userIteration["_id"].toString())}
      await db.collection(userProfileHealthCollection).updateOne(userID, {$set: insertArray }, {"upsert" : true}, function (err, response1) {
        console.log("inserted or updated record",response1.upsertedCount);
        }
      );
      // console.log(insertArray)
    })  //end foreach loop user iteration
  }//end count check
});

router.get('/binanceBalanceReturn', async function(req, res, next){

  const binance = new Binance().options({
    // APIKEY      :   'z1in8ZGQwYLReFiPdsDoMtfBWhQeOOWG7VRnTMu3zVD1AV8cbsEb5FLOhRoxk79H',
    // APISECRET   :   'GwSqxV2qpyZw4Dm0aLSWVMjq6EKRuMQM92GbUtvIKLD7cTm9KrxHAiugqFuIqzns'
  });


  // binance.prices( (error, ticker) => {
  //   console.info("Price of BNB: ", ticker);
  // });


  // binance.futuresMiniTickerStream( miniTicker => {
  //   console.info( miniTicker );
  // } );
  const binance = new Binance().options({
    // APIKEY      :   'z1in8ZGQwYLReFiPdsDoMtfBWhQeOOWG7VRnTMu3zVD1AV8cbsEb5FLOhRoxk79H',
    // APISECRET   :   'GwSqxV2qpyZw4Dm0aLSWVMjq6EKRuMQM92GbUtvIKLD7cTm9KrxHAiugqFuIqzns'
  });
  binance.websockets.candlesticks(['$all'], "15m", (candlesticks) => {
    let { e:eventType, E:eventTime, s:symbol, k:ticks } = candlesticks;
    let { o:open, h:high, l:low, c:close, v:volume, n:trades, i:interval, x:isFinal, q:quoteVolume, V:buyVolume, Q:quoteBuyVolume } = ticks;
    console.info(symbol+" "+interval+" candlestick update");
    console.info("open: "+open);
    console.info("high: "+high);
    console.info("low: "+low);
    console.info("close: "+close);
    console.info("volume: "+volume);
    console.info("isFinal: "+isFinal);
  });
  // binance.websockets.miniTicker(markets => {
  //   console.info(markets);
  // });

  // binance.balance((error, balances) => {
  //   if ( error ) return console.error(error);
  //   console.info("balances()", balances);
  //   console.info("ETH balance: ", balances.ETH.available);
  // });

});

router.get('/getKrakenBalanceUpdate', async function(req, res, next){

  const key          = 'o8FbXR9nQJ5wpmzpqEwRwXa4SbQUd4aqHFFjqv3/Ku96NNdMXoEyOKeA'; // API Key
  const secret       = 'nTorTROwWSsYYm7XMAEGuJP8vLScYNarsFS6kmLNWJqr3L1T1D3J3pA561fUrQ6vNkVw3Kd0YNedfhMUZVnynA=='; // API Private Key

  const kraken       =   new KrakenClient(key, secret);

  (async () => { 
    var balance = await kraken.api('Balance');
    console.log(balance.result['LINK'])

    var db = await conn;

    let arrayInsert = {}
      arrayInsert.coin_symbol = "LINK";
      arrayInsert.user_id = "60069ad77b061c5c4976f9a2";
      arrayInsert.available = balance.result['LINK'].toString()
      arrayInsert.coin_balance = balance.result['LINK'].toString()

    let where = {}
      where.coin_symbol = 'LINK';
      where.user_id = "60069ad77b061c5c4976f9a2";
        
    db.collection('user_wallet_kraken').updateOne(where , {$set: arrayInsert}, {"upsert": true}, function (err , response){
      if(err){
        console.log(err)
      }else{
        console.log("modified count ====> ", response.modifiedCount);
        console.log("upserted count ====>",  response.upsertedCount);
      }
    })
  })();
});

router.get('/getKrakenTradeHistory', async function(req, res, next){

  var  ofs          =0; 
  
      // const pair = 'QTUMXBT';
    const key          = 'lUebCZ1d6lIBzKYgkCLZrHEaJDs8ZouX2txJk3bX+H5xpsi9iurydmqC'; // API Key
    const secret       = '2bPmjql0h6QHNp1Fn0UqCllt8Cwg8qD0R5UV5UZMOiMgLotWTjPPw+97RrQ6P7Gz1Nr2VJ/RgcszVHNTiF+eJA=='; // API Private Key

    // console.log("asas")
    (async () => { 
      for (var i=1; i<10; i++){
        const kraken       =  new KrakenClient(key, secret, ofs);
        console.log('offset ====>', ofs)
        var openOrders = await kraken.api('TradesHistory');
        console.log(openOrders.result.trades)
        await helper.sleep(5000); 
        console.log("next")
        ofs          =ofs+50; 
      }
      
    })();
});

router.get('/useLocalStorage', async function(req, res, next){

  var LocalStorage = require('node-localstorage').LocalStorage,
  localStorage = new LocalStorage('./scratch');
  let arrayStore = ['as', 'asim', 'asim1']
  localStorage.setItem('Name', arrayStore) 
  console.log('get local storage data ==============>>>>',await localStorage.getItem('Name'))
  localStorage.removeItem('Name')
});

router.get('/webSockets', async function(req, res, next){

  const net = require("net") 

  const client = new net.Socket()
  client.connect(9999, "127.0.0.1") 
  let received = "" 
  client.on("data", data => { received += data, console.log(received) 

  }) 
  client.on("close", () => { console.log("connection closed") })










  // const net = require("net") 
  // const server = new net.Server()
  // server.listen({ host: "127.0.0.1", port: 9999 })
  // server.on("connection", client => { client.write("Hello ") }) 
  // const client = new net.Socket()
  // client.connect(9999, "127.0.0.1") 
  // let received = "" 
  // client.on("data", data => { received += data, console.log(received) // Hello 

  // }) 
  // client.on("close", () => { console.log("connection closed") })

});

router.get('/getKrakenBalance', async function(req, res, next){

  const secret = '2bPmjql0h6QHNp1Fn0UqCllt8Cwg8qD0R5UV5UZMOiMgLotWTjPPw+97RrQ6P7Gz1Nr2VJ/RgcszVHNTiF+eJA==';
  const key    = 'lUebCZ1d6lIBzKYgkCLZrHEaJDs8ZouX2txJk3bX+H5xpsi9iurydmqC';

  const kraken       =  new KrakenClient(key, secret);

  (async () => { 
    var balance = await kraken.api('Assets');
    console.log(balance)
  
  })();
});

router.get('/getOkexBalance', async function(req, res, next){

  var publicClient = new okex();
  var privateClient = new okex('614e9131-7079-49b5-b957-5ff3818f4144', '12C41B08BD1197F261AC9A9F645E2A34');
  
  // privateClient.getTrades(console.log)
  privateClient.addTrade(console.log, 'ethusdt', 'buy', '1', '1670');




});

router.get('/buzzleSolved', async function(req, res, next){

  let memberShipID = 55555;

  realDigits = await helper.puzzleFunction(memberShipID)
  if(realDigits.length > 1){
    realDigits = await helper.puzzleFunction(realDigits)
  }
  if(realDigits.length > 1){
    realDigits = await helper.puzzleFunction(realDigits)
  }
  // realDigits.length > 1 ? await helper.puzzleFunction(memberShipID) : console.log(realDigits)


  console.log(realDigits.length);
  console.log(realDigits);


});

router.get('/getKrakenTradeHistoryNew', async function(req, res, next){

  var  ofs          =0; 
  
      // const pair = 'QTUMXBT';
    const key          = 'lUebCZ1d6lIBzKYgkCLZrHEaJDs8ZouX2txJk3bX+H5xpsi9iurydmqC'; // API Key
    const secret       = '2bPmjql0h6QHNp1Fn0UqCllt8Cwg8qD0R5UV5UZMOiMgLotWTjPPw+97RrQ6P7Gz1Nr2VJ/RgcszVHNTiF+eJA=='; // API Private Key

    // console.log("asas")
    (async () => {
      var insertArray = [];
      var tradeHistory = []; 
      for (var i=1; i<10; i++){
        const kraken       =  new KrakenClient(key, secret);
        console.log('offset ====>', ofs)
        var openOrders = await kraken.api('QueryOrders');
        // console.log(openOrders.result.trades)

        console.log(openOrders)
        tradeHistory.push(openOrders.result.closed);
        insertArray = [
          ''
        ];
        // console.log(openOrders.result.closed);
        
        await helper.sleep(5000); 
        console.log("next")
        ofs          =ofs+50; 
      }
      console.log(unique(tradeHistory))
    })();
});

router.get('/hideKrakenUserWhoNotUsingBinanceHideInBinance',async function(req, res, next){
  var db = await conn;
  let sreach_criteria = {};
    sreach_criteria['api_key']    = {$exists : true, $ne: ""}; 
    sreach_criteria['api_secret'] = {$exists : true, $ne: ""}

   await db.collection('kraken_credentials').find({}, {user_id:1}).toArray((err, data)=> {
    if(err){
      throw err;
    }else{
      data.forEach(async function (itration){
        
        let whereFind ={}; 
          whereFind['_id'] = objectId(itration.user_id)
          whereFind['api_key']     =  {'$exists': false};   
          whereFind['api_secret']  =  {'$exists': false};
          
         await db.collection('users').find(whereFind).toArray((err, dataNew)=>{
          if (err){
            throw err;
          }else{
            if(dataNew.length > 0){
              console.log("admin_id of hide Users from binance investment report: ",(dataNew[0]._id).toString())

              let admin_id = {};
                admin_id['admin_id'] = (dataNew[0]._id).toString();

              let arraySet= {}
                arraySet['status'] = 'hideBinance';

                db.collection('user_investment_binance').updateOne(admin_id,  {$set: arraySet},  function(err , response){
                if(err){
                  throw err;
                }else{
                  // console.log()
                  console.log("modified count Hide ====> ", response.modifiedCount);
                }
              });
              // process.exit();
            } //end if
          } // end else
        })// end query

        let whereFindNew ={}; 
        whereFindNew['_id'] = objectId(itration.user_id)
        whereFindNew['api_key']     =  {'$exists': true};   
        whereFindNew['api_secret']  =  {'$exists': true};

         await db.collection('users').find(whereFindNew).toArray((err, dataNew1)=>{
          if (err){
            throw err;
          }else{
            if(dataNew1.length > 0){
              console.log("admin_id of both Users binance and kraken: ",(dataNew1[0]._id).toString())
              console.log("username: ",(dataNew1[0].username).toString())


              let admin_id = {};
                admin_id['admin_id'] = (dataNew1[0]._id).toString();

              let arraySet1= {}
                arraySet1['status'] = 'both';

               db.collection('user_investment_binance').updateOne(admin_id,  {$set: arraySet1}, function(err , response1){
                if(err){
                  throw err;
                }else{
                  console.log("modified count both ====> ", response1.modifiedCount);
                }
              });
              // process.exit();
            } //end if
          } // end else
        })// end query
        // await helper.sleep(5000); 
      });//end loop
    }//end else
  })//end query

  console.log('Done all Binance');
  let sreach_criteriaNew = {};
    sreach_criteriaNew['api_key']    = {$exists : false, $eq: ""}; 
    sreach_criteriaNew['api_secret'] = {$exists : false, $eq: ""}

  await db.collection('kraken_credentials').find({}, {user_id:1, api_key:1, api_secret:1}).toArray((err, dataUnset)=> {
    if(err){
      throw err;
    }else{
      dataUnset.forEach(async function (itrationNew){
      if(itrationNew.length > 0){
          let findWhere = {}
            findWhere['admin_id'] = (itrationNew.user_id).toString()

            db.collection('user_investment_binance').updateOne(findWhere, {$unset: {status: ""}}, function(err, returnResult){
              if(err){
                throw err;
              }else{
                console.log("modified count unset ====> ", returnResult.modifiedCount);
              }//end edle
            })//end query
          }//end if
      })//end loop
    }//end else
  })//end query

  console.log('Done all Kraken');
});//end route

router.get('/clusters', async function(req, res, next){

    const cps     = require('os').cpus().length
    const cluster = require('cluster');

    if(cluster.isMaster){
        for(let index = 0 ; index < cps ; index++){

            cluster.fork()
        }
        cluster.on('exit', (worker, code, signal) => {

            console.log(`worker ${worker.process.pid} died`);
        });
    }else{
        for (let index = 0; index < 1e8; index++) {
            
            
        }
        console.log(`${process.pid}`); 
        cluster.worker.kill()
        console.log('kill done')
    }

});

//FILLED_ERROR Orders Fixed Both Exchanges
router.get('/digieErrorOrdersFix', async function(req, res, next){

  console.log('not allowed to run without permission')
  process.exit(1)
  let currentTime = new Date();
  var olderDate=new Date(currentTime);
    olderDate.setDate(olderDate.getDate() - 1);
  console.log(olderDate)

  let searchLookup = [
    {
      '$match' : {
        application_mode :  'live',
        status           :  'FILLED_ERROR',
        created_date     :  {'$lte' : olderDate}, 
        cost_avg         :  {'$nin' : ['yes', 'taking_child']}
      }
    },

    {
      '$project' : {
        '_id'        : '$_id',
        'sell_price' : '$sell_price', 
      }
    }
  ]

  let db = await conn;
  let ordersBinance = await db.collection('buy_orders').aggregate(searchLookup).toArray()

  let ordersKraken  =  await db.collection('buy_orders_kraken').aggregate(searchLookup).toArray()

  console.log('binance count: ',ordersBinance.length)
  console.log('kraken  count: ',ordersKraken.length)

  for(var i = 1; i < ordersBinance.length ; i++){
    let UpdateArray = {
      status: "FILLED",
      trading_status: "complete",
      is_sell_order : "sold",
      fixed         : 'Asim_Node_Script',
      market_sold_price : ordersBinance[i]['sell_price'],
      // sell_fraction_filled_order_arr : {

      //   'orderFilledId'   : orderFilledId,
      //   'filledQty'       : filledQty,
      //   'sellOrderId'     : orderId,
      //   'sellTimeDate'    : new Date(),
      //   'filledPrice'     : parseFloat(ordersBinance[i]['sell_price']),
      //   'commission'      : commission,
      //   'commissionAsset' : commissionAsset,
      //   'commissionPercentRatio': percentComm
      // }

    }

    let find = {'_id' : new objectId(ordersBinance[i]['_id'].toString())}


     db.collection('buy_orders').updateOne(find, {$set: UpdateArray}, async(err, result) => {
      if(err){
        console.log("error")
      }else{
        console.log('update Count Binance: ', await result.modifiedCount)
      //  process.exit(1)
      }
    });

    console.log('loop count binance: ', i)

  }//end loop 

  console.log('binance all done');

  for(var i = 1; i < ordersKraken.length ; i++){
    let UpdateArray = {
      status: "FILLED",
      trading_status: "complete",
      fixed         : 'Asim_Node_Script',
      is_sell_order : "sold",
      market_sold_price : ordersKraken[i]['sell_price']
    }

    let find = {'_id' : new objectId(ordersKraken[i]['_id'].toString())}

     db.collection('buy_orders_kraken').updateOne(find, {$set: UpdateArray}, async (err, result) => {
      if(err){
        console.log("error")
      }else{
        console.log('update Count kraken: ', await result.modifiedCount)
      }
    });
    console.log('loop count kraken: ', i)

  }//end loop 
  console.log('kraken all done')
});
//Fixed Temp Ip Blocked Orders Fixed 
router.get('/tempApiBlockedErrorOrdersFixed', async function(req, res, next){

  console.log('permission Denied')
  process.exit(1)
  let db = await conn;
  let currentTime = new Date();
  let olderDate   = new Date(currentTime.setHours(currentTime.getHours() - 3))

  let findOrders = {
    application_mode  : "live",
    status            : {'$in': ["TEMPAPILOCK_ERROR", 'TEMPAPILOCK_ERROR_ERROR', 'TEMPAPILOCK_ERROR']},
    modified_date     : {'$lte': olderDate }
  }

  // orders collections reset 
  db.collection('orders').updateMany(findOrders, {$set: {status: "new", remove_error: "yes" }}, async(err, result)=> {
    if(err){
      console.log('err')
    }else{
      console.log('modified Orders Count binance: ', await result.modifiedCount)
    }
  });
  console.log('All Done Binance orders collections')

  db.collection('orders_kraken').updateMany(findOrders, {$set: {status: "new", remove_error: "yes"}}, async(err, result)=> {
    if(err){
      console.log('err')
    }else{
      console.log('modified Orders Count Kraken: ', await result.modifiedCount)
    }
  });
  console.log('All Done Kraken orders collections')

  //buy orders collections 
  db.collection('buy_orders_kraken').updateMany(findOrders, {$set: {status: "FILLED", remove_error: "yes",modified_date: new Date() }}, async(err, result)=> {
    if(err){
      console.log('err')
    }else{
      console.log('modified Orders Count Kraken: ', await result.modifiedCount)
    }
  });

  console.log('All Done Kraken')

   db.collection('buy_orders').updateMany(findOrders, {$set: {status: "FILLED", remove_error: "yes",modified_date: new Date() }}, async(err, results)=> {
    if(err){
      console.log('err')
    }else{
      console.log('modified Orders Count Binance: ', await results.modifiedCount)
    }
  });

  console.log('All Done Binance')
})
//Get ledger and delete Cancel orders
router.get('/getLedgerCancelOrdersDelete', async function(req, res, next){

  let getOrdersLookUp = [
    {
      '$match' : {

        application_mode : 'live',
        'admin_id'       :  '5c0912b7fc9aadaac61dd072',
        cavg_parent      : 'yes',
        count_avg_order  : {'$gt' : 0 },
        ledger_fixed     : {'$exists': false},
      }
    },
    {
      '$project' : {

        _id            :  1,
        avg_orders_ids :  1,
        count_avg_order:  1
      }
    },
    {
      '$limit' : 4
    }
  ];

  let db = await conn;
  let Orders = await db.collection('buy_orders').aggregate(getOrdersLookUp).toArray()
  
  console.log(Orders.length)

  for(var i = 0; i < Orders.length; i++){

    let count_order = Orders[i]['count_avg_order'];
    console.log('count',count_order)
    
    let find = {'_id' : new objectId(Orders[i]['_id'].toString() )}
      // db.collection('buy_orders').updateOne(find, {$set: {ledger_fixed: "yes"} } )

    //let ticker = Object.values(Orders[i]['avg_orders_ids']);

    let ticker = Orders[i]['avg_orders_ids'];

    for(var a = 0; a < ticker.length; a++){
     
      let findOrder = {

          '_id' : new objectId(ticker[a].toString()), 
          'status' : 'canceled'
        }

        // console.log(ticker)
      let orderFind = await db.collection('buy_orders').find(findOrder).toArray()

      console.log('cancel order Find count: ', orderFind.length )

      if(orderFind.length > 0){

        console.log('_id : ',orderFind[0]['_id'].toString())
        console.log('sell_order_id : ',orderFind[0]['sell_order_id'].toString())

        let deleteBuyOrder  =  {'_id' : new objectId(orderFind[0]['_id'].toString() )}
        let deleteSellOrder =  {'_id' : new objectId(orderFind[0]['sell_order_id'].toString() )}

        // let deleteCountBuy  = await db.collection('buy_orders').deleteOne(deleteBuyOrder)
        // console.log('buy delete count: ', deleteCountBuy.deletedCount)

        // let deleteCountSell = await db.collection('orders').deleteOne(deleteSellOrder)
        // console.log('sell delete count: ', deleteCountSell.deletedCount)


        if(count_order > 1){
          let count_order_new = count_order -1;
          

          console.log(a)

          // db.buy_orders.aggregate([{$match : {_id: ObjectId("60937e5573aada1ab89c255e")}},{$project: {avg_orders_ids: {'$arrayElemAt': ['$avg_orders_ids', a] }} }]).pretty()

          // all_buy_ids  and  avg_orders_ids    only update
          // db.collection('buy_orders').updateOne(find, {$set: {avg_sell_price:"", avg_price_all_upd:"", quantity_all:"", count_avg_order: count_order_new} } } )
          console.log('update order Count')
        }else{
          
          // db.collection('buy_orders').updateOne(find, {$unset: {quantity_all: "",count_avg_order: "", avg_orders_ids: "",avg_sell_price:"",avg_purchase_price:"",all_buy_ids:"",avg_all_date:"",avg_price_all_upd:"" }, {$set: {cost_avg: "yes"}} )
          console.log('sucessfully unset order ')
        }

      }



      // let count = await db.collection('buy_orders').countDocuments(findOrder)

      
    }
  }

})

router.get('/updateKrakenUsersTrading_ip', async function(req, res, next){
  let db = await conn;
  var match = {application_mode : 'both'} 
  let users =  await db.collection('users').find(match).toArray()

  console.log('users count:', users.length)
  for(var i= 0; i < users.length; i++){

    var match = { user_id : users[i]['_id'].toString()}
    var countcheck = await db.collection('kraken_credentials').updateOne(match, {$set: {trading_ip : users[i]['trading_ip'].toString() }})
  }
  console.log('All Done!!!')
})

router.get('/testingBasicAuth', async function(req, res, next){

  var dateFormat = require("dateformat");
  var now = new Date();


  // let currentTime = new Date();
  var olderDate=new Date(now);
    olderDate.setDate(olderDate.getDate() - 2);



  console.log(dateFormat(olderDate, "yyyy-mm-dd 00:00:00"));



  // let getAuthDetails = await  helper.authMdGet()


  // console.log('username ====>>',getAuthDetails.username)

  // console.log('password', getAuthDetails.password)



  // console.log(getAuthDetails)


  

  // const base64Credentials =  req.headers.authorization.split(' ')[1];
  // const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  // const userDetails = credentials.split(':');

  // let usernameApi = md5(userDetails[0])
  // let passwordApi = md5(userDetails[1])


  // if(username === usernameApi   &&  password == passwordApi){
  //   console.log('auth Correct')
  // }else{

  //   console.log('auth not correct')
  // }

})


router.get('/testingTwilio', async function(req, res, next){

  // const accountSid = 'AC446be32ee53c385a5123c0e54e528894'; // Your Account SID from www.twilio.com/console
  // const authToken = '5f96a25def1da9b05a72d7359fd969c4';   // Your Auth Token from www.twilio.com/console
  var twilio            =   require('twilio');
  var client = new twilio('AC446be32ee53c385a5123c0e54e528894', '5f96a25def1da9b05a72d7359fd969c4');
    
  client.messages.create({

    body : "testing",
    from: '+19083049127',
    to: '+923135936985'
  }).then(message => console.log(message));



  // client.calls.create({

  //   body : "testing",
  //   from: '+19083049127',
  //   to: '+923135936985'
  // }).then(call => console.log(call));


})

//binance pick Parent make no
router.get('/pickParentStatusCheckingAndRevert', async function(req, res, next) {
  console.log('permission denied!!!!')
  process.exit(0)
  let lookup = [ 
    {
      '$match' : {
        "application_mode" :  'both',
        // "username"        : "jamesparker",
        'is_api_key_valid'  :   'yes'
      }
    },

    {
      '$group' : {

        "_id"   : {'$toString' : '$_id'}
      }
    },

    {
      "$lookup": {
        "from": "buy_orders",
        "let": {
          "admin_id":  "$_id"
        },
        "pipeline": [
          {
            "$match": {
              "$expr": {
                "$eq": [
                  "$admin_id",
                  "$$admin_id"
                ]
              },
              "order_mode"  :  "live",
              "status"      :  "LTH",
              'cost_avg'    :  {'$nin' : ['yes',  'taking_child']}
            },
          },

          {
            '$group' : {

              "_id"   : '$admin_id',
              "count" :  {'$sum' : 1}
            }
          },

        ],
        "as": "new_data"
      }
    },
  ]
  let db = await conn;
  db.collection('users').aggregate(lookup, {'$allowDiskUse' : true}, async(err, result) => {
    if(err){

      console.log('mongodb error!!!!!!!!')
    }else{
      let response  = await result.toArray()
      for(var i=0 ; i < response.length; i++){
        let neew_data = (response[i]['new_data'])
        if(neew_data.length > 0){
          if(response[i]['new_data'][0]['count'] > 10){  
            let pickParentNo = {
              parent_status     : "parent",
              admin_id          :  (neew_data[0]['_id'].toString() ),
              application_mode  : 'live',
              pause_status      :  "play",
              status            :  {'$in'  : ['new', 'takingOrder']}
            }
            let count1 = await db.collection('buy_orders').countDocuments(pickParentNo);
            let count  = await db.collection('buy_orders').updateMany(pickParentNo, {'$set' : {pick_parent : "no"}})
            console.log('Loop:'+i+ '   LTH Orders Count: ' +neew_data[0]['count']+ '    update Parent count: '+count.modifiedCount+ '   admin_id '+ (neew_data[0]['_id'].toString())+ '    Parent count Total===>>>>' +count1 )
          }else{

            // console.log('Not update user_id ====>>>>', neew_data[0]['_id'].toString())
          }
        }
      }
    }
  })

  console.log('Done!!!!')

})

//kraken pick Parent make no
router.get('/pickParentStatusCheckingAndRevert_kraken', async function(req, res, next) {

  console.log('permission denied!!!!')
  process.exit(0)
  let lookup = [ 
    {
      '$group' : {

        "_id"   : {'$toString' : '$user_id'}
      }
    },

    {
      "$lookup": {
        "from": "buy_orders_kraken",
        "let": {
          "admin_id":  "$_id"
        },
        "pipeline": [
          {
            "$match": {
              "$expr": {
                "$eq": [
                  "$admin_id",
                  "$$admin_id"
                ]
              },
              "order_mode"  :  "live",
              "status"      :  "LTH",
              'cost_avg'    :  {'$nin' : ['yes',  'taking_child']}
            },
          },

          {
            '$group' : {

              "_id"   : '$admin_id',
              "count" :  {'$sum' : 1}
            }
          },
        ],
        "as": "new_data"
      }
    },
  
  ]
  let db = await conn;
  db.collection('kraken_credentials').aggregate(lookup, {'$allowDiskUse' : true}, async(err, result) => {
    if(err){

      console.log('mongodb error!!!!!!!!')
    }else{
      let response  = await result.toArray()
      for(var i=0 ; i < response.length; i++){
        let neew_data = (response[i]['new_data'])

        if(neew_data.length > 0){

          if(neew_data[0]['count'] > 10){
            let pickParentNo = {
              parent_status     : "parent",
              admin_id          :  (neew_data[0]['_id'].toString() ),
              application_mode  : 'live',
              pause_status      :  "play",
              status            :  {'$in'  : ['new', 'takingOrder']}
            }
            let count1 = await db.collection('buy_orders_kraken').countDocuments(pickParentNo);
            let count  = await db.collection('buy_orders_kraken').updateMany(pickParentNo, {'$set' : {pick_parent : "no"}})
            console.log('Loop: '+i +'   LTH order Count: '+ neew_data[0]['count'] + '   update Parent count: '+ count.modifiedCount, '   admin_id '+ (neew_data[0]['_id'].toString() )+ '   Parent count Total===>>>>'+count1 )
  
          }else{

            // console.log('Not Update user_id ===>>>',neew_data[0]['_id'].toString())
          }
        }
      }

    }
  })

})


router.get('/pricesSocket', async function(req, res, next){

  // const WebSocket = require('ws');
  // // // URL connection
  // const kline = new WebSocket("wss://dex.binance.org/api/ws/BNB_BTCB-1DE@kline_1h");

  // // Or Subscribe method
  // const conn = new WebSocket("wss://dex.binance.org/api/ws");
  // conn.onopen = function(evt) {
  //   conn.send(JSON.stringify({ method: "subscribe", topic: "kline_1h", symbols: ["BNB_BTCB-1DE"] }));
  // }

  
  // // URL connection
  // const allTickers = new WebSocket("wss://dex.binance.org/api/ws/$all@allTickers");

  // // Or Subscribe method
  // const conn = new WebSocket("wss://dex.binance.org/api/ws");
  // conn.onopen = function(evt) {
  //   conn.send(JSON.stringify({ method: "subscribe", topic: "allTickers", symbols: ["$all"] }));
  // }

})
