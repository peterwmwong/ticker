export default {

  aString(value){
    return typeof value === 'string';
  },

  aObject(value){
    return value != null && typeof value === 'object';
  },

  /**
   * Checks if `obj` is a window object.
   *
   * @private
   * @param {*} obj Object to check
   * @returns {boolean} True if `obj` is a window obj.
   */
  aWindow(obj) {
    return obj && obj.document && obj.location && obj.alert && obj.setInterval;
  },

  /**
   * @ngdoc function
   * @name angular.isFunction
   * @function
   *
   * @description
   * Determines if a reference is a `Function`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Function`.
   */
  aFunction(value){
    return typeof value == 'function';
  },

  /**
   * Determines if a value is a regular expression object.
   *
   * @private
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `RegExp`.
   */
  aRegExp(value) {
    return Object.prototype.toString.call(value) == '[object RegExp]';
  },

  /**
   * @ngdoc function
   * @name angular.isDate
   * @function
   *
   * @description
   * Determines if a value is a date.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Date`.
   */
  aDate(value){
    return Object.prototype.toString.call(value) == '[object Date]';
  },

  /**
   * @ngdoc function
   * @name angular.isArray
   * @function
   *
   * @description
   * Determines if a reference is an `Array`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is an `Array`.
   */
  aArray(value) {
    return Object.prototype.toString.call(value) == '[object Array]';
  }
};
