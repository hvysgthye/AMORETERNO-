// Synthetic in-memory R2 adapter for local tests only.
export class MemoryBucket {
  constructor(){this.objects=new Map();this.version=0;}
  async put(key,value,options={}){
    const previous=this.objects.get(key);
    if(options.onlyIf?.etagDoesNotMatch==='*'&&previous)return null;
    if(options.onlyIf?.etagMatches&&previous?.etag!==options.onlyIf.etagMatches)return null;
    const bytes=typeof value==='string'?new TextEncoder().encode(value):new Uint8Array(value);
    const object={bytes,etag:String(++this.version),httpMetadata:options.httpMetadata||{}};
    this.objects.set(key,object);return {etag:object.etag};
  }
  async head(key){const item=this.objects.get(key);return item?{etag:item.etag,size:item.bytes.length}:null;}
  async get(key,options={}){
    const item=this.objects.get(key);if(!item)return null;
    const output={etag:item.etag,httpEtag:`"${item.etag}"`,size:item.bytes.length,
      json:async()=>JSON.parse(new TextDecoder().decode(item.bytes)),text:async()=>new TextDecoder().decode(item.bytes),
      writeHttpMetadata:headers=>{if(item.httpMetadata.contentType)headers.set('Content-Type',item.httpMetadata.contentType);},body:item.bytes};
    const range=options.range?.get?.('Range')?.match(/^bytes=(\d+)-(\d*)$/);
    if(range){const offset=Number(range[1]),end=range[2]?Math.min(Number(range[2]),item.bytes.length-1):item.bytes.length-1;output.range={offset,length:end-offset+1};output.body=item.bytes.slice(offset,end+1);}
    return output;
  }
}

