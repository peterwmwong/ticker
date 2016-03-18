import xvdom              from 'xvdom';
import PathNavigator      from './PathNavigator.jsx';
import PathContents       from './PathContents.jsx';
import GithubFileContents from '../../models/github/GithubFileContents';

const CodeView = ({repo, pathArray=[], sha='master'}, contents) =>
  <div>
    <PathNavigator
      repo={repo}
      pathURLPrefix={`#github/${repo}/?code/`}
      pathArray={pathArray}
      sha={sha}
    />
    {contents && <PathContents repo={repo} sha={sha} contents={contents} />}
  </div>;

const onInit = (props, state, {loadContents}) => {
  GithubFileContents.query(props).then(loadContents);
};

CodeView.state = {
  onInit,
  onProps: onInit,
  loadContents: (props, state, actions, contents) => contents
};

export default CodeView;
