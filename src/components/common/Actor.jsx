import xvdom   from 'xvdom/src/index';
import timeAgo from '../../helpers/timeAgo';
import Avatar  from './Avatar.jsx';

export default ({user:{login, avatar_url}, action, actionDate, className}) =>
  <a className={`layout horizontal center ${className}`} href={`#github/${login}`}>
    <Avatar avatarUrl={avatar_url} />
    <div className='l-margin-l2 c-gray-dark'>
      <span className='c-black' textContent={login} />
      {` ${action || ''}`}
      <div
        className='t-font-size-10'
        textContent={`${timeAgo(Date.parse(actionDate))} ago`}
      />
    </div>
  </a>;
