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

export default async function loadJSON(url){
  var result = await loadResource("json", url, loadJSON.accessToken);
  if(!result.response) throw new Error("Not found");
  return is.aString(result.response) ? JSON.parse(result.response) : result.response;
}
