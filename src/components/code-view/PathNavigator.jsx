import './PathNavigator.css';
import xvdom from 'xvdom';

const repoName = repo => repo.split('/')[1]
const pathURL = (pathArray, i)=> pathArray.slice(0, i).map(a => `/${a}`).join('')

export default ({repo, pathURLPrefix, pathArray, sha}) =>
  <div className='Card Card--fullBleed l-height10 c-bg-white l-padding-t1 l-padding-h6 layout horizontal center'>
    <div className='flex'>
      {[repoName(repo), ...pathArray].map((component, i) =>
          <a
            key={i}
            className={`PathNavigator-path ${i === pathArray.length ? '' : 'u-link'}`}
            href={`${pathURLPrefix}${sha}${pathURL(pathArray, i)}`}
          >
            {component}
          </a>
      )}
    </div>
    <div className='u-link l-padding-l4'>{sha}</div>
  </div>
