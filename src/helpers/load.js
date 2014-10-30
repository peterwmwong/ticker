import is from './is';
import appState from '../elements/ticker-app-state';

export function loadResource(type, url, headers){
  headers = headers == null ? {} : headers;
  return new Promise(function(fulfill, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Authorization', 'token '+appState.attrs.accessTokens.github);
    xhr.responseType = type;
    xhr.send();
    xhr.onload  = ()=>fulfill(xhr);
    xhr.onerror = ()=>reject(xhr);
  });
}

export function loadJSON(url){
  return loadResource("json", url).then(function({response}){
    if(!response)
      throw new Error("Not found");
    return is.aString(response) ? JSON.parse(response) : response;
  });
}
