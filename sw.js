const V="1793002416523",CACHE="wortschatz-"+V;
const FILES=["./","index.html","manifest.webmanifest","icon-180.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:"reload"})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;
  const u=new URL(req.url);if(u.origin!==location.origin)return;
  if(u.pathname.endsWith("version.json")){e.respondWith(fetch(req.url,{cache:"no-store"}));return;}
  const nav=req.mode==="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith("index.html");
  // always go to the network first, bypassing the browser cache; fall back to the saved copy offline
  e.respondWith(fetch(req.url,{cache:"no-store",credentials:"same-origin"}).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(nav?"index.html":req,c));}return r})
    .catch(()=>caches.match(nav?"index.html":req,{ignoreSearch:true}).then(r=>r||caches.match("index.html"))));
});
