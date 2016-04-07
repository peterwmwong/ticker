import './AppDrawer.css';
import './common/List.css';
import xvdom      from 'xvdom';
import Icon from './common/Icon.jsx';
import Avatar     from './common/Avatar.jsx';
import SourceName from './SourceName.jsx';
import compare    from '../helpers/compare';

const sort = (a, b)=> compare(a.sortKey, b.sortKey);
const renderData = ({id})=> {
  const [owner, name] = id.split('/');
  return {
    id,
    avatarUrl: `https://github.com/${owner}.png?size=32`,
    sortKey: (name || owner).toLowerCase()
  };
};

const SourceGroup = ({sources})=>
  <div>
    {sources
      .map(renderData)
      .sort(sort)
      .map(({id, avatarUrl})=>
        <div className='layout horizontal center l-padding-l4' key={id}>
          <Avatar avatarUrl={avatarUrl} />
          <SourceName className='List-item List-item--noBorder' displayName={id} />
        </div>
      )
    }
  </div>

const logout = ()=> {
  window.localStorage.clear();
  window.location.reload();
}

// Lazily render drawer contents the first time the drawer is enabled.
// Prevent un-rendering contents when disabled.
let lazyRenderContents = false;
export default ({user, enabled, onLogin})=> {
  lazyRenderContents  = enabled || lazyRenderContents;
  const enabledClass  = enabled            ? 'is-enabled'  : '';
  const renderedClass = lazyRenderContents ? 'is-rendered' : '';
  return (
    <div className={`AppDrawer fixed scroll ${enabledClass} ${renderedClass}`}>
      {lazyRenderContents && (
        user ? (
          <div>
            <div className='List-item List-item--noBorder layout horizontal center'>
              <Avatar avatarUrl={`https://avatars.githubusercontent.com/u/${user.id}?`} />
              <span className='l-margin-l4' textContent={user.githubUsername} />
            </div>
            <div className='List-item List-item--header'>
              REPOSITORIES
            </div>
            <SourceGroup sources={user.sources.github.repos} />
            <div className='List-item List-item--header'>
              USERS / ORGS
            </div>
            <SourceGroup sources={user.sources.github.users} />
            <a
              className='List-item List-item--header l-padding-b4'
              onclick={logout}
            >
              LOGOUT
            </a>
          </div>
        ) : (
          <div
            className='List-item List-item--noBorder layout horizontal center'
            onclick={onLogin}
          >
            <Icon name='mark-github' />
            <span className='l-margin-l4' textContent='Login with GitHub' />
          </div>
        )
      )}
    </div>
  )
};
