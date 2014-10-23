import {StateChart} from 'helpers/svengali';

export default function StatefulPolymer(name,options){
  var stateConfig = options.state;
  var originalCreated = options.created;
  delete options.state;

  options.created = function(){
    var statechart = new StateChart(stateConfig);
    this.state = statechart.attrs;
    if(originalCreated) originalCreated.call(this);
  };

  Polymer(name, options);
};
