/**
 * Created by fengxiang on 2017/9/21.
 *
 * 通过本地的证书文件和配置文件来访问远程的peer
 *
 */

var co = require('co');
var path = require('path');
var fs = require('fs');
var util = require('util');
var hfc = require('fabric-client');
var Peer = require('fabric-client/lib/Peer.js');
var EventHub = require('fabric-client/lib/EventHub.js');
var User = require('fabric-client/lib/User.js');
var crypto = require('crypto');
var FabricCAService = require('fabric-ca-client');

var log4js = require('log4js');
var logger = log4js.getLogger('Helper');
logger.setLevel('DEBUG');

var tempdir = "/project/ws_nodejs/fabric_sdk_node_studynew/fabric-client-kvs";
//var tempdir = "/project/opt_fabric/fabricconfig/crypto-config/peerOrganizations/org1.robertfabrictest.com/users/Admin@org1.robertfabrictest.com/msp/keystore"

//var client
// channel
//var caClient
//var order
//var peer

var client = new hfc();
//1、设置相关的环境变量

//设置用于存储相关文件路径
var cryptoSuite = hfc.newCryptoSuite()
cryptoSuite.setCryptoKeyStore( hfc.newCryptoKeyStore({ path:tempdir } ) )
client.setCryptoSuite(cryptoSuite)

//创建CA客户端
var caClient = new FabricCAService('http://192.168.23.212:7054',null, '' ,cryptoSuite);


//创建账本
var channel = client.newChannel('roberttestchannel12');

//创建order
var order = client.newOrderer('grpc://192.168.23.212:7050');
channel.addOrderer(order);
//创建节点

//创建节点
var  peer188 = client.newPeer('grpc://172.16.10.188:7051');
channel.addPeer(peer188);


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
        //var a = 1

        /* var username = 'user88'
           var password = 'peer2wd'*/
        //根据本地证书而不是依赖CA的方式获取管理员账号信息
        let member = yield getOrgUser4FabricCa("user88","peer2wd");


        ///    =========  系统信息查询相关API ==========


        //获取当前peer服务器的信息
        /*let resultpeerinfo = yield channel.queryInfo(peer)
        console.info(  JSON.stringify(resultpeerinfo ) )*/



    }


)())





//2、设定client order caclient


//3、用admin账号登录下

//


/**
 *
 * 通过CA获取当前用户的证书信息
 *
 * @param username
 * @param password
 * @returns {Promise.<TResult>}
 *
 */
function getOrgUser4FabricCa(username,password) {


    var member

    return hfc.newDefaultKeyValueStore({path:tempdir})
        .then( (store)=>{

            client.setStateStore(store);
            client._userContext = null;

            return client.getUserContext(username,true).then( (user)=>{

                if( user && user.isEnrolled() ){

                    console.info(` success enrolled admin `)
                    return user;

                } else{

                    return caClient.enroll( {enrollmentID: username, enrollmentSecret: password} ).then(

                        (enrollment)=>{

                            console.info('Successfully enrolled user \'' + username + '\'');
                            member = new User(username)
                            member.setCryptoSuite( client.getCryptoSuite() )

                            return member.setEnrollment( enrollment.key,enrollment.certificate,'Org1MSP' )

                        }).then( ()=>{

                        return client.setUserContext(member)

                    } ).then(()=>{

                            return member

                        }
                    ).catch((err)=>{
                        console.error('enroll admin error'+err.stack)
                        return null
                    })


                }

            } )

        } )

}


//通过证书
function getOrgAdmin4Local() {




   /* var keyPath = "/project/opt_fabric/fabricconfig/crypto-config/peerOrganizations/org1.robertfabrictest.com/users/Admin@org1.robertfabrictest.com/msp/keystore";
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

    */

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