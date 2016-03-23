import loadStyle  from './loadStyle';

export default ()=> {
  window.setTimeout(()=> {
    Promise.all([
      loadStyle('https://fonts.googleapis.com/css?family=Roboto:500,400'),
      loadStyle('https://fonts.googleapis.com/icon?family=Material+Icons'),
      loadStyle('../node_modules/octicons/octicons/octicons.css')
    ]).then(()=> {
      document.body.className +=
        ' ticker-roboto-font-loaded ticker-material-icons-loaded ticker-octicons-loaded';
    })
  }, 300);
}
