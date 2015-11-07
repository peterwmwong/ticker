let added = false;
export default ()=>{
  if(!added){
    added = true;
    window.requestAnimationFrame(()=>{
      const s = document.createElement('link');
      s.rel = 'stylesheet';
      s.href = 'https://fonts.googleapis.com/css?family=Roboto:500,400';
      document.body.appendChild(s);
    });
  }
}
