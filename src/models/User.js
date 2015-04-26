import Source from './sources/Source.js';
import Model from '../helpers/bureau/model.js';

// function updateCreate(user){
//   return new Promise((resolve, reject)=>
//     new Firebase(`${TICKER_CONFIG.firebaseUrl}/users/${user.id}`).set({
//       id:user.id,
//       githubUsername:user.githubUsername,
//       sources:user.sources.map(s=>s.toSourceJSON())
//     }, error=>error ? reject(error) : resolve(user))
//   );
// }

export default class User extends Model {
  static get desc(){
    return {
      attr:{
        id:String,
        githubUsername:String
      },
      hasMany:{
        sources:{ type:Source }
      },
      mapper: {
        save:user=>
          new Promise((resolve, reject)=>
            new Firebase(`${TICKER_CONFIG.firebaseUrl}/users/${user.id}`).set(
              user.toJSON(),
              err=>err ? reject(err) : resolve(user)
            )
          ),
        get:id=>
          new Promise((resolve, reject)=>
            new Firebase(`${TICKER_CONFIG.firebaseUrl}/users/${id}`).
              once('value', data=>{
                const val = data.val();
                if(val){
                  resolve(val);
                }
                else{
                  reject("Couldn't find User");
                }
              })
          )
      }
    };
  }
}
