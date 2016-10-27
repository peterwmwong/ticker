import './Icon.css';
import xvdom from 'xvdom/src/index';

const handleClick = ({currentTarget:t}) => { t.onClickFn(t.onClickArg) }

export default ({className, name, onClick, onClickArg, size='med'}) =>
  <i
    className={`Icon Icon--${size} octicon octicon-${name} ${className} t-center`}
    onClickArg={onClickArg}
    onClickFn={onClick}
    onclick={onClick && handleClick}
  />
