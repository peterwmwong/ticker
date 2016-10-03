import xvdom from 'xvdom/src/index';

export default ({className, displayName})=> {
  const [owner, repo] = displayName.split('/');
  return (
    <a className={`t-normal ${className || ''}`} href={`#github/${displayName}`}>
      <span className='c-gray-dark t-light' textContent={repo ? `${owner}/` : ''} />
      {repo || owner}
    </a>
  );
}
