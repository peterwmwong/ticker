let added = false;

export default ()=> {
  if(added || window.Firebase) return;
  added = true;
  const s = document.createElement('script');
  s.src = '../vendor/firebase/firebase.js';
  document.head.appendChild(s);
}
