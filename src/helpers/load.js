const loadJSON = url =>
  new Promise((resolve, reject) => {
    const xhr = new window.XMLHttpRequest();
    const accessToken = localStorage.getItem('ticker:token:github');
    xhr.open('GET', url);
    if(accessToken) xhr.setRequestHeader('Authorization', `token ${accessToken}`);
    xhr.responseType = 'json';
    xhr.send();
    xhr.onerror = reject;
    xhr.onload  = () => {
      const response = xhr.response;
      if(response){
        resolve(typeof response === 'string' ? JSON.parse(response) : response);
      }
      else {
        reject(new Error('loadJSON: empty response'));
      }
    };
  });

loadJSON.setAccessToken = accessToken => {
  localStorage.setItem('ticker:token:github', accessToken);
};

export default loadJSON;
