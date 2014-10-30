import StatefulPolymer from '../helpers/StatefulPolymer';
import tickerAppState from './ticker-app-state';

StatefulPolymer('ticker-drawer', {
  state:tickerAppState,

  onSelectEventStream({target}){
    this.stateEvent('selectStream', target.templateInstance.model.eventStream);
  }
});
