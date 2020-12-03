'use strict';
const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require('path');
let mimes = {
	'.htm': 'text/html',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.gif': 'image/gif',
	'.jpg': 'image/jpeg',
	'.png': 'image/png'
}
function fileAccess(filepath){
    return new Promise((resolve,reject)=>{
        fs.access(filepath, fs.F_OK, error=>{
            if(!error){
                resolve(filepath);
            }
            else{
                reject(filepath);
            }
        });
        
    })
}
function FileStreamReader(filepath){
    return new Promise ((resolve,reject)=>{
        let fileStream = fs.createReadStream(filepath);
        fileStream.on('open',()=>{
            resolve(fileStream);
        })
        fileStream.on('error',error=>{
            reject(error);
        })
    })
}
function WebServer(req,res){
    let base_url = url.parse(req.url);
    let filepath =__dirname+( base_url.pathname==='/' ? '/index.htm':base_url.pathname);

    fileAccess(filepath)
        .then(FileStreamReader)
        .then((fileStream)=>{
            console.log("Serving : "+filepath);
            let contentType = mimes[path.extname(filepath)]; 
            res.writeHead(200, {'content-type':contentType})
            fileStream.pipe(res)            
        })
        .catch(error=>{
            res.writeHead(404,{content_type:'text/html'});
            res.end("<h1>404 content not found</h1>"+"<p>Error: "+error+"</p>");
        });
   
}
http.createServer(WebServer).listen(3000,()=>{console.log("Server is running on http://localhost:3000");})


