import xvdom              from 'xvdom';
import CommitView         from './CommitView.jsx';
import EventsView         from './EventsView.jsx';
import CodeView           from './code-view/CodeView.jsx';
import GithubIssue        from '../models/github/GithubIssue';
import GithubPull         from '../models/github/GithubPull';
import IssuesPullsView    from './IssuesPullsView.jsx';
import ReadmeView         from './ReadmeView.jsx';
import IssuePullView      from './issue-pull-view/IssuePullView.jsx';
import Tabs               from './common/Tabs.jsx';
import Icon               from './common/Icon.jsx';
import {toggleRepoSource} from '../helpers/getCurrentUser';
import AppToolbar, {
  AppToolbarSearch,
  AppToolbarDrawer
} from './AppToolbar.jsx';

const TABS = {
  readme:{
    title: 'Readme',
    view: (id)=> <ReadmeView id={id} />
  },
  news:{
    title: 'News',
    view: (id)=> <EventsView id={id} type='repos' />

  },
  code:{
    title: 'Code',
    view: (id, head, tail)=> <CodeView pathArray={tail} repo={id} sha={head} />
  },
  pulls:{
    title: 'Pull Requests',
    view: (id)=> <IssuesPullsView icon='git-pull-request' id={id} modelClass={GithubPull} />
  },
  issues:{
    title: 'Issues',
    view: (id)=> <IssuesPullsView icon='issue-opened' id={id} modelClass={GithubIssue} />
  }
};

const stripURLEnding = (url)=> url.replace(/\/\s*$/, '');

const isBookmarked = (user, id)=>
  user && user.sources.github.repos.find((s)=> s.id === id);

export default ({id, user, viewUrl='news'})=> {
  const [tab, head, ...tail] = stripURLEnding(viewUrl).split('/');
  // TODO: Temporary wrapper <div> to workaround xvdom dynamic stateful component
  //       rerendering bug
  return (
    <div>
      {
        ((tab === 'issues' || tab === 'pulls') && head)
            ? <IssuePullView  id={head}       repo={id} tab={tail[0]} />
        : (tab === 'commits' && head)
            ? <CommitView     commitId={head} repo={id} />
        : (
          <div>
            <AppToolbar
              left={<AppToolbarDrawer />}
              right={
                <div>
                  <AppToolbarSearch />
                  <Icon
                    className={`c-white ${isBookmarked(user, id) ? '' : 'c-opacity-50'}`}
                    name='bookmark'
                    onClick={()=> { toggleRepoSource(id) }}
                    size='small'
                  />
                </div>
              }
              secondary={
                <Tabs hrefPrefix={`#github/${id}?`} selected={tab} tabs={TABS} />
              }
              title={id}
            />
            <div className='l-padding-t24 l-padding-b2'>
              {TABS[tab].view(id, head, tail)}
            </div>
          </div>
        )
      }
    </div>
  );
};
