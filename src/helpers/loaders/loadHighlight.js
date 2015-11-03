const isAdded = ()=>!document.querySelector('script[src$="highlight.pack.js"]');
const checkHighlight = resolve=>{
  if(window.hljs) return resolve(hljs);
  setTimeout(()=>checkHighlight(resolve), 100);
}

export default ()=>
  new Promise(resolve=>{
    if(isAdded()){
      const s = document.createElement('script');
      s.src = `http://${(location.host || 'localhost')}/vendor/highlightjs/highlight.pack.js`;
      document.body.appendChild(s);
      checkHighlight(resolve);
    }
  });
