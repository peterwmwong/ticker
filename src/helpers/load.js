import is from './is';

export function loadResource(type, url, headers){
  headers = headers == null ? {} : headers;
  return new Promise(function(fulfill, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Authorization', 'token cd3cc5d471d59d6dce0095cf33e7c7f1ddaf23e6');
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
