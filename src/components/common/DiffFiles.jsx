import './Card.css';
import './Pill.css';
import xvdom          from 'xvdom/src/index';
import Code           from './Code.jsx';

const PATH_REGEX = /^(.*\/)?([^\/]+)$/;

const renderFile = ({additions, deletions, filename, patch}) => {
  const [, path, fname] = PATH_REGEX.exec(filename);
  return (
    <div className='Card' key={filename}>
      <div className='Card-title layout horizontal center t-no-wrap l-padding-r0'>
        <div className='c-gray-dark t-truncate' textContent={path} />
        <div className='t-normal l-padding-r1 t-truncate' textContent={fname} />
        <div className='flex' />
        <div className='Pill bg-green c-green' textContent={`+${additions}`} />
        <div className='Pill bg-red c-red' textContent={`–${deletions}`} />
      </div>
      <Code code={patch} syntax='diff' />
    </div>
  );
};

export default ({files}) =>
  <div>
    {files.map(renderFile)}
  </div>;
