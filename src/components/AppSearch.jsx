import './AppSearch.css';
import xvdom      from 'xvdom';
import List       from './common/List.jsx';
import SourceName from './SourceName.jsx';
import GithubRepo from '../models/github/GithubRepo';
import GithubUser from '../models/github/GithubUser';

const listMeta = ({avatar_url, full_name, id, login, owner})=> ({
  href: `#github/${login || full_name}`,
  avatarUrl: (avatar_url || (owner && owner.avatar_url)),
  key:  id,
  text: <SourceName displayName={login || full_name} />
})

const AppSearch = ({enabled}, {searchResults, term}, {onSearchInput})=>
  <div className={`AppSearch l-padding-2 fixed fixed--top ${enabled ? 'is-enabled' : ''}`}>
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
    <List
      className='AppSearch-searchResults'
      list={searchResults}
      meta={listMeta}
      noDivider
    />
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
