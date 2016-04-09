import xvdom              from 'xvdom';
import PathNavigator      from './PathNavigator.jsx';
import PathContents       from './PathContents.jsx';
import GithubFileContents from '../../models/github/GithubFileContents';

const CodeView = ({repo, pathArray=[], sha='master'}, contents)=>
  <div>
    <PathNavigator
      pathArray={pathArray}
      pathURLPrefix={`#github/${repo}?code/`}
      repo={repo}
      sha={sha}
    />
    <PathContents contents={contents} repo={repo} sha={sha} />
  </div>;

const onInit = (props, state, {loadContents})=> {
  GithubFileContents.query(props).then(loadContents);
};

CodeView.state = {
  onInit,
  onProps: onInit,
  loadContents: (props, state, actions, contents)=> contents
};

export default CodeView;
