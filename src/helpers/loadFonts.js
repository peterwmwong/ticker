window.requestAnimationFrame(()=>{
  window.WebFontConfig = {
    google: { families: [ 'Roboto:300,400:latin' ] }
  };
  const wf = document.createElement('script');
  wf.src = (document.location.protocol === 'https:' ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  document.body.appendChild(wf);
});
