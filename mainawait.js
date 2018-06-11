
var fabricservice = require('./fabricservice.js')

/*
var start = async function () {



    try {

        var blockchaininfo = await fabricservice.getBlockChainInfo();
        console.info(  JSON.stringify(blockchaininfo ) )




    } catch (err) {
        console.log(err); // 这里捕捉到错误 `error`
    }


};

start();
*/


/*var blockchaininfo = fabricservice.getBlockChainInfo();
console.info(  JSON.stringify(blockchaininfo ) )*/


(async ()=> {

    let blockchaininfo = await fabricservice.getBlockChainInfo();
    console.info(  JSON.stringify(blockchaininfo ) )



})();

