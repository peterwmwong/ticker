import xvdom           from 'xvdom';
import AppToolbar      from '../AppToolbar.jsx';
import Tabs            from '../common/Tabs.jsx';
import IssuePullInfo   from '../IssuePullInfo.jsx';
import PullCommitsView from './PullCommitsView.jsx';
import PullDiffView    from './PullDiffView.jsx';

const TABS = {
  info:{
    title: 'Info',
    view: (repo, id)=> <IssuePullInfo issueId={id} repo={repo} />
  },
  commits:{
    title: 'Commits',
    view: (repo, id)=> <PullCommitsView id={id} repo={repo} />
  },
  diff:{
    title: 'Diff',
    view: (repo, id)=> <PullDiffView id={id} />
  }
};

export default ({pullId, repo, tab='info'})=>
  <div>
    <AppToolbar
      secondary={
        <Tabs hrefPrefix={`#github/${repo}?pulls/${pullId}/`} selected={tab} tabs={TABS} />
      }
      title={pullId}
    />
    <div className='l-padding-t24 l-padding-b2'>
      {TABS[tab].view(repo, pullId)}
    </div>
  </div>
