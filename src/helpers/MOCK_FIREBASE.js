window.Firebase = class {
  constructor(url){this.url = url}
  onAuth(cb){return cb({github:{id:"284734", accessToken:'123'}})}
  once(str, cb){
    Promise.resolve().then(()=>{
      cb({
        val:()=>({
          "id": "284734",
          "githubUsername": "peterwmwong",
          "sources": [
            {"type": "GithubRepoSource", "config":{"full_name": "polymer/polymer"}},
            {"type": "GithubUserSource", "config":{"login": "polymer"}}
          ]
        })
      })
    })
  }
}
