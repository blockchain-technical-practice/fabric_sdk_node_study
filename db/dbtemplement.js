var blocks = {
    'channelname':channelname,
    'blocknum':blocknum,
    'datahash':datahash,
    'perhash':perhash,
    'txcount':txcount,
    'createdt':createdt,
    'remark':remark,
};
var ca = {
    'org_name':org_name,
    'ca_name':ca_name,
    'ca_request':ca_request,
    'ca_config_path':ca_config_path,
    'createdt':createdt,
    'remark':remark,
};
var chaincodes = {
    'peerid':peerid,
    'channelname':channelname,
    'name':name,
    'version':version,
    'path':path,
    'escc':escc,
    'vscc':vscc,
    'txcount':txcount,
    'ccstatus':ccstatus,
    'createdt':createdt,
    'remark':remark,
};
var channel = {
    'channelname':channelname,
    'blocks':blocks,
    'countblocks':countblocks,
    'trans':trans,
    'createdt':createdt,
    'remark':remark,
};
var keyset = {
    'channelname':channelname,
    'blocknum':blocknum,
    'blockhash':blockhash,
    'transactionhash':transactionhash,
    'keyname':keyname,
    'isdelete':isdelete,
    'chaincode':chaincode,
    'transnums':transnums,
    'createdt':createdt,
    'remark':remark,
};
var orderer = {
    'blocknum':blocknum,
    'datahash':datahash,
    'orderer_config':orderer_config,
    'createdt':createdt,
    'remark':remark,
};
var org = {
    'name':name,
    'mspid':mspid,
    'adminkey':adminkey,
    'admincert':admincert,
    'createdt':createdt,
    'remark':remark,
};
var org_ref_channel = {
    'name':name,
    'channelid':channelid,
};
var peer = {
    'mspid':mspid,
    'name':name,
    'requests':requests,
    'events':events,
    'peer_config':peer_config,
    'createdt':createdt,
    'remark':remark,
};
var peer_ref_channel = {
    'peer_name':peer_name,
    'channelname':channelname,
};
var transaction = {
    'channelname':channelname,
    'blocknum':blocknum,
    'blockhash':blockhash,
    'txhash':txhash,
    'txcreatedt':txcreatedt,
    'chaincodename':chaincodename,
    'createdt':createdt,
    'remark':remark,
};
var write_lock = {
    'write_lock':write_lock,
};


var keyset_history = {
    'channelname':channelname,
    'blocknum':blocknum,
    'blockhash':blockhash,
    'transactionhash':transactionhash,
    'keyname':keyname,
    'values':values,
    'trandtstr':trandtstr,
    'remark':remark,
};

var keyset = {
    'channelname':channelname,
    'blocknum':blocknum,
    'blockhash':blockhash,
    'transactionhash':transactionhash,
    'keyname':keyname,
    'isdelete':isdelete,
    'values':values,
    'chaincode':chaincode,
    'trandtstr':trandtstr,
    'transnums':transnums,
    'createdt':createdt,
    'remark':remark,
};




/*"mysql": {
     "host": "172.16.10.86",
     "port": "3306",
     "database": "blockchainexplorer",
     "username": "root",
     "passwd": "q1w2e3r4t%"
  },*/