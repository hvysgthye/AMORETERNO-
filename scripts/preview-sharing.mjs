import {createServer} from 'node:http';
import {Readable} from 'node:stream';
import worker from '../backend/sharing-worker.js';
import {MemoryBucket} from '../tests/helpers/memory-bucket.mjs';
const bucket=new MemoryBucket();
createServer(async(req,res)=>{
  try{
    const method=req.method;const headers=new Headers();
    for(const [key,value] of Object.entries(req.headers))if(value)headers.set(key,Array.isArray(value)?value.join(','):value);
    const request=new Request(`http://127.0.0.1:3002${req.url}`,{method,headers,...(!['GET','HEAD'].includes(method)?{body:Readable.toWeb(req),duplex:'half'}:{})});
    const response=await worker.fetch(request,{BUCKET:bucket});
    res.writeHead(response.status,Object.fromEntries(response.headers));
    if(response.body)for await(const chunk of response.body)res.write(chunk);
    res.end();
  }catch{res.writeHead(500);res.end('Local preview error');}
}).listen(3002,'127.0.0.1',()=>console.log('Synthetic local sharing storage: http://127.0.0.1:3002 (memory only)'));
