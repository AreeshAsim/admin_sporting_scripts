module.exports = {
    sumFunction: function(){
        return 20;
    },
    // new helper function

    // update_sub_document: (id, collection, value, field) => {
    //     return new Promise(resolve => {
    //         conn.then(db => {
    //             var upd_arr = {}
    //             let fieldObj = {}
    //             fieldObj[field] = value
    //             upd_arr['$push'] = fieldObj
    //             var where = {}
    //             where['_id'] = new ObjectId(id)
    //             db.collection(collection).updateOne(where, upd_arr, (err, result) => {
    //                 if (err) {
    //                     resolve(err)
    //                 } else {
    //                     resolve(result)
    //                 }
    //             })
    //         })
    //     })
    // },

    GetRandomAPIaccessToken:function() {
        let token_array = [
            'cf31f1bc3a0b3729f35832ff25c7f838',
            '34e0e2a1b05b11dccec3a1f0e55f12ed',
            'cd6d40934f1b41485a34e551961dea47',
            '674cf50e89bac56f29d1e7c919608247',
            'd34aaa3fb16773581167023ddda3b9b2',
            'e1812af878fb6323b022658aeab88981',
            '16f1f98832e8a22d334583d1b55ca74e',
            'e5f604c9e53e8bd397f7a0299a6c67ee',
            'ec4724447307c2973de0bda64c8ac4f7',
            'f221ca4ba18d776579cc442defd63c59',
            '2ef28a3a254745dd124b9425e2c54826',
            'cfa03debbee649ff160a6b74d83d8ff8',
            '95b119e31ad12564723790193f118231',
            '035b4ed3b93bae0e5f912acaf0dbb914',
            '647240ad2a6edd157c7986261d8527ee',
            '671837b9788b7f5b59f00815b74cd889',
            'df632a8d5703229bc031ce40e6dc16d9',
            '83c86ede18cc3bb07f9ecde100631f1e',
            '303da99664d5acc06de8ecda890ce52b',
            '81d1d45dbb19a90fdfae4f87865b136a',
            '63cdf744b7d76f27357ba1722da51ee6'
        ];
        return token_array[Math.floor(Math.random()*token_array.length)];
    },

    sleep:function(millis) {
        console.log('sleep run');
        return new Promise(function (resolve, reject) {
            setTimeout(function () { resolve(); }, millis);
        });
    },

    puzzleFunction:function(num){
        return new Promise(function (resolve, reject){
            var digits = num.toString().split('');
            let res = digits.map(Number).reduce((a,b) => a+b).toString();
            resolve(res)
        })
        
    },


    authMdGet: () => {
        return new Promise(function (resolve, reject) {
            
            var md5      = require('md5'); 
            let username = md5('asim');
            let password = md5('12345');


            let returnArray = {
                username : username,
                password : password
            }
            
            resolve(returnArray)

        })
    },





};