var co = require('co');
var httpclient = require('./bitcoindservice');



/*(co( function * () {

    let content = yield httpclient.httpget("http://www.hao123.com");
    console.info(content);

}

));*/


/*co((function * () {

    let content = yield httpclient.httpget("http://www.hao123.com");
    console.info(content);

})())*/


/*(co( function * () {

        let content = yield httpclient.httppostsimple("http://localhost/eshowcm1/index.php/m/nodeposttest",{a:'aaaa',b:'bbbbbbb'})
        console.info(content);

    }

));*/



(co( function * () {

        let content = yield httpclient.bithttppost("http://192.168.23.212", 33133 , {"jsonrpc": "1.0", "id":"curltest", "method": "getblockchaininfo", "params": [] },'root','111111' )
        console.info(content);

    }

));


//注册异常处理器
process.on('unhandledRejection', function (err) {
    console.error(err.stack);
});

process.on(`uncaughtException`, console.error);