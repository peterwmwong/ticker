const onerror = ({target})=>
  target.src='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export default ({avatarUrl, className=''})=>
  <img
    src={avatarUrl ? `${avatarUrl}v=3&s=32` : ''}
    className={`${className} ticker-avatar-icon`}
    onerror={onerror}
  />
