import './View.css';
import AppToolbar from './AppToolbar.jsx';
import EventsView from './EventsView.jsx';
import Tabs       from './common/Tabs.jsx';
import GithubUser from '../models/github/GithubUser';

const TABS = ['News', 'Repos'];

const UserView = ({id}, {user, tab}, {changeView})=>
  <div className="UserView View">
    <AppToolbar
      secondary={<Tabs tabs={TABS} selected={tab} onSelect={changeView} />}
      title={id}
    />
    <div className="View-content">
      {
        tab === 'News'          ? <EventsView id={id} type='users' />
      : tab === 'Code'          ? <EventsView id={id} type='users' />
      : tab === 'Pull Requests' ? <EventsView id={id} type='users' />
      : tab === 'Issues'        ? <EventsView id={id} type='users' />
      : null
      }
    </div>
  </div>;

const onInit = ({id}, state, {loadUser})=>(
  GithubUser.get(id).then(loadUser),
  {
    user: loadUser(GithubUser.localGet(id)),
    tab: TABS[0]
  }
);

UserView.state = {
  onInit: onInit,
  onProps: onInit,
  changeView: (props, state, actions, tab)=>({...state, tab}),
  loadUser: (props, state, actions, user)=>({...state, user})
}

export default UserView;
