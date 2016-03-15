import xvdom           from 'xvdom';

import AppToolbar      from './AppToolbar.jsx';
import CommitView      from './CommitView.jsx';
import EventsView      from './EventsView.jsx';
import FilesView       from './FilesView.jsx';
import GithubIssue     from '../models/github/GithubIssue';
import GithubPull      from '../models/github/GithubPull';
import IssuesPullsView from './IssuesPullsView.jsx';
import IssueView       from './IssueView.jsx';
import ReadmeView      from './ReadmeView.jsx';
import Tabs            from './common/Tabs.jsx';

const TABS = {
  readme:{
    title: 'Readme',
    view: id => <ReadmeView id={id} />
  },
  news:{
    title: 'News',
    view: id => <EventsView id={id} type='repos' />

  },
  code:{
    title: 'Code',
    view: id => <FilesView repo={id} />

  },
  pulls:{
    title: 'Pull Requests',
    view: id => <IssuesPullsView id={id} modelClass={GithubPull} icon='git-pull-request' />
  },
  issues:{
    title: 'Issues',
    view: id => <IssuesPullsView id={id} modelClass={GithubIssue} icon='issue-opened' />
  }
};

export default ({id, viewUrl='news'}) => {
  const [tab, resourceId] = viewUrl.split('/');
  return (
    resourceId
      ? (
          tab === 'issues'  ? <IssueView  repo={id}  issueId={resourceId} />
        : tab === 'commits' ? <CommitView repo={id} commitId={resourceId} />
        : null
      )
      : (
        <div>
          <AppToolbar
            secondary={
              <Tabs tabs={TABS} selected={tab} hrefPrefix={`#github/${id}?`} />
            }
            title={id}
          />
          <div className="l-padding-t24 l-padding-b2">
            {TABS[tab].view(id)}
          </div>
        </div>
      )
  );
};
