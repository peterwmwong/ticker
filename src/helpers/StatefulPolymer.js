import {StateChart} from 'helpers/svengali';

function stateFire(statechart, stateEvent, event){
  // Get fire args
  var fireArg = event.currentTarget.getAttribute('fire-arg');
  if(fireArg) statechart.fire(stateEvent, event.currentTarget.templateInstance.model[fireArg]);
  else statechart.fire(stateEvent);
}

// Add stateFire[eventName](fire-arg) functions on element
function addFireFuncs(object, statechart){
  var events = statechart.events;
  var event;
  for(var i=0; i<events.length; ++i){
    event = events[i];
    object[`stateFire.${event}`] = stateFire.bind(null, statechart, event);
  }
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
};
