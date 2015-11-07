export default function loadJSON(url){
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
        return;
      }
      resolve(typeof response === 'string' ? JSON.parse(response) : response);
    };
  });
}

loadJSON.setAccessToken = function(accessToken){
  localStorage.setItem('ticker:token:github', accessToken);
}
