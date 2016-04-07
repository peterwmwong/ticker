import xvdom           from 'xvdom';
import IssuePullInfo   from './IssuePullInfo.jsx';
import PullCommitsView from './PullCommitsView.jsx';
import PullDiffView    from './PullDiffView.jsx';
import AppToolbar      from '../AppToolbar.jsx';
import Icon            from '../common/Icon.jsx';
import Tabs            from '../common/Tabs.jsx';
import GithubIssue     from '../../models/github/GithubIssue';

const TABS = {
  info:{
    title: 'Info',
    view: (repo, id, issue)=> <IssuePullInfo issue={issue} repo={repo} />
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

const IssuePullView = ({id, repo, tab='info'}, issue, {onBack})=>
  <div>
    <AppToolbar
      left={
        <Icon
          className='c-white'
          name='chevron-left'
          onClick={onBack}
          size='small'
        />
      }
      secondary={
        (!!issue && !!issue.pull_request) &&
          <Tabs
            hrefPrefix={`#github/${repo}?pulls/${id}/`}
            selected={tab}
            tabs={TABS}
          />
      }
      title={`${issue && issue.pull_request ? 'PR' : 'Issue'} #${id}: ${issue ? issue.title : ''}`}
    />
    <div
      className={`${issue && issue.pull_request ? 'l-padding-t24' : 'l-padding-t14'} l-padding-b2`}
    >
      {issue && TABS[tab].view(repo, id, issue)}
    </div>
  </div>;

const onInit = ({repo, id}, state, {loadIssue})=> {
  const repoId = `${repo}/${id}`;
  GithubIssue.get(repoId).then(loadIssue);
  return GithubIssue.localGet(repoId);
};

IssuePullView.state = {
  onInit,
  onProps: onInit,
  onBack: ({repo})=> {window.location.hash=`#github/${repo}`},
  loadIssue: (props, state, actions, issue)=> issue
};

export default IssuePullView;
