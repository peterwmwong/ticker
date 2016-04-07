import './AppToolbar.css';
import xvdom from 'xvdom';
import App   from './App.jsx';
import Icon  from './common/Icon.jsx';

const showSearch = ()=> { App.showSearch() };
const showDrawer = ()=> { App.showDrawer() };

const AppToolbar = ({title, secondary, left, right}, {scrollClass})=>
  <div className={`AppToolbar fixed fixed--top c-white bg-purple ${scrollClass}`}>
    <div className='layout horizontal center-center l-height14 l-padding-h4'>
      {left}
      <div className='App__title l-padding-h4 t-truncate t-font-size-20 flex' textContent={title} />
      {right}
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

export const AppToolbarSearch = ()=>
  <Icon
    className='t-bold c-white l-padding-l4 l-padding-r6'
    name='search'
    onClick={showSearch}
    size='small'
  />

export const AppToolbarDrawer = ()=>
  <Icon
    className='c-white'
    name='three-bars'
    onClick={showDrawer}
    size='small'
  />

export default AppToolbar;
