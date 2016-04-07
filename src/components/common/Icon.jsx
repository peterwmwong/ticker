import './Icon.css';
import xvdom from 'xvdom';

export default ({className, name, onClick, size='med'})=>
  <i
    className={`Icon Icon--${size} octicon octicon-${name} ${className} t-center`}
    onclick={onClick}
  />
