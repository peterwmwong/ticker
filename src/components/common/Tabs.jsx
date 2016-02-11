import './Tabs.css';
import xvdom from 'xvdom';

export default ({tabs, selected, titleForTab, hrefForTab})=>
  <div className="Tabs layout horizontal end center-justified c-white l-height10 t-font-size-14 t-uppercase t-normal">
    {tabs.map(tab=>
      <a
        key={tab}
        className={`Tabs-tab u-cursor-pointer l-padding-h4 l-padding-b2 ${selected === tab ? 'is-selected' : ''}`}
        href={hrefForTab(tab)}
      >
        {titleForTab(tab)}
      </a>
    )}
  </div>
