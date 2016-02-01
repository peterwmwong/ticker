import './Tabs.css';

export default ({tabs, selected, onSelect})=>
  <div className="Tabs layout horizontal end t-font-size-18 c-white l-height14">
    {tabs.map(tab=>
      <a
        key={tab}
        className={`Tabs-tab u-cursor-pointer l-padding-h2 l-padding-b2 ${selected === tab ? 'is-selected' : ''}`}
        onclick={()=>onSelect(tab)}
      >
        {tab}
      </a>
    )}
  </div>
