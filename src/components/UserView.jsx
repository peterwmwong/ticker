import xvdom              from 'xvdom/src/index';
import EventsView         from './EventsView.jsx';
import UserReposView      from './UserReposView.jsx';
import RepoUserToolbar    from './RepoUserToolbar.jsx';
import {toggleUserSource} from '../helpers/getCurrentUser';

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
  <div className='l-padding-b2'>
    <RepoUserToolbar
      TABS={TABS}
      id={id}
      isBookmarked={isBookmarked(user, id)}
      onBookmark={toggleUserSource}
      tab={viewUrl}
    />
    {TABS[viewUrl].view(id)}
  </div>;
