import xvdom         from 'xvdom';
import AppToolbar    from './AppToolbar.jsx';
import EventsView    from './EventsView.jsx';
import UserReposView from './UserReposView.jsx';
import Tabs          from './common/Tabs.jsx';

const TABS = {
  news:{
    title: 'News',
    view: id=> <EventsView id={id} type='users' />
  },
  repos:{
    title: 'Repos',
    view: id=> <UserReposView id={id} />
  }
};

const titleForTab = tab=>TABS[tab].title

const UserView = ({id, tab='news'})=>
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

export default UserView;
