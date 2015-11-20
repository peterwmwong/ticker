import './CommitView.css';
import loadHighlight from '../helpers/loaders/loadHighlight';
import GithubCommit  from '../models/github/GithubCommit';
import Toolbar       from './Toolbar.jsx';

const INITIAL_STATE = {};

const File = ({file}, {patchHTML})=>{
  const [, path, fname] = /^(.*\/)?([^\/]+)$/.exec(file.filename);
  return (
    <div className="Card">
      <div className="Card-title l-padding-b4">
        <span className="c-gray-dark t-light" textContent={path} />
        {fname}
      </div>
      {patchHTML ? <pre className="CommitView-fileContents" innerHTML={patchHTML} />
                 : <pre className="CommitView-fileContents" textContent={file.patch}/>
      }
    </div>
  );
};

File.state = {
  onInit: (props, state, {highlight})=>(
    loadHighlight().then(highlight),
    INITIAL_STATE
  ),
  highlight: ({file}, state, actions, hljs)=>({
    patchHTML: file.patch && hljs.highlight('diff', file.patch).value
  })
}

const CommitView = (
  {repo, commitId, onRequestDrawer, onRequestSearch},
  {commit}
)=>
  <div>
    <div className="App__content">
      {commit && commit.files.map(file=>
        <File key={file.filename} file={file} />
      )}
    </div>
    <Toolbar
      className="fixed fixed--top"
      title={`${repo} ${commitId}`}
      onRequestDrawer={onRequestDrawer}
      onRequestSearch={onRequestSearch}
    />
  </div>;

CommitView.state = {
  onInit: ({repo, commitId}, state, {onCommit})=>(
    GithubCommit.get(`${repo}/${commitId}`).then(onCommit),
    INITIAL_STATE
  ),
  onCommit:(props, state, action, commit)=>({commit})
};

export default CommitView;
