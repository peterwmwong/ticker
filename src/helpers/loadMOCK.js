import githubEvents from '../models/github/GithubEventMapperMOCKDATA-allEvents';

export default async function loadJSON(url){
  if(/https:\/\/api.github.com\/users\/[A-z\-]/.test(url))
    return githubEvents;
  else
    throw `loadMock: No mock for ${url}`;
}
