import xvdom      from 'xvdom';
import GithubIcon from './common/GithubIcon.jsx';
import compare    from '../helpers/compare';
import GithubFile from '../models/github/GithubFile';

const TYPE_TO_ICON = {
  file: 'file-code',
  dir:  'file-directory'
};

const sortFiles = files=>
  files.sort((a, b)=>
    compare(a.type, b.type) ||
      compare(a.name, b.name)
  );

const File = ({file:{name, type}})=>
  <div className='List-item layout horizontal center'>
    <GithubIcon name={TYPE_TO_ICON[type]} className='l-margin-r3' />
    {name}
  </div>

const FilesView = (props, {files})=>
  <div className='l-margin-t2 Card'>
    {files.map(file=>
      <File key={file.name} file={file} />
    )}
  </div>;

const onInit = ({repo, path='', sha='master'}, state, {loadFiles})=>{
  const pathComponents = path.split('/');
  GithubFile.query({repo, sha, path}).then(loadFiles);
  return {
    sha,
    pathComponents,
    ...loadFiles(GithubFile.localQuery({repo, sha, path}))
  };
};

FilesView.state = {
  onInit: onInit,
  onProps: onInit,
  loadFiles: (props, state, actions, files)=>({...state, files: sortFiles(files)}),
  gotoDirectory: (props, state, {loadFiles}, directory)=>{
    let pathComponents = state && state.pathComponents || [];
    pathComponents = [
      ...pathComponents,
      directory
    ];

    GithubFile.query({repo, sha, path}).then(loadFiles),
    {
      ...state,
      pathComponents: (!state || !state.pathComponents) ? [] : [
        ...state.pathComponents,
        directory
      ],
      files: loadFiles()
    }
  }
};

export default FilesView;
