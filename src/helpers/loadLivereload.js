if(IS_DEV){
  window.requestAnimationFrame(()=>{
    let s = document.createElement('script');
    s.src = `http://${(location.host || 'localhost').split(':')[0]}:35729/livereload.js?snipver=1`;
    document.body.appendChild(s);
  });
}
