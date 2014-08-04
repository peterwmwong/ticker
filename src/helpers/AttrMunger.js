import is from './is';

function copy(obj){
  return is.aArray(obj) ?
    obj.map(copy) :
    is.aObject(obj) ? copyObj(obj) : obj;
}

function copyObj(obj){
  var result = {};
  for(var key in obj)
    result[key] = copy(obj[key]);
  return result;
}

function upcase(str){
  var self;
  self =  str.replace(/_([a-z])/g,  $=>"_"+$[1].toUpperCase());
  self = self.replace(/\/([a-z])/g, $=>"/"+$[1].toUpperCase());
  return self[0].toUpperCase() + self.substr(1);
}

function downcase(str){
  var self;
  self =  str.replace(/_([A-Z])/g,  $=>"_"+$[1].toLowerCase());
  self = self.replace(/\/([A-Z])/g, $=>"/"+$[1].toLowerCase());
  return self[0].toLowerCase() + self.substr(1);
}

function camelize(words){
  return downcase(
    words.replace(/\/(.?)/g,   $=>"."+upcase($[1]))
         .replace(/(?:_)(.)/g, $=>    upcase($[1]))
  );
}

function underscore(word){
  return word.replace(/\./g, '/')
             .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
             .replace(/([a-z\d])([A-Z])/g, "$1_$2")
             .replace(/-/g, '_')
             .toLowerCase();
}

function munge(isCamelize, attrs){
  if(is.aArray(attrs)){
    attrs.map(o=>munge(isCamelize, o));
  }else if(is.aObject(attrs)){
    for(var k in attrs){
      var v = attrs[k];
      if(is.aObject(v))
        munge(isCamelize, v);

      var transformed = isCamelize ? camelize(k, false) : underscore(k);

      if(k !== transformed){
        attrs[transformed] = v;
        delete attrs[k];
      }
    }
  }
  return attrs;
}

export default {
  // Public: Munges the given object or array of objects by converting all keys
  // to `camelCase` format.
  camelize:attrs=>munge(true, copy(attrs)),

  // Public: Munges the given object or array of objects by converting all keys
  // to `under_score` format.
  underscore:attrs=>munge(false, copy(attrs))
};
