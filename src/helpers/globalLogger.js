if(process.env.NODE_ENV === 'development'){
  window.log = (message, obj) => (console.log(message, obj), obj);
  window.debug = (obj) => {
    debugger; //eslint-disable-line
    return obj;
  };
}
