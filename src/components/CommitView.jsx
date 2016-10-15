import './common/Card.css';
import './common/Pill.css';
import xvdom               from 'xvdom/src/index';
import AppToolbar          from './AppToolbar.jsx';
import GithubCommit        from '../models/github/GithubCommit';
import DiffFiles           from './common/DiffFiles.jsx';
import Actor               from './common/Actor.jsx';
import Icon                from './common/Icon.jsx';
import modelStateComponent from '../helpers/modelStateComponent';

const COMMIT_PLACEHOLDER = {
  files: [],
  commit: {
    message: '',
    committer: {
      date: 0
    }
  },
  committer: {
    avatar_url: '',
    login: ''
  },
  stats: {
    additions: 0,
    deletions: 0
  }
};

const getCommitTitleMessage = message => {
  const [title] = /.*/g.exec(message);
  return title === message
    ? {title:'', message}
    : {title,    message:message.substr(title.length)};
};

export default modelStateComponent(GithubCommit, 'get', ({props: {repo, commitId}, state}) => {
  const {files, commit, committer, stats} = state || COMMIT_PLACEHOLDER;
  const {title, message} = getCommitTitleMessage(commit.message);
  return (
    <div>
      <AppToolbar
        left={
          <a href={`#github/${repo}`}>
            <Icon
              className='c-white l-padding-h4'
              name='chevron-left'
              size='small'
            />
          </a>
        }
        title={commitId}
      />
      <div className='Card Card--fullBleed'>
        {title &&
          <div className='Card-title'>
            <h1
              className='t-word-break-word l-margin-t4 l-margin-b0'
              textContent={title}
            />
          </div>
        }
        <div className='Card-content'>
          <div className='layout horizontal center l-margin-b4'>
            <Actor
              actionDate={commit.committer.date}
              className='flex'
              user={committer || {login:commit.committer.name}}
            />
            <div className='t-font-size-12 l-margin-h2' textContent={`${files.length} files changed`} />
            <div className='Pill bg-green c-green' textContent={`+${stats.additions}`} />
            <div className='Pill bg-red c-red' textContent={`–${stats.deletions}`} />
          </div>
          <pre
            className='t-white-space-normal t-word-break-word'
            textContent={message}
          />
        </div>
      </div>
      <DiffFiles files={files} />
    </div>
  );
})
