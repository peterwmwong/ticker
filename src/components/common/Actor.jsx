import timeAgo            from '../../helpers/timeAgo';
import Avatar             from './Avatar.jsx';

export default ({user, action, actionDate, className})=>
  <div className={`layout horizontal center ${className}`}>
    <Avatar avatarUrl={user.avatar_url} />
    <div className="l-margin-l2">
      <div className="t-light">
        <span className="t-normal l-margin-r1" textContent={user.login} />
        {action}
      </div>
      <div
        className="c-gray-dark t-font-size-10"
        textContent={`${timeAgo(Date.parse(actionDate))} ago`}
      />
    </div>
  </div>;
