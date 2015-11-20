import Icon from './common/Icon.jsx';

export default ({title, className='', onRequestDrawer, onRequestSearch})=>
  <div className={`App__toolbar layout horizontal ${className}`}>
    <Icon name="&#xe5d2;" className="l-padding-h4" onClick={onRequestDrawer} />
    <div className="App__title t-truncate t-font-size-20 flex" textContent={title} />
    <Icon name="&#xE8B6;" className="l-padding-h4" onClick={onRequestSearch} />
  </div>
