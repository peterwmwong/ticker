import './AppToolbar.css';
import Icon from './common/Icon.jsx';

const AppToolbar = ({title, secondary}, {scrollClass})=>
  <div className={`AppToolbar fixed fixed--top ${scrollClass}`}>
    <div className='layout horizontal center-center l-height14'>
      <Icon name="&#xe5d2;" className="l-padding-h4" onClick={handleOnDrawer} />
      <div className="App__title t-truncate t-font-size-20 flex" textContent={title} />
      <Icon name="&#xE8B6;" className="l-padding-h4" onClick={handleOnSearch} />
    </div>
    {secondary}
  </div>;

const handleOnDrawer = ()=>AppToolbar.onDrawer && AppToolbar.onDrawer();
const handleOnSearch = ()=>AppToolbar.onSearch && AppToolbar.onSearch();

AppToolbar.state = {
  onInit: (props, state, {onScroll})=>(
    requestAnimationFrame(()=>document.body.onscroll = onScroll),
    onScroll()
  ),

  onScroll: (props, state, actions)=>{
    const scrollTop = document.body ? document.body.scrollTop : 0;
    return {
      scrollTop,
      scrollClass:
        (scrollTop < 60                  ? 'is-hiding'         : '') +
        (scrollTop - state.scrollTop > 0 ? ' is-scrolling-down': '')
    };
  }
};

export default AppToolbar;
