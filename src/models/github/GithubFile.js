import loadJSON   from '../../helpers/load';
import storage    from '../../helpers/storage';

export default {
  localQuery:({repo, sha, path})=>(storage.getItemObj(`ticker:GithubFile:${repo}/${sha}/${path}`) || []),
  query:({repo, sha, path})=>
    loadJSON(
      `src/helpers/mock_data/GithubRepoContentsMOCK.json`
      // `https://api.github.com/repos/${repo}/contents${path}`
    ).then(files=>(
        storage.setItemObj(`ticker:GithubFile:${repo}/${sha}/${path}`, files),
        files
      ))
};
