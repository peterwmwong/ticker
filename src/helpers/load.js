export function loadResource(type, url, accessToken){
  return new Promise(function(fulfill, reject){
    const xhr = new window.XMLHttpRequest();
    xhr.open('GET', url);
    if(accessToken){
      xhr.setRequestHeader('Authorization', `token ${accessToken}`);
    }
    xhr.responseType = type;
    xhr.send();
    xhr.onload  = ()=>fulfill(xhr);
    xhr.onerror = ()=>reject(xhr);
  });
}

export default function loadJSON(url){
  return new Promise((resolve, reject)=>{
    loadResource('json', url, loadJSON.accessToken).then(({response})=>{
      if(!response) reject(new Error('Not found'));
      resolve(typeof response === 'string' ? JSON.parse(response) : response);
    });
  });
}

export function loadMOCKJSON(url){
  if(/https:\/\/api.github.com\/(repos|users)\/[A-z\-]+\/([A-z\-]+\/)?events/.test(url)){
    return loadJSON('/src/models/github/GithubEventMapperMOCKDATA-allEvents.json');
  }
  // else if(/https:\/\/api.github.com\/repos\/[A-z\-]+\/[A-z\-]+\/pulls/.test(url)){
  //   return githubRepoPulls;
  // }
  // else if(/https:\/\/api.github.com\/repos\/[A-z\-]+\/[A-z\-]+\/issues/.test(url)){
  //   return githubRepoIssues;
  // }
  // else if(/https:\/\/api.github.com\/users\/[A-z\-]+\/events/.test(url)){
  //   return githubEvents;
  // }
  // else if(/https:\/\/api.github.com\/users\/[A-z\-]+/.test(url)){
  //   return githubUsers.items[0];
  // }
  else if(/https:\/\/api.github.com\/repos\/[^\/]*\/[^\/]*$/.test(url)){
    return loadJSON('/src/helpers/mock_data/GithubRepoMOCK.json');
  }
  else if(/https:\/\/api.github.com\/users\/[^\/]*$/.test(url)){
    return new Promise(function(resolve){
      resolve({
        "login": "pesto",
        "id": 125612,
        "avatar_url": "https://avatars.githubusercontent.com/u/125612?v=2",
        "gravatar_id": "1c7bded9fd1b6e5ca8e9f77a6222302c",
        "url": "https://api.github.com/users/p",
        "html_url": "https://github.com/p",
        "followers_url": "https://api.github.com/users/p/followers",
        "following_url": "https://api.github.com/users/p/following{/other_user}",
        "gists_url": "https://api.github.com/users/p/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/p/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/p/subscriptions",
        "organizations_url": "https://api.github.com/users/p/orgs",
        "repos_url": "https://api.github.com/users/p/repos",
        "events_url": "https://api.github.com/users/p/events{/privacy}",
        "received_events_url": "https://api.github.com/users/p/received_events",
        "type": "User",
        "site_admin": false,
        "score": 75.656136
      });
    });
  }
  else if(/https:\/\/api.github.com\/search\/users\?q=.*/.test(url)){
    return loadJSON('/src/helpers/mock_data/GithubUserQueryMOCK.json');
  }
  else if(/https:\/\/api.github.com\/search\/repositories\?q=.*/.test(url)){
    return loadJSON('/src/helpers/mock_data/GithubRepoQueryMOCK.json');
  }
  else{
    throw `loadMock: No mock for ${url}`;
  }
}
