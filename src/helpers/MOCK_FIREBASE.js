// DEV ONLY
window.Firebase = class {
  constructor(url){this.url = url}
  onAuth(cb){return cb({github:{id:"284734", accessToken:'123'}})}
  once(str, cb){
    Promise.resolve().then(()=>{
      cb({
        val:()=>({
          "eventStreams": [
            {
              "config": {
                "type": "users",
                "users": "web-animations"
              },
              "id": "users:2975912",
              "type": "github"
            },
            {
              "config": {
                "repos": "facebook/react",
                "type": "repos"
              },
              "id": "repos:10270250",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "arv"
              },
              "id": "users:45845",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "morethanreal"
              },
              "id": "users:1202776",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "gulpjs"
              },
              "id": "users:6200624",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "suitcss"
              },
              "id": "users:4564613",
              "type": "github"
            },
            {
              "config": {
                "repos": "google/traceur-compiler",
                "type": "repos"
              },
              "id": "repos:9060347",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "vojtajina"
              },
              "id": "users:46647",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "tbosch"
              },
              "id": "users:690815",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "caitp"
              },
              "id": "users:2294695",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "guybedford"
              },
              "id": "users:598730",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "ebidel"
              },
              "id": "users:238208",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "Polymer"
              },
              "id": "users:2159051",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "addyosmani"
              },
              "id": "users:110953",
              "type": "github"
            },
            {
              "config": {
                "repos": "angular/angular",
                "type": "repos"
              },
              "id": 24195339,
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "rafaelw"
              },
              "id": "users:646051",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "jmesserly"
              },
              "id": "users:1081711",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "sorvell"
              },
              "id": "users:78891",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "domenic"
              },
              "id": "users:617481",
              "type": "github"
            },
            {
              "config": {
                "repos": "dglazkov/html-as-custom-elements",
                "type": "repos"
              },
              "id": "repos:18572086",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "GoogleWebComponents"
              },
              "id": "users:7328930",
              "type": "github"
            },
            {
              "config": {
                "repos": "angular/material",
                "type": "repos"
              },
              "id": "repos:21399598",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "domokit"
              },
              "id": "users:8664152",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "firebase"
              },
              "id": "users:1335026",
              "type": "github"
            },
            {
              "config": {
                "type": "users",
                "users": "PolymerLabs"
              },
              "id": "users:5912903",
              "type": "github"
            }
          ],
          "id": "284734"
        })
      })
    })
  }
}
// DEV ONLY
