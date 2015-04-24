import GithubUserSource from './GithubUserSource.js';
import GithubRepoSource from './GithubRepoSource.js';
import {polymorphic}    from '../../helpers/bureau/model.js';

let Source = polymorphic(
  [GithubUserSource, GithubRepoSource],
  ({type})=>
    type === 'GithubUserSource' ? GithubUserSource : GithubRepoSource
);

export default Source;
