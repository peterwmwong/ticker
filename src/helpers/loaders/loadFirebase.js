let added = false;

export default ()=>{
  if(added || window.Firebase) return;
  added = true;
  window.requestAnimationFrame(()=>{
    const s = document.createElement('script');
    s.src = `../vendor/firebase/firebase.js`;
    document.body.appendChild(s);
  });
}
