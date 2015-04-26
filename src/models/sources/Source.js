import GithubUser from '../github/GithubUser.js';
import GithubRepo from '../github/GithubRepo.js';
import {polymorphic}    from '../../helpers/bureau/model.js';

export default polymorphic(
  [GithubUser, GithubRepo],
  ({login})=> login ? GithubUser : GithubRepo
);
