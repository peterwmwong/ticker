import AttrMunger  from 'helpers/AttrMunger';
import Model       from '../helpers/model/Model';
import GithubEvent from './github/GithubEvent';
import GithubUser from './github/GithubUser';
import GithubRepo from './github/GithubRepo';

class EventStream extends Model {
  static load(attrs){
    return Model.load.call(
      (attrs.type === 'github' ? GithubEventStream : EventStream),
      attrs
    );
  }

  name(){ throw 'Implement me'; }
  events(){ throw 'Implement me'; }
}

function mergeResults(users, repos){
  return users.concat(repos).sort((a,b)=>b.score - a.score);
}

EventStream.create($=>{
  $.attr('type', 'string');
  $.attr('config', 'identity');
  $.mapper = {
    query: (array, {term})=>
      Promise.all([
        GithubUser.query({q:term}).$promise,
        GithubRepo.query({q:term}).$promise
      ]).then(([users,repos])=>
          array.$replace(
            mergeResults(users,repos).map(result=>{
              var type = result.login ? 'users' : 'repos';
              var name = result.login || result.fullName;
              return GithubEventStream.load({
                type: 'github',
                id: (type+':'+result.id),
                config: {
                  type: type,
                  [type]: name
                }
              })})))
  };
});

export class GithubEventStream extends EventStream {
  get name(){
    return this.config[this.config.type];
  }
  events(){
    return GithubEvent.query(this.config);
  }
}

export default EventStream;
