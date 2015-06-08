import './MOCK_FIREBASE.js';

window.requestAnimationFrame(()=>{
  let s = document.createElement('script');
  s.src = `http://${(location.host || 'localhost')}/components/firebase/firebase.js`;
  document.body.appendChild(s);
});
