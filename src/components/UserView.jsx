import xvdom         from 'xvdom';
import AppToolbar    from './AppToolbar.jsx';
import EventsView    from './EventsView.jsx';
import UserReposView from './UserReposView.jsx';
import Tabs          from './common/Tabs.jsx';

const TABS = ['News', 'Repos'];

const UserView = ({id}, {tab}, {changeView})=>
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

const onInit = ()=>({tab:TABS[0]});

UserView.state = {
  onInit,
  onProps: onInit,
  changeView: (props, state, actions, tab)=>({tab})
}

export default UserView;
