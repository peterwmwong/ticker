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
  if(/https:\/\/api.github.com\/(repos\/[A-z\-]+\/[A-z\-]+\/events)/.test(url)){
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
  else if(/https:\/\/api.github.com\/search\/users\?q=.*/.test(url)){
    return loadJSON('src/helpers/mock_data/GithubUserQueryMOCK.json');
  }
  else if(/https:\/\/api.github.com\/search\/repositories\?q=.*/.test(url)){
    return loadJSON('src/helpers/mock_data/GithubRepoQueryMOCK.json');
  }
  else{
    throw `loadMock: No mock for ${url}`;
  }
}
