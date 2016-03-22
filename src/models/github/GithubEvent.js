import model from '../../helpers/model';

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

export default model({
  query: ({type, id})=> ({
    cache: `ticker:GithubEvent:${type}/${id}`,
    url:   `https://api.github.com/${type}/${id}/events`
  })
});
