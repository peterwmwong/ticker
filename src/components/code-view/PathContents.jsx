import xvdom            from 'xvdom';
import List             from '../common/List.jsx';
import Code             from '../common/Code.jsx';
import compare          from '../../helpers/compare';
import getSyntaxForFile from '../../helpers/getSyntaxForFile';

const TYPE_TO_ICON = {
  file: 'file-code',
  dir:  'file-directory'
};

const sortFiles = (a, b)=> compare(a.type, b.type) || compare(a.name, b.name)

const item = ({name, type, path}, context)=> ({
  href: `${context}${path}`,
  icon: TYPE_TO_ICON[type],
  key:  name,
  text: name
});

export default ({repo, sha, contents})=>
  contents && contents.isFile ? (
    <div className='Card l-padding-t4'>
      <Code code={contents.value.content} syntax={getSyntaxForFile(contents.value.name)} />
    </div>
  ) : (
    <List
      className='Card'
      context={`#github/${repo}?code/${sha}/`}
      list={contents && contents.value.sort(sortFiles)}
      item={item}
    />
  )
