import './PathNavigator.css';
import xvdom from 'xvdom/src/index';

const repoName = repo => repo.split('/')[1]
const pathURL = (pathArray, i) => pathArray.slice(0, i).map(a => `/${a}`).join('')

export default ({pathURLPrefix, pathArray, repo, sha}) =>
  <div className='Card Card--fullBleed'>
    <div className='Card-content layout horizontal l-padding-v2'>
      <div className='flex'>
        {[repoName(repo), ...pathArray].map((component, i) =>
          <a
            className={`PathNavigator-path ${i === pathArray.length ? '' : 'u-link'}`}
            href={pathURLPrefix + sha + pathURL(pathArray, i)}
            key={i}
          >
            {component}
          </a>
        )}
      </div>
      <a className='u-link'>{sha}</a>
    </div>
  </div>
