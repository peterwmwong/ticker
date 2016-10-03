import xvdom   from 'xvdom/src/index';
import timeAgo from '../../helpers/timeAgo';
import Avatar  from './Avatar.jsx';

export default ({user:{login, avatar_url}, action, actionDate, className})=>
  <a className={`layout horizontal center ${className}`} href={`#github/${login}`}>
    <Avatar avatarUrl={avatar_url} />
    <div className='l-margin-l2'>
      <div className='t-normal'>
        {login}
        <span className='c-gray-dark l-margin-l1 t-light' textContent={action || ''} />
      </div>
      <div
        className='c-gray-dark t-font-size-10'
        textContent={`${timeAgo(Date.parse(actionDate))} ago`}
      />
    </div>
  </a>;
