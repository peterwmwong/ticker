/* eslint-disable no-console */

export function errorWrongType(expected, actual){
  console.error(`Expected model of type ${expected}, instead got ${actual}`);
}

export function errorMapperDidntReturnPromise(model, method, actualReturn){
  console.error(`Expected the '${method}' mapper for model ${model} to return a Promise, instead got ${actualReturn}`);
}

export function errorMapperMethodNotImplemented(model, method){
  console.error(`Expected the '${method}' mapper for model ${model} to be implemented`);
}
