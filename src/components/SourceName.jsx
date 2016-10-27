import xvdom from 'xvdom/src/index';

export default ({className, displayName}) => {
  const [owner, repo] = displayName.split('/');
  return (
    <a className={className || ''} href={`#github/${displayName}`}>
      <span className='c-gray-dark' textContent={repo ? `${owner}/` : ''} />
      {repo || owner}
    </a>
  );
}
