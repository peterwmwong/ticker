import xvdom         from 'xvdom';
import AppToolbar    from './AppToolbar.jsx';
import EventsView    from './EventsView.jsx';
import UserReposView from './UserReposView.jsx';
import Tabs          from './common/Tabs.jsx';

const TABS = {
  news:{
    title: 'News',
    view: (id)=> <EventsView id={id} type='users' />
  },
  repos:{
    title: 'Repos',
    view: (id)=> <UserReposView id={id} />
  }
};

const UserView = ({id, viewUrl='news'})=>
  <div>
    <AppToolbar
      secondary={
        <Tabs hrefPrefix={`#github/${id}?`} selected={viewUrl} tabs={TABS} />
      }
      title={id}
    />
    <div className='l-padding-t24 l-padding-b2'>
      {TABS[viewUrl].view(id)}
    </div>
  </div>;

export default UserView;
