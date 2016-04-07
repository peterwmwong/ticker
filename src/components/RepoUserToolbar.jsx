import xvdom      from 'xvdom';
import Icon       from './common/Icon.jsx';
import Tabs       from './common/Tabs.jsx';
import App        from './App.jsx';
import AppToolbar from './AppToolbar.jsx';

const showDrawer = ()=> { App.showDrawer() };

export default ({id, tab, TABS, isBookmarked, onBookmark})=>
  <AppToolbar
    left={
      <Icon
        className='c-white'
        name='three-bars'
        onClick={showDrawer}
        size='small'
      />
    }
    right={
      <Icon
        className={`c-white l-padding-l4 ${isBookmarked ? '' : 'c-opacity-50'}`}
        name='bookmark'
        onClick={onBookmark}
        size='small'
      />
    }
    secondary={
      <Tabs hrefPrefix={`#github/${id}?`} selected={tab} tabs={TABS} />
    }
    title={id}
  />
