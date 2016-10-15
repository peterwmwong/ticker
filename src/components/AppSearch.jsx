import './AppSearch.css';
import xvdom      from 'xvdom/src/index';
import List       from './common/List.jsx';
import SourceName from './SourceName.jsx';
import GithubRepo from '../models/github/GithubRepo';
import GithubUser from '../models/github/GithubUser';

const item = ({avatar_url, full_name, id, login, owner}) => ({
  href: `#github/${login || full_name}`,
  avatarUrl: (avatar_url || (owner && owner.avatar_url)),
  key:  id,
  text: <SourceName displayName={login || full_name} />
})

const AppSearch = ({props:{enabled}, state:{render, searchResults, term}, bindSend}) =>
  <div className={`AppSearch l-padding-2 fixed fixed--top ${enabled ? 'is-enabled' : ''}`}>
    {render &&
      <div>
        <div className='AppSearch-searchInputContainer'>
          <div className='AppSearch-inkdrop fit' />
          <div className='AppSearch-searchBar layout horizontal'>
            <input
              className='AppSearch-searchInput flex l-padding-h4'
              oninput={bindSend('onSearchInput')}
              placeholder='Search repositories or users…'
              type='text'
              value={term}
            />
          </div>
        </div>
        <List
          className='AppSearch-searchResults'
          item={item}
          itemClass='List-item--noDivider'
          list={searchResults}
        />
      </div>
    }
  </div>;

const onInit = ({props, state}) => ({
  render: (state && state.render || props.enabled),
  term: '',
  searchResults: []
});

AppSearch.state = {
  onInit,
  onProps: onInit,
  onSearchInput: ({state, bindSend}, event) => ({
    ...state,
    curSearch: (clearTimeout(state.curSearch), setTimeout(bindSend('doSearch'), 300)),
    term: event.target.value
  }),
  doSearch: ({state, bindSend}) => (
    Promise
      .all([GithubRepo.query(state), GithubUser.query(state)])
      .then(bindSend('onSearchResults')),
    {...state, curSearch:null}
  ),
  onSearchResults: ({state}, [repos, users]) => ({
    ...state,
    searchResults:
      (repos || [])
        .concat(users || [])
        .sort((a,b) => b.score - a.score)
        .slice(0, 5)
  })
};

export default AppSearch;
