import is from './is.js';

export function loadResource(type, url, accessToken){
  return new Promise(function(fulfill, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Authorization', `token ${accessToken}`);
    xhr.responseType = type;
    xhr.send();
    xhr.onload  = ()=>fulfill(xhr);
    xhr.onerror = ()=>reject(xhr);
  });
}

export default async function loadJSON(url){
  var {response} = await loadResource("json", url, loadJSON.accessToken);
  if(!response) throw new Error("Not found");
  return is.aString(response) ? JSON.parse(response) : response;
}
