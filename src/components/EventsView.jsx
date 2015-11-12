import GithubEvent from '../models/github/GithubEvent';
import EventCard   from './EventCard.jsx';
import Toolbar     from './Toolbar.jsx';

const EventsView = (
  {id, onRequestDrawer, onRequestSearch},
  {events, scrollTop, isScrollingDown},
  {onScroll}
)=>
  // TODO: Figure out a way to not set the scrollTop on initial render
  <div className="fit scroll App__content" onscroll={onScroll} scrollTop={scrollTop}>
    {events.map(event=>
      <EventCard key={event.id} event={event} />
    )}
    <Toolbar
      className={`fixed fixed--top ${isScrollingDown ? 'is-scrolling-down' : ''}`}
      title={id}
      onRequestDrawer={onRequestDrawer}
      onRequestSearch={onRequestSearch}
    />
  </div>;

const onInit = (props, state, {loadEvents})=>(
  GithubEvent.query(props).then(loadEvents),
  {events: GithubEvent.localQuery(props), scrollTop: 0, isScrollingDown: false}
);

EventsView.state = {
  onInit: onInit,
  onProps: onInit,
  loadEvents: (props, state, actions, events)=>({...state, events}),
  onScroll: (props, state, actions, scrollEvent)=>{
    const scrollTop       = scrollEvent.target.scrollTop;
    const isScrollingDown = scrollTop > 56 && scrollTop - state.scrollTop > 0;
    console.log('onScroll', scrollTop, isScrollingDown);
    return {...state, scrollTop, isScrollingDown};
  }
};

export default EventsView;
