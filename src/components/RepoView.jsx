import xvdom           from 'xvdom';
import AppToolbar      from './AppToolbar.jsx';
import EventsView      from './EventsView.jsx';
import FilesView       from './FilesView.jsx';
import IssuesPullsView from './IssuesPullsView.jsx';
import ReadmeView      from './ReadmeView.jsx';
import Tabs            from './common/Tabs.jsx';
import GithubIssue     from '../models/github/GithubIssue';
import GithubPull      from '../models/github/GithubPull';

const TABS = {
  readme:{
    title: 'Readme',
    view: id=> <ReadmeView id={id} />
  },
  news:{
    title: 'News',
    view: id=> <EventsView id={id} type='repos' />

  },
  code:{
    title: 'Code',
    view: id=> <FilesView repo={id} />

  },
  pulls:{
    title: 'Pull Requests',
    view: id=> <IssuesPullsView id={id} modelClass={GithubPull} icon='git-pull-request' />
  },
  issues:{
    title: 'Issues',
    view: id=> <IssuesPullsView id={id} modelClass={GithubIssue} icon='issue-opened' />
  }
};

const titleForTab = tab=>TABS[tab].title

const RepoView = ({id, tab='news'})=>
  <div>
    <AppToolbar
      secondary={
        <Tabs
          tabs={Object.keys(TABS)}
          selected={tab}
          titleForTab={titleForTab}
          hrefForTab={tab=>`#github/${id}?tab=${tab}`}
        />
      }
      title={id}
    />
    <div className="l-padding-t24 l-padding-b2">
      {TABS[tab].view(id)}
    </div>
  </div>;

export default RepoView;
