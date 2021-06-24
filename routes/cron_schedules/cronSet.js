const cron = require('node-cron');
const priceTicket = require("../cronJobs/conFirst")

module.exports = {

    saveCurrentMarketPrice : ()=>{
            cron.schedule('* * * * * *', () => {
            priceTicket.price();
        });
    },//End of saveCurrentMarketPrice
}