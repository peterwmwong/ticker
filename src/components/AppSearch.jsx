import './AppSearch.css';
import xvdom      from 'xvdom';
import Avatar     from './common/Avatar.jsx';
import SourceName from './SourceName.jsx';
import GithubRepo from '../models/github/GithubRepo';
import GithubUser from '../models/github/GithubUser';

const AppSearch = ({enabled}, {searchResults, term}, {onSearchInput})=>
  <div className={`AppSearch l-padding-1 fixed fixed--top ${enabled ? 'is-enabled' : ''}`}>
    <div className="AppSearch-searchInputContainer">
      <div className="AppSearch-inkdrop fit" />
      <div className="AppSearch-searchBar layout horizontal">
        <input
          type="text"
          className="AppSearch-searchInput flex l-padding-h4"
          placeholder="Search repositories or users…"
          value={term}
          oninput={onSearchInput}
        />
      </div>
    </div>
    <ul className="AppSearch-searchResults">
      {searchResults.map(({avatar_url, full_name, id, login, owner})=>
        <li
          key={id}
          className="layout horizontal center l-padding-v4 l-padding-h6"
        >
          <Avatar avatarUrl={avatar_url || (owner && owner.avatar_url)} />
          <SourceName
            className="l-margin-l4"
            displayName={login || full_name}
          />
        </li>
      )}
    </ul>
  </div>;

const onInit = ()=>({term: '', searchResults: []});

AppSearch.state = {
  onInit: onInit,
  onProps: onInit,
  onSearchInput: (props, state, {doSearch}, event)=>({
    ...state,
    curSearch: state.curSearch || setTimeout(doSearch, 300),
    term:event.target.value
  }),
  doSearch: (props, state, {onSearchResults})=>{
    const params = {term: state.term};
    Promise.all([
      GithubRepo.query(params), GithubUser.query(params)
    ]).then(([repos, users])=>{
      onSearchResults(
        [...repos, ...users].sort((a,b)=>b.score - a.score).slice(0, 5)
      );
    });
    return {...state, curSearch:null};
  },
  onSearchResults: (props, state, actions, searchResults)=>({
    ...state,
    searchResults
  })
};

export default AppSearch;
