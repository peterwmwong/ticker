import is from './is';

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

export default function loadJSON(url){
  return loadResource("json", url, loadJSON.accessToken).then(function({response}){
    if(!response) throw new Error("Not found");
    return is.aString(response) ? JSON.parse(response) : response;
  });
}
