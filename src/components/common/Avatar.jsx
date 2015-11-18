import './Avatar.css';

const onerror = ({target})=>
  target.src='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

export default ({avatarUrl})=>
  <img
    className='Avatar'
    onerror={onerror}
    src={avatarUrl ? `${avatarUrl}v=3&s=32` : ''}
  />
