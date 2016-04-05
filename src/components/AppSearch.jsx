import './AppSearch.css';
import xvdom      from 'xvdom';
import Avatar     from './common/Avatar.jsx';
import SourceName from './SourceName.jsx';
import GithubRepo from '../models/github/GithubRepo';
import GithubUser from '../models/github/GithubUser';

const AppSearch = ({enabled}, {searchResults, term}, {onSearchInput})=>
  <div className={`AppSearch l-padding-1 fixed fixed--top ${enabled ? 'is-enabled' : ''}`}>
    <div className='AppSearch-searchInputContainer'>
      <div className='AppSearch-inkdrop fit' />
      <div className='AppSearch-searchBar layout horizontal'>
        <input
          className='AppSearch-searchInput flex l-padding-h4'
          oninput={onSearchInput}
          placeholder='Search repositories or users…'
          type='text'
          value={term}
        />
      </div>
    </div>
    <ul className='AppSearch-searchResults'>
      {searchResults.map(({avatar_url, full_name, id, login, owner})=>
        <li
          className='layout horizontal center l-padding-v4 l-padding-h6'
          key={id}
        >
          <Avatar avatarUrl={avatar_url || (owner && owner.avatar_url)} />
          <SourceName
            className='l-margin-l4'
            displayName={login || full_name}
          />
        </li>
      )}
    </ul>
  </div>;

const onInit = ()=> ({term: '', searchResults: []});

AppSearch.state = {
  onInit,
  onProps: onInit,
  onSearchInput: (props, state, {doSearch}, event)=> ({
    ...state,
    curSearch: (clearTimeout(state.curSearch), setTimeout(doSearch, 300)),
    term: event.target.value
  }),
  doSearch: (props, state, {onSearchResults})=> (
    Promise
      .all([GithubRepo.query(state), GithubUser.query(state)])
      .then(onSearchResults),
    {...state, curSearch:null}
  ),
  onSearchResults: (props, state, actions, [repos, users])=> ({
    ...state,
    searchResults:
      (repos || [])
        .concat(users || [])
        .sort((a,b)=> b.score - a.score)
        .slice(0, 5)
  })
};

export default AppSearch;
