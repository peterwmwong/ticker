import xvdom           from 'xvdom';
import PullCommitsView from './PullCommitsView.jsx';
import PullDiffView    from './PullDiffView.jsx';
import AppToolbar      from '../AppToolbar.jsx';
import IssuePullInfo   from '../IssuePullInfo.jsx';
import Tabs            from '../common/Tabs.jsx';
import GithubIssue     from '../../models/github/GithubIssue';

const TABS = {
  info:{
    title: 'Info',
    view: (repo, id)=> <IssuePullInfo issueId={id} repo={repo} />
  },
  commits:{
    title: 'Commits',
    view: (repo, id)=> <PullCommitsView id={id} repo={repo} />
  },
  diff:{
    title: 'Diff',
    view: (repo, id)=> <PullDiffView id={id} repo={repo} />
  }
};

const PullView = ({pullId, repo, tab='info'}, pull)=>
  <div>
    <AppToolbar
      secondary={
        <Tabs hrefPrefix={`#github/${repo}?pulls/${pullId}/`} selected={tab} tabs={TABS} />
      }
      title={`PR #${pullId}: ${pull.title}`}
    />
    <div className='l-padding-t24 l-padding-b2'>
      {TABS[tab].view(repo, pullId)}
    </div>
  </div>;

const onInit = ({repo, pullId}, state, {loadIssue})=> {
  const id = `${repo}/${pullId}`;
  GithubIssue.get(id).then(loadIssue);
  return GithubIssue.localGet(id)
};

PullView.state = {
  onInit,
  onProps: onInit,
  loadIssue: (props, state, actions, pull)=> pull
};

export default PullView;
