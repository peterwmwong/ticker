import atob     from '../../helpers/atob';
import loadJSON from '../../helpers/load';

// let num = 0;
// const MOCK_CONTENTS = [
//   'src/helpers/mock_data/GithubRepoContentsMOCK.json',
//   'src/helpers/mock_data/GithubRepoContentsMOCK2.json',
//   'src/helpers/mock_data/GithubFileContentsMOCKFILE.json'
// ];

const addTransformedFileProperties = (fileContents) =>(
  fileContents.parentPath = fileContents.path.replace(/[^\/]+$/, ''),
  fileContents.content    = atob(fileContents.content),
  fileContents
)

const createGithubFileContent = (contents) =>
  contents.constructor === Array
    ? {isFile: false, value: contents}
    : {isFile: true,  value: addTransformedFileProperties(contents)}

export default {
  query:({repo, sha='master', pathArray=[]})=>
    loadJSON(
      // MOCK_CONTENTS[num++ % MOCK_CONTENTS.length]
      `https://api.github.com/repos/${repo}/contents/${pathArray.join('/')}?ref=${sha}`
    ).then(createGithubFileContent)
};
