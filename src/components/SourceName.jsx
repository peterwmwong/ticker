export default ({className, displayName})=>{
  const [owner, repo] = displayName.split('/');
  return repo ? (
    <span className={className}>
      <span className="c-gray-dark t-light">{owner}/</span>
      <span className="c-gray-darkest t-normal">{repo}</span>
    </span>
  ) : (
    <span className={className}>
      <span className="c-gray-darkest t-normal">{owner}</span>
    </span>
  );
}
