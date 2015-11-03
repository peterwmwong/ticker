export default ({name, className='', onClick})=>
  <i
    className={`${className} material-icons`}
    onclick={onClick}>
    {name}
  </i>
