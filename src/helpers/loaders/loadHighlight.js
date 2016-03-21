let loadingPromise;

export default ()=>
  loadingPromise || (loadingPromise = new Promise((resolve)=> {
    if(window.hljs) return resolve(window.hljs);
    window.requestAnimationFrame(()=> {
      const s = document.createElement('script');
      s.src = '../vendor/highlightjs/highlight.pack.js';
      s.onload = ()=> resolve(window.hljs);
      document.head.appendChild(s);
    });
  }));
