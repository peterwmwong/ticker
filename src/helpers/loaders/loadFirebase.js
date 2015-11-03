export default ()=>{
  if(window.Firebase) return;

  if(IS_MOCKING && IS_DEV){
    setTimeout(function(){
      window.Firebase = class{
        constructor(url){ this.url = url; }
        onAuth(cb){
          return cb({
            github:{
              id:'284734', username:'peterwmwong', accessToken:'123'
            }
          });
        }
        once(str, cb){
          Promise.resolve().then(()=>{
            cb({
              val:()=>({
                'id': '284734',
                'username': 'peterwmwong',
                'sources': [
                  {'type': 'GithubRepoSource', 'full_name':'polymer/polymer'},
                  {'type': 'GithubRepoSource', 'full_name':'facebook/react'},
                  {'type': 'GithubUserSource', 'login':'polymer'},
                  {'type': 'GithubUserSource', 'login':'facebook'}
                ]
              })
            });
          });
        }
      };
    }, 500);
  }
  else{
    window.requestAnimationFrame(()=>{
      const s = document.createElement('script');
      s.src = `http://${(location.host || 'localhost')}/vendor/firebase/firebase.js`;
      document.body.appendChild(s);
    });
  }
}
