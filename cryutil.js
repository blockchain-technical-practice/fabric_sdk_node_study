/**
 * Created by shouhewu on 6/11/17.
 */
var util=require('fabric-ca-client/lib/utils')
var fs=require('fs')


var cryptoSuit=util.newCryptoSuite({algorithm:'ec',hash:'sha2'})
var cryptoKeyStore=util.newCryptoKeyStore({path: '/tmp/app-state-store'})
cryptoSuit.setCryptoKeyStore(cryptoKeyStore)

/*cryptoSuit.generateKey().then(key => {
    //generate csr
    var csr =key.generateCSR('CN=gcc2ge')
    console.info(csr)

}).catch(err => {
    console.info(err)
});*/


//get private key by ski
//create private key
cryptoSuit.getKey('8a4ed8278fd021fddcad61d3691f086da70dc19c40d243a7da4029c88cdd9ae9').then(key=>{
    console.info( key._key.prvKeyHex )
    // console.info(key.getSKI())
    var pkey=key.getPublicKey()
    console.info( pkey._key.pubKeyHex )
}).catch(err =>{
    console.info( err )
})


//import private key
/*
var key=fs.readFileSync(__dirname+"/artifacts/users/User1@org1.example.com/msp/keystore/9f333d17a7770b9bac7fec965a203a50f04080b11e3cf336b474719b6fc2f863_sk")
cryptoSuit.importKey(key).then(key =>{
    console.info(key)
})
*/