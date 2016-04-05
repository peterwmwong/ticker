import './Icon.css';
import xvdom from 'xvdom';

export default ({className, name, onClick, size='med'})=>
  <i
    className={`Icon Icon--${size} octicon octicon-${name} ${className} layout vertical center-center`}
    onclick={onClick}
  />
