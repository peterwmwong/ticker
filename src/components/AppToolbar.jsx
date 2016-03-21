import './AppToolbar.css';
import xvdom from 'xvdom';
import Icon  from './common/Icon.jsx';

const handleOnDrawer = ()=> AppToolbar.onDrawer && AppToolbar.onDrawer();
const handleOnSearch = ()=> AppToolbar.onSearch && AppToolbar.onSearch();

const AppToolbar = ({title, secondary}, {scrollClass})=>
  <div className={`AppToolbar fixed fixed--top c-white bg-purple ${scrollClass}`}>
    <div className='layout horizontal center-center l-height14'>
      <Icon className='l-padding-h4' name='&#xe5d2;' onClick={handleOnDrawer} />
      <div className='App__title t-truncate t-font-size-20 flex' textContent={title} />
      <Icon className='l-padding-h4' name='&#xE8B6;' onClick={handleOnSearch} />
    </div>
    {secondary}
  </div>;

AppToolbar.state = {
  onInit: (props, state, {onScroll})=> (
    requestAnimationFrame(()=> document.body.onscroll = onScroll),
    onScroll()
  ),

  onScroll: (props, state)=> {
    const scrollTop = document.body ? document.body.scrollTop : 0;
    return {
      scrollTop,
      scrollClass: (scrollTop > 56 && scrollTop - state.scrollTop > 0) ? ' is-scrolling-down': ''
    };
  }
};

export default AppToolbar;
