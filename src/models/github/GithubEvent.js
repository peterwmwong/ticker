import loadJSON   from '../../helpers/load';
import Model      from '../../helpers/bureau/model';
import GithubUser from './GithubUser';
import GithubRepo from './GithubRepo';
import timeAgo    from '../../helpers/timeAgo';
import storage    from '../../helpers/storage';

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

export default class GithubEvent extends Model{
  static get desc(){
    return {
      mapper:{
        localQuery:({type, id})=>{
          const local = storage.getItem(`ticker:GithubEvent:${type}/${id}`);
          return local ? JSON.parse(local) : [];
        },
        query:({type, id})=>
          loadJSON(`https://api.github.com/${type}/${id}/events`)
            .then(events=>{
              storage.setItem(`ticker:GithubEvent:${type}/${id}`, JSON.stringify(events));
              return events;
            })
      },
      attr:{
        created_at: Date,
        payload: Object,
        type: String,
        id: String
      },
      hasOne:{
        actor: {type:GithubUser},
        repo: {type:GithubRepo}
      }
    };
  }

  get timeAgo(){ return timeAgo(this.created_at.valueOf()); }
}
