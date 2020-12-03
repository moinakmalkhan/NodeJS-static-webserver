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
                reject(filepath)
            }
        });
        
    })
}
function fileReader(filepath){
    return new Promise((resolve, reject)=>{
        fs.readFile(filepath,(error,content)=>{
            if (!error){
                resolve(content);
            }
            else{
                reject();
            }        
        })
    })
}
function WebServer(req,res){
    let base_url = url.parse(req.url);
    let filepath =__dirname+( base_url.pathname==='/' ? '/index.htm':base_url.pathname);
    // filepath=filepath.replace(/\\/g,"/")

    fileAccess(filepath)
        .then(fileReader)
        .then((content)=>{
            console.log("Serving : "+filepath);
            let contentType = mimes[path.extname(filepath)]; 
            res.writeHead(200, {'content-type':contentType})
            res.end(content,'utf-8')
        })
        .catch(error=>{
            res.writeHead(404,{content_type:'text/html'});
            res.end("<h1>404 content not found</h1>"+"<p>Error: "+error+"</p>");
        });
    // fs.access(filepath, fs.F_OK, error=>{
    //     if(error){
    //         res.writeHead(404,{content_type:'text/html'});
    //         res.end("<h1>404 content not found</h1>");
    //     }
    //     else{
    //         fs.readFile(filepath,(error,content)=>{
    //             if (error){
    //                 res.writeHead(500,{content_type:'text/html'});
    //                 res.end("<h1>500: The server could not read the requested file</h1>");
    //             }
    //             else{
    //                 console.log("Serving : "+filepath);
    //                 let contentType = mimes[path.extname(filepath)]; // mimes['.css'] === 'text/css'
    //                 res.writeHead(200, {content_type:contentType})
    //                 res.end(content,'utf-8')
    //             }        
    //         })
    //     }
    // })
}
http.createServer(WebServer).listen(3000,()=>{console.log("Server is running on http://localhost:3000");})


