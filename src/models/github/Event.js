import Model       from '../../helpers/model/Model';
import EventMapper from './EventMapper';
import User        from './User';
import Repo        from './Repo';

class Event extends Model{}
Event.create($=>{
  $.mapper = EventMapper;

  $.attr('type',    'string');
  $.attr('payload', 'identity');
  $.attr('createdAt', 'datetime');

  $.hasOne('actor', 'User');
  $.hasOne('repo',  'Repo');
});

export default Event;
