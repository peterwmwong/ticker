import './AppDrawer.css';
import './common/List.css';
import xvdom      from 'xvdom';
import GithubIcon from './common/GithubIcon.jsx';
import Avatar     from './common/Avatar.jsx';
import SourceName from './SourceName.jsx';
import compare    from '../helpers/compare';

const sortRepos = (a, b)=>compare(a.full_name, b.full_name);
const sortUsers = (a, b)=>compare(a.login,     b.login);

const renderGroup = (sourceNameProp, sources)=>
  sources.map(({[sourceNameProp]:name})=>
    <SourceName
      key={name}
      className="List-item List-item--noBorder"
      displayName={name}
    />
  );

const renderSources = sources=>
  <div>
    <div className='List-item List-item--header c-gray-dark t-normal t-uppercase'>
      Repositories
    </div>
    {renderGroup('full_name', sources.filter(s=>s.type === 'GithubRepoSource').sort(sortRepos))}
    <div className='List-item List-item--header c-gray-dark t-normal t-uppercase'>
      Users / Orgs
    </div>
    {renderGroup('login', sources.filter(s=>s.type === 'GithubUserSource').sort(sortUsers))}
  </div>;

// Lazily render drawer contents the first time the drawer is enabled.
// Prevent un-rendering contents when disabled.
let lazyRenderContents = false;
export default ({user, enabled, onLogin})=>(
  (lazyRenderContents = enabled || lazyRenderContents),
  <div className={`AppDrawer fixed scroll ${enabled ? 'is-enabled' : ''}`}>
    {lazyRenderContents &&
      <div>
        <div
          className="List-item List-item--noBorder layout horizontal center"
          onclick={user && onLogin}
        >
          {user
            ? <Avatar avatarUrl={`https://avatars.githubusercontent.com/u/${user.id}?`}/>
            : <GithubIcon name="mark-github" />
          }
          <span
            className="l-margin-l4"
            textContent={user ? user.githubUsername : 'Login with GitHub'}
          />
        </div>
        {user && renderSources(user.sources)}
      </div>
    }
  </div>
);
