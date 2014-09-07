import User from '../models/User';
import {GithubEventStream} from '../models/EventStream';

// TODO(pwong): TEMPORARY! Waiting for backend
var mockGithubES = (function(){
  var nextId = 1;
  return (type,value)=>{
    return GithubEventStream.load({
      id: nextId++,
      type: 'github',
      config: {
        type: type,
        [type]: value
      }
    });
  }
})();

var MOCKUSER = User.load({
  id: 1,
  login: 'peterwmwong',
  name:  'Peter Wong'
})

MOCKUSER.addEventStreams(
  mockGithubES('users', 'polymer'),
  mockGithubES('repos', 'centro/centro-media-manager'),
  mockGithubES('users', 'googlewebcomponents'),
  mockGithubES('repos', 'google/traceur-compiler'),
  mockGithubES('users', 'arv'),
  mockGithubES('users', 'johnjbarton'),
  mockGithubES('users', 'guybedford'),
  mockGithubES('users', 'ebidel'),
  mockGithubES('users', 'addyosmani'),
  mockGithubES('users', 'esprehn'),
  mockGithubES('users', 'abarth'),
  mockGithubES('users', 'theefer'),
  mockGithubES('users', 'btford'),
  mockGithubES('users', 'tbosch'),
  mockGithubES('users', 'vojtajina'),
  mockGithubES('users', 'eisenbergeffect'),
  mockGithubES('repos', 'jscs-dev/node-jscs'),
  mockGithubES('repos', 'jshint/jshint'),
  mockGithubES('repos', 'facebook/react')
);

export default {
  // TODO(pwong): TEMPORARY! Waiting for backend
  user: MOCKUSER
};
