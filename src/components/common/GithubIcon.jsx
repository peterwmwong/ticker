import xvdom from 'xvdom';

export default ({name, className=''})=>
  <i
    className={`${className} octicon mega-octicon octicon-${name} c-gray-light layout vertical center-center`}
  />
