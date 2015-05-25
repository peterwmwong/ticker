import loadJSON   from '../../helpers/load.js';
import Model      from '../../helpers/bureau/model.js';
import GithubUser from './GithubUser.js';
import GithubRepo from './GithubRepo.js';
import timeAgo    from '../../helpers/timeAgo.js';

// TOOD(pwong): We don't may need more then just property access in the future
// const TYPE_TO_PAYLOAD = {
//   CommitCommentEvent: CommitCommentEvent,
//   CreateEvent: CreateEvent,
//   DeleteEvent: DeleteEvent,
//   FollowEvent: FollowEvent,
//   ForkEvent: ForkEvent,
//   GollumEvent: GollumEvent,
//   IssueCommentEvent: IssueCommentEvent,
//   IssuesEvent: IssuesEvent,
//   MemberEvent: MemberEvent,
//   MembershipEvent: MembershipEvent,
//   PageBuildEvent: PageBuildEvent,
//   PublicEvent: PublicEvent,
//   PullRequestEvent: PullRequestEvent,
//   PullRequestReviewCommentEvent: PullRequestReviewCommentEvent,
//   PushEvent: PushEvent,
//   ReleaseEvent: ReleaseEvent,
//   TeamAddEvent: TeamAddEvent,
//   WatchEvent: WatchEvent
// };

export default class GithubEvent extends Model {
  static get desc(){
    return {
      mapper:{
        query:({type, id})=>
          loadJSON(`https://api.github.com/${type}/${id}/events`)
        // query:({type, id})=>
        //   new Promise(resolve=>{
        //     setTimeout(
        //       ()=>resolve(loadJSON(`https://api.github.com/${type}/${id}/events`)),
        //       1000
        //     );
        //   })
      },
      attr:{
        created_at: Date,
        payload: Object,
        type: String
      },
      hasOne:{
        actor: {type:GithubUser},
        repo: {type:GithubRepo}
      }
    };
  }

  get timeAgo(){ return timeAgo(this.created_at.valueOf()); }
}
