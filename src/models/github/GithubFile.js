import loadJSON   from '../../helpers/load';
import storage    from '../../helpers/storage';

export default {
  localQuery:({repo})=>(storage.getItemObj(`ticker:GithubFile:${repo}`) || []),
  query:({repo})=>
    loadJSON(
      // `src/helpers/mock_data/GithubRepoContentsMOCK.json`
      `https://api.github.com/repos/${repo}/contents/`
    ).then(files=>(
        storage.setItemObj(`ticker:GithubFile:${repo}`, files),
        files
      ))
};
