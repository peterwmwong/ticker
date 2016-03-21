import xvdom            from 'xvdom';
import Markup           from './common/Markup.jsx';
import GithubRepoReadme from '../models/github/GithubRepoReadme';

const ReadmeView = (props, readme)=>
  <div className='Card l-margin-t2'>
    <div className='Card-content'>
      <Markup content={readme} />
    </div>
  </div>;

const onInit = ({id}, state, {loadReadme})=> (
  GithubRepoReadme.get(id).then(loadReadme),
  (GithubRepoReadme.localGet(id) || '')
);

ReadmeView.state = {
  onInit,
  onProps: onInit,
  loadReadme: (props, state, actions, readme)=> readme
}

export default ReadmeView;
