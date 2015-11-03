import GithubUser    from '../github/GithubUser';
import GithubRepo    from '../github/GithubRepo';
import {polymorphic} from '../../helpers/bureau/model';

export default polymorphic(
  [GithubUser, GithubRepo],
  ({login})=> login ? GithubUser : GithubRepo
);
