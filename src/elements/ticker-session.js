import User from '../models/User';
import EventStream from '../models/EventStream';
import {data} from '../helpers/session';

Polymer('ticker-session',{
  fbUserDataReady: false,
  data: data,

  login(){
    this.$.fbLogin.login();
  },

  logout(){
    this.$.fbLogin.logout();
  },

  // Change Handlers
  // ===============

  fbUserChanged(_, fbUser){
    if(fbUser){
      data.accessTokens.github = fbUser.accessToken;
      User.get(fbUser.id).$promise.
        catch(error=>{
          return new User({
            id:fbUser.id,
            eventStreams: [
              new EventStream({
                id: '1',
                type: 'github',
                config: {
                  type: 'users',
                  users: 'peterwmwong'
                }
              })
            ]
          }).$save().$promise
        }).
        then(user=>data.user = user)
    }
  }

});
