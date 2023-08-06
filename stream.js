const express = require('express');
const fs = require('fs');
const status = require('express-status-monitor');
const zlib = require('zlib');

const PORT = 8000;

const app = express();
app.use(status());



//Reading the file without using streams: It is taking around 40MB of memory in the express-status-moitor
// app.get('/',(req,res)=>{
//     fs.readFile("./sample.txt",(err,data)=>{
//         res.end(data);
//     })
// })
 
//Reading the file using streams: It is taking around 35MB of memory so i saved 5mb, in larger files say 500mb you will be able to save upto hundreds of MBs
// app.get('/',(req,res)=>{
//   const stream = fs.createReadStream('./sample.txt',"utf-8");  //Creating the stream
//   stream.on("data",(chunk)=>{  //starting the stream 
//     res.write(chunk);
//   });
//   stream.on("end",()=>res.end());  //closing the stream
// })

// Suppose you have to convert the file in zip and then read, suppose you have 400mb file now you will first read it then zip it which will completely take 400 + 400 = 800mb of space, so you can save this space using streams and pipes. See below

fs.createReadStream('./sample.txt').pipe(zlib.createGzip().pipe(fs.createWriteStream("./sample.zip"))); //Iska yahi fayda hai ki poori sample.txt file pehle memory me load nahhi hua then zip nahi hua...we directly take from read stream and send it to writeStream through piping
app.get('/',(req,res)=>{
  const stream = fs.createReadStream('./sample.txt',"utf-8");  //Creating the stream
  stream.on("data",(chunk)=>{  //starting the stream 
    res.write(chunk);
  });
  stream.on("end",()=>res.end());  //closing the stream
})

app.listen(PORT,()=>{
    console.log('Server started!');
})
