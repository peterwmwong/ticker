import './Tabs.css';
import xvdom from 'xvdom/src/index';

function renderTab(tabId){
  const {tabs, selected, hrefPrefix} = this;
  const {href, title} = tabs[tabId];
  return (
    <a
      className={`Tabs-tab u-cursor-pointer l-padding-h4 l-padding-b2 ${selected === tabId ? 'is-selected' : ''}`}
      href={`${hrefPrefix}${href || tabId}`}
      key={tabId}
    >
      {title || tabId}
    </a>
  );
}

export default props =>
  <div className='Tabs layout horizontal end center-justified c-white l-height10 t-font-size-14 t-uppercase t-normal'>
    {Object.keys(props.tabs).map(renderTab, props)}
  </div>
