let loadingPromise;

export default ()=>
  loadingPromise || (loadingPromise = new Promise((resolve)=> {
    if(window.marked) resolve(window.marked);
    else{
      window.requestAnimationFrame(()=> {
        const s = document.createElement('script');
        s.src = '../node_modules/marked/lib/marked.js';
        s.onload = ()=> resolve(window.marked);
        document.head.appendChild(s);
      });
    }
  }));
