

    module.exports ={
        price: ()=>{
          conn.then((db)=>{
              db.collection('coins').find({'user_id':'global'}).sort( { '_id':-1} ).toArray((err,coinsArr)=>{
                if(err){
                  console.log(err);          
                }else{
                  if(coinsArr.length >0){
                      for (const key of coinsArr) {
                        let coin = key.symbol;
                        if(typeof coin !== 'undefined'){
                          binance.prices(coin, (error, ticker) => {
                            let updquery = {};
      
                          if(typeof ticker[coin] !== 'undefined'){
                            updquery['price'] = parseFloat(ticker[coin]);
                            updquery['coin'] = coin;
                            updquery['created_date'] = new Date();
                            let set = {};
                             set['$set'] = updquery;
                            let query = {};
                            query['coin'] = coin;
                            let upsert = {};
                                upsert['upsert'] = true;
                            db.collection('market_prices').updateOne(query,set,upsert,(err,success)=>{
                              if(err) throw err;
                              console.log('market prices Updated');
                            })
                          }//ticker coin undefinded
                        });//End binance call
                      }//End undefined
                  }//End iterator
                }//End lengh >0
                 // console.log(coinsArr);
              }//End success
            })//End Query
          }).catch((err)=>{
            console.log(err);
          }) //End of db connectin Promise
        }//End of price
      }//End of Export
      
