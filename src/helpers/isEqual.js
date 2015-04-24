import is from './is.js';

/**
 * @ngdoc function
 * @name angular.equals
 * @function
 *
 * @description
 * Determines if two objects or two values are equivalent. Supports value types, regular
 * expressions, arrays and objects.
 *
 * Two objects or values are considered equivalent if at least one of the following is true:
 *
 * * Both objects or values pass `===` comparison.
 * * Both objects or values are of the same type and all of their properties are equal by
 *   comparing them with `angular.equals`.
 * * Both values are NaN. (In JavaScript, NaN == NaN => false. But we consider two NaN as equal)
 * * Both values represent the same regular expression (In JavasScript,
 *   /abc/ == /abc/ => false. But we consider two regular expressions as equal when their textual
 *   representation matches).
 *
 * During a property comparison, properties of `function` type and properties with names
 * that begin with `$` are ignored.
 *
 * Scope and DOMWindow objects are being compared only by identify (`===`).
 *
 * @param {*} o1 Object or value to compare.
 * @param {*} o2 Object or value to compare.
 * @returns {boolean} True if arguments are equal.
 */
export default function isEqual(o1, o2) {
  if (o1 === o2) return true;
  if (o1 === null || o2 === null) return false;
  if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
  var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
  if (t1 == t2) {
    if (t1 == 'object') {
      if (is.aArray(o1)) {
        if (!is.aArray(o2)) return false;
        if ((length = o1.length) == o2.length) {
          for(key=0; key<length; key++) {
            if (!isEqual(o1[key], o2[key])) return false;
          }
          return true;
        }
      } else if (is.aDate(o1)) {
        return is.aDate(o2) && o1.getTime() == o2.getTime();
      } else if (is.aRegExp(o1) && is.aRegExp(o2)) {
        return o1.toString() == o2.toString();
      } else {
        if (is.aWindow(o1) || is.aWindow(o2) || is.aArray(o2)) return false;
        keySet = {};
        for(key in o1) {
          if (key.charAt(0) === '$' || is.aFunction(o1[key])) continue;
          if (!isEqual(o1[key], o2[key])) return false;
          keySet[key] = true;
        }
        for(key in o2) {
          if (!keySet.hasOwnProperty(key) &&
              key.charAt(0) !== '$' &&
              o2[key] !== undefined &&
              !is.aFunction(o2[key])) return false;
        }
        return true;
      }
    }
  }
  return false;
}
