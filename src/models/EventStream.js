import AttrMunger  from 'helpers/AttrMunger';
import Model       from '../helpers/model/Model';
import GithubEvent from './github/GithubEvent';
import GithubUser from './github/GithubUser';

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

EventStream.create($=>{
  $.attr('type', 'string');
  $.attr('config', 'identity');
  $.mapper = {
    query: (array, {term})=>
      GithubUser.query({q:term}).$promise
        .then(users=>
          array.$replace(
            users.map(user=>
              GithubEventStream.load({
                id: user.id,
                config: {
                  type: 'users',
                  users: user.login
                }
              }))))
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
