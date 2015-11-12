let added = false;
export default ()=>{
  if(!added){
    added = true;
    window.setTimeout(()=>{
      const s3 = document.createElement('link');
      s3.rel = 'stylesheet';
      s3.href = 'https://fonts.googleapis.com/css?family=Roboto:500,400';

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

      document.head.appendChild(s3);
      document.head.appendChild(s);
      document.head.appendChild(s2);
    }, 300);
  }
}
