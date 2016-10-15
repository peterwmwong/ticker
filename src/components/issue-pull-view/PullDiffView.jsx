import xvdom          from 'xvdom/src/index';
import modelStateComponent from '../../helpers/modelStateComponent';
import GithubPullFile from '../../models/github/GithubPullFile';
import DiffFiles      from '../common/DiffFiles.jsx';

export default modelStateComponent(GithubPullFile, 'query',
  ({state}) => <DiffFiles files={state || []} />
)
