import './common/Card.css';
import './common/Pill.css';
import xvdom        from 'xvdom';
import AppToolbar   from './AppToolbar.jsx';
import GithubCommit from '../models/github/GithubCommit';
import Actor        from './common/Actor.jsx';
import Code         from './common/Code.jsx';

const PATH_REGEX = /^(.*\/)?([^\/]+)$/;
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

const renderFile = ({additions, deletions, filename, patch})=>{
  const [, path, fname] = PATH_REGEX.exec(filename);
  return (
    <div key={filename} className="Card">
      <div className="Card-title layout horizontal center t-no-wrap">
        <div className="c-gray-dark t-truncate" textContent={path} />
        <div className="t-normal l-padding-r1 t-truncate" textContent={fname} />
        <div className="flex" />
        <div className="Pill bg-green c-green" textContent={`+${additions}`} />
        <div className="Pill bg-red c-red" textContent={`–${deletions}`} />
      </div>
      {patch && <Code code={patch} />}
    </div>
  );
};

const getCommitTitleMessage = message=>{
  const [title] = /.*/g.exec(message);
  return title === message ? {title:'', message}
    : {title, message:message.substr(title.length)};
};

const CommitView = ({repo, commitId}, {files, commit, committer, stats})=>{
  const {title, message} = getCommitTitleMessage(commit.message);
  return (
    <div className="l-padding-t6">
      <div className="Card Card--fullBleed l-padding-t5">
        <AppToolbar title={commitId} />
        <div className="Card-title">
          {title && <h1
            className="t-word-break-word l-margin-t4 l-margin-b0"
            textContent={title}
          />}
        </div>
        <div className="Card-content">
          <div className="layout horizontal center l-margin-b4">
            <Actor
              className="flex"
              actionDate={commit.committer.date}
              user={committer || {login:commit.committer.name}}
            />
            <div className="t-font-size-12 l-margin-h2" textContent={`${files.length} files changed`} />
            <div className="Pill bg-green c-green" textContent={`+${stats.additions}`} />
            <div className="Pill bg-red c-red" textContent={`–${stats.deletions}`} />
          </div>
          <pre
            className="t-white-space-normal t-word-break-word"
            textContent={message}
          />
        </div>
      </div>
      {files.map(renderFile)}
    </div>
  )
};

CommitView.state = {
  onInit: ({repo, commitId}, state, {onCommit})=>(
    GithubCommit.get(`${repo}/${commitId}`).then(onCommit),
    COMMIT_PLACEHOLDER
  ),
  onCommit:(props, state, action, commit)=>commit
};

export default CommitView;
