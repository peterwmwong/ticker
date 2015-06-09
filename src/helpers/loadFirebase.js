import './MOCK_FIREBASE.js';

if(!IS_MOCKING || !IS_DEV){
  window.requestAnimationFrame(()=>{
    let s = document.createElement('script');
    s.src = `http://${(location.host || 'localhost')}/components/firebase/firebase.js`;
    document.body.appendChild(s);
  });
}
