import xvdom         from 'xvdom';
import AppToolbar    from './AppToolbar.jsx';
import EventsView    from './EventsView.jsx';
import UserReposView from './UserReposView.jsx';
import Tabs          from './common/Tabs.jsx';
import GithubUser    from '../models/github/GithubUser';

const TABS = ['News', 'Repos'];

const UserView = ({id}, {user, tab}, {changeView})=>
  <div>
    <AppToolbar
      secondary={<Tabs tabs={TABS} selected={tab} onSelect={changeView} />}
      title={id}
    />
    <div className="l-padding-t24 l-padding-b2">
      {
        tab === 'News'  ? <EventsView id={id} type='users' />
      : tab === 'Repos' ? <UserReposView id={id} />
      : null
      }
    </div>
  </div>;

const onInit = ({id}, state, {loadUser})=>(
  GithubUser.get(id).then(loadUser),
  {
    user: loadUser(GithubUser.localGet(id)),
    tab:  TABS[0]
  }
);

UserView.state = {
  onInit: onInit,
  onProps: onInit,
  changeView: (props, state, actions, tab)=>({...state, tab}),
  loadUser: (props, state, actions, user)=>({...state, user})
}

export default UserView;
