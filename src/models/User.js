import Model from 'helpers/model/Model.js';
import Source from 'models/sources/Source.js';

function updateCreate(user){
  return new Promise((resolve, reject)=>
    new Firebase(`${CONFIG.firebaseUrl}/users/${user.id}`).set({
      id:user.id,
      githubUsername:user.githubUsername,
      sources:user.sources.map(s=>s.toSourceJSON())
    }, error=>error ? reject(error) : resolve(user))
  );
}

class User extends Model {
  constructor(attrs){
    this._sources = attrs.sources;
    super(attrs);
  }
  get sources(){return this._sources}
}

User.create($=>{
  $.attr('githubUsername', 'string');

  $.mapper = {
    create:updateCreate,
    update:updateCreate,
    get:user=>
      new Promise((resolve, reject)=>
        new Firebase(`${CONFIG.firebaseUrl}/users/${user.id}`).
          once('value', data=>{
            var val = data.val();
            if(val){
              user.$load(val);
              user._sources = val.sources.map(s=>Source.load(s));
              resolve(user);
            } else {
              reject("Couldn't find User");
            }
          })
      )
  };
});

export default User;
