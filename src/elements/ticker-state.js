import User        from '../models/User';
import EventStream from '../models/EventStream';
import {data}      from '../helpers/session';

// !!! <MOCKDATA> !!!
  data.user = new User({
    id:12345,
    eventStreams: [
      EventStream.load({
        id: '1',
        type: 'github',
        config: {
          type: 'repos',
          repos: 'peterwmwong/ticker'
        }
      }),
      EventStream.load({
        id: '2',
        type: 'github',
        config: {
          type: 'repos',
          repos: 'polymer/polymer'
        }
      })
    ]
  });
// !!! </MOCKDATA> !!!

Polymer('ticker-state',{
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
      // Extract the GitHub access token, to be used by all GitHub API request.
      // See `helpers/load.js`
      data.accessTokens.github = fbUser.accessToken;
      // Load user data
      User.get(fbUser.id).$promise.
        // If user does not exist yet...
        catch(error=>
          // Create user with no streams
          new User({
            id:fbUser.id,
            eventStreams: []
          }).$save().$promise
        ).
        then(user=>data.user = user)
    }
  }

});
