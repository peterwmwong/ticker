export default (src)=>
  new Promise((resolve)=> {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    document.head.appendChild(s);
  });
