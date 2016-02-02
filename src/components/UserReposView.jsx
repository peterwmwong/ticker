import xvdom      from 'xvdom';
import GithubIcon from './common/GithubIcon.jsx';
import compare    from '../helpers/compare';
import GithubRepo from '../models/github/GithubRepo';

const UserReposView = (props, repos)=>
  <div className='l-margin-t2 Card'>
    {repos.map(({name, description})=>
      <div className='List-item layout horizontal center t-normal'>
        <GithubIcon name='repo' className='l-margin-r3' />
        <div className="t-normal">
          {name}
          <div
            className="t-light t-font-size-14 c-gray-dark"
            textContent={description}
          />
        </div>
      </div>
    )}
  </div>;

UserReposView.state = {
  onInit: ({id:user}, state, {loadRepos})=>(
    GithubRepo.query({user}).then(loadRepos),
    loadRepos(GithubRepo.localQuery({user}) || [])
  ),
  loadRepos: (props, state, actions, repos)=>
    repos.sort((a, b)=>compare(a.name, b.name))
}

export default UserReposView;
