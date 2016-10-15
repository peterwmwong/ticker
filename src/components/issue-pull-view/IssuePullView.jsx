import xvdom           from 'xvdom/src/index';
import IssuePullInfo   from './IssuePullInfo.jsx';
import PullCommitsView from './PullCommitsView.jsx';
import PullDiffView    from './PullDiffView.jsx';
import AppToolbar      from '../AppToolbar.jsx';
import Icon            from '../common/Icon.jsx';
import Tabs            from '../common/Tabs.jsx';
import GithubIssue     from '../../models/github/GithubIssue';
import modelStateComponent      from '../../helpers/modelStateComponent';

const TABS = {
  info:{
    title: 'Info',
    view: (repo, id, issue) => <IssuePullInfo issue={issue} repo={repo} />
  },
  commits:{
    title: 'Commits',
    view: (repo, id) => <PullCommitsView id={id} repo={repo} />
  },
  diff:{
    title: 'Diff',
    view: (repo, id) => <PullDiffView id={id} repo={repo} />
  }
};

export default modelStateComponent(GithubIssue, 'get', ({props: {id, repo, tab='info'}, state:issue}) =>
  <div>
    <AppToolbar
      left={
        <a href={`#github/${repo}`}>
          <Icon
            className='c-white l-padding-h4'
            name='chevron-left'
            size='small'
          />
        </a>
      }
      secondary={
        (issue && issue.pull_request) &&
          <Tabs
            hrefPrefix={`#github/${repo}?pulls/${id}/`}
            selected={tab}
            tabs={TABS}
          />
      }
      title={`${(issue && issue.pull_request) ? 'PR' : 'Issue'} #${id}: ${issue ? issue.title : ''}`}
    />
    {issue && TABS[tab].view(repo, id, issue)}
  </div>
);
