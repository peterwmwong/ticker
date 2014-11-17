import {StateChart} from 'helpers/svengali';

function stateFire(statechart, stateEvent, {currentTarget}){
  // Get fire args
  var fireArg = currentTarget.getAttribute('fire-arg');
  if(fireArg) statechart.fire(stateEvent, currentTarget.templateInstance.model[fireArg]);
  else statechart.fire(stateEvent);
}

// Add stateFire[eventName](fire-arg) functions on element
function addFireFuncs(object, statechart){
  var events = statechart.events;
  for(var i=0; i<events.length; ++i)
    object[`stateFire.${events[i]}`] = stateFire.bind(null, statechart, events[i]);
}

export default function StatefulPolymer(name,options){
  var stateConfig = options.state;
  var originalCreated = options.created;
  options.state = null;

  if(stateConfig instanceof StateChart) addFireFuncs(options, stateConfig);

  options.created = function(){
    this._statechart = (stateConfig instanceof StateChart) ? stateConfig
                        : new StateChart(stateConfig);

    if(!(stateConfig instanceof StateChart)) addFireFuncs(this, this._statechart);

    this.state = this._statechart.attrs;
    if(originalCreated) originalCreated.call(this);
  };

  options.stateEvent = function(eventName, params){
    this._statechart.fire(eventName, params);
  }

  window.Polymer(name, options);
}
