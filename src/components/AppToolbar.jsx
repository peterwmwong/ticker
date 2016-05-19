import './AppToolbar.css';
import xvdom from 'xvdom';
import App   from './App.jsx';
import Icon  from './common/Icon.jsx';

const showSearch = ()=> { App.showSearch() };

const AppToolbar = ({props: {title, secondary, left, right}, state:{scrollClass}})=>
  <div className={`AppToolbar fixed fixed--top c-white bg-purple ${scrollClass}`}>
    <div className='layout horizontal center-center l-height14'>
      {left}
      <div className='App__title l-padding-r0 t-truncate t-font-size-20 flex' textContent={title} />
      <Icon
        className='t-bold c-white l-padding-h4'
        name='search'
        onClick={showSearch}
        size='small'
      />
      {right}
    </div>
    {secondary}
  </div>;

const getScrollState = (prevScrollTop)=> {
  const scrollTop = document.body ? document.body.scrollTop : 0;
  return {
    scrollTop,
    scrollClass: (scrollTop > 56 && scrollTop - prevScrollTop > 0) ? ' is-scrolling-down': ''
  };
}


AppToolbar.state = {
  onInit: ({bindSend})=> (
    requestAnimationFrame(()=> document.body.onscroll = bindSend('onScroll')),
    getScrollState(0)
  ),

  onScroll: ({state:{scrollTop}})=> getScrollState(scrollTop)
};

export default AppToolbar;
