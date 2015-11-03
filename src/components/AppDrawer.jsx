import './AppDrawer.css';
import './common/List.css';
import Avatar from './common/Avatar.jsx';
import SourceName from './SourceName.jsx';

export default ({user, enabled, onSelectSource, onRequestDisable, onLogin})=>
  <div className={`AppDrawer ${enabled ? 'is-enabled' : ''}`}>
    <div className='AppDrawer-sheet' onclick={onRequestDisable} />
    <div className='AppDrawer-content'>
      {!user &&
        <div className="List-item l-padding-v6" onclick={onLogin}>
          Login
        </div>
      }
      {user &&
        <div className="List-item layout horizontal center l-padding-v6">
          <Avatar avatarUrl="" className="l-margin-r4" />
          {user.username}
        </div>
      }
      {user && user.sources.map(source=>
        <div key={source.displayName} className="List-item" onclick={()=>onSelectSource(source)}>
          <SourceName displayName={source.displayName}/>
        </div>
      )}
    </div>
  </div>;
