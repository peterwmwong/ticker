const sw = navigator.serviceWorker;
if (sw){
  sw.register('../serviceWorker.js');
}
