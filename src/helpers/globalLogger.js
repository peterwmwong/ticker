if(process.env.NODE_ENV === 'development'){
  window.log = (message, obj)=>(console.log(message, obj), obj)
}
