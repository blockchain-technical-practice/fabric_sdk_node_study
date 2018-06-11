/**
 * Created by fengxiang on 2017/9/21.
 *
 * 通过本地的证书文件和配置文件来访问远程的peer
 *
 */

var co = require('co');
var http = require('http');
var path = require('path');
var fs = require('fs');
var util = require('util');
var hfc = require('fabric-client');
var Peer = require('fabric-client/lib/Peer.js');
var EventHub = require('fabric-client/lib/EventHub.js');
var User = require('fabric-client/lib/User.js');
var crypto = require('crypto');
var FabricCAService = require('fabric-ca-client');

var hfc = require('fabric-client');

var log4js = require('log4js');
var logger = log4js.getLogger('Helper');
logger.setLevel('DEBUG');

var tempdir = "/project/ws_nodejs/fabric_sdk_node_studynew/fabric-client-kvs";
//var tempdir = "/project/opt_fabric/fabricconfig/crypto-config/peerOrganizations/org1.robertfabrictest.com/users/Admin@org1.robertfabrictest.com/msp/keystore"

var client
// channel
var caClient
//var order
//var peer

var client = new hfc();
var superagent = require('superagent');

//1、设置相关的环境变量

//设置用于存储相关文件路径
/*var cryptoSuite = hfc.newCryptoSuite()
cryptoSuite.setCryptoKeyStore( hfc.newCryptoKeyStore({path:tempdir} ) )


client.setCryptoSuite(cryptoSuite)*/

//创建CA客户端
//var caClient = new FabricCAService('http://192.168.23.212:7054',null, '' ,cryptoSuite);


//创建账本
var channel = client.newChannel('roberttestchannel');

//创建order
var order = client.newOrderer('grpc://192.168.23.212:7050');
channel.addOrderer(order);
//创建节点

//创建节点
/*var  peer188 = client.newPeer('grpc://172.16.10.188:7051');
channel.addPeer(peer188);*/

var  peer = client.newPeer('grpc://192.168.23.212:7051');
channel.addPeer(peer);

//创建另外的节点
/*var  peer186 = client.newPeer('grpc://172.16.10.186:7051');
channel.addPeer(peer186);*/



/*getadminuser().then((member)=>{
    return channel.queryBlock(2, peer);
},(err)=>{
    console.error('Failed to get submitter "' + err.stack + '"')
}).then((reponse)=>{
    console.info( reponse  )
    return reponse
},(err)=>{
    console.error(err.stack)
}).catch((err)=>{
    console.error(err.stack)
})*/




co(( function *() {

        //let adminmember = yield getadminuser();
        //let adminmember = yield getResisteredUser('admin','org1');
        var a = 1

        //根据本地证书而不是依赖CA的方式获取管理员账号信息
        let member = yield getOrgUser4Local();

        ///    =========  系统信息查询相关API ==========

        //获取当前peer服务器的信息
        /*let resultpeerinfo = yield channel.queryInfo(peer)
        console.info(  JSON.stringify(resultpeerinfo ) )*/

        //根据区块编号获取区块信息
        /*let blockinfobyNum =  yield channel.queryBlock(178, peer,null);
        console.info(  JSON.stringify( blockinfobyNum ) )
        */

        //根据区块链HASH获取区块详细信息
        /*let blockinfobyhash = yield channel.queryBlockByHash(new Buffer("ec298dc1cd1f0e0a3f6d6e25b5796e7b5e4d668aeb6ec3a90b4aa6bb1a7f0c17","hex"),peer)
        console.info(  JSON.stringify(blockinfobyhash ) )*/


        //查询Peer节点加入的所有通道
        /*let resultchannels = yield client.queryChannels(peer)
        console.info(  JSON.stringify( resultchannels ) )*//*let resultchannels = yield client.queryChannels(peer)
        console.info(  JSON.stringify( resultchannels ) )*/

        //查询已经install的chaincode

        /*let resultchannels = yield client.queryInstalledChaincodes(peer)
        console.info(  JSON.stringify( resultchannels ) )*/


        // 查询已经实例化的Chaincode
       /* let chaincodeinstalls = yield channel.queryInstantiatedChaincodes( peer )
        console.info(  JSON.stringify( chaincodeinstalls ) )*/


        //根据交易编号获取交易详细信息

       /* let resulttxinfo = yield channel.queryTransaction("56f51f9a54fb4755fd68c6c24931234a59340f7c98308374e9991d276d7d4a96", peer);
        console.info(  JSON.stringify( resulttxinfo ) )*/



       //获取通道的配置信息

        tx_id = client.newTransactionID();
        let g_request = {
            txId :     tx_id
        };

       let r2 = yield channel.getChannelConfig();

       let channeljoinorgs = r2['config']['channel_group']['groups']['map']['Application']['value']['groups']['map'];
       let join_groups = [];

       for( orgkey in channeljoinorgs ){
           join_groups.push(orgkey);
       }


        console.info( join_groups );

       let r1 = yield channel.getGenesisBlock(g_request);
       let data = r1['data']['data'][0]['buffer'].toString('utf-8');







       /*console.info(  r1['header']['data_hash'] )
       console.info(  r1['data']['data'][0] )*/
       //console.info( data );

       /* var response = superagent.post("http://127.0.0.1:8188/protolator/decode/common.Block", r1['data']['data'][0]['buffer'])
            .buffer()
            .end((err, res) => {

                if(err) {
                    logger.error(err);
                    return;
                }

                config_proto = res.body;
            });
*/


        //======  系统管理相关API ============






        //// =====  chaincode 类 API ==========




        // 3、调用Chaincode

        //查询  查询方法只要不涉及数据的写入，都是可以调用的

        /*tx_id = client.newTransactionID();
        var request = {
            chaincodeId: "cc_endorse",
            txId: tx_id,
            fcn: "invoke",
            args: ["GetTxID","akey","333333333 hahaha lst key dddddd this is last version"]
        };

        let chiancodequeryresutl = yield channel.queryByChaincode( request , peer );


        for (let i = 0; i < chiancodequeryresutl.length; i++) {
            console.info('Query Response ' + chiancodequeryresutl[i].toString( 'utf8' ) );
            //return response_payloads[i].toString('utf8');
        }*/

        //console.info( JSON.stringify( chiancodequeryresutl ) )



        //发起交易


        //let targets = {peer};

        /*let tx_id = client.newTransactionID();
        var request = {
            targets: peer,
            chaincodeId: "cc_endorse1",
            fcn: "invoke",
            args: ["a","b","1"],
            chainId: "roberttestchannel",
            txId: tx_id
        };

        let chaincodeinvokresult = yield channel.sendTransactionProposal(request);

        var proposalResponses = chaincodeinvokresult[0];
        var proposal = chaincodeinvokresult[1];
        var header = chaincodeinvokresult[2];
        var all_good = true;

        for (var i in proposalResponses) {

            let one_good = false;
            if (proposalResponses && proposalResponses[0].response &&
                proposalResponses[0].response.status === 200) {
                one_good = true;
                console.info('transaction proposal was good');
            } else {
                console.error('transaction proposal was bad');
            }
            all_good = all_good & one_good;
        }

        if (all_good) {

            console.info(util.format(

                'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
                proposalResponses[0].response.status, proposalResponses[0].response.message,
                proposalResponses[0].response.payload, proposalResponses[0].endorsement
                    .signature));


            var request = {
                proposalResponses: proposalResponses,
                proposal: proposal,
                header: header
            };
            // set the transaction listener and set a timeout of 30sec
            // if the transaction did not get committed within the timeout period,
            // fail the test
            var transactionID = tx_id.getTransactionID();
            var sendPromise = yield  channel.sendTransaction(request);

            var eventPromises = [];

            var eh = client.newEventHub();
            eh.setPeerAddr("grpc://192.168.23.212:7051")

            eh.connect();

            let txPromise = new Promise((resolve, reject) => {
                let handle = setTimeout(() => {
                    eh.disconnect();
                    reject();
                }, 30000);

                eh.registerTxEvent(transactionID, (tx, code) => {
                    clearTimeout(handle);
                    eh.unregisterTxEvent(transactionID);
                    eh.disconnect();

                    if (code !== 'VALID') {
                        logger.error(
                            'The balance transfer transaction was invalid, code = ' + code);
                        reject();
                    } else {
                        logger.info(
                            'The balance transfer transaction has been committed on peer ' +
                            eh._ep._endpoint.addr);
                        resolve();
                    }
                });
            });
            eventPromises.push(txPromise);



        }

        console.info(all_good)*/


        //let adminuser = yield helper.getAdminUser('org1')
        //let adminuser = yield getAdminUser1();

        //console.info(  adminuser )

       // let result = yield startevents();


        /**
         *
         *  =====   多方背书  ==============
         *
         *
         * @type {TransactionID}
         */

        ///// =====   多方背书  ==============

        /*var myArray=[];
        myArray.push(peer);
        myArray.push(peer190);*/

        /*let tx_id = client.newTransactionID();
        var request = {

            chaincodeId: "cc_endfinlshed",
            fcn: "invoke",
            args: ["a","b","1"],
            chainId: "roberttestchannel12",
            txId: tx_id
        };

        let chaincodeinvokresult = yield channel.sendTransactionProposal(request);

        var proposalResponses = chaincodeinvokresult[0];
        var proposal = chaincodeinvokresult[1];
        var header = chaincodeinvokresult[2];
        var all_good = true;

        for (var i in proposalResponses) {

            let one_good = false;
            if (proposalResponses && proposalResponses[0].response &&
                proposalResponses[0].response.status === 200) {
                one_good = true;
                console.info('transaction proposal was good');
            } else {
                console.error('transaction proposal was bad');
            }
            all_good = all_good & one_good;
        }

        if (all_good) {

            console.info(util.format(

                'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
                proposalResponses[0].response.status, proposalResponses[0].response.message,
                proposalResponses[0].response.payload, proposalResponses[0].endorsement
                    .signature));


            var request = {
                proposalResponses: proposalResponses,
                proposal: proposal,
                header: header
            };
            // set the transaction listener and set a timeout of 30sec
            // if the transaction did not get committed within the timeout period,
            // fail the test
            var transactionID = tx_id.getTransactionID();
            var sendPromise = yield  channel.sendTransaction(request);

            var eventPromises = [];

            var eh = client.newEventHub();
            eh.setPeerAddr("grpc://192.168.23.212:7051")

            eh.connect();

            let txPromise = new Promise((resolve, reject) => {
                let handle = setTimeout(() => {
                    eh.disconnect();
                    reject();
                }, 30000);

                eh.registerTxEvent(transactionID, (tx, code) => {
                    clearTimeout(handle);
                    eh.unregisterTxEvent(transactionID);
                    eh.disconnect();

                    if (code !== 'VALID') {
                        logger.error(
                            'The balance transfer transaction was invalid, code = ' + code);
                        reject();
                    } else {
                        logger.info(
                            'The balance transfer transaction has been committed on peer ' +
                            eh._ep._endpoint.addr);
                        resolve();
                    }
                });
            });
            eventPromises.push(txPromise);


        }

        console.info(all_good)*/

    }


)())




//2、设定client order caclient

//3、用admin账号登录下

//


/**
 *
 * 根据cryptogen模块生成的账号通过Fabric接口进行相关的操作
 *
 * @returns {Promise.<TResult>}
 *
 */
function getOrgUser4Local() {


        var keyPath = "/project/opt_fabric/fabricconfig/crypto-config/peerOrganizations/org1.robertfabrictest.com/users/Admin@org1.robertfabrictest.com/msp/keystore";
        var keyPEM = Buffer.from(readAllFiles(keyPath)[0]).toString();
        var certPath = "/project/opt_fabric/fabricconfig/crypto-config/peerOrganizations/org1.robertfabrictest.com/users/Admin@org1.robertfabrictest.com/msp/signcerts";
        var certPEM = readAllFiles(certPath)[0].toString();



        return hfc.newDefaultKeyValueStore({

            path:tempdir

        }).then((store) => {
            client.setStateStore(store);

            return client.createUser({
                username: 'Admin',
                mspid: 'Org1MSP',
                cryptoContent: {
                    privateKeyPEM: keyPEM,
                    signedCertPEM: certPEM
                }
            });
        });

    //测试通过CA命令行生成的证书依旧可以成功的发起交易
    /*var keyPath = "/project/fabric_resart/config_demo/org1/186/fabric-user/msp/keystore";
    var keyPEM = Buffer.from(readAllFiles(keyPath)[0]).toString();
    var certPath = "/project/fabric_resart/config_demo/org1/186/fabric-user/msp//signcerts";
    var certPEM = readAllFiles(certPath)[0].toString();


    return hfc.newDefaultKeyValueStore({

        path:tempdir

    }).then((store) => {
        client.setStateStore(store);

        return client.createUser({
            username: 'user87',
            mspid: 'Org1MSP',
            cryptoContent: {
                privateKeyPEM: keyPEM,
                signedCertPEM: certPEM
            }
        });
    });*/
};




function readAllFiles(dir) {
    var files = fs.readdirSync(dir);
    var certs = [];
    files.forEach((file_name) => {
        let file_path = path.join(dir,file_name);
        let data = fs.readFileSync(file_path);
        certs.push(data);
    });
    return certs;
}



//// 备份的代码块

/***
 channel.queryInstantiatedChaincodes(peer).then((response)=>{


            var details = [];
            for (let i = 0; i < response.chaincodes.length; i++) {
                let detail={}
                logger.info('name: ' + response.chaincodes[i].name + ', version: ' +
                    response.chaincodes[i].version + ', path: ' + response.chaincodes[i].path
                );
                detail.name=response.chaincodes[i].name
                detail.version=response.chaincodes[i].version
                detail.path=response.chaincodes[i].path
                details.push(detail);
            }

        })

 */


process.on('unhandledRejection', function (err) {
    console.error(err.stack);
});

process.on(`uncaughtException`, console.error);

