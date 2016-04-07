import xvdom              from 'xvdom';
import EventsView         from './EventsView.jsx';
import UserReposView      from './UserReposView.jsx';
import Tabs               from './common/Tabs.jsx';
import Icon               from './common/Icon.jsx';
import {toggleUserSource} from '../helpers/getCurrentUser';
import AppToolbar, {
  AppToolbarSearch,
  AppToolbarDrawer
} from './AppToolbar.jsx';

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

const isBookmarked = (user, id)=>
  user && user.sources.github.users.find((s)=> s.id === id);

export default ({id, user, viewUrl='news'})=>
  <div>
    <AppToolbar
      left={<AppToolbarDrawer />}
      right={
        <div>
          <AppToolbarSearch />
          <Icon
            className={`c-white ${isBookmarked(user, id) ? '' : 'c-opacity-50'}`}
            name='bookmark'
            size='small'
            onClick={()=> { toggleUserSource(id) }}
          />
        </div>
      }
      secondary={
        <Tabs hrefPrefix={`#github/${id}?`} selected={viewUrl} tabs={TABS} />
      }
      title={id}
    />
    <div className='l-padding-t24 l-padding-b2'>
      {TABS[viewUrl].view(id)}
    </div>
  </div>;
