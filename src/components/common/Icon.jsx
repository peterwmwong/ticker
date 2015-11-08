export default ({name, className='', onClick})=>
  <i
    className={`${className} u-pointer-cursor material-icons layout horizontal center`}
    onclick={onClick}>
    {name}
  </i>
