/*

Replaces `src/helpers/load` to load mock AJAX responses.

This allows for offline development and can be activated by adding '#offline' to
the URL.  See `src/index.jade` for how this module is installed and replaces
`src/helpers/load`.

*/
import githubEvents    from '../models/github/GithubEventMapperMOCKDATA-allEvents';
import githubUsers     from '../models/github/GithubUserMapperQueryMOCKDATA';
import githubRepoPulls from '../helpers/mock_data/GithubRepoPullsMOCK';

export default async function loadJSON(url){
  if(/https:\/\/api.github.com\/repos\/[A-z\-]+\/[A-z\-]+\/events/.test(url))
    return githubEvents;
  else if(/https:\/\/api.github.com\/repos\/[A-z\-]+\/[A-z\-]+\/pulls/.test(url))
    return githubRepoPulls;
  else if(/https:\/\/api.github.com\/users\/[A-z\-]+\/events/.test(url))
    return githubEvents;
  else if(/https:\/\/api.github.com\/users\/[A-z\-]+/.test(url))
    return githubUsers.items[0];
  else if(/https:\/\/api.github.com\/search\/users\?q=.*/.test(url))
    return githubUsers;
  else if(/https:\/\/api.github.com\/search\/repositories\?q=.*/.test(url))
    return githubUsers;
  else
    throw `loadMock: No mock for ${url}`;
}
