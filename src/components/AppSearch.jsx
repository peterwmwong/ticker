import './AppSearch.css';
import Icon       from './common/Icon.jsx';
import Avatar     from './common/Avatar.jsx';
import SourceName from './SourceName.jsx';
import GithubRepo from '../models/github/GithubRepo';
import GithubUser from '../models/github/GithubUser';

const AppSearch = ({enabled, onRequestDisable}, {searchResults, term}, {onSearchInput})=>
  <div className={`AppSearch fixed l-padding-1 ${enabled ? 'is-enabled' : ''}`}>
    <div className="AppSearch-backdrop fit" onclick={onRequestDisable} />
    <div className="AppSearch-searchInputContainer">
      <div className="AppSearch-inkdrop fit" />
      <div className="AppSearch-searchBar layout horizontal">
        <Icon name="&#xe5d2;" className="l-padding-l4" onClick={onRequestDisable} />
        <input
          type="text"
          className="AppSearch-searchInput flex l-padding-h4"
          placeholder="Search repositories or users..."
          value={term}
          oninput={onSearchInput}
        />
      </div>
    </div>
    <ul className="AppSearch-searchResults">
      {searchResults.map(result=>
        <li
          key={result.id}
          className="layout horizontal center l-padding-v4 l-padding-h6"
          result={result}
          onclick={onRequestDisable}
        >
          <Avatar
            avatarUrl={`https://avatars.githubusercontent.com/u/1234?`}
            className="l-margin-r4"
          />
          <SourceName displayName={result.login || result.full_name} />
        </li>
      )}
    </ul>
  </div>;

AppSearch.state = {
  onInit: (props, state, actions)=>({term: '', searchResults: []}),
  onProps: (props, state, actions)=>actions.onInit(),
  onSearchInput: (props, state, actions, event)=>{
    const term = event.target.value;
    const params = {term};
    Promise.all([
      GithubRepo.query(params), GithubUser.query(params)
    ]).then(([repos, users])=>{
      actions.onSearchResults(
        [...repos, ...users].sort((a,b)=>a.score - b.score).slice(0, 5)
      );
    })
    return {...state, term};
  },
  onSearchResults: (props, state, actions, searchResults)=>({
    ...state,
    searchResults
  })
};

export default AppSearch;
