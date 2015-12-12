import './common/Card.css';
import './common/Pill.css';
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

const CommitView = ({repo, commitId}, {files, commit, committer, stats})=>
  <div>
    <div className="App__content Card Card--fullBleed">
      <div className="Card-content">
        <pre
          className="t-white-space-normal t-word-wrap-break-word"
          textContent={commit.message}
        />
        <div className="layout horizontal center l-margin-t4">
          <Actor
            className="flex"
            actionDate={commit.committer.date}
            user={committer || {login:commit.committer.name}}
          />
          <div className="t-font-size-12 l-margin-h2" textContent={`${files.length} files changed`} />
          <div className="Pill bg-green c-green" textContent={`+${stats.additions}`} />
          <div className="Pill bg-red c-red" textContent={`–${stats.deletions}`} />
        </div>
      </div>
    </div>
    {files.map(renderFile)}
  </div>;

CommitView.state = {
  onInit: ({repo, commitId}, state, {onCommit})=>(
    GithubCommit.get(`${repo}/${commitId}`).then(onCommit),
    COMMIT_PLACEHOLDER
  ),
  onCommit:(props, state, action, commit)=>commit
};

export default CommitView;
