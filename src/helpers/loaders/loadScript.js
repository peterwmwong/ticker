export default (src, globalProp)=>
  new Promise((resolve)=> {
    const s = document.createElement('script');
    s.src = src;
    s.onload = ()=> {resolve(globalProp && window[globalProp])};
    document.head.appendChild(s);
  });
