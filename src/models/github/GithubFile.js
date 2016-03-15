import loadJSON   from '../../helpers/load';
import storage    from '../../helpers/storage';

export default {
  localQuery:({repo})=>(storage.getItemObj(`ticker:GithubFile:${repo}`) || []),
  query:({repo, sha='master', path=''})=>
    loadJSON(
      // log('path:', path)
      //   ? `src/helpers/mock_data/GithubRepoContentsMOCK2.json`
      //   : `src/helpers/mock_data/GithubRepoContentsMOCK.json`
      `https://api.github.com/repos/${repo}/contents/${path}?ref=${sha}`
    ).then(files=>(
      storage.setItemObj(`ticker:GithubFile:${repo}`, files),
      files
    ))
};
