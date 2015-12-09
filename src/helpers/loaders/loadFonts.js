let added = false;

const load = (link, name)=>{
  const el = document.createElement('link');
  el.rel = 'stylesheet';
  el.href = link;
  el.onload = ()=>{
    window.requestAnimationFrame(()=>{document.body.classList.add(`ticker-${name}-loaded`)});
  };
  document.head.appendChild(el);
};

export default ()=>{
  if(added) return;
  added = true;
  window.setTimeout(()=>{
    load('https://fonts.googleapis.com/css?family=Roboto:500,400', 'roboto-font');
    load('https://fonts.googleapis.com/icon?family=Material+Icons', 'material-icons');
    load('../node_modules/octicons/octicons/octicons.css', 'octicons');
  }, 300);
}
