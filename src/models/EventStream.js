import AttrMunger from 'helpers/AttrMunger';
import Model from '../../helpers/model/Model';
import Event from './github/Event';

// !!! TEMPORARY !!! //
// !!! TEMPORARY !!! //
// !!! TEMPORARY !!! //
var mockGithubES = (function(){
  var nextId = 1;
  return (type,value)=>{
    return {
      id: nextId++,
      type: 'github',
      config: {
        type: type,
        [type]: value
      }
    };
  }
})();
var MOCKDATA = [
  mockGithubES('users', 'polymer'),
  mockGithubES('repos', 'centro/centro-media-manager'),
  mockGithubES('users', 'arv'),
  mockGithubES('users', 'esprehn'),
  mockGithubES('users', 'abarth'),
  mockGithubES('users', 'johnjbarton'),
  mockGithubES('users', 'tbosch'),
  mockGithubES('users', 'vojtajina'),
];
// !!! TEMPORARY !!! //
// !!! TEMPORARY !!! //
// !!! TEMPORARY !!! //

class EventStream extends Model {
  name()  { throw 'Implement me'; }
  events(){ throw 'Implement me'; }
}

class GithubEventStream extends EventStream {
  get name(){
    return this.config[this.config.type];
  }
  events(){
    return Event.query(this.config);
  }
}

EventStream.create($=>{
  $.attr('type', 'string');
  $.attr('config', 'identity');
  $.mapper = {
    query:(array)=>{
      return Promise.resolve(MOCKDATA).then(data=>{
        return array.$replace(
          GithubEventStream.loadAll(
            AttrMunger.camelize(data)));
      })
    }
  }
});

export default EventStream;
