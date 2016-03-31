import './common/Card.css';
import './common/Pill.css';
import xvdom        from 'xvdom';
import AppToolbar   from './AppToolbar.jsx';
import GithubCommit from '../models/github/GithubCommit';
import DiffFiles    from './common/DiffFiles.jsx';
import Actor        from './common/Actor.jsx';

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

const getCommitTitleMessage = (message)=> {
  const [title] = /.*/g.exec(message);
  return title === message ? {title:'', message}
    : {title, message:message.substr(title.length)};
};

const CommitView = ({repo, commitId}, {files, commit, committer, stats})=> {
  const {title, message} = getCommitTitleMessage(commit.message);
  return (
    <div className='l-padding-t6'>
      <div className='Card Card--fullBleed l-padding-t5'>
        <AppToolbar title={commitId} />
        <div className='Card-title'>
          {title && <h1
            className='t-word-break-word l-margin-t4 l-margin-b0'
            textContent={title}
          />}
        </div>
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
};

CommitView.state = {
  onInit: ({repo, commitId}, state, {onCommit})=> (
    GithubCommit.get(`${repo}/${commitId}`).then(onCommit),
    GithubCommit.localGet(`${repo}/${commitId}`) || COMMIT_PLACEHOLDER
  ),
  onCommit:(props, state, action, commit)=> commit
};

export default CommitView;
