let decode = atob;

// Safari/Firefox: atob() cannot handle newlines
try{ atob('\n') }
catch(e){
  decode = (content)=> atob(content.replace(/\n/g, ''))
}

export default decode;
