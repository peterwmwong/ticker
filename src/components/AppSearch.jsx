import './AppSearch.css';
import Icon from './common/Icon.jsx';

export default ({enabled, onRequestDisable})=>
  <div className={`AppSearch fixed l-padding-1 ${enabled ? 'is-enabled' : ''}`}>
    <div className="AppSearch-backdrop fit" onclick={onRequestDisable} />
    <div className="AppSearch-searchInputContainer layout horizontal">
      <Icon name="&#xe5d2;" className="l-padding-l4" onClick={onRequestDisable} />
      <input type="text" className="flex AppSearch-searchInput l-padding-h4" placeholder="Search repositories or users..." />
    </div>
  </div>;
