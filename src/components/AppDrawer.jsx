import './AppDrawer.css';
import './common/List.css';
import GithubIcon from './common/GithubIcon.jsx';
import Avatar from './common/Avatar.jsx';
import SourceName from './SourceName.jsx';

export default ({user, enabled, onLogin})=>
  <div className={`AppDrawer ${enabled ? 'is-enabled' : ''}`}>
    <div className='AppDrawer-content scroll'>
      {!user
        ? <div className="List-item layout horizontal center" onclick={onLogin}>
            <GithubIcon name="mark-github" className="l-margin-r4" />
            Login with GitHub
          </div>
        : <div>
            <div className="List-item layout horizontal center t-font-size-20">
              <Avatar
                avatarUrl={`https://avatars.githubusercontent.com/u/${user.id}?`}
              />
            <span className="l-margin-l4" textContent={user.githubUsername} />
            </div>
            {user.sources.map(source=>{
              const displayName = source.login || source.full_name;
              return <SourceName key={displayName} className="List-item" displayName={displayName}/>
            })}
          </div>
      }
    </div>
  </div>;
