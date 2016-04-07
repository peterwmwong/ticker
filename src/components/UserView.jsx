import xvdom              from 'xvdom';
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
  <div>
    <RepoUserToolbar
      TABS={TABS}
      id={id}
      isBookmarked={isBookmarked(user, id)}
      onBookmark={()=> { toggleUserSource(id) }}
      tab={viewUrl}
    />
    <div className='l-padding-t24 l-padding-b2'>
      {TABS[viewUrl].view(id)}
    </div>
  </div>;
