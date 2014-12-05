/*

Statechart integration for Polymer elements.

1. Add a Statechart to a Polymer element

```js
// Instead of Polymer({...}), use StatefulPolymer({...})
StatefulPolymer({
  state: {
    states:{
      'lightOn':{
        attrs: { 'light':'on'                      },
        events:{ 'toggleLight':goto('../lightOff') }
      },
      'lightOff':{
        attrs: { 'light':'off'                     },
        events:{ 'toggleLight':goto('../lightOn')  }
      }
    }
  }
})
```

2. Bind Statechart `attrs` to your template using `state`

```html
<polymer-element name='my-element'>
  <template>
    Light is {{state.light}}
  </template>
  ...
</polymer-element>
```

3. Fire state events

```html
<!-- in the template... -->
<button on-tap='{{stateFire.toggleLight}}'>Switch</button>
```


*/

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
    // `bindInputToState(attr)` Filter
    this.bindInputToState = {
      toDOM(val, attr){return this.state[attr]},
      toModel(val, attr){
        this.stateEvent(`${attr}Changed`, val);
        if(window.event && window.event.target && window.event.target.value !== this.state[attr])
          window.event.target.value = this.state[attr];
        return this.state[attr];
      }
    };

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
