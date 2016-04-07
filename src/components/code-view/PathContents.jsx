import xvdom            from 'xvdom';
import Icon             from '../common/Icon.jsx';
import Code             from '../common/Code.jsx';
import compare          from '../../helpers/compare';
import getSyntaxForFile from '../../helpers/getSyntaxForFile';

const TYPE_TO_ICON = {
  file: 'file-code',
  dir:  'file-directory'
};

const sortFiles = (a, b)=> compare(a.type, b.type) || compare(a.name, b.name)

const renderFile = (repo, sha, {content, name})=>
  <div className='Card l-padding-t4'>
    <Code code={content} syntax={getSyntaxForFile(name)} />
  </div>

const renderDirectory = (repo, sha, files)=>
  <div className='Card l-margin-t2'>
    {files.map(({name, type, path})=>
      <a
        className='List-item layout horizontal center t-normal'
        href={`#github/${repo}?code/${sha}/${path}`}
        key={name}
      >
        <Icon className='l-margin-r3' name={TYPE_TO_ICON[type]} />
        {name}
      </a>
    )}
  </div>;

export default ({repo, sha, contents: {isFile, value}})=>
  isFile
    ? renderFile(repo, sha, value)
    : renderDirectory(repo, sha, value.sort(sortFiles));
