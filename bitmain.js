var co = require('co');
var bitcoindservice = require('./bitcoindservice')
var express = require('express');


var app = express();


var bitcoind_host = "http://192.168.23.212";
var bitcoind_port = 33133;
var bitcoind_username = "root";
var bitcoind_passwd = "111111";

//获取当前比特币系统的区块信息

app.get('/getblockchaininfo', function (req, res) {

    co( function * () {

        var bitcommand = {"jsonrpc": "1.0", "id":"curltest", "method": "getblockchaininfo", "params": [] };
        let content = yield bitcoindservice.bithttppost(bitcoind_host, bitcoind_port , bitcommand ,bitcoind_username,bitcoind_passwd);
        res.send( content );


    }).catch((err) => {
        res.send(err);
    })

});


//获取当前比特币系统的网络信息
app.get('/getnetworkinfo', function (req, res) {

    co( function * () {

        var bitcommand = {"jsonrpc": "1.0", "id":"curltest", "method": "getnetworkinfo", "params": [] };
        let content = yield bitcoindservice.bithttppost(bitcoind_host, bitcoind_port , bitcommand ,bitcoind_username,bitcoind_passwd);
        res.send( content );


    }).catch((err) => {
        res.send(err);
    })


});


//获取当前钱包信息
app.get('/getwalletinfo', function (req, res) {

    co( function * () {

        var bitcommand = {"jsonrpc": "1.0", "id":"curltest", "method": "getwalletinfo", "params": [] };
        let content = yield bitcoindservice.bithttppost(bitcoind_host, bitcoind_port , bitcommand ,bitcoind_username,bitcoind_passwd);
        res.send( content );


    }).catch((err) => {
        res.send(err);
    })


});


//根据区块的高度获取区块链的hash值
app.get('/getblockhash', function (req, res) {

    co( function * () {

        var bitcommand = {"jsonrpc": "1.0", "id":"curltest", "method": "getblockhash", "params": [0] };
        let content = yield bitcoindservice.bithttppost(bitcoind_host, bitcoind_port , bitcommand ,bitcoind_username,bitcoind_passwd);
        res.send( content );


    }).catch((err) => {
        res.send(err);
    })


});


//根据区块的hash值，获取区块链的详细信息
app.get('/getblock', function (req, res) {

    co( function * () {

        var bitcommand = {"jsonrpc": "1.0", "id":"curltest", "method": "getblock", "params": ["000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f"] };
        let content = yield bitcoindservice.bithttppost(bitcoind_host, bitcoind_port , bitcommand ,bitcoind_username,bitcoind_passwd);
        res.send( content );


    }).catch((err) => {
        res.send(err);
    })


});


//模拟发起一笔交易


app.get('/sendTransaction', function (req, res) {

    co( function * () {



    }).catch((err) => {
        res.send(err);
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