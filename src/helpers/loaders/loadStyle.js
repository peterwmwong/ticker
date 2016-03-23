export default (link)=>
  new Promise((resolve)=> {
    const el = document.createElement('link');
    el.rel = 'stylesheet';
    el.href = link;
    el.onload = resolve;
    document.head.appendChild(el);
  });
