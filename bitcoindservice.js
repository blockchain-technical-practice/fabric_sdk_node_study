var http=require('http');
var querystring=require('querystring');
var url  = require('url')


var bithttppost = function (posturl,port,postData,username,passwd) {


    var postDatastr=JSON.stringify(postData);

    var urlObj = url.parse(posturl)

    var loginstring = username + ":" + passwd;

    var loginstringbuf = new Buffer( loginstring );
    var cred = loginstringbuf.toString('base64');


    var options={
        hostname:urlObj.hostname,
        port:port,
        path: urlObj.pathname,
        method:'POST',
        headers:{

            'Content-Type':'text/plain',
            'Content-Length':Buffer.byteLength(postDatastr),
            'Authorization': `Basic ${cred}`
        }
    }

    return  httppost(options,postDatastr);

}


var httppost = function (options,postData) {

    return new Promise(( resolve,reject)=>{


        var buffers = [];
        var req=http.request(options, function(res) {


            res.on('data',function(reposebuffer){

                buffers.push(reposebuffer);
            });
            res.on('end',function(){
                //console.log('No more data in response.********');
                var wholeData = Buffer.concat(buffers);
                var dataStr = wholeData.toString('utf8');
                resolve(dataStr)
            });

            res.on('error',function(err){
                reject(err);
            });

        });

        req.write(postData);
        req.end();

    })


}


exports.httppost =httppost;
exports.bithttppost = bithttppost;




