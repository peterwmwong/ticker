let added = false;
export default ()=>{
  if(!added){
    added = true;
    window.requestAnimationFrame(()=>{
      const s = document.createElement('link');
      s.rel = 'stylesheet';
      s.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
      s.onload = ()=>
        window.requestAnimationFrame(()=>
          document.body.classList.add('ticker-material-icons-loaded')
        );

      const s2 = document.createElement('link');
      s2.rel = 'stylesheet';
      s2.href = '../node_modules/octicons/octicons/octicons.css';
      s2.onload = ()=>
        window.requestAnimationFrame(()=>
          document.body.classList.add('ticker-octicons-loaded')
        );

      document.head.appendChild(s);
      document.head.appendChild(s2);
    });
  }
}
