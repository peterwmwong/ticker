import xvdom           from 'xvdom';

import AppToolbar      from './AppToolbar.jsx';
import CommitView      from './CommitView.jsx';
import EventsView      from './EventsView.jsx';
import CodeView        from './code-view/CodeView.jsx';
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
    view: (id, head, tail) => <CodeView repo={id} sha={head} pathArray={tail} />

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

const stripURLEnding = url=> url.replace(/\/\s*$/, '');

export default ({id, viewUrl='news'}) => {
  const [tab, head, ...tail] = stripURLEnding(viewUrl).split('/');
  return (
      (tab === 'issues'  && head) ? <IssueView  repo={id} issueId={head} />
    : (tab === 'commits' && head) ? <CommitView repo={id} commitId={head} />
    : (
      <div>
        <AppToolbar
          secondary={
            <Tabs tabs={TABS} selected={tab} hrefPrefix={`#github/${id}?`} />
          }
          title={id}
        />
        <div className="l-padding-t24 l-padding-b2">
          {TABS[tab].view(id, head, tail)}
        </div>
      </div>
    )
  );
};
