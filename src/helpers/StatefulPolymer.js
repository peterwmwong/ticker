import {StateChart} from 'helpers/svengali';

export default function StatefulPolymer(name,options){
  var stateConfig = options.state;
  var originalCreated = options.created;
  options.state = null;

  options.created = function(){
    this._statechart = (stateConfig instanceof StateChart) ? stateConfig
                        : new StateChart(stateConfig);
    this.state = this._statechart.attrs;
    if(originalCreated) originalCreated.call(this);
  };

  options.stateEvent = function(eventName, params){
    this._statechart.fire(eventName, params);
  }

  window.Polymer(name, options);
};
