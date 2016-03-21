import './Tabs.css';
import xvdom from 'xvdom';

export default ({tabs, selected, hrefPrefix=''})=>
  <div className='Tabs layout horizontal end center-justified c-white l-height10 t-font-size-14 t-uppercase t-normal'>
    {Object.keys(tabs).map((tabId)=> {
      const tab = tabs[tabId];
      return (
        <a
          className={`Tabs-tab u-cursor-pointer l-padding-h4 l-padding-b2 ${selected === tabId ? 'is-selected' : ''}`}
          href={`${hrefPrefix}${tab.href || tabId}`}
          key={tabId}
        >
          {tab.title || tabId}
        </a>
      );
    }
    )}
  </div>
