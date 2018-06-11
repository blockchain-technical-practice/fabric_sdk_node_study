var co = require('co');
var fabricservice = require('./fabricservice.js')
var express = require('express');


var app = express();


var channelid = "qklszznscfchannel";
var chaincodeid = "qklszznscfcc";


//供应商发起供货交易
app.get('/sendTransaction1', function (req, res) {

    co( function * () {
        var blockinfo = yield fabricservice.sendTransaction(chaincodeid,"invoke",["putvalue","tans_id1","1"],channelid);
        res.send( "success" );
    })


});


//核心企业发起确认
app.get('/sendTransaction2', function (req, res) {

    co( function * () {
        var blockinfo = yield fabricservice.sendTransaction(chaincodeid,"invoke",["putvalue","tans_id1","2"],channelid);
        res.send( "success" );
    })


});

//金融机构审核并放款
app.get('/sendTransaction3', function (req, res) {

    co( function * () {
        var blockinfo = yield fabricservice.sendTransaction(chaincodeid,"invoke",["putvalue","tans_id1","100"],channelid);
        res.send( "success" );
    })


});


//查询交易记录
app.get('/queryhistory', function (req, res) {

    co( function * () {
        var blockinfo = yield fabricservice.sendTransaction(chaincodeid,"invoke",["gethistory","tans_id1","-1"],channelid);
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