import './Avatar.css';
import xvdom from 'xvdom/src/index';

const EMPTY_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
const onerror = ({target}) => {target.src=EMPTY_IMAGE};

export default ({avatarUrl}) =>
  <img
    className='Avatar'
    onerror={onerror}
    src={`${avatarUrl}v=3&s=32`}
  />
