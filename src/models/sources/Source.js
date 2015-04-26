import GithubUserSource from './GithubUserSource.js';
import GithubRepoSource from './GithubRepoSource.js';
import {polymorphic}    from '../../helpers/bureau/model.js';

export default polymorphic(
  [GithubUserSource, GithubRepoSource],
  ({type})=>
    type === 'GithubUserSource' ? GithubUserSource : GithubRepoSource
);
