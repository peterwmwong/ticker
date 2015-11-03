export default function loadJSON(url){
  if(IS_DEV && IS_MOCKING){
    if(/https:\/\/api.github.com\/repos\/[A-z\-]+\/([A-z\-]+\/)?events/.test(url)){
      url = '/src/helpers/mock_data/GithubEventMapper2MOCK.json';
    }
    else if(/https:\/\/api.github.com\/users\/[A-z\-]+\/([A-z\-]+\/)?events/.test(url)){
      url = '/src/helpers/mock_data/GithubEventMapper-allEvents-MOCK.json';
    }
    else if(/https:\/\/api.github.com\/repos\/[^\/]*\/[^\/]*$/.test(url)){
      url = 'src/helpers/mock_data/GithubRepoMOCK.json';
    }
    else if(/https:\/\/api.github.com\/users\/[^\/]*$/.test(url)){
      url = 'src/helpers/mock_data/GithubUserMOCK.json';
    }
    else if(/https:\/\/api.github.com\/search\/users\?q=.*/.test(url)){
      url = 'src/helpers/mock_data/GithubUserQueryMOCK.json';
    }
    else if(/https:\/\/api.github.com\/search\/repositories\?q=.*/.test(url)){
      url = 'src/helpers/mock_data/GithubRepoQueryMOCK.json';
    }
    else{
      throw `loadMock: No mock for ${url}`;
    }
  }

  return new Promise((resolve, reject)=>{
    const xhr = new window.XMLHttpRequest();
    const accessToken = localStorage.getItem('ticker:token:github');
    xhr.open('GET', url);
    if(accessToken){
      xhr.setRequestHeader('Authorization', `token ${accessToken}`);
    }
    xhr.responseType = 'json';
    xhr.send();
    xhr.onerror = ()=>reject(xhr);
    xhr.onload  = ()=>{
      let response = xhr.response;
      if(!response){
        reject(new Error('Not found'));
      }
      resolve(typeof response === 'string' ? JSON.parse(response) : response);
    };
  });
}

loadJSON.setAccessToken = function(accessToken){
  if(!IS_MOCKING){
    localStorage.setItem('ticker:token:github', accessToken);
  }
}
