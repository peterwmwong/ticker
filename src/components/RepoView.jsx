import xvdom              from 'xvdom/src/index';
import CommitView         from './CommitView.jsx';
import EventsView         from './EventsView.jsx';
import CodeView           from './code-view/CodeView.jsx';
import GithubIssue        from '../models/github/GithubIssue';
import GithubPull         from '../models/github/GithubPull';
import IssuesPullsView    from './IssuesPullsView.jsx';
import ReadmeView         from './ReadmeView.jsx';
import RepoUserToolbar    from './RepoUserToolbar.jsx';
import IssuePullView      from './issue-pull-view/IssuePullView.jsx';
import {toggleRepoSource} from '../helpers/getCurrentUser';

const TABS = {
  readme:{
    title: 'Readme',
    view: id => <ReadmeView id={id} />
  },
  news:{
    title: 'News',
    view: id => <EventsView id={id} type='repos' />

  },
  code:{
    title: 'Code',
    view: (id, head, tail) => <CodeView pathArray={tail} repo={id} sha={head} />
  },
  pulls:{
    title: 'Pull Requests',
    view: repo => <IssuesPullsView modelClass={GithubPull} repo={repo} />
  },
  issues:{
    title: 'Issues',
    view: repo => <IssuesPullsView modelClass={GithubIssue} repo={repo} />
  }
};

const stripURLEnding = url => url.replace(/\/\s*$/, '');

const isBookmarked = (user, id) =>
  user && user.sources.github.repos.find(s => s.id === id);

export default ({id, user, viewUrl='news'}) => {
  const [tab, head, ...tail] = stripURLEnding(viewUrl).split('/');
  // TODO: Temporary wrapper <div> to workaround xvdom dynamic stateful component
  //       rerendering bug
  return (
    <div>
      {
        ((tab === 'issues' || tab === 'pulls') && head)
            ? <IssuePullView id={head} repo={id} tab={tail[0]} />
        : (tab === 'commits' && head)
            ? <CommitView commitId={head} repo={id} />
        : (
          <div className='l-padding-b2'>
            <RepoUserToolbar
              TABS={TABS}
              id={id}
              isBookmarked={isBookmarked(user, id)}
              onBookmark={toggleRepoSource}
              tab={tab}
            />
            {TABS[tab].view(id, head, tail)}
          </div>
        )
      }
    </div>
  );
};
