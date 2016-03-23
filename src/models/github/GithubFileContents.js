import atob     from '../../helpers/atob';
import model  from '../../helpers/model';

// let num = 0;
// const MOCK_CONTENTS = [
//   'src/helpers/mock_data/GithubRepoContentsMOCK.json',
//   'src/helpers/mock_data/GithubRepoContentsMOCK2.json',
//   'src/helpers/mock_data/GithubFileContentsMOCKFILE.json'
// ];

const addTransformedFileProperties = (fileContents)=> (
  fileContents.parentPath = fileContents.path.replace(/[^\/]+$/, ''),
  fileContents.content    = atob(fileContents.content),
  fileContents
)

const createGithubFileContent = (contents)=>
  contents.constructor === Array
    ? {isFile: false, value: contents}
    : {isFile: true,  value: addTransformedFileProperties(contents)}

export default model({
  query: ({repo, sha='master', pathArray=[]})=> ({
    // url: 'src/helpers/mock_data/GithubFileContentsMOCKFILE.json',
    url: `https://api.github.com/repos/${repo}/contents/${pathArray.join('/')}?ref=${sha}`,
    transform: createGithubFileContent
  })
});
