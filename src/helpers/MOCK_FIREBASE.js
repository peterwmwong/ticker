// DEV ONLY
window.Firebase = class {
  constructor(url){this.url = url}
  onAuth(cb){return cb({github:{id:"284734", accessToken:'123'}})}
  once(str, cb){
    Promise.resolve().then(()=>{
      cb({
        val:()=>({
          "id": "284734",
          "githubUsername": "peterwmwong",
          "dataRefs": [
            {
              "config": {
                "login": "p",
                "id": 125612,
                "avatar_url": "https://avatars.githubusercontent.com/u/125612?v=2",
                "gravatar_id": "1c7bded9fd1b6e5ca8e9f77a6222302c",
                "url": "https://api.github.com/users/p"
              },
              "id": 2975912,
              "type": "GithubUser"
            }
          ]
        })
      })
    })
  }
}
// DEV ONLY
