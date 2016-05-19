import xvdom              from 'xvdom';
import modelStateComponent         from '../../helpers/modelStateComponent';
import PathNavigator      from './PathNavigator.jsx';
import PathContents       from './PathContents.jsx';
import GithubFileContents from '../../models/github/GithubFileContents';

export default modelStateComponent(GithubFileContents, 'query', ({props: {repo, pathArray=[], sha='master'}, state:contents})=>
  <div>
    <PathNavigator
      pathArray={pathArray}
      pathURLPrefix={`#github/${repo}?code/`}
      repo={repo}
      sha={sha}
    />
    <PathContents contents={contents} repo={repo} sha={sha} />
  </div>
)
