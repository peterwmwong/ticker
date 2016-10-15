import './AppDrawer.css';
import './common/List.css';
import xvdom      from 'xvdom/src/index';
import List       from './common/List.jsx';
import Icon       from './common/Icon.jsx';
import Avatar     from './common/Avatar.jsx';
import SourceName from './SourceName.jsx';
import compare    from '../helpers/compare';

const userAvatarUrl = username => `https://github.com/${username}.png?size=32`
const sort = (a, b) => compare(a.sortKey, b.sortKey);
const renderData = ({id}) => {
  const [owner, name] = id.split('/');
  return {
    id,
    avatarUrl: userAvatarUrl(owner),
    sortKey: (name || owner).toLowerCase()
  };
}
const sortSources = sources => sources.map(renderData).sort(sort)

const item = ({id, avatarUrl}) => ({
  href: `#github/${id}`,
  avatarUrl: avatarUrl,
  key:  id,
  text: <SourceName displayName={id} />
})

const logout = () => {
  window.localStorage.clear();
  window.location.reload();
}

// Lazily render drawer contents the first time the drawer is enabled.
// Prevent un-rendering contents when disabled.
let lazyRenderContents = false;
export default ({user, enabled, onLogin}) => {
  lazyRenderContents  = enabled || lazyRenderContents;
  const enabledClass  = enabled            ? 'is-enabled'  : '';
  const renderedClass = lazyRenderContents ? 'is-rendered' : '';
  return (
    <div className={`AppDrawer fixed scroll ${enabledClass} ${renderedClass}`}>
      {lazyRenderContents && (
        user ? (
          <div>
            <div className='List-item List-item--noDivider layout horizontal center'>
              <Avatar avatarUrl={userAvatarUrl(user.githubUsername)} />
              <span className='l-margin-l4' textContent={user.githubUsername} />
            </div>
            <div className='List-item List-item--header'>
              REPOSITORIES
            </div>
            <List
              item={item}
              itemClass='List-item--noDivider'
              list={user.sources.github.repos}
              transform={sortSources}
            />
            <div className='List-item List-item--header'>
              USERS / ORGS
            </div>
            <List
              item={item}
              itemClass='List-item--noDivider'
              list={user.sources.github.users}
              transform={sortSources}
            />
            <a
              className='List-item List-item--header l-padding-b4'
              onclick={logout}
            >
              LOGOUT
            </a>
          </div>
        ) : (
          <div
            className='List-item List-item--noDivider layout horizontal center'
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
