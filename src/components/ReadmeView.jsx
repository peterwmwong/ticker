import xvdom            from 'xvdom/src/index';
import Markup           from './common/Markup.jsx';
import modelStateComponent       from '../helpers/modelStateComponent';
import GithubRepoReadme from '../models/github/GithubRepoReadme';

export default modelStateComponent(GithubRepoReadme, 'get', ({state}) =>
  <div className='Card l-margin-t2'>
    <Markup className='Card-content' content={state} />
  </div>
)
