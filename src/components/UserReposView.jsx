import xvdom               from 'xvdom';
import List                from './common/List.jsx';
import compare             from '../helpers/compare';
import modelStateComponent from '../helpers/modelStateComponent';
import GithubRepo          from '../models/github/GithubRepo';

const compareRepos = (a, b)=> compare(a.name, b.name)
const sortRepos = (repos)=> repos.sort(compareRepos)
const item = ({name, description}, id)=> ({
  href: `#github/${id}/${name}`,
  icon: 'repo',
  key:  name,
  text: name,
  secondaryText: description
})

export default modelStateComponent(GithubRepo, 'query', ({props: {id}, state})=>
  <List
    className='Card'
    context={id}
    item={item}
    list={state}
    transform={sortRepos}
  />
)
