import xvdom      from 'xvdom';
import GithubIcon from './common/GithubIcon.jsx';
import compare    from '../helpers/compare';
import GithubFile from '../models/github/GithubFile';

const TYPE_TO_ICON = {
  file: 'file-code',
  dir:  'file-directory'
};

const FilesView = (props, files)=>
  <div className='l-margin-t2 Card'>
    {files.map(({name, type})=>
      <div key={name} className='List-item layout horizontal center t-normal'>
        <GithubIcon name={TYPE_TO_ICON[type]} className='l-margin-r3' />
        {name}
      </div>
    )}
  </div>;

FilesView.state = {
  onInit: ({repo}, state, {loadFiles})=>(
    GithubFile.query({repo}).then(loadFiles),
    loadFiles(GithubFile.localQuery({repo}))
  ),
  loadFiles: (props, state, actions, files)=>
    files.sort((a, b)=>compare(a.type, b.type) || compare(a.name, b.name))
};

export default FilesView;
