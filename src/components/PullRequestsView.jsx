import xvdom      from 'xvdom';
import GithubIcon from './common/GithubIcon.jsx';
import compare    from '../helpers/compare';
import timeAgo    from '../helpers/timeAgo';
import GithubPull from '../models/github/GithubPull';

const PullRequestsView = (props, pulls)=>
  <div className='l-margin-t2 Card'>
    {pulls.map(({id, number, title, created_at, user})=>
      <div key={id} className='List-item layout horizontal center'>
        <GithubIcon name='git-pull-request' className='l-margin-r3' />
        <div className="t-normal">
          {title}
          <div className="t-light t-font-size-14 c-gray-dark">
            #{number} opened {timeAgo(Date.parse(created_at))} ago by {user.login}
          </div>
        </div>
      </div>
    )}
  </div>;

PullRequestsView.state = {
  onInit: ({id}, state, {loadPulls})=>(
    GithubPull.query({id}).then(loadPulls),
    loadPulls(GithubPull.localQuery({id}) || [])
  ),
  loadPulls: (props, state, actions, pulls)=>
    pulls.sort((a, b)=>compare(b.created_at, a.created_at))
}

export default PullRequestsView;
