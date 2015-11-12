import './AppDrawer.css';
import './common/List.css';
import Avatar from './common/Avatar.jsx';
import SourceName from './SourceName.jsx';

export default ({user, enabled, onLogin})=>
  <div className={`AppDrawer ${enabled ? 'is-enabled' : ''}`}>
    <div className='AppDrawer-content scroll'>
      {!user &&
        <div className="List-item l-padding-v6" onclick={onLogin}>Login</div>
      }
      {user &&
        <div className="List-item layout horizontal center l-padding-v6 t-font-size-20">
          <Avatar
            avatarUrl={`https://avatars.githubusercontent.com/u/${user.id}?`}
            className="l-margin-r4"
          />
          {user.githubUsername}
        </div>
      }
      {user && user.sources.map(source=>
        <SourceName key={source.displayName} className="List-item" displayName={source.displayName}/>
      )}
    </div>
  </div>;
