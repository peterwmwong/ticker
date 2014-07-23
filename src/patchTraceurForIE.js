/* global $traceurRuntime */
(function(){
  var test = {};
  if(!('__proto__' in test)){
    var orig = $traceurRuntime.createClass;
    $traceurRuntime.createClass = function(){
      var result = orig.apply(null, [].slice.call(arguments));
      if(arguments.length > 3){
        var superClass = arguments[3];
        Object.keys(superClass).map(function(key){
          result[key] = superClass[key];
        });
      }
      return result;
    };
  }
})();
