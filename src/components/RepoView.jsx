import xvdom           from 'xvdom';
import AppToolbar      from './AppToolbar.jsx';
import EventsView      from './EventsView.jsx';
import FilesView       from './FilesView.jsx';
import IssuesPullsView from './IssuesPullsView.jsx';
import ReadmeView      from './ReadmeView.jsx';
import Tabs            from './common/Tabs.jsx';
import GithubRepo      from '../models/github/GithubRepo';
import GithubIssue     from '../models/github/GithubIssue';
import GithubPull      from '../models/github/GithubPull';

const TABS = ['Readme', 'News', 'Code', 'Pull Requests', 'Issues'];


const RepoView = ({id}, {repo, tab}, {changeView})=>
  <div>
    <AppToolbar
      secondary={<Tabs tabs={TABS} selected={tab} onSelect={changeView} />}
      title={id}
    />
    <div className="l-padding-t24 l-padding-b2">
      {
        tab === 'Readme'          ? <ReadmeView id={id} />
      : tab === 'News'          ? <EventsView id={id} type='repos' />
      : tab === 'Code'          ? <FilesView repo={id} />
      : tab === 'Pull Requests' ? <IssuesPullsView id={id} modelClass={GithubPull} icon='git-pull-request' />
      : tab === 'Issues'        ? <IssuesPullsView id={id} modelClass={GithubIssue} icon='issue-opened' />
      : null
      }
    </div>
  </div>;

const init = ({id}, state, {loadRepo})=>(
  GithubRepo.get(id).then(loadRepo),
  {
    repo: loadRepo(GithubRepo.localGet(id)),
    tab: TABS[1]
  }
);

RepoView.state = {
  onInit: init,
  onProps: init,
  changeView: (props, state, actions, tab)=>({...state, tab}),
  loadRepo:  (props, state, actions, repo)=>({...state, repo})
}

export default RepoView;
