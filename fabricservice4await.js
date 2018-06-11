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


let client = new hfc();
var channel = client.newChannel('roberttestchannel12');
var order = client.newOrderer('grpc://192.168.23.212:7050');
//channel.addOrderer(order);
/*var  peer188 = client.newPeer('grpc://172.16.10.188:7051');
channel.addPeer(peer188);*/
var  peer = client.newPeer('grpc://192.168.23.212:7051');
channel.addPeer(peer);


/**
 *
 * 获取channel的区块链信息
 * @returns {Promise.<TResult>}
 *
 */
var getBlockChainInfo = async function() {



    return await getOrgUser4Local().then((user)=>{

        return channel.queryInfo(peer);

    } ,(err)=>{

        console.log('error', e);
    } )


}


/**
 * 获取当前区块的
 *
 * @param blocknum
 * @returns {Promise.<TResult>}
 *
 */
var getblockInfobyBlockNum = function (blocknum) {

    return getOrgUser4Local().then((user)=>{

        return channel.queryBlock(blocknum, peer,null);

    } ,(err)=>{

        console.log('error', e);
    } )

}


/**
 * 发起invoker查询
 *
 * @returns {Promise.<TResult>}
 */
var sendTransaction = function (  chaincodeid , func , chaincode_args , channel ) {


    var tx_id = null;

    return getOrgUser4Local().then((user)=>{

        tx_id = client.newTransactionID();
        var request = {

            chaincodeId: "cc_endfinlshed",
            fcn: "invoke",
            args: ["a","b","1"],
            chainId: "roberttestchannel12",
            txId: tx_id
        };


        return channel.sendTransactionProposal(request);

    } ,(err)=>{

        console.log('error', e);
    } ).then((chaincodeinvokresult )=>{


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

            return channel.sendTransaction(request);



        }



    },(err)=>{

        logger.error(err);
    }).then(( sendtransresult )=>{

        return sendtransresult;

    },(err)=>{
        logger.error(err);
    });

}


/**
 *
 * 根据cryptogen模块生成的账号通过Fabric接口进行相关的操作
 *
 * @returns {Promise.<TResult>}
 *
 */
function getOrgUser4Local() {

    //测试通过CA命令行生成的证书依旧可以成功的发起交易
    var keyPath = "/project/fabric_resart/config_demo/org1/186/fabric-user/msp/keystore";
    var keyPEM = Buffer.from(readAllFiles(keyPath)[0]).toString();
    var certPath = "/project/fabric_resart/config_demo/org1/186/fabric-user/msp//signcerts";
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


exports.getBlockChainInfo = getBlockChainInfo;

exports.sendTransaction = sendTransaction;