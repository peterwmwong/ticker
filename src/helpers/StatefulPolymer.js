import {StateChart} from 'helpers/svengali';

export default function StatefulPolymer(name,options){
  var stateConfig = options.state;
  var originalCreated = options.created;
  options.state = null;

  options.created = function(){
    var statechart = (stateConfig instanceof StateChart) ?
                     stateConfig :
                     new StateChart(stateConfig);
    this.state = statechart.attrs;
    if(originalCreated) originalCreated.call(this);
  };

  window.Polymer(name, options);
};
