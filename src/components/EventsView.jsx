import GithubEvent from '../models/github/GithubEvent';
import EventCard   from './EventCard.jsx';
import Toolbar     from './Toolbar.jsx';

const EVENT_TYPES_TO_HIDE = {
  'WatchEvent': true,
  'GollumEvent': true
};

const EventsView = (
  {id, onRequestDrawer, onRequestSearch},
  {events, isScrollingDown},
  {onScroll}
)=>
  <div className="fit scroll App__content" onscroll={onScroll}>
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
  {
    events: loadEvents(GithubEvent.localQuery(props)).events,
    scrollTop: 0,
    isScrollingDown: false
  }
);

EventsView.state = {
  onInit: onInit,
  onProps: onInit,
  loadEvents: (props, state, actions, events)=>({
    ...state,
    events: events.filter(e=>!EVENT_TYPES_TO_HIDE[e.type])
  }),
  onScroll: (props, state, actions, scrollEvent)=>{
    const scrollTop = scrollEvent.target.scrollTop;
    return {
      ...state,
      scrollTop,
      isScrollingDown: scrollTop > 56 && scrollTop - state.scrollTop > 0
    };
  }
};

export default EventsView;
