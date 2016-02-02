import xvdom from 'xvdom';

export default ({className, displayName})=>{
  const [owner, repo] = displayName.split('/');
  return (
    <a className={`t-normal ${className}`} href={`#github/${displayName}`}>
      {repo && <span className="c-gray-dark t-light" textContent={`${owner}/`} />}
      {repo || owner}
    </a>
  );
}
