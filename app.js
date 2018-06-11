/**
 * Created by fengxiang on 2017/9/21.
 * QQ 411321681
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

var hfc = require('fabric-client');



var tempdir = "/project/ws_nodejs/fabric_sdk_node_studynew/fabric-client-kvs";

/*var client
var channel
var caClient
var order
var peer*/

var client = new hfc();


//1、设置相关的环境变量

//设置用于存储相关文件路径
var cryptoSuite = hfc.newCryptoSuite()
cryptoSuite.setCryptoKeyStore(hfc.newCryptoKeyStore({path:tempdir}))
client.setCryptoSuite(cryptoSuite)

//创建CA客户端
var caClient = new FabricCAService('http://192.168.23.212:7054',null, '' ,cryptoSuite);


//创建账本
var channel = client.newChannel('roberttestchannel12');

//创建order
var order = client.newOrderer('grpc://192.168.23.212:7050');
channel.addOrderer(order);

//创建节点
var  peer = client.newPeer('grpc://192.168.23.212:7051');
channel.addPeer(peer);



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

        let adminmember = yield getadminuser();
        //let adminmember = yield getResisteredUser('user88','org1');

        //根据区块链号获取区块信息
        let result =  yield channel.queryBlock(50, peer,null);

        console.info(  JSON.stringify(result ) )


        /*//let adminuser = yield helper.getAdminUser('org1')
        //let adminuser = yield getAdminUser1();

        console.info(  adminuser )*/

        //let result = yield startevents();

    }


)())





//2、设定client order caclient


//3、用admin账号登录下

//




function startevents() {


    var users = [
        {
            "username":"admin",
            "secret":"adminpw"
        }
    ]

    var username = 'admin'
    var password = 'adminpw'
    var member

    return hfc.newDefaultKeyValueStore( { path:tempdir } )
        .then( (store)=>{

            client.setStateStore(store);
            client._userContext = null;

            return client.getUserContext(username,true).then( (user)=>{

                if( user && user.isEnrolled() ){

                    console.info(` success enrolled admin `)


                    eh = client.newEventHub();
                    eh.setPeerAddr("grpc://192.168.23.212:7053");


                    try{


                        //区块监听
                        eh.registerBlockEvent(   (block)=>{

                                console.info(block)

                            } ,

                            (err)=>{

                                if(err.toString().indexOf('Connect Failed') >= 0) {
                                    console.error(   ` find a error on connect failed  `+err.stack)
                                }
                                else {
                                    console.error('Error function was called but found an unknown error '+err);
                                }

                            }



                        )

                        //监控chaincode
                        eh.registerChaincodeEvent( 'mycc','myname',( chaincodeevent )=>{
                                console.info( chaincodeevent )
                        },(err)=>{
                            console.error(err)
                        } )


                        //监控交易,主要是将监控交易是否被记录到区块链,目前还没有正式,估计是可以获取交易
                        //成功和失败,当交易被发起之后,并没有立即比记录到区块中。

                        //eh.registerTxEvent()

                        eh.connect();

                    }catch(err){

                        console.error(   ` find a error  `+err.stack)
                    }


                    return user;

                } else{

                    return caClient.enroll( {enrollmentID: username, enrollmentSecret: password} ).then(

                        (enrollment)=>{

                            console.info('Successfully enrolled user \'' + username + '\'');
                            member = new User(username)
                            member.setCryptoSuite( client.getCryptoSuite() )

                            return member.setEnrollment( enrollment.key,enrollment.certificate,'Org1MSP' )

                        }).then( ()=>{

                        client.setUserContext(member)






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




function getResisteredUser( username , userOrg ) {

    var member;
    var enrollmentSecret = null;

    return hfc.newDefaultKeyValueStore({path:tempdir}).then( (store)=>{
        client.setStateStore(store);
        client._userContext = null;

        return client.getUserContext(username,true).then((user)=>{

            if( user && user.isEnrolled() ){
                 console.info('Successfully loaded member from persistence');
                return user;
            }else{

                return getadminuser().then( (adminUser) => {

                    member = adminUser;
                    return caClient.register({ enrollmentID: username, affiliation: userOrg + '.depart1' }, member);

                } ).then( (secret)=>{

                    enrollmentSecret = secret;
                    console.info(username + ' registered successfully');
                    return caClient.enroll({ enrollmentID: username, enrollmentSecret: secret });

                } ,( err )=> {

                    console.error( '  enrool admin err    ' + err.stack)
                    return ''+ err

                }).then( (message)=>{


                    if (message && typeof message === 'string' && message.includes('Error:')) {

                        console.error(username + ' enrollment failed');
                        return message;
                    }

                    console.info(username + ' enrolled successfully');

                    member = new User(username);
                    member._enrollmentSecret = enrollmentSecret;
                    return member.setEnrollment(message.key, message.certificate, 'Org1MSP' );

                } ).then(()=>{

                    client.setUserContext(member);
                    return member;

                }).catch((err)=>{

                    console.error(util.format('%s enroll failed: %s', username, err.stack ? err.stack : err));
                    return '' + err;

                })

            }

        }).then((user)=>{
            return user;
        } ,(err)=>{
            console.error(''+err.stack)
        } ).catch((err)=>{

            console.error(' ' +err.stack)
        })


    } )

}






function getadminuser() {




    var username = 'user88'
    var password = 'peer2wd'
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







function getAdminUser1() {
    var users = [
        {
            "username":"admin",
            "secret":"adminpw"
        }
    ]
    var username = 'admin';
    var password = 'adminpw';
    var member;


    //var client = getClientForOrg(userOrg);



    return hfc.newDefaultKeyValueStore({path: tempdir}).then((store) => {
        client.setStateStore(store);
        // clearing the user context before switching
        client._userContext = null;
        return client.getUserContext(username, true).then((user) => {
            if (user && user.isEnrolled()) {
                 console.info('Successfully loaded member from persistence');
                return user;
            } else {
               // let caClient = caClients[userOrg];
                // need to enroll it with CA server
                return caClient.enroll({
                    enrollmentID: username,
                    enrollmentSecret: password
                }).then((enrollment) => {
                     console.info('Successfully enrolled user \'' + username + '\'');
                    member = new User(username);
                    member.setCryptoSuite(client.getCryptoSuite());
                    return member.setEnrollment(enrollment.key, enrollment.certificate, "Org1MSP");
                }).then(() => {
                    return client.setUserContext(member);
                }).then(() => {
                    return member;
                }).catch((err) => {
                    console.error('Failed to enroll and persist user. Error: ' + err.stack ? err.stack : err);
                    return null;
                });
            }
        });
    });
};