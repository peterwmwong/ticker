import xvdom      from 'xvdom';
import GithubIcon from './common/GithubIcon.jsx';
import compare    from '../helpers/compare';
import GithubRepo from '../models/github/GithubRepo';

const UserReposView = (props, repos)=>
  <div className='l-margin-t2 Card'>
    {repos.map(repo=>
      <div className='List-item layout horizontal center'>
        <GithubIcon name='repo' className='l-margin-r3' />
        {repo.name}
      </div>
    )}
  </div>;

const onInit = ({id:user}, state, {loadRepos})=>(
  GithubRepo.query({user}).then(loadRepos),
  loadRepos(GithubRepo.localQuery({user}) || [])
);

UserReposView.state = {
  onInit: onInit,
  onProps: onInit,
  loadRepos: (props, state, actions, repos)=>
    repos.sort((a, b)=>compare(a.name, b.name))
}

export default UserReposView;
