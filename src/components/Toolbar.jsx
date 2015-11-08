import Icon from './common/Icon.jsx';

export default ({title, onRequestDrawer})=>
  <div className="App__toolbar layout horizontal">
    <Icon name="&#xe5d2;" className="l-padding-h4" onClick={onRequestDrawer} />
    <div className="App__title t-font-size-20 flex">{title}</div>
  </div>
