import loadJSON   from '../../helpers/load';
import storage    from '../../helpers/storage';

// let num = 1;

const storageKey = (repo, sha, pathArray)=>
  `ticker:GithubFile:${repo}:${sha}:${pathArray.join('/')}`

export default {
  localQuery:({repo, sha='master', pathArray=[]})=>
    storage.getItemObj(storageKey(repo, sha, pathArray)) || [],

  query:({repo, sha='master', pathArray=[]})=>
    loadJSON(
      // (++num % 2)
      //   ? `src/helpers/mock_data/GithubRepoContentsMOCK2.json`
      //   : `src/helpers/mock_data/GithubRepoContentsMOCK.json`
      `https://api.github.com/repos/${repo}/contents/${pathArray.join('/')}?ref=${sha}`
    ).then(files=>(
      storage.setItemObj(storageKey(repo, sha, pathArray), files),
      files
    ))
};
