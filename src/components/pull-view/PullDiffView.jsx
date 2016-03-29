import xvdom          from 'xvdom';
import GithubPullFile from '../../models/github/GithubPullFile';
import DiffFiles      from '../common/DiffFiles.jsx';

const PullDiffView = ({repo, id}, files)=> <DiffFiles files={files} />;

PullDiffView.state = {
  onInit: (props, state, {onFiles})=> (
    GithubPullFile.query(props).then(onFiles),
    GithubPullFile.localQuery(props) || []
  ),
  onFiles:(props, state, action, files)=> files
};

export default PullDiffView;
