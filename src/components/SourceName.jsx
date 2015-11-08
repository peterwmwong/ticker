export default ({className, displayName})=>{
  const [owner, repo] = displayName.split('/');
  const href = `#github/${displayName}`;
  return repo ? (
    <a className={`${className} c-gray-darkest t-normal`} href={href}>
      <span className="c-gray-dark t-light">{owner}/</span>
      {repo}
    </a>
  ) : (
    <a className={`${className} c-gray-darkest t-normal`} href={href}>{owner}</a>
  );
}
