import Icon from './common/Icon.jsx';

export default ({title, onRequestDrawer})=>
  <div className="App__toolbar layout horizontal">
    <Icon
      name="&#xe5d2;"
      className="l-padding-h4 u-pointer-cursor layout horizontal center-center"
      onClick={onRequestDrawer}
    />
    <div className="App__title flex">{title}</div>
    <Icon name="&#xe8b6;" className="l-padding-h4 u-pointer-cursor layout horizontal center-center" />
  </div>
