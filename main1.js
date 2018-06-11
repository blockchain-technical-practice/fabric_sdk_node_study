var co = require('co');
var fabricservice = require('./fabricservice4await')
var testfun = require('./functest.js')
var express = require('express');


var app = express();

app.get('/getchannelheight', function (req, res) {


        var blockinfo = fabricservice.getBlockChainInfo();

        blockinfo.then((data)=>{
            res.send(  JSON.stringify(data ) );
        });


});


app.get('/sendtrans', function (req, res) {

    co( function * () {

        var blockinfo = yield fabricservice.sendTransaction();
        res.send( "success" );
    })


});





//启动http服务
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});


//注册异常处理器
process.on('unhandledRejection', function (err) {
    console.error(err.stack);
});

process.on(`uncaughtException`, console.error);