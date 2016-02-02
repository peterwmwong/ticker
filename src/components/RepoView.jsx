import xvdom            from 'xvdom';
import AppToolbar       from './AppToolbar.jsx';
import EventsView       from './EventsView.jsx';
import FilesView        from './FilesView.jsx';
import PullRequestsView from './PullRequestsView.jsx';
import IssuesView       from './IssuesView.jsx';
import Tabs             from './common/Tabs.jsx';
import GithubRepo       from '../models/github/GithubRepo';

const TABS = ['News', 'Code', 'Pull Requests', 'Issues'];

const RepoView = ({id}, {repo, tab}, {changeView})=>
  <div>
    <AppToolbar
      secondary={<Tabs tabs={TABS} selected={tab} onSelect={changeView} />}
      title={id}
    />
    <div className="l-padding-t24 l-padding-b2">
      {
        tab === 'News'          ? <EventsView id={id} type='repos' />
      : tab === 'Code'          ? <FilesView repo={id} />
      : tab === 'Pull Requests' ? <PullRequestsView id={id}/>
      : tab === 'Issues'        ? <IssuesView id={id}/>
      : null
      }
    </div>
  </div>;

const init = ({id}, state, {loadRepo})=>(
  GithubRepo.get(id).then(loadRepo),
  {
    repo: loadRepo(GithubRepo.localGet(id)),
    tab: TABS[0]
  }
);

RepoView.state = {
  onInit: init,
  onProps: init,
  changeView: (props, state, actions, tab)=>({...state, tab}),
  loadRepo:  (props, state, actions, repo)=>({...state, repo})
}

export default RepoView;
