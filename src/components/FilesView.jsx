import './PathToolbar.css';
import xvdom      from 'xvdom';
import GithubIcon from './common/GithubIcon.jsx';
import compare    from '../helpers/compare';
import GithubFile from '../models/github/GithubFile';

const TYPE_TO_ICON = {
  file: 'file-code',
  dir:  'file-directory'
};

const sortFiles = (a, b) => compare(a.type, b.type) || compare(a.name, b.name)

const PathContents = ({repo, sha}, files) =>
  <div className='l-margin-t2 Card'>
    {files.map(({name, type, path}) =>
      <a
        key={name}
        className='List-item layout horizontal center t-normal'
        href={`#github/${repo}/?code/${sha}/${path}`}
      >
        <GithubIcon name={TYPE_TO_ICON[type]} className='l-margin-r3' />
        {name}
      </a>
    )}
  </div>;

const onInit = (props, state, {loadFiles}) => (
  GithubFile.query(props).then(loadFiles),
  loadFiles(GithubFile.localQuery(props))
);

PathContents.state = {
  onInit,
  onProps: onInit,
  loadFiles: (props, state, actions, files)=>files.sort(sortFiles)
};

const repoName = repo => repo.split('/')[1]
const pathURL = (pathArray, i)=> pathArray.slice(0, i).map(a => `/${a}`).join('')

const PathToolbar = ({repo, pathURLPrefix, pathArray, sha}) =>
  <div className='Card Card--fullBleed l-height10 c-bg-white l-padding-t1 l-padding-h6 layout horizontal center'>
    <div className='flex'>
      {[repoName(repo), ...pathArray].map((component, i)=>
        <a
          key={i}
          className='u-link PathToolbar-path'
          href={`${pathURLPrefix}${sha}${pathURL(pathArray, i)}`}
        >
          {component}
        </a>
      )}
    </div>
    <div className='u-link l-padding-l4'>{sha}</div>
  </div>

const FilesView = ({repo, pathArray=[], sha='master'}) =>
  <div>
    <PathToolbar
      repo={repo}
      pathURLPrefix={`#github/${repo}/?code/`}
      pathArray={pathArray}
      sha={sha}
    />
    <PathContents repo={repo} pathArray={pathArray} sha={sha} />
  </div>;

export default FilesView;
