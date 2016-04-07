if(process.env.NODE_ENV === 'development'){
  window.log = (obj)=> (
    console.log(obj), //eslint-disable-line
    obj
  );
  window.debug = (obj, cond=true)=> {
    if(cond) debugger; //eslint-disable-line
    return obj;
  };
}
