let added = false;
export default ()=>{
  if(!added){
    added = true;
    window.requestAnimationFrame(()=>{
      const s = document.createElement('link');
      s.rel = 'stylesheet';
      s.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
      document.body.appendChild(s);
    });
  }
}
