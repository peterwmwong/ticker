import State from 'state';
import firebase from 'firebase';

export default {

  enter(state){
    var ref = new Firebase(this.location);
    this.auth = new FirebaseSimpleLogin(ref, (error, user)=>
      this.fire('user-auth-changed', {error, user})
    );
    this.auth.login('github', {rememberMe: true});
  },

  'on auth-changed'(state, {error, user}){
    if(error || !user){
      this.goto('login');
    }else if(user){
      state.user = user;
    }
  }

  'on login'(state, {user}){
    state.user = user;
    this.goto('./loggedIn');
  },

  'on logout'(state, ){
    state.user = null;
    this.goto('./login');
  },

  select(state){
    return   (state.user === undefined) ? 'try-auto-login'
           : (state.user === null)      ? 'login'
           : 'logged-in';
  },

  states: [
    State('login'),
    ConcurrentState('logged-in', {
      states: [
        State('drawer',{
          states:[
            State('on'),
            State('off')
          ]
        })
      ]
    })
  ]

};
