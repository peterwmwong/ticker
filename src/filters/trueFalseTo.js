export default PolymerExpressions.prototype.trueFalseTo = {
  toDOM:   (isTrue, trueValue, falseValue)=>isTrue ? trueValue : falseValue,
  toModel: (newValue, trueValue, falseValue)=>newValue === trueValue
};
